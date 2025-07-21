# 🎯 最简单的GitHub部署方案

## 🚀 推荐方案：使用GitHub网页界面直接上传

### 步骤1：创建GitHub仓库
1. 访问 https://github.com
2. 点击右上角 `+` → `New repository`
3. Repository name: `cpk-tools`
4. Description: `Professional CPK Analysis Tools - 专业的CPK分析工具`
5. 选择 **Public**
6. 点击 `Create repository`

### 步骤2：上传文件
1. 在新创建的仓库页面，点击 `uploading an existing file`
2. 将以下文件拖拽到上传区域：

**必须上传的核心文件：**
- `index.html`
- `ATE Tool/` 整个文件夹
- `Accuracy Tool/` 整个文件夹
- `.github/workflows/pages.yml`
- `README.md`
- `LICENSE`
- `package.json`

**可选文件：**
- 所有其他HTML、CSS、JS文件
- `界面优化展示.html`
- 所有库文件（.min.js, .min.css）

3. 在页面底部的 "Commit changes" 部分：
   - Title: `Initial commit: CPK Analysis Tools v2.0.0`
   - Description: `Add professional CPK analysis tools with modern UI`
4. 点击 `Commit changes`

### 步骤3：启用GitHub Pages
1. 在仓库页面，点击 `Settings` 标签
2. 在左侧菜单中找到 `Pages`
3. 在 **Source** 部分选择 `GitHub Actions`
4. 页面会自动检测到工作流文件

### 步骤4：等待部署完成
1. 点击仓库的 `Actions` 标签
2. 查看 "Deploy CPK Tools to GitHub Pages" 工作流
3. 等待绿色勾号（通常需要2-5分钟）

### 步骤5：访问你的网站
网站地址：`https://你的GitHub用户名.github.io/cpk-tools/`

---

## 🔄 后续更新方法

### 方法1：GitHub网页编辑
1. 直接在GitHub上点击文件名
2. 点击编辑按钮（铅笔图标）
3. 修改后提交更改

### 方法2：重新上传文件
1. 在仓库页面点击 `Add file` → `Upload files`
2. 拖拽修改后的文件
3. 提交更改

---

## ✅ 检查清单

- [ ] GitHub仓库已创建
- [ ] 所有文件已上传
- [ ] GitHub Pages已启用（Source: GitHub Actions）
- [ ] Actions工作流运行成功
- [ ] 网站可以正常访问
- [ ] ATE CPK工具正常工作
- [ ] Accuracy CPK工具正常工作

---

**🎊 这是最简单的方法，不需要安装任何软件！**

如果你更喜欢使用图形界面，也可以参考 `GITHUB_DESKTOP_GUIDE.md`
