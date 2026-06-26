# Changelog

## v1.0.10 (2026-06-26)

**新增 4 个编码/加密工具** (总共 55 个)

- 🔐 **AES/DES Encryptor** — 对称加密/解密（AES-CBC/GCM/CTR/ECB、DES、3DES），支持密钥/IV 自动生成
- 📜 **Certificate Parser** — 解析 PEM/X.509 证书（颁发者/有效期/SAN/指纹/扩展）
- 🔏 **HMAC Generator** — HMAC-SHA-1/256/384/512 签名生成
- 🔑 **SSH Key Generator** — 生成 Ed25519/RSA 密钥对，OpenSSH 格式公钥 + SHA-256 指纹
- 🐛 **修复** 更新说明弹窗 HTML 未渲染问题

---

## v1.0.7 (2025-06-26)

**新增 8 个工具** (总共 46 个)

- ⏱️ **Timer & Stopwatch** — 秒表 · 倒计时 · 番茄钟 · 间歇训练计时器（Web Audio 闹钟，键盘 Space/R 快捷键）
- 🔌 **USB Device Viewer** — WebHID 设备查看器（VID/PID/HID 集合/输入报告/导出 JSON）
- 🔍 **XPath Tester** — XPath 表达式测试与 XML/HTML 节点查询（元素/属性/文本/数字/布尔结果）
- 📋 **HTTP Status Codes** — HTTP 状态码速查手册（1xx–5xx）
- 🎯 **Regex Cheat Sheet** — 正则表达式语法速查手册（语法/量词/锚点/分组/断言/标志位）
- 🔤 **HTML Entities** — HTML 实体字符速查手册（&amp; / &lt; / &copy; 等）
- 🗄️ **SQL Cheat Sheet** — SQL 常用语法速查（SELECT/JOIN/GROUP BY/DDL/DML）
- 🖼️ **Image Tools** — 图片转 Base64 · 拖放上传 · 图片信息（尺寸/格式/大小）
- 🔄 **Data Format Converter** — CSV ↔ JSON ↔ XML 数据格式互转

---

## v1.0.6 (2025-06-26)

**新增 8 个工具** (总共 38 个)

- 🎨 **Color Converter** — 颜色格式转换 HEX ↔ RGB ↔ HSL
- 📝 **Lorem Ipsum Generator** — 虚拟占位文本生成（段落/句子/单词）
- 🔍 **Regex Tester** — 正则表达式实时测试与替换（分组捕获/替换预览/标志位）
- 📊 **Diff Checker** — 逐行对比文本差异，LCS 算法，三色高亮
- 🔢 **Number Base Converter** — 进制转换（Bin/Oct/Dec/Hex）+ 反码/补码
- 📏 **Unit Converter** — 10 种单位换算（长度/面积/体积/时间/角度/速度/温度/压力/热量/功率）
- 🏠 **首页重设计** — Hero 区域 + 统计面板 + 分类色标卡片
- 🗂️ **分组重组** — 7 大分类，拆分「编码/加密」

---

## v1.0.5 (2025-06-25)

**修复**

- 🐛 修复更新检测版本比较和状态覆盖竞态问题
- 🐛 修复本地版本与 GitHub 版本不匹配导致的更新下载失败

---

## v1.0.4 (2025-06-25)

**修复**

- 📐 About 页面更新技术栈和图标库信息（Lucide React / Radix UI / CodeMirror 6）

---

## v1.0.3 (2025-06-25)

**修复**

- 🐛 修复设置页面窗口化无法滚动（移除双层 overflow 冲突）
- 🎨 检查更新 / 恢复默认按钮并排到底部 footer
- 📐 About 页面技术栈更新

---

## v1.0.2 (2025-06-25)

**N/A — 跳过**

---

## v1.0.1 (2025-06-25)

初始公开发布

---

## v1.1.0 (2025-06-25)

**新增工具**

- 📋 **npm Cheat Sheet** — npm / Yarn / pnpm 命令速查
- 🐧 **Linux Cheat Sheet** — Linux 常用命令速查手册
- ☸️ **Kubernetes Cheat Sheet** — K8s 命令速查手册
- 🧩 **通用 CheatSheet 组件** — 抽取可复用的速查表组件

---

## v1.0.0

首次发布 — 基础工具集。
