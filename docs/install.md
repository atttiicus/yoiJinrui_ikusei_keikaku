# 安装依赖

> 此文档中路径仅作示例，具体路径请自行甄别并更改

## 1. 安装 Rust

Tauri 核心依赖 Rust，**必须首先安装**。

```powershell
# 方式一：官网下载 rustup-init.exe（可自定义安装路径）
# https://www.rust-lang.org/tools/install

# 方式二：winget
winget install Rustlang.Rustup
```

安装时选择默认选项（stable toolchain），完成后重启终端，验证：

```bash
cargo --version
rustc --version
```

### 添加 Android 交叉编译目标

```bash
rustup target add aarch64-linux-android    # ARM64，主流设备，必须
rustup target add x86_64-linux-android    # x86_64，模拟器调试用
```

---

## 2. 配置环境变量

Android 构建依赖以下三个环境变量，缺一不可。在 PowerShell（管理员）中执行：

```powershell
[System.Environment]::SetEnvironmentVariable("JAVA_HOME",    "C:\jdk\jdk-17.0.18", "Machine")
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\Administrator\AppData\Local\Android\Sdk", "Machine")
[System.Environment]::SetEnvironmentVariable("NDK_HOME",     "C:\Users\Administrator\AppData\Local\Android\Sdk\ndk\28.2.13676358", "Machine")
```

同时确保 PATH 包含：

```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\cmdline-tools\latest\bin
```

> 设置后需**重启终端**才能生效。

---

## 3. 安装 Android cmdline-tools

SDK Manager 等命令行工具需要单独安装。

1. 下载：https://developer.android.com/studio/index.html#command-line-tools-only  
   选择 `commandlinetools-win-*.zip`
2. 解压，并将目录结构整理为：
   ```
   C:\Users\Administrator\AppData\Local\Android\Sdk\cmdline-tools\latest\
   ├── bin\
   ├── lib\
   └── ...
   ```
3. 验证：
   ```bash
   sdkmanager --version
   ```

---

## 4. 接受 Android 许可证

```bash
sdkmanager --licenses
# 全部输入 y 同意
```

未接受会导致 Gradle 构建时报 `License for package ... not accepted`。

---

## 5. 安装项目依赖

```bash
cd app
pnpm install
```

---

## 环境清单速览

| 组件 | 要求 |
|------|------|
| Rust (stable) | `rustup` 安装 |
| JAVA_HOME | `C:\jdk\jdk-17.0.18` |
| ANDROID_HOME | `...\Android\Sdk` |
| NDK_HOME | `...\Sdk\ndk\28.2.13676358` |
| cmdline-tools | 手动下载安装 |
| Android 许可证 | `sdkmanager --licenses` |
| Rust Android targets | `rustup target add ...` |
