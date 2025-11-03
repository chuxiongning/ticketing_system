export type TicketStatus = "new" | "assigned" | "inProgress" | "done" | "declined" | "cancelled";
export type Priority = "low" | "medium" | "high" | "urgent";
export type FieldType = "text" | "number" | "date" | "location" | "photo" | "signature" | "faceRecognition";

export interface TicketComment {
  id: string;
  userId: string;
  userName: string;
  comment: string;
  createdAt: Date;
  type: "general" | "accept" | "decline" | "cancel";
}

export interface TemplateField {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
}

export interface TemplateStep {
  id: string;
  name: string;
  description: string;
  fields: TemplateField[];
  order: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  steps: TemplateStep[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  templateId: string;
  templateName: string;
  status: TicketStatus;
  priority: Priority;
  assignedTo: string;
  assignedToName: string;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  dueDate: Date;
  completedSteps: string[];
  stepData: Record<string, any>;
  accepted?: boolean;
  acceptedAt?: Date;
  comments: TicketComment[];
}

export interface User {
  id: string;
  name: string;
  role: "admin" | "engineer" | "manager";
}
