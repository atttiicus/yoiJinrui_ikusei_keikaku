#[tauri::command]
fn greet(name: &str) -> String {
    format!("你好，{}！这条消息来自 Rust 后端 🦀", name)
}

#[tauri::command]
async fn export_file(
    app: tauri::AppHandle,
    filename: String,
    content: String,
) -> Result<String, String> {
    use tauri::Manager;

    // 依次尝试几个可写目录，找到第一个能写入的
    let candidates = [
        app.path().download_dir().ok(),
        app.path().document_dir().ok(),
        app.path().app_data_dir().ok(),
    ];

    for dir_opt in candidates.iter().flatten() {
        let _ = std::fs::create_dir_all(dir_opt);
        let path = dir_opt.join(&filename);
        if std::fs::write(&path, content.as_bytes()).is_ok() {
            return Ok(path.to_string_lossy().to_string());
        }
    }

    Err("所有目录均写入失败，请检查存储权限".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, export_file])
        .run(tauri::generate_context!())
        .expect("运行 Tauri 应用时发生错误");
}
