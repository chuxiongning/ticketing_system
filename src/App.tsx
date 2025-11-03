import { useState } from "react";
import { Language } from "./lib/i18n";
import { translations, TranslationKey } from "./lib/i18n";
import { Ticket, Template, Priority, TicketComment } from "./lib/types";
import { mockUsers, mockTemplates, mockTickets } from "./lib/mockData";
import { LanguageSelector } from "./components/LanguageSelector";
import { CreateTicket } from "./components/CreateTicket";
import { TemplateManager } from "./components/TemplateManager";
import { TicketDetail } from "./components/TicketDetail";
import { AccountSettings } from "./components/AccountSettings";
import { Login } from "./components/Login";
import { SignUp } from "./components/SignUp";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { TicketStatus } from "./lib/types";
import { ClipboardList, AlertCircle, Clock, CheckCircle2, User, LogOut, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";

type View = "dashboard" | "tickets";
type AuthView = "login" | "signup";

interface UserAccount {
  name: string;
  email: string;
  role: string;
  password: string;
}

export default function App() {
  const [language, setLanguage] = useState<Language>("en");
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [authView, setAuthView] = useState<AuthView>("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<UserAccount[]>([
    {
      name: "Demo User",
      email: "demo@csenergy.com",
      role: "Maintenance Engineer",
      password: "demo123",
    },
  ]);
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [userName, setUserName] = useState("Demo User");
  const [userEmail, setUserEmail] = useState("demo@csenergy.com");
  const [userRole, setUserRole] = useState("Maintenance Engineer");

  const t = (key: TranslationKey) => translations[language][key];
  const currentUserId = "5";

  const handleCreateTicket = (ticketData: {
    title: string;
    description: string;
    templateId: string;
    assignedTo: string;
    priority: Priority;
    dueDate: Date;
  }) => {
    const template = templates.find((t) => t.id === ticketData.templateId);
    const assignedUser = mockUsers.find((u) => u.id === ticketData.assignedTo);

    if (!template || !assignedUser) return;

    const newTicket: Ticket = {
      id: `T${String(tickets.length + 1).padStart(3, "0")}`,
      title: ticketData.title,
      description: ticketData.description,
      templateId: ticketData.templateId,
      templateName: template.name,
      status: "new",
      priority: ticketData.priority,
      assignedTo: ticketData.assignedTo,
      assignedToName: assignedUser.name,
      createdBy: currentUserId,
      createdByName: userName,
      createdAt: new Date(),
      dueDate: ticketData.dueDate,
      completedSteps: [],
      stepData: {},
      accepted: false,
      comments: [],
    };

    setTickets([newTicket, ...tickets]);
  };

  const handleSaveTemplate = (templateData: Omit<Template, "id" | "createdAt" | "updatedAt">) => {
    const newTemplate: Template = {
      ...templateData,
      id: `TPL${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTemplates([...templates, newTemplate]);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case "new":
        return "bg-sky-500";
      case "assigned":
        return "bg-cyan-500";
      case "inProgress":
        return "bg-blue-500";
      case "done":
        return "bg-emerald-500";
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
  
  const handleAcceptTicket = (ticketId: string, comment: string) => {
    setTickets(
      tickets.map((ticket) => {
        if (ticket.id === ticketId) {
          const newComment: TicketComment = {
            id: `C${Date.now()}`,
            userId: currentUserId,
            userName: userName,
            comment: comment || "Accepted ticket and started work",
            createdAt: new Date(),
            type: "accept",
          };
          return {
            ...ticket,
            status: "inProgress" as TicketStatus,
            accepted: true,
            acceptedAt: new Date(),
            comments: [...ticket.comments, newComment],
          };
        }
        return ticket;
      })
    );
    setSelectedTicket(null);
  };

  const handleDeclineTicket = (ticketId: string, reason: string) => {
    setTickets(
      tickets.map((ticket) => {
        if (ticket.id === ticketId) {
          const newComment: TicketComment = {
            id: `C${Date.now()}`,
            userId: currentUserId,
            userName: userName,
            comment: reason,
            createdAt: new Date(),
            type: "decline",
          };
          return {
            ...ticket,
            status: "declined" as TicketStatus,
            comments: [...ticket.comments, newComment],
          };
        }
        return ticket;
      })
    );
    setSelectedTicket(null);
  };

  const handleCancelTicket = (ticketId: string, reason: string) => {
    setTickets(
      tickets.map((ticket) => {
        if (ticket.id === ticketId) {
          const newComment: TicketComment = {
            id: `C${Date.now()}`,
            userId: currentUserId,
            userName: userName,
            comment: reason || "Ticket cancelled by creator",
            createdAt: new Date(),
            type: "cancel",
          };
          return {
            ...ticket,
            status: "cancelled" as TicketStatus,
            comments: [...ticket.comments, newComment],
          };
        }
        return ticket;
      })
    );
    setSelectedTicket(null);
  };

  const stats = {
    total: tickets.length,
    pending: tickets.filter((t) => t.status === "new").length,
    inProgress: tickets.filter((t) => t.status === "inProgress" || t.status === "assigned").length,
    completed: tickets.filter((t) => t.status === "done").length,
  };

  const handleUpdateProfile = (name: string, email: string) => {
    setUserName(name);
    setUserEmail(email);
  };

  const handleLogin = async (email: string, password: string) => {
    // Simulate async login
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    
    setUserName(user.name);
    setUserEmail(user.email);
    setUserRole(user.role);
    setIsAuthenticated(true);
    toast.success(t("signInSuccess"));
  };

  const handleSignUp = async (name: string, email: string, password: string, role: string) => {
    // Simulate async signup
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error("Email already exists");
    }
    
    const newUser: UserAccount = { name, email, role, password };
    setUsers([...users, newUser]);
    setUserName(name);
    setUserEmail(email);
    setUserRole(role);
    setIsAuthenticated(true);
    toast.success(t("signUpSuccess"));
  };

  const handleLogout = () => {
    console.log("Logging out...");
    setIsAuthenticated(false);
    setShowAccountSettings(false);
    setCurrentView("dashboard");
    setSelectedTicket(null);
  };

  // Show login/signup if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        {/* Language Selector - Fixed Top Right */}
        <div className="fixed top-4 right-4 z-50">
          <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
        </div>

        {authView === "login" ? (
          <Login
            language={language}
            onLogin={handleLogin}
            onSwitchToSignUp={() => setAuthView("signup")}
          />
        ) : (
          <SignUp
            language={language}
            onSignUp={handleSignUp}
            onSwitchToLogin={() => setAuthView("login")}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Logo + Navigation */}
            <div className="flex items-center gap-8">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <ClipboardList className="h-6 w-6 text-white" />
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                <Button
                  variant={currentView === "dashboard" ? "default" : "ghost"}
                  onClick={() => setCurrentView("dashboard")}
                  className={
                    currentView === "dashboard"
                      ? "bg-primary hover:bg-primary/90"
                      : "hover:bg-secondary"
                  }
                >
                  {t("dashboard")}
                </Button>
                <Button
                  variant={currentView === "tickets" ? "default" : "ghost"}
                  onClick={() => setCurrentView("tickets")}
                  className={
                    currentView === "tickets"
                      ? "bg-primary hover:bg-primary/90"
                      : "hover:bg-secondary"
                  }
                >
                  {t("tickets")}
                </Button>
              </nav>
            </div>

            {/* Right: Language + Account */}
            <div className="flex items-center gap-3">
              <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />

              {/* Account Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-white">
                        {userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-white">
                        {userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-foreground">{userName}</p>
                      <p className="text-muted-foreground">{userEmail}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedTicket(null);
                      setShowAccountSettings(true);
                    }}
                    className="cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    {t("accountSettings")}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }} 
                    className="cursor-pointer text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("logOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden flex items-center gap-2 mt-3">
            <Button
              variant={currentView === "dashboard" ? "default" : "ghost"}
              onClick={() => setCurrentView("dashboard")}
              className={
                currentView === "dashboard"
                  ? "bg-primary hover:bg-primary/90 flex-1"
                  : "hover:bg-secondary flex-1"
              }
              size="sm"
            >
              {t("dashboard")}
            </Button>
            <Button
              variant={currentView === "tickets" ? "default" : "ghost"}
              onClick={() => setCurrentView("tickets")}
              className={
                currentView === "tickets"
                  ? "bg-primary hover:bg-primary/90 flex-1"
                  : "hover:bg-secondary flex-1"
              }
              size="sm"
            >
              {t("tickets")}
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-6">
        {/* Dashboard View */}
        {currentView === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 md:p-6 border-l-4 border-l-primary bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">{t("totalTickets")}</p>
                    <p className="text-primary mt-1">{stats.total}</p>
                  </div>
                  <ClipboardList className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
              </Card>

              <Card className="p-4 md:p-6 border-l-4 border-l-sky-500 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">{t("pending")}</p>
                    <p className="text-primary mt-1">{stats.pending}</p>
                  </div>
                  <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-sky-500" />
                </div>
              </Card>

              <Card className="p-4 md:p-6 border-l-4 border-l-blue-500 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">{t("inProgress")}</p>
                    <p className="text-primary mt-1">{stats.inProgress}</p>
                  </div>
                  <Clock className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
                </div>
              </Card>

              <Card className="p-4 md:p-6 border-l-4 border-l-emerald-500 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">{t("completed")}</p>
                    <p className="text-primary mt-1">{stats.completed}</p>
                  </div>
                  <CheckCircle2 className="h-6 w-6 md:h-8 md:w-8 text-emerald-500" />
                </div>
              </Card>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {statusCategories.map((status) => {
                const statusTickets = tickets.filter((t) => t.status === status);
                return (
                  <div key={status} className="space-y-3">
                    <div className="flex items-center gap-2 px-2">
                      <div className={`h-3 w-3 rounded-full ${getStatusColor(status)}`} />
                      <h3 className="text-foreground">
                        {t(status as TranslationKey)} ({statusTickets.length})
                      </h3>
                    </div>
                    <div className="space-y-2 min-h-[200px]">
                      {statusTickets.map((ticket) => (
                        <Card
                          key={ticket.id}
                          className="p-4 cursor-pointer hover:shadow-lg transition-all border-l-4 bg-white"
                          style={{
                            borderLeftColor: getStatusColor(status)
                              .replace("bg-sky-500", "#0ea5e9")
                              .replace("bg-cyan-500", "#06b6d4")
                              .replace("bg-blue-500", "#3b82f6")
                              .replace("bg-emerald-500", "#10b981"),
                          }}
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-foreground line-clamp-2">{ticket.title}</h4>
                              <Badge variant={getPriorityBadge(ticket.priority)} className="shrink-0">
                                {t(ticket.priority as TranslationKey)}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground line-clamp-2">{ticket.description}</p>
                            <div className="flex flex-col gap-2">
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
                                      className="bg-primary h-2 rounded-full transition-all"
                                      style={{
                                        width: `${
                                          (ticket.completedSteps.length /
                                            (ticket.completedSteps.length + 1)) *
                                          100
                                        }%`,
                                      }}
                                    />
                                  </div>
                                  <span className="text-muted-foreground">
                                    {ticket.completedSteps.length}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tickets View */}
        {currentView === "tickets" && (
          <Card className="bg-white">
            <Tabs defaultValue="create" className="w-full">
              <div className="border-b px-6 pt-6">
                <TabsList className="bg-secondary">
                  <TabsTrigger value="create" className="data-[state=active]:bg-white">
                    {t("createTicket")}
                  </TabsTrigger>
                  <TabsTrigger value="templates" className="data-[state=active]:bg-white">
                    {t("templates")}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="create" className="p-6 mt-0">
                <CreateTicket
                  templates={templates}
                  users={mockUsers}
                  language={language}
                  onSubmit={handleCreateTicket}
                  onCancel={() => setCurrentView("dashboard")}
                />
              </TabsContent>

              <TabsContent value="templates" className="p-6 mt-0">
                <TemplateManager
                  templates={templates}
                  language={language}
                  onSaveTemplate={handleSaveTemplate}
                  onDeleteTemplate={handleDeleteTemplate}
                />
              </TabsContent>
            </Tabs>
          </Card>
        )}
      </div>

      {/* Ticket Detail Sheet */}
      <Sheet open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <SheetContent className="w-full md:max-w-3xl overflow-y-auto bg-background p-0">
          {selectedTicket && (
            <TicketDetail
              ticket={selectedTicket}
              template={templates.find((t) => t.id === selectedTicket.templateId)}
              language={language}
              currentUserId={currentUserId}
              onClose={() => setSelectedTicket(null)}
              onAccept={(comment) => handleAcceptTicket(selectedTicket.id, comment)}
              onDecline={(reason) => handleDeclineTicket(selectedTicket.id, reason)}
              onCancel={(reason) => handleCancelTicket(selectedTicket.id, reason)}
              onEdit={() => {
                console.log("Edit ticket:", selectedTicket.id);
                setSelectedTicket(null);
              }}
              onDelete={() => {
                setTickets(tickets.filter((t) => t.id !== selectedTicket.id));
                setSelectedTicket(null);
              }}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Account Settings Sheet */}
      <Sheet open={showAccountSettings} onOpenChange={setShowAccountSettings}>
        <SheetContent className="w-full md:max-w-lg overflow-y-auto bg-background p-0">
          <AccountSettings
            userName={userName}
            userEmail={userEmail}
            userRole={userRole}
            language={language}
            onUpdateProfile={handleUpdateProfile}
            onChangeLanguage={setLanguage}
            onLogout={handleLogout}
            onClose={() => setShowAccountSettings(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
