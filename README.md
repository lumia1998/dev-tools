# Dev Tools

一站式开发工具箱，基于 Electron + React + TypeScript 构建。

## 工具列表

### 开发工具
- **Token Generator** — 生成 UUID、JWT、API Key 等随机标识符
- **JWT Generator** — 快速生成和调试 JSON Web Token
- **Cron Generator** — 可视化生成和解析 Cron 表达式
- **JSON Formatter** — 格式化、压缩、校验 JSON，支持树形视图和排序键名
- **URL Codec** — URL 编码与解码
- **Hash Generator** — MD5、SHA-1、SHA-256、SHA-384、SHA-512
- **Password Generator** — 高强度随机密码 + 密码强度检测
- **JWT Decoder** — 解析和检查 JWT Token
- **Base64 Codec** — Base64 编码与解码
- **Keyboard Tester** — 实时查看键盘按键的 KeyboardEvent
- **Mouse Tester** — 鼠标事件检测，5 键状态 + 坐标 + 滚轮
- **Git Cheat Sheet** — Git 命令速查手册 + 快捷配置（SSH/登录）
- **Docker Cheat Sheet** — Docker 命令速查 + 容器快捷管理
- **Maven Dependency** — Maven Central 实时搜索依赖，支持 Maven/Gradle/SBT
- **File Generator** — 生成指定大小的测试文件（TXT/JSON/CSV/Binary/Base64）

### 网络工具
- **我的 IP** — 查看本机内网 IP
- **Port Generator** — 生成随机网络端口号
- **Subnet Calculator** — IPv4 子网计算器
- **IPv4 Converter** — IPv4 地址与数字格式互相转换
- **IP Range Expander** — IP 范围转 CIDR 计算

### 换算工具
- **Data Size Converter** — 数据大小单位转换（Binary/Decimal）
- **Timestamp Converter** — Unix 时间戳与日期时间双向转换

### 文本工具
- **Text Analyzer** — 实时文本统计 + 测试数据生成（中英文混合）

### 系统工具
- **设备信息** — 设备和浏览器运行环境检测（含 IP 定位降级）

## 快捷功能

- **Ctrl+K** — 全局命令面板，搜索所有工具
- **Ctrl+Enter** — JSON Formatter 内快速格式化
- **设置页** — 主题切换、字体大小、自动更新

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For Windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
