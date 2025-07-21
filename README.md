# 🔧 CPK Analysis Tools | CPK 分析工具

[![Deploy to GitHub Pages](https://github.com/your-username/cpk-tools/workflows/Deploy%20CPK%20Tools%20to%20GitHub%20Pages/badge.svg)](https://github.com/your-username/cpk-tools/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 专业的CPK（过程能力指数）分析工具集，支持ATE测试数据和Accuracy测试数据的自动化处理与分析。

## ✨ 功能特色

### 🎯 ATE CPK 分析工具
- **Excel数据导入** - 支持导入Chromra ATE测试数据
- **ATE Report自动解析** - 智能识别txt格式的ATE报告
- **信号自动匹配** - 自动填充CH1-CH10测试信号
- **模型名称提取** - 自动从文件名提取型号信息
- **CPK计算与导出** - 完整的统计分析和Excel导出

### 🎪 Accuracy CPK 分析工具  
- **批量文件处理** - 支持文件夹批量上传处理
- **智能数据识别** - 自动识别Accuracy测试参数
- **统计分析** - 完整的CPK统计计算
- **多语言支持** - 繁体中文、英文、越南语

## 🚀 在线使用

访问我们的GitHub Pages部署：**[https://your-username.github.io/cpk-tools/](https://your-username.github.io/cpk-tools/)**

## 📱 界面预览

### 主页面
![CPK工具主页](界面优化展示.html)

### ATE CPK 工具
- 现代化的Apple风格设计
- 响应式布局，支持移动设备
- 直观的操作流程

### Accuracy CPK 工具
- 统一的设计语言
- 智能的文件处理
- 实时的数据分析

## 🛠️ 技术特性

- **纯前端技术** - HTML5 + CSS3 + JavaScript ES6+
- **响应式设计** - 支持桌面端和移动端
- **现代UI/UX** - Apple风格设计语言
- **离线使用** - 无需服务器，数据本地处理
- **跨浏览器兼容** - 支持Chrome、Edge、Firefox、Safari

## 📦 本地部署

1. **克隆仓库**
   ```bash
   git clone https://github.com/your-username/cpk-tools.git
   cd cpk-tools
   ```

2. **直接打开**
   ```bash
   # 使用浏览器打开主页面
   open 界面优化展示.html
   
   # 或者直接使用工具
   open "ATE Tool/ATE CPK Tool.html"
   open "Accuracy Tool/Accuracy CPK Tool.html"
   ```

3. **使用本地服务器**（推荐）
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js
   npx serve .
   ```

## 📖 使用指南

### ATE CPK 工具使用流程

1. **上传Excel文件** - 点击"上傳 Excel"按钮选择Chromra ATE数据文件
2. **上传ATE Report** - 点击"上傳 ATE Report"选择txt格式的测试报告
3. **确认信号匹配** - 系统自动识别信号，可手动调整CH1-CH10
4. **执行CPK分析** - 点击"執行 CPK"开始计算
5. **导出结果** - 点击"導出CPK"或"導出圖片"保存结果

### Accuracy CPK 工具使用流程

1. **选择文件夹** - 点击"選擇資料夾"上传包含txt文件的文件夹
2. **执行分析** - 点击"執行 Accuracy CPK"开始数据处理
3. **查看结果** - 查看生成的CPK分析表格
4. **导出Excel** - 点击"導出 CPK Excel"保存分析结果

## 🔧 技术架构

```
cpk-tools/
├── ATE Tool/                    # ATE CPK分析工具
│   ├── ATE CPK Tool.html       # 主页面
│   ├── ate-cpk-tool.css        # 样式文件
│   └── ate-cpk-tool.js         # 逻辑脚本
├── Accuracy Tool/              # Accuracy CPK分析工具
│   ├── Accuracy CPK Tool.html  # 主页面
│   └── accuracy-cpk-tool.css   # 样式文件
├── Test data/                  # 测试数据示例
├── .github/workflows/          # GitHub Actions配置
│   └── pages.yml              # 自动部署配置
├── 界面优化展示.html            # 项目主页
└── README.md                   # 项目说明
```

## 🎨 设计亮点

- **统一设计语言** - Apple风格的现代化设计
- **响应式布局** - 完美适配各种屏幕尺寸
- **毛玻璃效果** - backdrop-filter实现的高级视觉效果
- **动态交互** - 平滑的过渡动画和悬停效果
- **深色模式友好** - 优雅的颜色搭配

## 🌐 浏览器支持

| 浏览器 | 版本要求 | 文件夹上传 | 毛玻璃效果 |
|--------|----------|------------|------------|
| Chrome | ≥ 88 | ✅ | ✅ |
| Edge | ≥ 88 | ✅ | ✅ |
| Firefox | ≥ 87 | ✅ | ⚠️ |
| Safari | ≥ 14 | ✅ | ✅ |

## 📝 更新日志

### v2.0.0 (2025-07-20)
- 🎨 全新的界面设计，统一Apple风格
- 📱 完整的响应式支持
- 🚀 性能优化和代码重构
- 🌍 多语言支持（中文、英文、越南语）
- ✨ 新增ATE Report自动解析功能
- 🔧 改进的错误处理和用户反馈

### v1.0.0
- 🎉 初始版本发布
- 📊 基础的CPK分析功能
- 📤 Excel导入导出功能

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 这个仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系我们

- **项目主页**: [https://github.com/your-username/cpk-tools](https://github.com/your-username/cpk-tools)
- **在线演示**: [https://your-username.github.io/cpk-tools/](https://your-username.github.io/cpk-tools/)
- **问题反馈**: [Issues](https://github.com/your-username/cpk-tools/issues)

## ⭐ 支持项目

如果这个项目对您有帮助，请给我们一个星标 ⭐️

---

<div align="center">
  <p>Made with ❤️ for the test engineering community</p>
  <p>为测试工程师社区用心打造</p>
</div>
