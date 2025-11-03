# FastAPI后端集成指南

## 📋 概述

本指南说明如何将前端应用与新创建的FastAPI后端集成。

## 🎯 集成步骤

### 1. 启动后端服务器

```bash
cd backend

# 创建虚拟环境（首次）
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 安装依赖（首次）
pip install -r requirements.txt

# 初始化demo数据（可选）
python init_demo_data.py

# 启动服务器
python run.py
```

后端将在 `http://localhost:8000` 运行

访问API文档：http://localhost:8000/docs

### 2. 修改前端API配置

编辑 `src/lib/api.js` 文件：

#### 方法1: 使用环境变量（推荐）

在项目根目录创建 `.env` 文件：

```env
REACT_APP_API_URL=http://localhost:8000/api
```

#### 方法2: 直接修改代码

修改 `src/lib/api.js` 第9行：

```javascript
// 修改前
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// 修改后
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
```

### 3. 取消注释API调用

在 `src/lib/api.js` 中，每个API函数都有真实API调用的注释代码。

**示例：登录功能**

找到第48-64行，修改为：

```javascript
async login(email, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
```

**删除或注释掉mock实现：**

```javascript
// 删除这部分
// return new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve({
//       user: { id: '1', name: 'Demo User', email, role: 'engineer' },
//       token: 'mock-jwt-token'
//     });
//   }, 500);
// });
```

### 4. 添加Token认证

修改 `src/lib/api.js` 第16-35行的 `apiFetch` 函数：

```javascript
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token'); // 获取token

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }), // 添加认证头
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // 处理未授权
        localStorage.removeItem('token');
        window.location.href = '/';
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

### 5. 替换所有API函数

按照以下模式替换所有TODO标记的API函数：

#### 认证API (第48-102行)

```javascript
export const authAPI = {
  async login(email, password) {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(name, email, password, role) {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  },

  async logout() {
    return apiFetch('/auth/logout', { method: 'POST' });
  },
};
```

#### 工单API (第114-222行)

```javascript
export const ticketsAPI = {
  async getAll() {
    return apiFetch('/tickets');
  },

  async getById(id) {
    return apiFetch(`/tickets/${id}`);
  },

  async create(ticketData) {
    return apiFetch('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  },

  async update(id, updates) {
    return apiFetch(`/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async delete(id) {
    return apiFetch(`/tickets/${id}`, { method: 'DELETE' });
  },

  async accept(id, comment) {
    return apiFetch(`/tickets/${id}/accept`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    });
  },

  async decline(id, reason) {
    return apiFetch(`/tickets/${id}/decline`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  async cancel(id, reason) {
    return apiFetch(`/tickets/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
};
```

#### 模板API (第234-299行)

```javascript
export const templatesAPI = {
  async getAll() {
    return apiFetch('/templates');
  },

  async getById(id) {
    return apiFetch(`/templates/${id}`);
  },

  async create(templateData) {
    return apiFetch('/templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  },

  async update(id, updates) {
    return apiFetch(`/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async delete(id) {
    return apiFetch(`/templates/${id}`, { method: 'DELETE' });
  },
};
```

#### 用户API (第311-344行)

```javascript
export const usersAPI = {
  async getAll() {
    return apiFetch('/users');
  },

  async getById(id) {
    return apiFetch(`/users/${id}`);
  },

  async updateProfile(id, updates) {
    return apiFetch(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};
```

#### 文件上传API (第358-393行)

```javascript
export const filesAPI = {
  async upload(file, fieldType) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fieldType', fieldType);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return await response.json();
  },

  async delete(fileId) {
    return apiFetch(`/files/${fileId}`, { method: 'DELETE' });
  },
};
```

#### 人脸识别API (第438-458行)

```javascript
export const faceRecognitionAPI = {
  async verify(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/face-recognition/verify`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Verification failed');
    }

    return await response.json();
  },
};
```

### 6. 启动前端

```bash
npm install
npm run dev
```

## 🧪 测试集成

### 1. 测试登录

使用demo账户登录：
- Email: `demo@csenergy.com`
- Password: `demo123`

### 2. 测试工单

- 查看工单列表
- 创建新工单
- Accept/Decline工单
- 更新工单状态

### 3. 测试模板

- 查看模板列表
- 创建新模板
- 编辑模板

### 4. 测试文件上传

- 在工单详情中上传照片
- 上传签名

## 🔧 故障排除

### CORS错误

如果遇到CORS错误，检查后端 `.env` 文件中的 `CORS_ORIGINS` 配置：

```env
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 401未授权错误

1. 检查token是否正确保存到localStorage
2. 检查API请求是否包含Authorization header
3. 重新登录获取新token

### 连接被拒绝

1. 确认后端服务器正在运行
2. 检查API_BASE_URL配置是否正确
3. 确认端口8000没有被占用

## 📊 API响应格式

### 成功响应

```json
{
  "id": "T001",
  "title": "Ticket Title",
  ...
}
```

### 错误响应

```json
{
  "detail": "Error message"
}
```

## 🎯 完整集成清单

- [ ] 后端服务器运行在 http://localhost:8000
- [ ] 访问 http://localhost:8000/docs 确认API文档可用
- [ ] 运行 `python init_demo_data.py` 初始化demo数据
- [ ] 前端配置API_BASE_URL
- [ ] 修改apiFetch函数添加token认证
- [ ] 替换所有API函数的mock实现
- [ ] 测试登录功能
- [ ] 测试工单CRUD
- [ ] 测试模板CRUD
- [ ] 测试文件上传
- [ ] 检查浏览器控制台无错误

## 📝 注意事项

1. **开发环境**：前端和后端需要同时运行
   - 后端：http://localhost:8000
   - 前端：http://localhost:5173 (或3000)

2. **生产环境**：
   - 后端部署到服务器
   - 修改前端API_BASE_URL为实际后端地址
   - 配置HTTPS

3. **Token管理**：
   - Token存储在localStorage
   - Token在登录时获取
   - Token在登出时清除

## 🚀 下一步

集成完成后：

1. **测试所有功能**
2. **处理错误情况**
3. **添加加载状态**
4. **优化用户体验**
5. **准备部署**

---

**准备好了吗？开始集成吧！** 🎉
