import { useState } from "react";
import { Ticket, Template } from "../lib/types";
import { translations, TranslationKey, Language } from "../lib/i18n";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { CheckCircle2, Circle, MapPin, Camera, FileSignature, ScanFace } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface MyTasksProps {
  tickets: Ticket[];
  templates: Template[];
  language: Language;
  currentUserId: string;
  onUpdateTicket: (ticketId: string, updates: Partial<Ticket>) => void;
}

export function MyTasks({
  tickets,
  templates,
  language,
  currentUserId,
  onUpdateTicket,
}: MyTasksProps) {
  const t = (key: TranslationKey) => translations[language][key];
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepData, setStepData] = useState<Record<string, any>>({});

  const myTickets = tickets.filter(
    (ticket) => ticket.assignedTo === currentUserId && ticket.status !== "done"
  );

  const handleOpenTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setStepData(ticket.stepData || {});
    const template = templates.find((t) => t.id === ticket.templateId);
    if (template) {
      const nextStepIndex = template.steps.findIndex(
        (step) => !ticket.completedSteps.includes(step.id)
      );
      setCurrentStepIndex(nextStepIndex >= 0 ? nextStepIndex : template.steps.length - 1);
    }
  };

  const handleCompleteStep = () => {
    if (!selectedTicket) return;

    const template = templates.find((t) => t.id === selectedTicket.templateId);
    if (!template) return;

    const currentStep = template.steps[currentStepIndex];
    const newCompletedSteps = [...selectedTicket.completedSteps, currentStep.id];

    const updates: Partial<Ticket> = {
      completedSteps: newCompletedSteps,
      stepData: { ...selectedTicket.stepData, ...stepData },
    };

    // If this is the last step, mark ticket as done
    if (newCompletedSteps.length === template.steps.length) {
      updates.status = "done";
    } else if (selectedTicket.status === "new" || selectedTicket.status === "assigned") {
      updates.status = "inProgress";
    }

    onUpdateTicket(selectedTicket.id, updates);

    // Move to next step or close dialog
    if (currentStepIndex < template.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setSelectedTicket(null);
      setStepData({});
    }
  };

  const getFieldIcon = (type: string) => {
    switch (type) {
      case "location":
        return <MapPin className="h-4 w-4" />;
      case "photo":
        return <Camera className="h-4 w-4" />;
      case "signature":
        return <FileSignature className="h-4 w-4" />;
      case "faceRecognition":
        return <ScanFace className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const renderFieldInput = (field: any, stepId: string) => {
    const fieldKey = `${stepId}_${field.id}`;
    const value = stepData[fieldKey] || "";

    switch (field.type) {
      case "text":
        return (
          <Input
            value={value}
            onChange={(e) => setStepData({ ...stepData, [fieldKey]: e.target.value })}
            required={field.required}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => setStepData({ ...stepData, [fieldKey]: e.target.value })}
            required={field.required}
          />
        );
      case "date":
        return (
          <Input
            type="datetime-local"
            value={value}
            onChange={(e) => setStepData({ ...stepData, [fieldKey]: e.target.value })}
            required={field.required}
          />
        );
      case "location":
        return (
          <div className="space-y-2">
            <Input
              value={value}
              onChange={(e) => setStepData({ ...stepData, [fieldKey]: e.target.value })}
              placeholder="Latitude, Longitude"
              required={field.required}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((position) => {
                    setStepData({
                      ...stepData,
                      [fieldKey]: `${position.coords.latitude}, ${position.coords.longitude}`,
                    });
                  });
                }
              }}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Get Current Location
            </Button>
          </div>
        );
      case "photo":
        return (
          <div className="space-y-2">
            <Input type="file" accept="image/*" capture="environment" required={field.required} />
            <p className="text-muted-foreground">Take or upload a photo</p>
          </div>
        );
      case "signature":
        return (
          <div className="space-y-2">
            <div className="border-2 border-dashed rounded p-4 h-32 flex items-center justify-center">
              <p className="text-muted-foreground">Signature pad placeholder</p>
            </div>
          </div>
        );
      case "faceRecognition":
        return (
          <div className="space-y-2">
            <Button type="button" variant="outline" className="w-full">
              <ScanFace className="h-4 w-4 mr-2" />
              Capture Face
            </Button>
            <p className="text-muted-foreground">Use front camera for face recognition</p>
          </div>
        );
      default:
        return (
          <Textarea
            value={value}
            onChange={(e) => setStepData({ ...stepData, [fieldKey]: e.target.value })}
            required={field.required}
          />
        );
    }
  };

  const selectedTemplate = selectedTicket
    ? templates.find((t) => t.id === selectedTicket.templateId)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary">{t("assignedToMe")}</h1>
        <p className="text-muted-foreground">
          {myTickets.length} active {myTickets.length === 1 ? "task" : "tasks"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {myTickets.map((ticket) => {
          const template = templates.find((t) => t.id === ticket.templateId);
          const progress = template
            ? (ticket.completedSteps.length / template.steps.length) * 100
            : 0;

          return (
            <Card key={ticket.id} className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-primary">{ticket.title}</h3>
                  <Badge
                    variant={
                      ticket.priority === "urgent" || ticket.priority === "high"
                        ? "destructive"
                        : "default"
                    }
                  >
                    {t(ticket.priority as TranslationKey)}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{ticket.description}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-[#0ea5e9] h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {template && (
                <div className="space-y-1">
                  {template.steps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-2">
                      {ticket.completedSteps.includes(step.id) ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span
                        className={
                          ticket.completedSteps.includes(step.id)
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        }
                      >
                        {step.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Due: {ticket.dueDate.toLocaleDateString()}
                </span>
                <Button
                  onClick={() => handleOpenTicket(ticket)}
                  className="bg-[#0ea5e9] hover:bg-[#0284c7]"
                >
                  {ticket.completedSteps.length === 0 ? t("startTask") : t("viewDetails")}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Task Detail Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTicket?.title}</DialogTitle>
          </DialogHeader>

          {selectedTemplate && selectedTicket && (
            <div className="space-y-6">
              {/* Progress Stepper */}
              <div className="flex items-center justify-between">
                {selectedTemplate.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex items-center justify-center h-8 w-8 rounded-full ${
                        selectedTicket.completedSteps.includes(step.id)
                          ? "bg-green-500 text-white"
                          : index === currentStepIndex
                          ? "bg-[#0ea5e9] text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < selectedTemplate.steps.length - 1 && (
                      <div
                        className={`h-1 w-12 ${
                          selectedTicket.completedSteps.includes(step.id)
                            ? "bg-green-500"
                            : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Current Step */}
              {currentStepIndex < selectedTemplate.steps.length && (
                <Card className="p-6 space-y-4">
                  <div>
                    <h3 className="text-primary">
                      {selectedTemplate.steps[currentStepIndex].name}
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedTemplate.steps[currentStepIndex].description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {selectedTemplate.steps[currentStepIndex].fields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <Label>
                          <div className="flex items-center gap-2">
                            {getFieldIcon(field.type)}
                            {field.name}
                            {field.required && <span className="text-destructive">*</span>}
                          </div>
                        </Label>
                        {renderFieldInput(
                          field,
                          selectedTemplate.steps[currentStepIndex].id
                        )}
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={handleCompleteStep}
                    className="w-full bg-[#0ea5e9] hover:bg-[#0284c7]"
                  >
                    {currentStepIndex === selectedTemplate.steps.length - 1
                      ? t("markAsComplete")
                      : t("completeStep")}
                  </Button>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
