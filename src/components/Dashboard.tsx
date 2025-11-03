import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Ticket, TicketStatus } from "../lib/types";
import { translations, TranslationKey, Language } from "../lib/i18n";
import { ClipboardList, AlertCircle, Clock, CheckCircle2, Plus } from "lucide-react";
import { Button } from "./ui/button";

interface DashboardProps {
  tickets: Ticket[];
  language: Language;
  onCreateTicket: () => void;
  onViewTicket: (ticket: Ticket) => void;
}

export function Dashboard({ tickets, language, onCreateTicket, onViewTicket }: DashboardProps) {
  const t = (key: TranslationKey) => translations[language][key];

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case "new":
        return "bg-blue-500";
      case "assigned":
        return "bg-yellow-500";
      case "inProgress":
        return "bg-orange-500";
      case "done":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, any> = {
      low: "secondary",
      medium: "default",
      high: "destructive",
      urgent: "destructive",
    };
    return variants[priority] || "default";
  };

  const statusCategories: TicketStatus[] = ["new", "assigned", "inProgress", "done"];

  const stats = {
    total: tickets.length,
    pending: tickets.filter((t) => t.status === "new").length,
    inProgress: tickets.filter((t) => t.status === "inProgress" || t.status === "assigned").length,
    completed: tickets.filter((t) => t.status === "done").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary">{t("welcomeBack")}</h1>
          <p className="text-muted-foreground">{t("ticketOverview")}</p>
        </div>
        <Button onClick={onCreateTicket} className="gap-2 bg-[#0ea5e9] hover:bg-[#0284c7]">
          <Plus className="h-4 w-4" />
          {t("createTicket")}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-l-4 border-l-[#0ea5e9]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">{t("totalTickets")}</p>
              <p className="text-primary">{stats.total}</p>
            </div>
            <ClipboardList className="h-8 w-8 text-[#0ea5e9]" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">{t("pending")}</p>
              <p className="text-primary">{stats.pending}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">{t("inProgress")}</p>
              <p className="text-primary">{stats.inProgress}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">{t("completed")}</p>
              <p className="text-primary">{stats.completed}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusCategories.map((status) => {
          const statusTickets = tickets.filter((t) => t.status === status);
          return (
            <div key={status} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${getStatusColor(status)}`} />
                <h3 className="text-muted-foreground">
                  {t(status as TranslationKey)} ({statusTickets.length})
                </h3>
              </div>
              <div className="space-y-2">
                {statusTickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onViewTicket(ticket)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-primary">{ticket.title}</h4>
                        <Badge variant={getPriorityBadge(ticket.priority)}>
                          {t(ticket.priority as TranslationKey)}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground line-clamp-2">{ticket.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{ticket.assignedToName}</span>
                        <span className="text-muted-foreground">
                          {ticket.dueDate.toLocaleDateString()}
                        </span>
                      </div>
                      {ticket.completedSteps.length > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className="bg-[#0ea5e9] h-2 rounded-full transition-all"
                              style={{
                                width: `${(ticket.completedSteps.length / (ticket.completedSteps.length + 1)) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-muted-foreground">
                            {ticket.completedSteps.length}
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
