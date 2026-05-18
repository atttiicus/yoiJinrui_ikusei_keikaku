import { invoke } from "@tauri-apps/api/core";
import { platform, arch, version } from "@tauri-apps/plugin-os";

// 初始化平台信息
async function initPlatformInfo() {
  try {
    const [p, a, v] = await Promise.all([platform(), arch(), version()]);
    document.getElementById("platform").textContent = p;
    document.getElementById("arch").textContent = a;
    document.getElementById("app-version").textContent = v || "0.1.0";
  } catch (e) {
    // 在非 Tauri 环境（纯浏览器）中降级处理
    document.getElementById("platform").textContent =
      navigator.userAgent.includes("Android") ? "android" : "web";
    document.getElementById("arch").textContent = "unknown";
    document.getElementById("app-version").textContent = "0.1.0";
  }
}

// 问候功能：调用 Rust 后端
async function greet() {
  const input = document.getElementById("greet-input").value.trim();
  const name = input || "朋友";
  const resultEl = document.getElementById("greet-result");

  try {
    const message = await invoke("greet", { name });
    resultEl.textContent = message;
    resultEl.classList.remove("hidden");
  } catch (e) {
    resultEl.textContent = `错误: ${e}`;
    resultEl.classList.remove("hidden");
  }
}

// 计数器
let count = 0;

function updateCounter() {
  const el = document.getElementById("counter-val");
  el.textContent = count;
  el.style.transform = "scale(1.2)";
  setTimeout(() => (el.style.transform = "scale(1)"), 100);
}

// 事件绑定
document.getElementById("greet-btn").addEventListener("click", greet);

document.getElementById("greet-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") greet();
});

document.getElementById("inc-btn").addEventListener("click", () => {
  count++;
  updateCounter();
});

document.getElementById("dec-btn").addEventListener("click", () => {
  count--;
  updateCounter();
});

document.getElementById("reset-btn").addEventListener("click", () => {
  count = 0;
  updateCounter();
});

// 启动
initPlatformInfo();
