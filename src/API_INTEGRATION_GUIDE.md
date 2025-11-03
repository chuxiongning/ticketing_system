# API集成指南 / API Integration Guide

## 概述 / Overview

本指南说明如何将前端应用与后端API集成。所有必要的前端组件已转换为JavaScript，并准备好了API服务层。

This guide explains how to integrate the frontend application with backend APIs. All necessary frontend components have been converted to JavaScript and the API service layer is ready.

## 已完成的工作 / Completed Work

### ✅ JavaScript转换完成

所有必需的前端组件已转换为JavaScript：

| 文件 | 状态 | 说明 |
|------|------|------|
| `/lib/types.js` | ✅ | 类型定义 (JSDoc) |
| `/lib/i18n.js` | ✅ | 多语言支持 |
| `/lib/mockData.js` | ✅ | 模拟数据 |
| `/lib/api.js` | ✅ | **API服务层** |
| `/App.jsx` | ✅ | 主应用组件 |
| `/components/Login.jsx` | ✅ | 登录组件 |
| `/components/SignUp.jsx` | ✅ | 注册组件 |
| `/components/LanguageSelector.jsx` | ✅ | 语言选择器 |
| `/components/CreateTicket.jsx` | ✅ | 创建工单 |
| `/components/TemplateManager.jsx` | ✅ | 模板管理 |
| `/components/TicketDetail.jsx` | ✅ | 工单详情 |
| `/components/AccountSettings.jsx` | ✅ | 账户设置 |

### 🔌 API服务层

创建了 `/lib/api.js` 文件，包含以下API服务：

1. **authAPI** - 用户认证
   - `login(email, password)`
   - `register(name, email, password, role)`
   - `logout()`

2. **ticketsAPI** - 工单管理
   - `getAll()`
   - `getById(id)`
   - `create(ticketData)`
   - `update(id, updates)`
   - `delete(id)`
   - `accept(id, comment)`
   - `decline(id, reason)`
   - `cancel(id, reason)`

3. **templatesAPI** - 模板管理
   - `getAll()`
   - `getById(id)`
   - `create(templateData)`
   - `update(id, updates)`
   - `delete(id)`

4. **usersAPI** - 用户管理
   - `getAll()`
   - `getById(id)`
   - `updateProfile(id, updates)`

5. **filesAPI** - 文件上传
   - `upload(file, fieldType)`
   - `delete(fileId)`

6. **locationAPI** - 位置服务
   - `getCurrentLocation()`

7. **faceRecognitionAPI** - 人脸识别
   - `verify(imageFile)`

## 🚀 后端API集成步骤

### 步骤 1: 配置API端点

在 `/lib/api.js` 文件顶部配置你的API基础URL：

```javascript
// 修改这些配置
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-api.com/api';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
```

或者在项目根目录创建 `.env` 文件：

```env
REACT_APP_API_URL=https://your-api.com/api
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### 步骤 2: 替换Mock实现

每个API函数都有TODO注释，标记需要替换的位置。

**示例：登录API集成**

**当前（Mock）：**
```javascript
async login(email, password) {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: { id: '1', name: 'Demo User', email, role: 'engineer' },
        token: 'mock-jwt-token'
      });
    }, 500);
  });
}
```

**替换为实际API：**
```javascript
async login(email, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
```

### 步骤 3: 在组件中使用API

API已经准备好供组件使用。示例：

```javascript
import api from '../lib/api';

// 在组件中
const handleLogin = async (email, password) => {
  try {
    const { user, token } = await api.auth.login(email, password);
    // 保存token和用户信息
    localStorage.setItem('token', token);
    setUser(user);
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};
```

### 步骤 4: 添加认证Token

修改 `/lib/api.js` 中的 `apiFetch` 函数以包含认证token：

```javascript
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token'); // 或从你的状态管理获取
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // 处理未授权 - 例如重定向到登录页面
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
```

## 📋 后端API需求规范

### 认证端点 / Authentication Endpoints

#### POST /auth/login
```json
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "engineer"
  },
  "token": "jwt-token-here"
}
```

#### POST /auth/register
```json
// Request
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "engineer"
}

// Response
{
  "user": {
    "id": "new-user-id",
    "name": "New User",
    "email": "newuser@example.com",
    "role": "engineer"
  },
  "token": "jwt-token-here"
}
```

### 工单端点 / Tickets Endpoints

#### GET /tickets
```json
// Response
[
  {
    "id": "T001",
    "title": "Ticket Title",
    "description": "Description",
    "templateId": "TPL123",
    "templateName": "Template Name",
    "status": "new",
    "priority": "high",
    "assignedTo": "user-id",
    "assignedToName": "John Doe",
    "createdBy": "creator-id",
    "createdByName": "Jane Smith",
    "createdAt": "2025-10-31T10:00:00Z",
    "dueDate": "2025-11-05T10:00:00Z",
    "completedSteps": [],
    "stepData": {},
    "accepted": false,
    "comments": []
  }
]
```

#### POST /tickets
```json
// Request
{
  "title": "New Ticket",
  "description": "Description",
  "templateId": "TPL123",
  "assignedTo": "user-id",
  "priority": "high",
  "dueDate": "2025-11-05T10:00:00Z"
}

