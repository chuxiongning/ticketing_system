import { useState } from "react";
import { translations } from "../lib/i18n";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export function CreateTicket({
  templates,
  users,
  language,
  onSubmit,
  onCancel,
}) {
  const t = (key) => translations[language][key];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState(new Date());

  const selectedTemplate = templates.find((t) => t.id === templateId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !templateId || !assignedTo) return;

    onSubmit({
      title,
      description,
      templateId,
      assignedTo,
      priority,
      dueDate,
    });
  };

  const priorities = ["low", "medium", "high", "urgent"];

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-secondary border-primary">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>{t("ticketTitle")}</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("ticketTitle")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>{t("description")}</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("description")}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("selectTemplate")}</Label>
            <Select value={templateId} onValueChange={setTemplateId} required>
              <SelectTrigger>
                <SelectValue placeholder={t("selectTemplate")} />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTemplate && (
            <Card className="p-4 bg-secondary border-primary">
              <h4 className="text-primary mb-2">{selectedTemplate.name}</h4>
              <p className="text-muted-foreground mb-3">{selectedTemplate.description}</p>
              <div className="space-y-1">
                <p className="text-muted-foreground">Steps:</p>
                {selectedTemplate.steps.map((step, index) => (
                  <div key={step.id} className="text-muted-foreground ml-4">
                    {index + 1}. {step.name} ({step.fields.length} fields)
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("assignTo")}</Label>
              <Select value={assignedTo} onValueChange={setAssignedTo} required>
                <SelectTrigger>
                  <SelectValue placeholder={t("assignTo")} />
                </SelectTrigger>
                <SelectContent>
                  {users
                    .filter((u) => u.role === "engineer")
                    .map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("priority")}</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p} value={p}>
                      {t(p)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("dueDate")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(dueDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dueDate} onSelect={(date) => date && setDueDate(date)} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {t("submit")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
