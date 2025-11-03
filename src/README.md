# 充电桩维护工单系统 / EV Charging Station Maintenance System

<div align="center">

![Status](https://img.shields.io/badge/Status-Ready%20for%20API%20Integration-green)
![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow)
![React](https://img.shields.io/badge/React-18+-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

一个功能完整的充电桩维护工单管理系统，支持桌面和移动端，提供多语言界面。

A fully functional EV charging station maintenance ticket management system with desktop and mobile support and multi-language interface.

[功能特性](#-功能特性) • [快速开始](#-快速开始) • [API集成](#-api集成) • [文档](#-文档)

</div>

---

## 📋 目录 / Table of Contents

- [功能特性](#-功能特性)
- [技术栈](#-技术栈)
- [快速开始](#-快速开始)
- [项目结构](#-项目结构)
- [API集成](#-api集成)
- [使用说明](#-使用说明)
- [文档](#-文档)
- [浏览器支持](#-浏览器支持)
- [许可证](#-许可证)

---

## ✨ 功能特性

### 🔐 用户认证
- ✅ 登录/注册功能
- ✅ 角色管理（工程师、主管、管理员）
- ✅ 会话管理
- ✅ 账户设置

### 🎫 工单管理
- ✅ 创建和分配工单
- ✅ 多状态工作流（新建、已分配、进行中、已完成）
- ✅ 优先级管理（低、中、高、紧急）
- ✅ Accept/Decline工单机制
- ✅ 工单取消和删除
- ✅ 评论系统
- ✅ 进度追踪
- ✅ 截止日期提醒

### 📋 模板管理
- ✅ 自定义工单模板
- ✅ 多步骤工作流
- ✅ 灵活的字段类型：
  - 文本输入
  - 数字输入
  - 日期选择
  - GPS位置获取
  - 照片上传
  - 数字签名
  - 人脸识别验证

### 📊 Dashboard看板
- ✅ 实时统计数据
- ✅ 看板视图（按状态分组）
- ✅ 工单卡片展示
- ✅ 进度可视化

### 🌍 多语言支持
- ✅ 英语 (English)
- ✅ 泰语 (ไทย)
- ✅ 葡萄牙语 (Português)
- ✅ 实时语言切换

### 🎨 现代UI/UX
- ✅ CS Energy Tech品牌配色
- ✅ 响应式设计（桌面+移动端）
- ✅ 直观的交互界面
- ✅ Toast通知系统
- ✅ 加载状态提示

---

## 🛠️ 技术栈

### 前端
- **框架**: React 18+ (JavaScript)
- **样式**: Tailwind CSS 4.0
- **组件库**: Shadcn UI
- **图标**: Lucide React
- **日期处理**: date-fns
- **通知**: Sonner

### 后端（待集成）
- **推荐**: Supabase
- **认证**: JWT
- **数据库**: PostgreSQL
- **存储**: Cloud Storage
- **API**: RESTful

---

## 🚀 快速开始

### 前置要求

- Node.js 16+ 
- npm 或 yarn

### 安装步骤

```bash
# 1. 克隆仓库
git clone <repository-url>
cd charging-station-maintenance

# 2. 安装依赖
npm install

# 3. 配置环境变量（可选）
cp .env.example .env
# 编辑.env文件

# 4. 启动开发服务器
npm start

# 5. 在浏览器打开
# http://localhost:3000
```

### Demo账户

```
邮箱: demo@csenergy.com
密码: demo123
```

---

## 📁 项目结构

```
project/
├── lib/
│   ├── api.js              # API服务层
│   ├── i18n.js             # 多语言翻译
│   ├── mockData.js         # 模拟数据
│   └── types.js            # 类型定义(JSDoc)
│
├── components/
│   ├── Login.jsx           # 登录组件
│   ├── SignUp.jsx          # 注册组件
│   ├── LanguageSelector.jsx  # 语言选择器
│   ├── CreateTicket.jsx    # 创建工单
│   ├── TemplateManager.jsx # 模板管理
│   ├── TicketDetail.jsx    # 工单详情
│   ├── AccountSettings.jsx # 账户设置
│   └── ui/                 # Shadcn UI组件
│
├── styles/
│   └── globals.css         # 全局样式
│
├── App.jsx                 # 主应用组件
│
└── 文档/
    ├── README.md           # 本文件
    ├── API_INTEGRATION_GUIDE.md  # API集成指南
    ├── CONVERSION_COMPLETE.md    # 转换完成报告
    └── TYPESCRIPT_TO_JAVASCRIPT_GUIDE.md  # TS转JS指南
```

---

## 🔌 API集成

### 当前状态

应用目前使用**mock数据**运行，所有功能都可以测试。

### 集成步骤

#### 1. 配置API端点

编辑 `/lib/api.js`:

```javascript
const API_BASE_URL = 'https://your-api.com/api';
```

或使用环境变量 `.env`:

```env
REACT_APP_API_URL=https://your-api.com/api
```

#### 2. 替换Mock实现

在 `/lib/api.js` 中，每个API函数都有 `// TODO: Replace with actual API call` 注释：

```javascript
// 当前Mock实现
async login(email, password) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ user: {...}, token: '...' });
    }, 500);
  });
}

// 替换为真实API
async login(email, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
```

#### 3. 可用的API服务

```javascript
// 导入API服务
import api from './lib/api';

// 使用示例
const result = await api.auth.login(email, password);
const tickets = await api.tickets.getAll();
const template = await api.templates.create(data);
```

**详细指南**: 查看 [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)

---

## 📖 使用说明

### 用户工作流

#### 工单创建者（管理员/主管）
1. 登录系统
2. 进入 "Tickets" → "Create Ticket"
3. 选择工单模板
4. 填写标题、描述
5. 分配给工程师
6. 设置优先级和截止日期
7. 提交创建

#### 工程师
1. 登录系统
2. 在Dashboard查看分配的工单
3. 点击工单查看详情
4. 选择 **Accept** 开始工作，或 **Decline** 拒绝
5. 按照模板步骤完成任务
6. 填写必需字段（位置、照片、签名等）
7. 完成所有步骤后，工单状态变为"已完成"

#### 模板管理
1. 进入 "Tickets" → "Templates"
2. 点击 "Create Template"
3. 添加模板名称和描述
4. 添加工作步骤
5. 为每个步骤添加字段
6. 设置字段类型和是否必填
7. 保存模板

### 语言切换

点击右上角的语言选择器（地球图标），选择：
- English
- ไทย (Thai)  
- Português

界面立即切换为选定语言。

---

## 📚 文档

### 完整文档列表

| 文档 | 说明 |
|------|------|
| [README.md](./README.md) | 本文件，项目概述 |
| [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) | 详细的API集成指南 |
| [CONVERSION_COMPLETE.md](./CONVERSION_COMPLETE.md) | TypeScript到JavaScript转换完成报告 |
| [TYPESCRIPT_TO_JAVASCRIPT_GUIDE.md](./TYPESCRIPT_TO_JAVASCRIPT_GUIDE.md) | TS转JS转换规则和示例 |

### API文档

详细的API端点规范请参考 [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)，包括：

- 认证端点
- 工单CRUD操作
- 模板管理
- 文件上传
- 位置服务
- 人脸识别

---

## 🌐 浏览器支持

| 浏览器 | 版本 |
|--------|------|
| Chrome | 最新版 ✅ |
| Edge | 最新版 ✅ |
| Firefox | 最新版 ✅ |
| Safari | 最新版 ✅ |
| Mobile | iOS 12+, Android 8+ ✅ |

---

## 🎨 设计系统

### 颜色方案

基于 **CS Energy Tech** 品牌：

- **主色**: 蓝色 (#0ea5e9)
- **背景**: 白色、浅灰
- **成功**: 翡翠绿 (#10b981)
- **警告**: 橙色
- **错误**: 红色

### 状态颜色

- **New**: 天蓝色
- **Assigned**: 青色
- **In Progress**: 蓝色
- **Done**: 绿色
- **Declined**: 红色
- **Cancelled**: 灰色

---

## 🔐 安全特性

### 已实现
- ✅ 前端表单验证
- ✅ XSS防护（React默认）
- ✅ 密码加密显示
- ✅ 安全的客户端状态管理

### 需要后端配合
- ⚠️ JWT token认证
- ⚠️ API速率限制
- ⚠️ CORS策略
- ⚠️ HTTPS强制
- ⚠️ 输入验证和清理
- ⚠️ 文件上传安全检查

---

## 🧪 测试

### 运行应用测试

```bash
# 启动开发服务器
npm start

# 使用Demo账户登录
# Email: demo@csenergy.com
# Password: demo123
```

### 测试清单

- [ ] 登录/注册流程
- [ ] 创建工单
- [ ] Accept/Decline工单
- [ ] 创建和编辑模板
- [ ] 语言切换
- [ ] 账户设置更新
- [ ] 响应式布局（调整浏览器窗口）
- [ ] 移动端测试

---

## 🚧 开发状态

### ✅ 已完成

- [x] 所有前端组件（JavaScript）
- [x] 完整的UI/UX设计
- [x] 多语言支持
- [x] 响应式布局
- [x] Mock数据测试
- [x] API服务层架构

### 🔄 待办事项

- [ ] 集成真实后端API
- [ ] 实现文件上传功能
- [ ] 集成人脸识别服务
- [ ] 添加单元测试
- [ ] 性能优化
- [ ] PWA支持（离线功能）

---

## 📊 功能概览

```
用户管理
├── 登录/注册
├── 角色权限
└── 账户设置

工单系统
├── 创建工单
├── 分配工单
├── 状态追踪
├── Accept/Decline
├── 评论系统
└── 进度管理

模板系统
├── 创建模板
├── 自定义步骤
├── 灵活字段
└── 字段验证

Dashboard
├── 统计数据
├── 看板视图
└── 工单卡片

多语言
├── 英语
├── 泰语
└── 葡萄牙语
```

---

## 💡 常见问题

### Q: 如何添加新的语言？

A: 编辑 `/lib/i18n.js`，添加新的语言对象并提供翻译。

### Q: 如何自定义颜色主题？

A: 编辑 `/styles/globals.css` 中的CSS变量。

### Q: Mock数据存储在哪里？

A: `/lib/mockData.js` - 包含用户、模板和工单的示例数据。

### Q: 如何添加新的字段类型？

A: 
1. 在 `/lib/types.js` 的 `FieldType` 中添加新类型
2. 在 `/lib/i18n.js` 中添加翻译
3. 在相关组件中实现UI

### Q: 支持哪些浏览器？

A: 所有现代浏览器（Chrome, Firefox, Safari, Edge）和移动浏览器。

---

## 🤝 贡献

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

---

## 📞 支持

如有问题或需要帮助：

1. 查看文档: [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)
2. 检查代码中的注释
3. 查看浏览器控制台错误

---

## 📄 许可证

本项目采用 MIT 许可证。

---

## 🙏 致谢

- **React** - UI框架
- **Tailwind CSS** - 样式系统
- **Shadcn UI** - 组件库
- **Lucide** - 图标库
- **CS Energy Tech** - 品牌设计灵感

---

## 📈 版本历史

### v1.0.0 (2025-10-31)
- ✅ 初始发布
- ✅ 完整的JavaScript转换
- ✅ 所有核心功能实现
- ✅ API服务层准备就绪
- ✅ 多语言支持
- ✅ 响应式设计

---

<div align="center">

**🎉 准备就绪！开始集成你的后端API吧！ 🚀**

Made with ❤️ for CS Energy Tech

[⬆ 返回顶部](#充电桩维护工单系统--ev-charging-station-maintenance-system)

</div>
