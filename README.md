# 成为更好的人类

一个自律养成安卓APP。

基于 tauri 开发

<img src="icon.png" width=150 height=150>

## 前置依赖

| 依赖 | 版本要求 | 说明 |
|------|---------|------|
| Node.js | >= 18 | JS 运行时 |
| pnpm | >= 8 | 包管理器 |
| Rust / Cargo | stable | Tauri 核心编译依赖 |
| Java (JDK) | 17 | Android 构建必须 |
| Android SDK | API 24+ | 含 NDK >= 26 |

> Android 环境变量（`JAVA_HOME`、`ANDROID_HOME`、`NDK_HOME`）必须正确配置后才能进行 Android 相关操作。

## 快速开始

```bash
# 1. 安装依赖
pnpm install

# 2. 运行（桌面）
pnpm dev

# 3. 运行（Android）
pnpm android:dev
```

## 详细文档

> 以下文档中所使用的路径仅作示例，具体路径请自行甄别并更改

- [安装依赖](docs/install.md) — 环境配置、Rust 安装、Android 工具链
- [运行项目](docs/run.md) — 桌面 / Android 开发模式
- [打包项目](docs/build.md) — 构建 APK / AAB / 桌面安装包
