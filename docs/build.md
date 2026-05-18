# 打包项目

> 此文档中路径仅作示例，具体路径请自行甄别并更改

## Android 打包

### 调试包（APK）

```bash
cd app
pnpm android:build
```

产物位置：`src-tauri/gen/android/app/build/outputs/apk/`

### 发布包（AAB，上架 Google Play 必须）

```bash
pnpm android:build -- --aab
```

产物位置：`src-tauri/gen/android/app/build/outputs/bundle/`

---

## 桌面打包

```bash
cd app
pnpm build
```

根据当前系统自动生成对应安装包（Windows → `.msi` / `.exe`），产物位置：`src-tauri/target/release/bundle/`

---

## 发布前必须配置签名

调试包使用 debug keystore，**正式发布必须配置签名**，否则无法上架应用商店。

### 生成 keystore

```bash
keytool -genkey -v -keystore your-keystore.jks -alias your-alias -keyalg RSA -keysize 2048 -validity 10000
```

> ⚠️ keystore 文件务必备份，丢失后无法更新已发布的应用。

### 在 `src-tauri/gen/android/app/build.gradle.kts` 中配置

```kotlin
android {
    signingConfigs {
        create("release") {
            storeFile = file("your-keystore.jks")
            storePassword = System.getenv("KEYSTORE_PASSWORD")
            keyAlias = "your-alias"
            keyPassword = System.getenv("KEY_PASSWORD")
        }
    }
    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
        }
    }
}
```

---

## 优化：减小包体积

默认编译所有 ABI，发布时可只保留 arm64-v8a（覆盖 95%+ 现代设备）。

在 `build.gradle.kts` 的 `android {}` 块中添加：

```kotlin
defaultConfig {
    ndk {
        abiFilters += listOf("arm64-v8a")
    }
}
```

---

## 常见问题

| 错误 | 原因 | 解决 |
|------|------|------|
| `License for package not accepted` | SDK 许可证未接受 | 运行 `sdkmanager --licenses` |
| `No toolchains found in NDK` | NDK_HOME 路径错误 | 确认路径指向具体版本目录 |
| `Gradle build failed`（网络超时） | 依赖下载失败 | 配置 Gradle 代理，见下方 |

### Gradle 代理配置（国内网络）

编辑 `C:\Users\Administrator\.gradle\gradle.properties`：

```properties
systemProp.http.proxyHost=127.0.0.1
systemProp.http.proxyPort=7890
systemProp.https.proxyHost=127.0.0.1
systemProp.https.proxyPort=7890
```
