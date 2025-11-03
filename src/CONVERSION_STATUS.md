# TypeScript到JavaScript转换状态

## 概述
本文档追踪项目中TypeScript文件到JavaScript的转换状态。

## ✅ 已完成转换的文件

### 核心文件
- [x] `/lib/types.ts` → `/lib/types.js` - 类型定义(JSDoc格式)
- [x] `/lib/i18n.ts` → `/lib/i18n.js` - 国际化翻译
- [x] `/lib/mockData.ts` → `/lib/mockData.js` - 模拟数据
- [x] `/App.tsx` → `/App.jsx` - 主应用组件

## 🔄 待转换的文件

### 组件文件 (Components)
以下文件需要按照转换指南进行转换：

#### 主要组件
- [ ] `/components/Login.tsx` → `/components/Login.jsx`
- [ ] `/components/SignUp.tsx` → `/components/SignUp.jsx`
- [ ] `/components/Dashboard.tsx` → `/components/Dashboard.jsx`
- [ ] `/components/CreateTicket.tsx` → `/components/CreateTicket.jsx`
- [ ] `/components/TemplateManager.tsx` → `/components/TemplateManager.jsx`
- [ ] `/components/TicketDetail.tsx` → `/components/TicketDetail.jsx`
- [ ] `/components/AccountSettings.tsx` → `/components/AccountSettings.jsx`
- [ ] `/components/LanguageSelector.tsx` → `/components/LanguageSelector.jsx`
- [ ] `/components/MyTasks.tsx` → `/components/MyTasks.jsx`

#### UI组件 (Shadcn)
- [ ] `/components/ui/accordion.tsx` → `.jsx`
- [ ] `/components/ui/alert-dialog.tsx` → `.jsx`
- [ ] `/components/ui/alert.tsx` → `.jsx`
- [ ] `/components/ui/aspect-ratio.tsx` → `.jsx`
- [ ] `/components/ui/avatar.tsx` → `.jsx`
- [ ] `/components/ui/badge.tsx` → `.jsx`
- [ ] `/components/ui/breadcrumb.tsx` → `.jsx`
- [ ] `/components/ui/button.tsx` → `.jsx`
- [ ] `/components/ui/calendar.tsx` → `.jsx`
- [ ] `/components/ui/card.tsx` → `.jsx`
- [ ] `/components/ui/carousel.tsx` → `.jsx`
- [ ] `/components/ui/chart.tsx` → `.jsx`
- [ ] `/components/ui/checkbox.tsx` → `.jsx`
- [ ] `/components/ui/collapsible.tsx` → `.jsx`
- [ ] `/components/ui/command.tsx` → `.jsx`
- [ ] `/components/ui/context-menu.tsx` → `.jsx`
- [ ] `/components/ui/dialog.tsx` → `.jsx`
- [ ] `/components/ui/drawer.tsx` → `.jsx`
- [ ] `/components/ui/dropdown-menu.tsx` → `.jsx`
- [ ] `/components/ui/form.tsx` → `.jsx`
- [ ] `/components/ui/hover-card.tsx` → `.jsx`
- [ ] `/components/ui/input-otp.tsx` → `.jsx`
- [ ] `/components/ui/input.tsx` → `.jsx`
- [ ] `/components/ui/label.tsx` → `.jsx`
- [ ] `/components/ui/menubar.tsx` → `.jsx`
- [ ] `/components/ui/navigation-menu.tsx` → `.jsx`
- [ ] `/components/ui/pagination.tsx` → `.jsx`
- [ ] `/components/ui/popover.tsx` → `.jsx`
- [ ] `/components/ui/progress.tsx` → `.jsx`
- [ ] `/components/ui/radio-group.tsx` → `.jsx`
- [ ] `/components/ui/resizable.tsx` → `.jsx`
- [ ] `/components/ui/scroll-area.tsx` → `.jsx`
- [ ] `/components/ui/select.tsx` → `.jsx`
- [ ] `/components/ui/separator.tsx` → `.jsx`
- [ ] `/components/ui/sheet.tsx` → `.jsx`
- [ ] `/components/ui/sidebar.tsx` → `.jsx`
- [ ] `/components/ui/skeleton.tsx` → `.jsx`
- [ ] `/components/ui/slider.tsx` → `.jsx`
- [ ] `/components/ui/sonner.tsx` → `.jsx`
- [ ] `/components/ui/switch.tsx` → `.jsx`
- [ ] `/components/ui/table.tsx` → `.jsx`
- [ ] `/components/ui/tabs.tsx` → `.jsx`
- [ ] `/components/ui/textarea.tsx` → `.jsx`
- [ ] `/components/ui/toggle-group.tsx` → `.jsx`
- [ ] `/components/ui/toggle.tsx` → `.jsx`
- [ ] `/components/ui/tooltip.tsx` → `.jsx`
- [ ] `/components/ui/use-mobile.ts` → `.js`
- [ ] `/components/ui/utils.ts` → `.js`

