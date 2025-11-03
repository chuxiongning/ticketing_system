import { useState } from "react";
import { translations } from "../lib/i18n";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Plus, Trash2, Edit, GripVertical } from "lucide-react";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";

export function TemplateManager({
  templates,
  language,
  onSaveTemplate,
  onDeleteTemplate,
}) {
  const t = (key) => translations[language][key];
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [steps, setSteps] = useState([]);

  const fieldTypes = [
    "text",
    "number",
    "date",
    "location",
    "photo",
    "signature",
    "faceRecognition",
  ];

  const handleOpenDialog = (template) => {
    if (template) {
      setEditingTemplate(template);
      setTemplateName(template.name);
      setTemplateDescription(template.description);
      setSteps(template.steps);
    } else {
      setEditingTemplate(null);
      setTemplateName("");
      setTemplateDescription("");
      setSteps([]);
    }
    setIsDialogOpen(true);
  };

  const handleAddStep = () => {
    const newStep = {
      id: `step${Date.now()}`,
      name: "",
      description: "",
      fields: [],
      order: steps.length + 1,
    };
    setSteps([...steps, newStep]);
  };

  const handleRemoveStep = (stepId) => {
    setSteps(steps.filter((s) => s.id !== stepId));
  };

  const handleUpdateStep = (stepId, updates) => {
    setSteps(steps.map((s) => (s.id === stepId ? { ...s, ...updates } : s)));
  };

  const handleAddField = (stepId) => {
    const newField = {
      id: `field${Date.now()}`,
      name: "",
      type: "text",
      required: false,
    };
    setSteps(
      steps.map((s) =>
        s.id === stepId ? { ...s, fields: [...s.fields, newField] } : s
      )
    );
  };

  const handleRemoveField = (stepId, fieldId) => {
    setSteps(
      steps.map((s) =>
        s.id === stepId ? { ...s, fields: s.fields.filter((f) => f.id !== fieldId) } : s
      )
    );
  };

  const handleUpdateField = (stepId, fieldId, updates) => {
    setSteps(
      steps.map((s) =>
        s.id === stepId
          ? {
              ...s,
              fields: s.fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f)),
            }
          : s
      )
    );
  };

  const handleSave = () => {
    if (!templateName.trim() || steps.length === 0) return;

    onSaveTemplate({
      name: templateName,
      description: templateDescription,
      steps,
    });

    setIsDialogOpen(false);
    setTemplateName("");
    setTemplateDescription("");
    setSteps([]);
    setEditingTemplate(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            {templates.length} {templates.length === 1 ? "template" : "templates"}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenDialog()}
              className="gap-2 bg-[#0ea5e9] hover:bg-[#0284c7]"
            >
              <Plus className="h-4 w-4" />
              {t("createTemplate")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? t("editTemplate") : t("createTemplate")}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>{t("templateName")}</Label>
                <Input
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder={t("templateName")}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("description")}</Label>
                <Textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder={t("description")}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Steps</Label>
                  <Button onClick={handleAddStep} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    {t("addStep")}
                  </Button>
                </div>

                {steps.map((step, stepIndex) => (
                  <Card key={step.id} className="p-4 space-y-4">
                    <div className="flex items-start gap-2">
                      <GripVertical className="h-5 w-5 text-muted-foreground mt-2" />
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 space-y-2">
                            <Input
                              value={step.name}
                              onChange={(e) =>
                                handleUpdateStep(step.id, { name: e.target.value })
                              }
                              placeholder={t("stepName")}
                            />
                            <Textarea
                              value={step.description}
                              onChange={(e) =>
                                handleUpdateStep(step.id, { description: e.target.value })
                              }
                              placeholder={t("stepDescription")}
                            />
                          </div>
                          <Button
                            onClick={() => handleRemoveStep(step.id)}
                            variant="ghost"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Fields</Label>
                            <Button
                              onClick={() => handleAddField(step.id)}
                              variant="outline"
                              size="sm"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {step.fields.map((field) => (
                            <div
                              key={field.id}
                              className="flex items-center gap-2 p-2 bg-muted rounded"
                            >
                              <Input
                                value={field.name}
                                onChange={(e) =>
                                  handleUpdateField(step.id, field.id, {
                                    name: e.target.value,
                                  })
                                }
                                placeholder="Field name"
                                className="flex-1"
                              />
                              <Select
                                value={field.type}
                                onValueChange={(value) =>
                                  handleUpdateField(step.id, field.id, {
                                    type: value,
                                  })
                                }
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {fieldTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {t(type)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={field.required}
                                  onCheckedChange={(checked) =>
                                    handleUpdateField(step.id, field.id, {
                                      required: !!checked,
                                    })
                                  }
                                />
                                <Label>{t("requiredField")}</Label>
                              </div>
                              <Button
                                onClick={() => handleRemoveField(step.id, field.id)}
                                variant="ghost"
                                size="sm"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t("cancel")}
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-[#0ea5e9] hover:bg-[#0284c7]"
                >
                  {t("saveTemplate")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="text-primary">{template.name}</h3>
                <div className="flex gap-1">
                  <Button
                    onClick={() => handleOpenDialog(template)}
                    variant="ghost"
                    size="sm"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => onDeleteTemplate(template.id)}
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground">{template.description}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Steps</span>
                <Badge>{template.steps.length}</Badge>
              </div>
              <div className="space-y-1">
                {template.steps.slice(0, 3).map((step, index) => (
                  <div key={step.id} className="text-muted-foreground">
                    {index + 1}. {step.name}
                  </div>
                ))}
                {template.steps.length > 3 && (
                  <div className="text-muted-foreground">
                    +{template.steps.length - 3} more
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
