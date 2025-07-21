# 🖥️ 使用GitHub Desktop部署 | Deploy with GitHub Desktop

## 📦 下载并安装GitHub Desktop

1. 访问：https://desktop.github.com/
2. 下载并安装GitHub Desktop
3. 使用你的GitHub账户登录

## 🚀 简单部署步骤

### 1. 创建GitHub仓库
1. 打开 https://github.com
2. 点击 `+` → `New repository`
3. 名称：`cpk-tools`
4. 选择Public，点击Create

### 2. 使用GitHub Desktop发布
1. 打开GitHub Desktop
2. 点击 `File` → `Add Local Repository`
3. 选择你的项目文件夹：
   ```
   C:\Users\DanieHuang\OneDrive - LITE-ON TECHNOLOGY CORP\Desktop\CPK 20250715
   ```
4. 如果提示"This directory does not appear to be a Git repository"
   - 点击 `create a repository`
5. 填写：
   - Name: `cpk-tools`
   - Description: `Professional CPK Analysis Tools`
   - 取消勾选 `Initialize this repository with a README`
6. 点击 `Create Repository`

### 3. 发布到GitHub
1. 在GitHub Desktop中，点击 `Publish repository`
2. 确保 `Keep this code private` 未勾选
3. 点击 `Publish Repository`

### 4. 启用GitHub Pages
1. 在GitHub网站上进入你的仓库
2. 点击 `Settings`
3. 找到 `Pages` 设置
4. Source选择 `GitHub Actions`

## ✅ 验证部署

访问：`https://你的用户名.github.io/cpk-tools/`

---

**这种方法更简单，适合不熟悉命令行的用户！** 🎉
