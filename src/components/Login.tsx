import { useState } from "react";
import { Language, translations, TranslationKey } from "../lib/i18n";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { ClipboardList, Mail, Lock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface LoginProps {
  language: Language;
  onLogin: (email: string, password: string) => Promise<void>;
  onSwitchToSignUp: () => void;
}

export function Login({ language, onLogin, onSwitchToSignUp }: LoginProps) {
  const t = (key: TranslationKey) => translations[language][key];
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(t("fieldRequired"));
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t("invalidEmail"));
      return;
    }

    setIsLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(t("invalidCredentials"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <div className="p-8 space-y-6">
          {/* Logo and Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                <ClipboardList className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-primary">{t("welcomeToCS")}</h1>
            <p className="text-muted-foreground">{t("signInToAccount")}</p>
          </div>

          {/* Demo Credentials Info */}
          <Alert className="bg-blue-50 border-primary/20">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-foreground">
              <strong>Demo Account:</strong> demo@csenergy.com / demo123
            </AlertDescription>
          </Alert>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {t("email")}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("enterEmail")}
                className="bg-input-background"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                {t("password")}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("enterPassword")}
                className="bg-input-background"
                disabled={isLoading}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isLoading}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal cursor-pointer"
                >
                  {t("rememberMe")}
                </Label>
              </div>
              <Button
                type="button"
                variant="link"
                className="px-0 h-auto"
                disabled={isLoading}
              >
                {t("forgotPassword")}
              </Button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? t("loading") : t("signIn")}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-muted-foreground">
              {t("dontHaveAccount")}{" "}
              <Button
                type="button"
                variant="link"
                className="px-1 h-auto"
                onClick={onSwitchToSignUp}
                disabled={isLoading}
              >
                {t("signUp")}
              </Button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
