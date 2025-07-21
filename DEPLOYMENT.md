# 🚀 部署指南 | Deployment Guide

## GitHub Pages 自动部署

### 1. 创建GitHub仓库

1. 登录到 [GitHub](https://github.com)
2. 点击右上角的 `+` -> `New repository`
3. 输入仓库名称，建议使用 `cpk-tools`
4. 选择 `Public`（GitHub Pages需要公开仓库，除非你有Pro账户）
5. 点击 `Create repository`

### 2. 上传代码到GitHub

#### 方法一：使用部署脚本（推荐）

**Windows:**
```cmd
.\deploy.bat
```

**Mac/Linux:**
```bash
chmod +x deploy.sh
./deploy.sh
```

#### 方法二：手动部署

```bash
# 1. 在项目目录中初始化git
cd "CPK 20250715"
git init

# 2. 添加远程仓库（请替换为你的GitHub用户名）
git remote add origin https://github.com/你的用户名/cpk-tools.git

# 3. 添加所有文件
git add .

# 4. 提交代码
git commit -m "Initial commit: CPK Analysis Tools v2.0.0"

# 5. 推送到GitHub
git branch -M main
git push -u origin main
```

### 3. 启用GitHub Pages

1. 进入你的GitHub仓库页面
2. 点击 `Settings` 标签
3. 在左侧菜单中找到 `Pages`
4. 在 `Source` 部分选择 `GitHub Actions`
5. 系统会自动检测到 `.github/workflows/pages.yml` 文件
6. GitHub Actions会自动运行并部署你的网站

### 4. 访问部署的网站

部署完成后，你的网站将在以下地址可用：
- `https://你的用户名.github.io/cpk-tools/`

## 自定义域名（可选）

如果你有自己的域名，可以配置自定义域名：

1. 在仓库根目录创建 `CNAME` 文件
2. 在文件中输入你的域名，例如：`tools.yourdomain.com`
3. 在你的DNS服务商处添加CNAME记录指向 `你的用户名.github.io`

## 本地开发和测试

```bash
# 使用Python内置服务器
python -m http.server 8000

# 或使用Node.js serve
npx serve .

# 然后访问 http://localhost:8000
```

## 更新部署

每次推送代码到main分支时，GitHub Actions会自动重新部署：

```bash
git add .
git commit -m "Update: 描述你的更改"
git push origin main
```

## 故障排除

### 部署失败
1. 检查 `.github/workflows/pages.yml` 文件是否正确
2. 确保仓库设置中已启用GitHub Pages
3. 查看Actions标签页中的错误日志

### 页面无法访问
1. 等待几分钟，GitHub Pages部署可能需要一些时间
2. 检查仓库是否为公开状态
3. 确认GitHub Pages设置正确

### 样式或功能异常
1. 检查浏览器控制台是否有错误信息
2. 确保所有相对路径正确
3. 测试不同浏览器的兼容性

## 贡献代码

如果你想贡献代码：

1. Fork这个仓库
2. 创建新的分支 `git checkout -b feature/新功能`
3. 提交你的更改 `git commit -am '添加新功能'`
4. 推送到分支 `git push origin feature/新功能`
5. 创建Pull Request

---

**需要帮助？** 
- 查看 [GitHub Pages 文档](https://docs.github.com/en/pages)
- 在 [Issues](https://github.com/你的用户名/cpk-tools/issues) 页面提问
