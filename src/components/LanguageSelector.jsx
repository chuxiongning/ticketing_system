import { Globe } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const languageNames = {
  en: "English",
  th: "ไทย",
  pt: "Português",
};

export function LanguageSelector({ currentLanguage, onLanguageChange }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-primary text-primary hover:bg-primary hover:text-white">
          <Globe className="h-4 w-4" />
          {languageNames[currentLanguage]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem 
          onClick={() => onLanguageChange("en")}
          className="cursor-pointer"
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onLanguageChange("th")}
          className="cursor-pointer"
        >
          ไทย (Thai)
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onLanguageChange("pt")}
          className="cursor-pointer"
        >
          Português
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
