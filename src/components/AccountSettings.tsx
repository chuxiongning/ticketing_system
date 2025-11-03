import { useState } from "react";
import { Language, translations, TranslationKey } from "../lib/i18n";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  User,
  Mail,
  Briefcase,
  Globe,
  LogOut,
  Camera,
  Save,
  X,
} from "lucide-react";
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

interface AccountSettingsProps {
  userName: string;
  userEmail: string;
  userRole: string;
  language: Language;
  onUpdateProfile: (name: string, email: string) => void;
  onChangeLanguage: (language: Language) => void;
  onLogout: () => void;
  onClose: () => void;
}

const languageNames: Record<Language, string> = {
  en: "English",
  th: "ไทย (Thai)",
  pt: "Português",
};

export function AccountSettings({
  userName,
  userEmail,
  userRole,
  language,
  onUpdateProfile,
  onChangeLanguage,
  onLogout,
  onClose,
}: AccountSettingsProps) {
  const t = (key: TranslationKey) => translations[language][key];

  const [editedName, setEditedName] = useState(userName);
  const [editedEmail, setEditedEmail] = useState(userEmail);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleNameChange = (value: string) => {
    setEditedName(value);
    setHasChanges(value !== userName || editedEmail !== userEmail);
  };

  const handleEmailChange = (value: string) => {
    setEditedEmail(value);
    setHasChanges(editedName !== userName || value !== userEmail);
  };

  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    onChangeLanguage(lang);
  };

  const handleSaveChanges = () => {
    onUpdateProfile(editedName, editedEmail);
    setHasChanges(false);
  };

  const handleCancel = () => {
    setEditedName(userName);
    setEditedEmail(userEmail);
    setSelectedLanguage(language);
    setHasChanges(false);
    onClose();
  };

  const handleLogout = () => {
    setShowLogoutDialog(false);
    onLogout();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-primary">{t("accountSettings")}</h2>
          <p className="text-muted-foreground">{t("manageProfilePreferences")}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Separator />

      {/* Profile Picture */}
      <Card className="p-6 bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-primary text-white text-3xl">
                {editedName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center">
            <h3 className="text-foreground">{editedName}</h3>
            <p className="text-muted-foreground">{userRole}</p>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="p-6 bg-white">
        <div className="space-y-4">
          <h3 className="text-foreground flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {t("personalInformation")}
          </h3>
          <Separator />

          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                {t("name")}
              </Label>
              <Input
                id="name"
                value={editedName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder={t("name")}
                className="bg-input-background"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {t("email")}
              </Label>
              <Input
                id="email"
                type="email"
                value={editedEmail}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder={t("email")}
                className="bg-input-background"
              />
            </div>

            {/* Role (Read-only) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                {t("role")}
              </Label>
              <div className="px-3 py-2 bg-muted rounded-md text-muted-foreground">
                {userRole}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card className="p-6 bg-white">
        <div className="space-y-4">
          <h3 className="text-foreground flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            {t("preferences")}
          </h3>
          <Separator />

          <div className="space-y-2">
            <Label htmlFor="language" className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              {t("language")}
            </Label>
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger id="language" className="bg-input-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="en">{languageNames.en}</SelectItem>
                <SelectItem value="th">{languageNames.th}</SelectItem>
                <SelectItem value="pt">{languageNames.pt}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6 bg-white">
        <div className="space-y-4">
          <h3 className="text-foreground">{t("security")}</h3>
          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <div>
                <p className="text-foreground">{t("password")}</p>
                <p className="text-muted-foreground">••••••••</p>
              </div>
              <Button variant="outline" size="sm">
                {t("changePassword")}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        {hasChanges && (
          <Card className="p-4 bg-blue-50 border-primary">
            <div className="flex items-center justify-between">
              <p className="text-foreground">{t("unsavedChanges")}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditedName(userName);
                    setEditedEmail(userEmail);
                    setHasChanges(false);
                  }}
                >
                  {t("discard")}
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveChanges}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t("save")}
                </Button>
              </div>
            </div>
          </Card>
        )}

        <Button
          variant="destructive"
          onClick={() => setShowLogoutDialog(true)}
          className="w-full"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t("logOut")}
        </Button>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmLogout")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirmLogoutMessage")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-destructive hover:bg-destructive/90"
            >
              {t("logOut")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
