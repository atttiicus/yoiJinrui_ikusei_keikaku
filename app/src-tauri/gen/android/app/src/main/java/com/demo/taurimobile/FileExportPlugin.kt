package com.demo.taurimobile

import android.app.Activity
import android.content.ContentValues
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import app.tauri.annotation.Command
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Invoke
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import java.io.File

@TauriPlugin
class FileExportPlugin(private val activity: Activity) : Plugin(activity) {

    @Command
    fun exportToDownloads(invoke: Invoke) {
        val args = invoke.getArgs()
        val filename = args.getString("filename")
            ?: return invoke.reject("缺少 filename 参数")
        val content = args.getString("content")
            ?: return invoke.reject("缺少 content 参数")

        try {
            val path = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                // Android 10+：MediaStore API，无需额外权限
                val values = ContentValues().apply {
                    put(MediaStore.Downloads.DISPLAY_NAME, filename)
                    put(MediaStore.Downloads.MIME_TYPE, "application/json")
                }
                val collection = MediaStore.Downloads.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)
                val uri = activity.contentResolver.insert(collection, values)
                    ?: throw Exception("MediaStore insert 失败")
                activity.contentResolver.openOutputStream(uri)?.use { os ->
                    os.write(content.toByteArray(Charsets.UTF_8))
                } ?: throw Exception("无法打开输出流")
                "/storage/emulated/0/Download/$filename"
            } else {
                // Android 9 及以下：直接写文件
                val dir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
                val file = File(dir, filename)
                file.writeText(content, Charsets.UTF_8)
                file.absolutePath
            }

            invoke.resolve(JSObject().apply { put("path", path) })
        } catch (e: Exception) {
            invoke.reject(e.message ?: "未知错误")
        }
    }
}
