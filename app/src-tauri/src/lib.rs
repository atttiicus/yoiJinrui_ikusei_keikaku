use serde::{Deserialize, Serialize};
use tauri::{
    plugin::{Builder, TauriPlugin},
    Manager,
};

// ── 通用命令 ──────────────────────────────────────────────────
#[tauri::command]
fn greet(name: &str) -> String {
    format!("你好，{}！这条消息来自 Rust 后端 🦀", name)
}

// ── 文件导出 ──────────────────────────────────────────────────
#[derive(Serialize)]
struct ExportPayload {
    filename: String,
    content: String,
}

#[derive(Deserialize)]
struct ExportResponse {
    path: String,
}

// Android 侧保存 PluginHandle
#[cfg(target_os = "android")]
struct FileExportHandle(tauri::plugin::PluginHandle<tauri::Wry>);

// 将 fileExport 插件注册到 Tauri，Android 上同时通过
// register_android_plugin 关联 Kotlin 的 FileExportPlugin
fn file_export_plugin() -> TauriPlugin<tauri::Wry> {
    Builder::<tauri::Wry>::new("fileExport")
        .setup(|app, api| {
            #[cfg(target_os = "android")]
            {
                let handle =
                    api.register_android_plugin("com.demo.taurimobile", "FileExportPlugin")?;
                app.manage(FileExportHandle(handle));
            }
            Ok(())
        })
        .build()
}

#[tauri::command]
async fn export_to_downloads(
    app: tauri::AppHandle,
    filename: String,
    content: String,
) -> Result<String, String> {
    #[cfg(target_os = "android")]
    {
        let handle = app.state::<FileExportHandle>();
        let result = handle
            .0
            .run_mobile_plugin::<ExportResponse>(
                "exportToDownloads",
                ExportPayload { filename, content },
            )
            .map_err(|e| e.to_string())?;
        return Ok(result.path);
    }

    #[cfg(not(target_os = "android"))]
    {
        let base = dirs::download_dir()
            .or_else(|| dirs::document_dir())
            .ok_or_else(|| "找不到下载目录".to_string())?;
        std::fs::create_dir_all(&base).map_err(|e| e.to_string())?;
        let path = base.join(&filename);
        std::fs::write(&path, content.as_bytes()).map_err(|e| e.to_string())?;
        Ok(path.to_string_lossy().to_string())
    }
}

// ── 入口 ──────────────────────────────────────────────────────
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(file_export_plugin())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, export_to_downloads])
        .run(tauri::generate_context!())
        .expect("运行 Tauri 应用时发生错误");
}
