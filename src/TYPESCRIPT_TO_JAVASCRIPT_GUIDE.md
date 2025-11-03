# TypeScript to JavaScript Conversion Guide

## Overview
This guide explains how to convert the TypeScript files in this project to JavaScript.

## Files Already Converted
✅ `/lib/types.js` - Type definitions (using JSDoc comments)
✅ `/lib/i18n.js` - Translation object

## Conversion Rules

### 1. File Extensions
- Change `.tsx` to `.jsx` for React components
- Change `.ts` to `.js` for JavaScript modules

### 2. Remove Type Annotations
**TypeScript:**
```typescript
const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
const language: Language = "en";
function handleSubmit(email: string, password: string): void {
```

**JavaScript:**
```javascript
const [tickets, setTickets] = useState(mockTickets);
const language = "en";
function handleSubmit(email, password) {
```

### 3. Remove Interface Definitions
**TypeScript:**
```typescript
interface LoginProps {
  language: Language;
  onLogin: (email: string, password: string) => Promise<void>;
  onSwitchToSignUp: () => void;
}
```

**JavaScript:**
```javascript
// Remove interface, use prop destructuring directly
// Or add JSDoc comments for documentation:
/**
 * @param {Object} props
 * @param {string} props.language
 * @param {Function} props.onLogin
 * @param {Function} props.onSwitchToSignUp
 */
```

### 4. Remove Type Imports
**TypeScript:**
```typescript
import { Language, TranslationKey } from "../lib/i18n";
import { Ticket, Template } from "../lib/types";
```

**JavaScript:**
```javascript
// Remove type imports, keep only value imports
import { translations } from "../lib/i18n";
```

### 5. Component Props
**TypeScript:**
```typescript
export function Login({ language, onLogin, onSwitchToSignUp }: LoginProps) {
```

**JavaScript:**
```javascript
export function Login({ language, onLogin, onSwitchToSignUp }) {
```

### 6. Function Return Types
**TypeScript:**
```typescript
const getStatusColor = (status: TicketStatus): string => {
```

**JavaScript:**
```javascript
const getStatusColor = (status) => {
```

### 7. Generic Types
**TypeScript:**
```typescript
const [error, setError] = useState<string>("");
const users: UserAccount[] = [];
```

**JavaScript:**
```javascript
const [error, setError] = useState("");
const users = [];
```

### 8. Type Assertions and Casts
**TypeScript:**
```typescript
const value = data as string;
<MyComponent {...props as ComponentProps} />
```

**JavaScript:**
```javascript
const value = data;
<MyComponent {...props} />
```

### 9. Enums
**TypeScript:**
```typescript
enum Status {
  New = "new",
  InProgress = "inProgress"
}
```

**JavaScript:**
```javascript
const Status = {
  New: "new",
  InProgress: "inProgress"
};
```

### 10. Optional Documentation with JSDoc
For better IDE support, you can add JSDoc comments:

```javascript
/**
 * Login component
 * @param {Object} props
 * @param {string} props.language - Current language
 * @param {Function} props.onLogin - Login handler
 * @param {Function} props.onSwitchToSignUp - Switch to signup handler
 * @returns {JSX.Element}
 */
export function Login({ language, onLogin, onSwitchToSignUp }) {
  // ... component code
}
```

## Quick Conversion Steps for Each File

### For Component Files (`.tsx` → `.jsx`):

1. Rename file extension from `.tsx` to `.jsx`
2. Remove all interface/type definitions
3. Remove type annotations from:
   - Function parameters
   - State variables
   - Props destructuring
   - Return types
4. Remove type imports (keep value imports)
5. Update any imports that reference `.ts` or `.tsx` to `.js` or `.jsx`

### Example Conversion:

**Before (TypeScript):**
```typescript
import { useState } from "react";
import { Language, translations, TranslationKey } from "../lib/i18n";
import { Button } from "./ui/button";

interface LoginProps {
  language: Language;
  onLogin: (email: string, password: string) => Promise<void>;
}

export function Login({ language, onLogin }: LoginProps) {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const t = (key: TranslationKey) => translations[language][key];
  
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await onLogin(email, password);
  };
  
  return <div>...</div>;
}
```

**After (JavaScript):**
```javascript
import { useState } from "react";
import { translations } from "../lib/i18n";
import { Button } from "./ui/button";

export function Login({ language, onLogin }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const t = (key) => translations[language][key];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await onLogin(email, password);
  };
  
  return <div>...</div>;
}
```

## Files to Convert

### High Priority (Main Application Files):
- [ ] `/App.tsx` → `/App.jsx`
- [ ] `/components/Login.tsx` → `/components/Login.jsx`
- [ ] `/components/SignUp.tsx` → `/components/SignUp.jsx`
- [ ] `/components/Dashboard.tsx` → `/components/Dashboard.jsx`
- [ ] `/components/CreateTicket.tsx` → `/components/CreateTicket.jsx`
- [ ] `/components/TemplateManager.tsx` → `/components/TemplateManager.jsx`
- [ ] `/components/TicketDetail.tsx` → `/components/TicketDetail.jsx`
- [ ] `/components/AccountSettings.tsx` → `/components/AccountSettings.jsx`
- [ ] `/components/LanguageSelector.tsx` → `/components/LanguageSelector.jsx`
- [ ] `/components/MyTasks.tsx` → `/components/MyTasks.jsx`

### Library Files:
- [x] `/lib/i18n.ts` → `/lib/i18n.js` (Already converted)
- [x] `/lib/types.ts` → `/lib/types.js` (Already converted)
- [ ] `/lib/mockData.ts` → `/lib/mockData.js`

### UI Components:
The `/components/ui/` folder contains shadcn components. These can remain as `.tsx` files or be converted following the same rules.

### Utility Files:
- [ ] `/utils/supabase/info.tsx` → `/utils/supabase/info.jsx`
- [ ] `/components/figma/ImageWithFallback.tsx` → `/components/figma/ImageWithFallback.jsx`

### Backend Files:
- [ ] `/supabase/functions/server/index.tsx` → `/supabase/functions/server/index.jsx`
- [ ] `/supabase/functions/server/kv_store.tsx` → `/supabase/functions/server/kv_store.jsx`

## Automated Conversion Tools

You can use these tools to help automate the conversion:

1. **Find and Replace in VS Code:**
   - Remove `: Type` annotations
   - Remove `interface` definitions
   - Remove `<Type>` generic annotations

2. **TypeScript to JavaScript Babel Plugin:**
   ```bash
   npx @babel/cli src --out-dir lib --extensions ".ts,.tsx"
   ```

3. **Manual Review:**
   Always review automated conversions for:
   - Logic errors
   - Missing imports
   - Type-dependent code

## Testing After Conversion

After converting files:
1. Check for import errors
2. Test all user flows
3. Verify data handling
4. Check console for runtime errors
5. Test with different data types

## Notes

- JavaScript is more flexible but less type-safe
- Consider adding PropTypes or JSDoc for documentation
- Runtime validation becomes more important
- IDE autocomplete may be less helpful
