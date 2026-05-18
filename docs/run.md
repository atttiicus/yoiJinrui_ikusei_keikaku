# 运行项目

确保已完成 [安装依赖](install.md) 中的所有步骤。

> 此文档中路径仅作示例，具体路径请自行甄别并更改


## 安装项目依赖并初始化

```bash
cd app

# 安装 npm 依赖（@tauri-apps/cli、vite 等）
npm install

# 初始化 Android 工程（生成 src-tauri/gen/android/ 目录）
npm run android:init
# 等价于：npx tauri android init

# 生成应用图标（准备一张 1024x1024 的 PNG 图片）
npx tauri icon path/to/your-icon.png
```

---

## 七、启动开发 / 打包

```bash
# 启动桌面开发模式（调试用）
npm run dev

# 连接安卓设备/启动模拟器后，启动安卓开发模式
npm run android:dev

# 构建安卓 APK/AAB
npm run android:build
```


## 桌面开发模式

```bash
cd app
pnpm dev
```

会同时启动 Vite 开发服务器（`http://localhost:1420`）和 Tauri 桌面窗口，支持热更新。

---

## Android 开发模式

### 前置：连接设备或启动模拟器

**真机（推荐）：**
```bash
# 手机开启「开发者选项」→「USB 调试」，连接电脑后：
adb devices  # 确认设备已识别
```

**无线调试（Android 11+）：**
```bash
adb pair <ip>:<port>    # 先配对（IP 和端口在手机「无线调试」页面查看）
adb connect <ip>:<port> # 再连接
```

**模拟器：**  
打开 Android Studio → AVD Manager，启动已有模拟器即可。

### 启动

```bash
cd app
pnpm android:dev
```

Tauri 会自动将应用安装到连接的设备/模拟器并启动，同时开启热更新。

---

## 常见问题

| 错误 | 原因 | 解决 |
|------|------|------|
| `JAVA_HOME is not set` | 环境变量缺失 | 参考 install.md 第 2 步 |
| `SDK location not found` | ANDROID_HOME 缺失 | 参考 install.md 第 2 步 |
| `adb: device offline` | USB 调试未授权 | 手机确认授权弹窗 |
| `No connected devices` | 设备未识别 | 检查驱动或改用无线调试 |
