package com.demo.taurimobile

import android.content.ContentValues
import android.content.Context
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import java.io.File

object DownloadHelper {
    @JvmStatic
    fun saveToDownloads(context: Context, filename: String, content: String): String {
        return try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                val values = ContentValues().apply {
                    put(MediaStore.Downloads.DISPLAY_NAME, filename)
                    put(MediaStore.Downloads.MIME_TYPE, "application/json")
                }
                val collection = MediaStore.Downloads.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)
                val uri = context.contentResolver.insert(collection, values)
                    ?: return "ERR:MediaStore insert 返回 null"
                context.contentResolver.openOutputStream(uri)?.use { os ->
                    os.write(content.toByteArray(Charsets.UTF_8))
                } ?: return "ERR:无法打开输出流"
                "OK:/storage/emulated/0/Download/$filename"
            } else {
                val dir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
                val file = File(dir, filename)
                file.writeText(content, Charsets.UTF_8)
                "OK:${file.absolutePath}"
            }
        } catch (e: Exception) {
            "ERR:${e.javaClass.simpleName}: ${e.message}"
        }
    }
}
