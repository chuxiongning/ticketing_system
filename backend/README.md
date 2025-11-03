# EV充电桩维护工单系统 - FastAPI后端

这是一个为充电桩维护工单管理系统构建的FastAPI后端服务。

## 🚀 功能特性

### ✅ 认证系统
- JWT token认证
- 用户注册/登录
- 密码加密存储（bcrypt）

### 📋 工单管理
- 创建、读取、更新、删除工单
- 工单分配和状态管理
- Accept/Decline工单机制
- 工单取消功能
- 支持优先级设置

### 📝 模板管理
- 自定义工单模板
- 多步骤工作流
- 灵活的字段类型支持

### 👥 用户管理
- 获取用户列表
- 更新用户信息
- 角色管理

### 📁 文件管理
- 文件上传（照片、签名等）
- 文件下载
- 文件删除

### 🔍 人脸识别
- 人脸验证接口（可集成第三方服务）

## 📋 技术栈

- **FastAPI** - 现代、快速的Web框架
- **SQLAlchemy** - ORM数据库工具
- **Pydantic** - 数据验证
- **JWT** - Token认证
- **Bcrypt** - 密码加密
- **SQLite/PostgreSQL** - 数据库

## 🛠️ 安装步骤

### 1. 创建虚拟环境

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. 安装依赖

```bash
pip install -r requirements.txt
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 必须修改的配置
SECRET_KEY=your-secret-key-here  # 生成方法: openssl rand -hex 32

# 可选配置
DATABASE_URL=sqlite:///./ticketing_system.db
# 使用PostgreSQL: postgresql://user:password@localhost/dbname
```

### 4. 启动服务器

```bash
# 开发模式（自动重载）
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 或使用Python直接运行
python -m uvicorn app.main:app --reload
```

服务器将在 `http://localhost:8000` 启动。

### 5. 访问API文档

启动后访问：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 📚 API端点

### 认证 (Authentication)

| 方法 | 端点 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/auth/login` | 用户登录 | ❌ |
| POST | `/api/auth/register` | 用户注册 | ❌ |
| POST | `/api/auth/logout` | 用户登出 | ✅ |

### 工单 (Tickets)

| 方法 | 端点 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/tickets` | 获取所有工单 | ✅ |
| GET | `/api/tickets/{id}` | 获取单个工单 | ✅ |
| POST | `/api/tickets` | 创建工单 | ✅ |
| PUT | `/api/tickets/{id}` | 更新工单 | ✅ |
| DELETE | `/api/tickets/{id}` | 删除工单 | ✅ |
| POST | `/api/tickets/{id}/accept` | 接受工单 | ✅ |
| POST | `/api/tickets/{id}/decline` | 拒绝工单 | ✅ |
| POST | `/api/tickets/{id}/cancel` | 取消工单 | ✅ |

### 模板 (Templates)

| 方法 | 端点 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/templates` | 获取所有模板 | ✅ |
| GET | `/api/templates/{id}` | 获取单个模板 | ✅ |
| POST | `/api/templates` | 创建模板 | ✅ |
| PUT | `/api/templates/{id}` | 更新模板 | ✅ |
| DELETE | `/api/templates/{id}` | 删除模板 | ✅ |

### 用户 (Users)

| 方法 | 端点 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/users` | 获取所有用户 | ✅ |
| GET | `/api/users/{id}` | 获取单个用户 | ✅ |
| PUT | `/api/users/{id}` | 更新用户 | ✅ |

### 文件 (Files)

| 方法 | 端点 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/files/upload` | 上传文件 | ✅ |
| GET | `/api/files/{id}` | 下载文件 | ✅ |
| DELETE | `/api/files/{id}` | 删除文件 | ✅ |

### 人脸识别 (Face Recognition)

| 方法 | 端点 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/face-recognition/verify` | 验证人脸 | ✅ |

## 🔐 认证说明

大多数端点需要JWT认证。在请求头中包含token：

```
Authorization: Bearer <your-token-here>
```

### 获取Token

1. 使用 `/api/auth/login` 登录
2. 响应中包含 `token` 字段
3. 在后续请求中使用此token

### 示例