// Response
{
  "id": "T002",
  "title": "New Ticket",
  // ... other fields
}
```

#### POST /tickets/:id/accept
```json
// Request
{
  "comment": "Accepted and will start work"
}

// Response
{
  "id": "T001",
  "status": "inProgress",
  "accepted": true,
  "acceptedAt": "2025-10-31T11:00:00Z"
}
```

### 模板端点 / Templates Endpoints

#### GET /templates
```json
// Response
[
  {
    "id": "TPL001",
    "name": "Template Name",
    "description": "Template Description",
    "steps": [
      {
        "id": "step1",
        "name": "Step Name",
        "description": "Step Description",
        "order": 1,
        "fields": [
          {
            "id": "field1",
            "name": "Field Name",
            "type": "text",
            "required": true
          }
        ]
      }
    ],
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T10:00:00Z"
  }
]
```

### 文件上传端点 / File Upload Endpoints

#### POST /files/upload
```
Content-Type: multipart/form-data

file: [binary data]
fieldType: "photo"
```

```json
// Response
{
  "id": "FILE123",
  "url": "https://storage.example.com/files/image.jpg",
  "name": "image.jpg",
  "type": "image/jpeg",
  "size": 123456
}
```

### 位置服务 / Location Services

位置服务使用浏览器的Geolocation API，不需要后端端点。

Location services use the browser's Geolocation API, no backend endpoint needed.

### 人脸识别端点 / Face Recognition Endpoints

#### POST /face-recognition/verify
```
Content-Type: multipart/form-data

image: [binary image data]
```

```json
// Response
{
  "verified": true,
  "confidence": 0.95,
  "message": "Face verified successfully"
}
```

## 🔐 安全考虑 / Security Considerations

1. **Token存储** - 使用 `httpOnly` cookies 或安全的localStorage
2. **HTTPS** - 所有API调用必须通过HTTPS
3. **CORS** - 配置适当的CORS策略
4. **Rate Limiting** - 实现速率限制防止滥用
5. **Input Validation** - 在前端和后端都验证输入
6. **文件上传** - 验证文件类型和大小

## 🧪 测试指南 / Testing Guide

### 测试当前Mock实现

应用当前使用mock数据。要测试：

1. 启动应用
2. 使用演示账户登录：`demo@csenergy.com` / `demo123`
3. 测试所有功能：
   - 创建工单
   - 创建模板
   - Accept/Decline工单
   - 切换语言
   - 更新账户设置

### 集成后端后测试

1. 替换API实现
2. 配置正确的API端点
3. 测试所有API调用
4. 验证错误处理
5. 测试认证流程
6. 测试文件上传功能

## 📦 数据类型参考 / Data Types Reference

### Ticket Status
- `new` - 新建
- `assigned` - 已分配
- `inProgress` - 进行中
- `done` - 已完成
- `declined` - 已拒绝
- `cancelled` - 已取消

### Priority
- `low` - 低
- `medium` - 中
- `high` - 高
- `urgent` - 紧急

### Field Types
- `text` - 文本
- `number` - 数字
- `date` - 日期
- `location` - 位置
- `photo` - 照片
- `signature` - 签名
- `faceRecognition` - 人脸识别

### User Roles
- `engineer` - 工程师
- `supervisor` - 主管
- `administrator` - 管理员

## 🌐 Supabase集成 / Supabase Integration

如果使用Supabase作为后端：

### 1. 安装Supabase客户端

```bash
npm install @supabase/supabase-js
```

### 2. 创建Supabase客户端

```javascript
// /lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 3. 修改API函数使用Supabase

```javascript
// 示例：使用Supabase的登录
import { supabase } from './supabase';

export const authAPI = {
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    return {
      user: data.user,
      token: data.session.access_token,
    };
  },
};
```

## 📞 需要帮助？ / Need Help?

如果在集成过程中遇到问题：

1. 检查浏览器控制台的错误信息
2. 验证API端点URL是否正确
3. 确认请求和响应格式匹配
4. 检查CORS配置
5. 验证认证token是否正确传递

## 📝 变更日志 / Changelog

### 2025-10-31
- ✅ 所有必需组件转换为JavaScript
- ✅ 创建API服务层 (`/lib/api.js`)
- ✅ 准备好后端集成接口
- ✅ 添加mock实现用于开发测试
- ✅ 文档完善

---

## 快速开始清单 / Quick Start Checklist

- [ ] 配置API基础URL
- [ ] 替换认证API的mock实现
- [ ] 替换工单API的mock实现  
- [ ] 替换模板API的mock实现
- [ ] 添加token认证逻辑
- [ ] 配置文件上传endpoint
- [ ] 测试所有API调用
- [ ] 处理错误情况
- [ ] 添加加载状态
- [ ] 部署到生产环境

**准备就绪！现在可以开始集成你的后端API了。** 🚀

**Ready to go! You can now start integrating your backend APIs.** 🚀
