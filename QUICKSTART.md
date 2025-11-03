# 快速开始指南 / Quick Start Guide

## 🚀 5分钟启动完整系统

### 第一步：启动后端

```bash
# 1. 进入后端目录
cd backend

# 2. 创建虚拟环境
python -m venv venv

# 3. 激活虚拟环境
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 4. 安装依赖
pip install -r requirements.txt

# 5. 初始化demo数据
python init_demo_data.py

# 6. 启动后端服务器
python run.py
```

✅ 后端运行在：http://localhost:8000
📚 API文档：http://localhost:8000/docs

### 第二步：启动前端

打开新终端窗口：

```bash
# 1. 返回项目根目录
cd /path/to/ticketing_system

# 2. 安装依赖（首次）
npm install

# 3. 启动开发服务器
npm run dev
```

✅ 前端运行在：http://localhost:5173 (或3000)

### 第三步：登录测试

使用demo账户登录：

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 工程师 | demo@csenergy.com | demo123 |
| 工程师 | john@csenergy.com | password123 |
| 主管 | sarah@csenergy.com | password123 |
| 管理员 | admin@csenergy.com | admin123 |

## 📋 系统功能

### ✅ 已实现功能

- 用户认证（JWT）
- 工单管理（CRUD + Accept/Decline/Cancel）
- 模板管理（多步骤、多字段类型）
- 用户管理
- 文件上传
- 多语言支持（英语、泰语、葡萄牙语）
- 响应式设计

### 📊 测试工作流

1. **作为主管**（sarah@csenergy.com）：
   - 创建新工单模板
   - 分配工单给工程师

2. **作为工程师**（demo@csenergy.com）：
   - 查看分配的工单
   - Accept工单
   - 按步骤完成任务
   - 上传照片、获取GPS位置
   - 添加数字签名

3. **查看Dashboard**：
   - 工单统计
   - 按状态分组的看板视图
   - 进度追踪

## 🔧 API集成（可选）

如果需要前端连接真实后端API：

1. 查看 `INTEGRATION_GUIDE.md`
2. 修改 `src/lib/api.js`
3. 取消注释真实API调用
4. 删除mock实现

## 📝 端口配置

默认端口：
- 后端：8000
- 前端：5173 (Vite) 或 3000 (React)

如需修改：

**后端** - 编辑 `backend/run.py`:
```python
uvicorn.run(..., port=8000)  # 修改端口号
```

**前端** - 编辑 `vite.config.ts`:
```typescript
export default {
  server: {
    port: 5173  // 修改端口号
  }
}
```

## 🐛 常见问题

### 后端无法启动

```bash
# 检查Python版本（需要3.8+）
python --version

# 重新安装依赖
pip install --upgrade -r requirements.txt
```

### CORS错误

检查后端 `.env` 文件中的CORS配置：
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 数据库错误

```bash
# 删除数据库重新初始化
cd backend
rm ticketing_system.db
python init_demo_data.py
```

## 📚 更多文档

- **后端文档**：`backend/README.md`
- **API集成**：`INTEGRATION_GUIDE.md`
- **前端文档**：`src/README.md`
- **API参考**：http://localhost:8000/docs

## 🎯 下一步

1. ✅ 启动系统测试所有功能
2. 📖 阅读API文档
3. 🔧 集成前端API（如需要）
4. 🚀 部署到生产环境

---

**遇到问题？** 查看详细文档或检查浏览器控制台错误信息。

**准备好了吗？开始使用吧！** 🎉
