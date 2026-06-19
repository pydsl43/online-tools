# 🛠️ 白给工具

[![GitHub](https://img.shields.io/badge/在线访问-wdnmd.vip-blue?style=flat-square)](https://wdnmd.vip/)
[![GitHub Pages](https://img.shields.io/badge/deployed-GitHub%20Pages-success?style=flat-square)](https://pages.github.com/)
[![License](https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square)](LICENSE)

白给工具 - 一个免费、安全、隐私保护的在线工具合集。**所有处理均在浏览器本地完成，不上传任何服务器。**

🌐 **在线访问**: [https://wdnmd.vip/](https://wdnmd.vip/)

---

## 🧰 工具列表

| 工具 | 说明 | 链接 | 状态 |
|------|------|------|:----:|
| 🖼️ **在线图片压缩** | 免费压缩 PNG/JPG/WebP 等格式，支持批量处理 | [立即使用](https://wdnmd.vip/image-tools/) | ✅ 已上线 |
| 📄 **在线 PDF 工具** | PDF 合并、拆分、压缩，全部本地处理 | [立即使用](https://wdnmd.vip/pdf-tools/) | ✅ 已上线 |
| ✏️ **在线文字处理** | 字数统计、大小写转换、简繁转换、JSON 格式化 | [立即使用](https://wdnmd.vip/text-tools/) | ✅ 已上线 |

## ✨ 特点

- 🆓 **完全免费** — 所有功能永久免费使用
- 🔒 **隐私安全** — 文件在浏览器本地处理，不会上传到任何服务器
- 🚀 **快速高效** — 纯前端实现，无需等待服务器响应
- 📱 **移动友好** — 手机、平板、桌面都能流畅使用
- 🎯 **无需注册** — 打开即用，无需创建账号

## 🏗️ 技术栈

- HTML5 / CSS3 / JavaScript (ES6+)
- [Tailwind CSS](https://tailwindcss.com/) — 页面样式
- [pdf-lib](https://pdf-lib.js.org/) — PDF 处理
- Canvas API — 图片压缩处理
- **零后端依赖** — 全部客户端处理

## 🚀 部署

通过 GitHub Pages + GitHub Actions 自动构建发布。

```bash
# 本地预览
cd online-tools
python3 -m http.server 8000
# 访问 http://localhost:8000
```

## 📄 页面结构

```
/
├── index.html              # 门户首页
├── image-tools/index.html  # 图片压缩工具
├── pdf-tools/index.html    # PDF 工具
├── text-tools/index.html   # 文字处理工具
├── privacy.html            # 隐私政策
├── about.html              # 关于我们
├── contact.html            # 联系我们
├── sitemap.xml             # Sitemap
├── feed.xml                # RSS Feed
├── robots.txt              # Robots 配置
└── ads.txt                 # 广告验证文件
```

## 📊 项目状态

[![Pages Build](https://github.com/pydsl43/online-tools/actions/workflows/deploy.yml/badge.svg)](https://github.com/pydsl43/online-tools/actions/workflows/deploy.yml)

---

> 💡 如果你觉得这个工具有帮助，欢迎给项目点个 ⭐ Star！