```bash
# 登录
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# 响应
{
  "user": {...},
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

# 使用token访问受保护端点
curl -X GET "http://localhost:8000/api/tickets" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 📦 数据模型

### User（用户）
```json
{
  "id": "uuid",
  "name": "User Name",
  "email": "user@example.com",
  "role": "engineer|supervisor|administrator",
  "created_at": "2025-11-03T00:00:00Z",
  "updated_at": "2025-11-03T00:00:00Z"
}
```

### Ticket（工单）
```json
{
  "id": "T12345678",
  "title": "Ticket Title",
  "description": "Description",
  "template_id": "TPL12345678",
  "template_name": "Template Name",
  "status": "new|assigned|inProgress|done|declined|cancelled",
  "priority": "low|medium|high|urgent",
  "assigned_to": "user-id",
  "assigned_to_name": "Engineer Name",
  "created_by": "user-id",
  "created_by_name": "Creator Name",
  "created_at": "2025-11-03T00:00:00Z",
  "updated_at": "2025-11-03T00:00:00Z",
  "due_date": "2025-11-10T00:00:00Z",
  "completed_steps": ["step1", "step2"],
  "step_data": {},
  "accepted": false,
  "accepted_at": null,
  "declined_reason": null,
  "cancelled_reason": null
}
```

### Template（模板）
```json
{
  "id": "TPL12345678",
  "name": "Template Name",
  "description": "Description",
  "created_at": "2025-11-03T00:00:00Z",
  "updated_at": "2025-11-03T00:00:00Z",
  "steps": [
    {
      "id": "STEP12345678",
      "name": "Step Name",
      "description": "Step Description",
      "order": 1,
      "fields": [
        {
          "id": "FIELD12345678",
          "name": "Field Name",
          "type": "text|number|date|location|photo|signature|faceRecognition",
          "required": true,
          "order": 1
        }
      ]
    }
  ]
}
```

## 🗄️ 数据库

### SQLite（默认）

数据库文件将自动创建在 `ticketing_system.db`。

### PostgreSQL（生产环境推荐）

1. 创建PostgreSQL数据库
2. 修改 `.env` 中的 `DATABASE_URL`：

```env
DATABASE_URL=postgresql://username:password@localhost/ticketing_system
```

### 数据库迁移

数据库表会在首次启动时自动创建。

## 🧪 测试API

### 使用Swagger UI

1. 启动服务器
2. 访问 http://localhost:8000/docs
3. 点击 "Authorize" 按钮
4. 先调用 `/api/auth/register` 或 `/api/auth/login` 获取token
5. 将token粘贴到Authorization输入框
6. 测试其他端点

### 使用cURL

```bash
# 注册用户
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "engineer"
  }'

# 创建模板
curl -X POST "http://localhost:8000/api/templates" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "维护检查模板",
    "description": "常规维护检查",
    "steps": [
      {
        "name": "外观检查",
        "description": "检查设备外观",
        "order": 1,
        "fields": [
          {
            "name": "拍照记录",
            "type": "photo",
            "required": true,
            "order": 1
          }
        ]
      }
    ]
  }'
```

## 🔧 开发指南

### 项目结构

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI应用入口
│   ├── core/                # 核心配置
│   │   ├── config.py        # 应用配置
│   │   ├── security.py      # 安全工具（JWT、密码）
│   │   └── database.py      # 数据库配置
│   ├── models/              # SQLAlchemy模型
│   │   ├── user.py
│   │   ├── ticket.py
│   │   ├── template.py
│   │   └── comment.py
│   ├── schemas/             # Pydantic schemas
│   │   ├── user.py
│   │   ├── ticket.py
│   │   ├── template.py
│   │   └── auth.py
│   └── routers/             # API路由
│       ├── auth.py
│       ├── tickets.py
│       ├── templates.py
│       ├── users.py
│       ├── files.py
│       └── face_recognition.py
├── uploads/                 # 文件上传目录
├── requirements.txt         # Python依赖
├── .env.example            # 环境变量示例
└── README.md               # 本文件
```

### 添加新端点

1. 在 `app/models/` 添加数据模型（如需要）
2. 在 `app/schemas/` 添加Pydantic schemas
3. 在 `app/routers/` 添加路由
4. 在 `app/main.py` 中注册路由

### 修改数据库模型

1. 修改 `app/models/` 中的模型
2. 删除现有数据库文件（开发环境）
3. 重启服务器，数据库表会自动重建

## 🚀 部署

### 使用Uvicorn

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 使用Gunicorn + Uvicorn

```bash
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### 使用Docker

创建 `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

构建和运行：

```bash
docker build -t ticketing-api .
docker run -p 8000:8000 ticketing-api
```

## 🔐 安全建议

1. **生产环境**：
   - 修改 `SECRET_KEY` 为强随机密钥
   - 使用 `openssl rand -hex 32` 生成
   - 设置 `DEBUG=False`

2. **数据库**：
   - 生产环境使用PostgreSQL
   - 定期备份数据库

3. **HTTPS**：
   - 使用反向代理（Nginx）配置HTTPS
   - 强制使用HTTPS连接

4. **CORS**：
   - 限制 `CORS_ORIGINS` 只允许可信域名

## 📝 环境变量说明

| 变量 | 说明 | 默认值 |
|------|------|--------|
| APP_NAME | 应用名称 | EV Charging Station Maintenance API |
| APP_VERSION | 应用版本 | 1.0.0 |
| DEBUG | 调试模式 | True |
| API_PREFIX | API前缀 | /api |
| SECRET_KEY | JWT密钥 | 需要修改 |
| ACCESS_TOKEN_EXPIRE_MINUTES | Token过期时间（分钟） | 1440 (24小时) |
| DATABASE_URL | 数据库连接 | sqlite:///./ticketing_system.db |
| UPLOAD_DIR | 上传目录 | ./uploads |
| MAX_UPLOAD_SIZE | 最大上传大小（字节） | 10485760 (10MB) |

## 🐛 故障排除

### 端口被占用

```bash
# 查找占用端口的进程
lsof -i :8000

# 使用不同端口
uvicorn app.main:app --port 8001
```

### 数据库错误

```bash
# 删除数据库文件重新开始
rm ticketing_system.db

# 重启服务器
uvicorn app.main:app --reload
```

### 导入错误

```bash
# 确认在正确的目录
cd backend

# 确认虚拟环境已激活
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# 重新安装依赖
pip install -r requirements.txt
```

## 📞 支持

如有问题或需要帮助：
1. 查看API文档：http://localhost:8000/docs
2. 检查服务器日志
3. 验证环境变量配置

## 📄 许可证

MIT License

---

**准备就绪！开始使用FastAPI后端吧！** 🚀
