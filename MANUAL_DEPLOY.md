# 🚀 手动GitHub部署指南 | Manual GitHub Deployment Guide

## 📋 部署前准备

### 1. 安装Git（如果尚未安装）
- 下载Git：https://git-scm.com/download/win
- 或使用命令：`winget install Git.Git`
- 安装完成后重启命令行

### 2. 配置Git（首次使用）
```powershell
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱@example.com"
```

## 🌐 创建GitHub仓库

1. 打开 https://github.com
2. 点击右上角的 `+` → `New repository`
3. **Repository name**: `cpk-tools`
4. **Description**: `Professional CPK Analysis Tools - 专业的CPK分析工具`
5. 选择 **Public**
6. 不勾选 "Add a README file"（我们已经有了）
7. 点击 **Create repository**

## 📤 上传代码步骤

### 方法一：使用我们的自动脚本（推荐）

1. **打开PowerShell** 并导航到项目目录：
   ```powershell
   cd "C:\Users\DanieHuang\OneDrive - LITE-ON TECHNOLOGY CORP\Desktop\CPK 20250715"
   ```

2. **修改部署脚本**中的仓库地址：
   - 编辑 `deploy.bat` 文件
   - 将 `https://github.com/你的用户名/cpk-tools.git` 
   - 替换为你的实际仓库地址，例如：`https://github.com/DanieHuang/cpk-tools.git`

3. **运行部署脚本**：
   ```powershell
   .\deploy.bat
   ```

### 方法二：手动步骤

```powershell
# 1. 初始化Git仓库
git init

# 2. 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/cpk-tools.git

# 3. 设置主分支名称
git branch -M main

# 4. 添加所有文件
git add .

# 5. 提交代码
git commit -m "Initial commit: Professional CPK Analysis Tools v2.0.0"

# 6. 推送到GitHub
git push -u origin main
```

## ⚙️ 启用GitHub Pages

1. 进入你的GitHub仓库页面
2. 点击 **Settings** 标签
3. 在左侧菜单找到 **Pages**
4. 在 **Source** 部分选择 **GitHub Actions**
5. 页面会显示："Source: Deploy from a branch" → 改为 "GitHub Actions"

## 🎯 验证部署

1. **检查Actions状态**：
   - 在仓库页面点击 **Actions** 标签
   - 查看 "Deploy CPK Tools to GitHub Pages" 工作流
   - 等待绿色勾号表示部署成功

2. **访问你的网站**：
   - URL格式：`https://你的用户名.github.io/cpk-tools/`
   - 例如：`https://daniehuang.github.io/cpk-tools/`

3. **测试功能**：
   - 访问主页
   - 测试ATE CPK工具
   - 测试Accuracy CPK工具

## 🔧 故障排除

### Git命令不识别
- 重新安装Git
- 重启命令行工具
- 检查环境变量PATH

### 推送失败
- 检查网络连接
- 确认GitHub仓库地址正确
- 可能需要配置GitHub令牌认证

### Pages不显示
- 等待5-10分钟（首次部署需要时间）
- 检查Actions是否成功运行
- 确认仓库为Public状态

## 📞 需要帮助？

如果遇到问题：
1. 检查 `DEPLOYMENT.md` 详细说明
2. 参考 `CHECKLIST.md` 检查清单
3. 查看GitHub仓库的Issues页面

---

**🎉 准备好了吗？按照上面的步骤开始部署吧！**