### 工具文件
- [ ] `/utils/supabase/info.tsx` → `/utils/supabase/info.jsx`
- [ ] `/components/figma/ImageWithFallback.tsx` → `/components/figma/ImageWithFallback.jsx`

### 后端文件
- [ ] `/supabase/functions/server/index.tsx` → `/supabase/functions/server/index.jsx`
- [ ] `/supabase/functions/server/kv_store.tsx` → `/supabase/functions/server/kv_store.jsx` (受保护文件，请谨慎)

## 转换检查清单

每个文件转换时请确认：

### 1. 语法转换
- [ ] 移除所有类型注解 (`: Type`)
- [ ] 移除所有接口定义 (`interface`)
- [ ] 移除所有类型别名 (`type`)
- [ ] 移除泛型 (`<Type>`)
- [ ] 移除类型导入 (`import type { ... }`)
- [ ] 修改文件扩展名 (`.tsx` → `.jsx`, `.ts` → `.js`)

### 2. 导入更新
- [ ] 更新组件导入路径 (如果引用了已转换的文件)
- [ ] 移除类型导入，保留值导入
- [ ] 确保所有导入路径正确

### 3. 功能验证
- [ ] 组件正常渲染
- [ ] Props正常传递
- [ ] 事件处理正常工作
- [ ] 状态管理正常
- [ ] 无控制台错误

## 快速转换脚本

可以使用以下正则表达式进行批量查找替换：

### 移除类型注解
```regex
查找: : (string|number|boolean|any|void|null|undefined)(\s|\)|,|;|=|>)
替换: $2
```

### 移除泛型
```regex
查找: <[A-Z][a-zA-Z0-9,\s<>]*>(?=\()
替换: (留空)
```

### 移除React.FC类型
```regex
查找: : React\.FC<[^>]+>
替换: (留空)
```

## 注意事项

1. **UI组件库**: Shadcn组件可以保持为`.tsx`或批量转换
2. **类型安全**: 转换后失去TypeScript的类型检查，需加强运行时验证
3. **IDE支持**: 考虑添加JSDoc注释以保持IDE提示
4. **测试**: 每次转换后务必测试相关功能
5. **渐进式转换**: 建议先转换核心文件，再转换UI组件

## 转换优先级

### 高优先级（立即转换）
1. ✅ `/App.tsx` - 已完成
2. ✅ `/lib/mockData.ts` - 已完成
3. ✅ `/lib/i18n.ts` - 已完成
4. ✅ `/lib/types.ts` - 已完成

### 中优先级（按需转换）
5. `/components/Login.tsx`
6. `/components/SignUp.tsx`
7. `/components/Dashboard.tsx`
8. `/components/CreateTicket.tsx`
9. `/components/TemplateManager.tsx`
10. `/components/TicketDetail.tsx`
11. `/components/AccountSettings.tsx`

### 低优先级（最后转换）
- 所有`/components/ui/`目录下的文件
- 工具类文件

## 当前可用文件

以下JavaScript文件已经可以使用：
- `/lib/types.js`
- `/lib/i18n.js`
- `/lib/mockData.js`
- `/App.jsx`

## 导入示例

### 之前 (TypeScript)
```typescript
import { Language, TranslationKey } from "./lib/i18n";
import { Ticket, Template, User } from "./lib/types";
import { mockTickets } from "./lib/mockData";
```

### 之后 (JavaScript)
```javascript
import { translations } from "./lib/i18n";
import { mockTickets } from "./lib/mockData";
// 类型导入已移除，直接使用值
```

## 下一步行动

1. 根据`TYPESCRIPT_TO_JAVASCRIPT_GUIDE.md`中的指南转换剩余组件
2. 更新所有导入语句以引用`.js`或`.jsx`文件
3. 测试每个转换后的组件
4. 更新本文档的进度
