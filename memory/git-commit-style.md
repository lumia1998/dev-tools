# Git Commit 风格

## 格式
```
<type>: <中文简述>
```

## 类型
| type | 场景 |
|------|------|
| `feat` | 新功能、新工具 |
| `fix` | 修复 bug |
| `style` | UI/视觉调整（不影响逻辑） |
| `refactor` | 重构（不改功能） |
| `docs` | 文档 |
| `chore` | 配置、版本、端口等杂项 |

## 特点
- 简述用**中文**，简洁描述改动内容
- 用**破折号 `—`** 分隔动作和对象（可选，如 `feat: 新增 File Generator 测试文件生成器`）
- 一个 commit 一个逻辑单元，不混合无关改动
- 不加 scope（无括号前缀）
- 不加 body / footer（纯单行）

## 示例
```
feat: 新增 Case Converter — 大小写与命名格式实时转换
refactor: 页面注册表 — 工具页面统一管理，App.tsx 精简
style: 重新设计设置页面 — Editorial 宽屏布局
fix: 鼠标右键识别为中键、滚轮显示为左键 的问题
chore: bump version to 1.0.1
docs: 更新 README，列出全部工具和快捷功能
```
