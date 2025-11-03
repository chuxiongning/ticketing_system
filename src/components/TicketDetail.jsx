import { useState } from "react";
import { translations } from "../lib/i18n";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Calendar,
  User,
  FileText,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  PlayCircle,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  XCircle,
} from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export function TicketDetail({
  ticket,
  template,
  language,
  currentUserId,
  onClose,
  onAccept,
  onDecline,
  onCancel,
  onDelete,
  onEdit,
}) {
  const t = (key) => translations[language][key];
  
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  const isCreator = ticket.createdBy === currentUserId;
  const isAssigned = ticket.assignedTo === currentUserId;
  const canAcceptOrDecline = isAssigned && !isCreator && ticket.status === "assigned" && !ticket.accepted;
  const canCancel = isCreator && (ticket.status === "new" || ticket.status === "assigned");

  const handleAccept = () => {
    if (onAccept) {
      onAccept(commentText);
      setCommentText("");
      setShowAcceptDialog(false);
    }
  };

  const handleDecline = () => {
    if (onDecline) {
      onDecline(commentText);
      setCommentText("");
      setShowDeclineDialog(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel(commentText);
      setCommentText("");
      setShowCancelDialog(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-sky-500";
      case "assigned":
        return "bg-cyan-500";
      case "inProgress":
        return "bg-blue-500";
      case "done":
        return "bg-emerald-500";
      case "declined":
        return "bg-red-500";
      case "cancelled":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case "new":
        return "text-sky-500";
      case "assigned":
        return "text-cyan-500";
      case "inProgress":
        return "text-blue-500";
      case "done":
        return "text-emerald-500";
      case "declined":
        return "text-red-500";
      case "cancelled":
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      low: "secondary",
      medium: "default",
      high: "destructive",
      urgent: "destructive",
    };
    return variants[priority] || "default";
  };

  const progress = template
    ? (ticket.completedSteps.length / template.steps.length) * 100
    : 0;

  const daysUntilDue = Math.ceil(
    (ticket.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const isOverdue = daysUntilDue < 0;
  const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 3;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 max-w-full">
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <span className="text-muted-foreground">#{ticket.id}</span>
              <Badge variant={getPriorityBadge(ticket.priority)}>
                {t(ticket.priority)}
              </Badge>
              <Badge className={getStatusColor(ticket.status)}>
                {t(ticket.status)}
              </Badge>
            </div>
            <h2 className="text-primary break-words">{ticket.title}</h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {/* Actions for assigned user */}
          {canAcceptOrDecline && (
            <>
              <Button 
                onClick={() => setShowAcceptDialog(true)} 
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                {t("accept")}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowDeclineDialog(true)}
                className="border-red-500 text-red-500 hover:bg-red-50"
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                {t("decline")}
              </Button>
            </>
          )}
          
          {/* Actions for creator */}
          {canCancel && (
            <Button 
              variant="outline" 
              onClick={() => setShowCancelDialog(true)}
              className="border-orange-500 text-orange-500 hover:bg-orange-50"
            >
              <XCircle className="h-4 w-4 mr-2" />
              {t("cancelTicket")}
            </Button>
          )}
          
          {isCreator && onDelete && ticket.status === "cancelled" && (
            <Button variant="outline" onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              {t("delete")}
            </Button>
          )}
          
          {onEdit && isCreator && (ticket.status === "new" || ticket.status === "assigned") && (
            <Button variant="outline" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              {t("edit")}
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Description */}
      {ticket.description && (
        <Card className="p-4 bg-secondary border-primary/20">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="text-foreground mb-1">{t("description")}</h4>
              <p className="text-muted-foreground break-words">{ticket.description}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Key Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Assigned To */}
        <Card className="p-4 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-muted-foreground">{t("assignTo")}</p>
              <div className="flex items-center gap-2 mt-1">
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-white text-xs">
                    {ticket.assignedToName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-foreground truncate">{ticket.assignedToName}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Due Date */}
        <Card className={`p-4 ${isOverdue ? "bg-red-50 border-red-200" : "bg-white"}`}>
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg flex-shrink-0 ${
                isOverdue
                  ? "bg-red-100"
                  : isDueSoon
                  ? "bg-yellow-100"
                  : "bg-primary/10"
              }`}
            >
              {isOverdue ? (
                <AlertCircle className="h-5 w-5 text-red-600" />
              ) : (
                <Calendar className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-muted-foreground">{t("dueDate")}</p>
              <p className={`mt-1 ${isOverdue ? "text-red-600" : "text-foreground"}`}>
                {ticket.dueDate.toLocaleDateString()}
              </p>
              {isOverdue && (
                <p className="text-red-600">{t("overdueDays").replace("{days}", Math.abs(daysUntilDue).toString())}</p>
              )}
              {isDueSoon && !isOverdue && (
                <p className="text-yellow-600">{t("dueDays").replace("{days}", daysUntilDue.toString())}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Created By */}
        <Card className="p-4 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-muted-foreground">{t("createdBy")}</p>
              <p className="text-foreground mt-1 truncate">{ticket.createdByName}</p>
              <p className="text-muted-foreground">
                {ticket.createdAt.toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Template */}
        <Card className="p-4 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-muted-foreground">{t("template")}</p>
              <p className="text-foreground mt-1 break-words">{ticket.templateName}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Section */}
      {template && (
        <Card className="p-6 bg-white">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-shrink-0">
                <Clock className="h-5 w-5 text-primary" />
                <h4 className="text-foreground">{t("workProgress")}</h4>
              </div>
              <span className={`${getStatusTextColor(ticket.status)} flex-shrink-0`}>
                {ticket.completedSteps.length} / {template.steps.length} {t("steps")}
              </span>
            </div>

            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
              </div>
            </div>

            <Separator />

            {/* Steps List */}
            <div className="space-y-3">
              {template.steps.map((step, index) => {
                const isCompleted = ticket.completedSteps.includes(step.id);
                return (
                  <div
                    key={step.id}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                      isCompleted ? "bg-emerald-50" : "bg-secondary"
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`${
                            isCompleted ? "text-emerald-700" : "text-foreground"
                          } break-words`}
                        >
                          {index + 1}. {step.name}
                        </span>
                        {isCompleted && (
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 flex-shrink-0">
                            {t("done")}
                          </Badge>
                        )}
                      </div>
                      <p
                        className={`mt-1 break-words ${
                          isCompleted ? "text-emerald-600" : "text-muted-foreground"
                        }`}
                      >
                        {step.description}
                      </p>
                      {step.fields.length > 0 && (
                        <p className="text-muted-foreground mt-1">
                          {step.fields.length} {t("fields")} {t("required")}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Comments Section */}
      {ticket.comments && ticket.comments.length > 0 && (
        <Card className="p-6 bg-white">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary flex-shrink-0" />
              <h4 className="text-foreground">{t("comments")}</h4>
            </div>
            <Separator />
            <div className="space-y-3">
              {ticket.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-3 bg-secondary rounded-lg">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-white text-xs">
                      {comment.userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-foreground truncate">{comment.userName}</span>
                      {comment.type === "accept" && (
                        <Badge className="bg-emerald-500 flex-shrink-0">{t("accepted")}</Badge>
                      )}
                      {comment.type === "decline" && (
                        <Badge className="bg-red-500 flex-shrink-0">{t("declined")}</Badge>
                      )}
                      {comment.type === "cancel" && (
                        <Badge className="bg-orange-500 flex-shrink-0">{t("cancelled")}</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-1 break-words">{comment.comment}</p>
                    <p className="text-muted-foreground mt-1">
                      {comment.createdAt.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Accept Dialog */}
      <AlertDialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("acceptTicket")}</AlertDialogTitle>
            <AlertDialogDescription>
              You will accept this ticket and work will begin automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label>{t("comment")} (Optional)</Label>
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t("addComment")}
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCommentText("")}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAccept}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              {t("accept")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Decline Dialog */}
      <AlertDialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("declineTicket")}</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for declining this ticket.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label>{t("reason")} *</Label>
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t("reason")}
              rows={3}
              required
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCommentText("")}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDecline}
              disabled={!commentText.trim()}
              className="bg-red-500 hover:bg-red-600"
            >
              {t("decline")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("cancelTicket")}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this ticket? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label>{t("reason")} (Optional)</Label>
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t("reason")}
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCommentText("")}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {t("cancelTicket")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
