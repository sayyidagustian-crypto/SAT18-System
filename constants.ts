import type { Section, Principle } from './types';

export const sectionsData: Section[] = [
    {
        emoji: "1️⃣",
        title: "Core Engine (Dasar Sistem)",
        description: "Mesin utama yang menjalankan proses build, analisa, dan perbaikan.",
        content: {
            type: 'list',
            items: [
                "Build Engine → Membangun (compile/bundle) aplikasi.",
                "Error Analyzer → Membaca log, mengenali pola error.",
                "Correction Engine → Menyusun solusi otomatis.",
                "Folder Mapper → Memastikan hasil build di folder yang tepat."
            ]
        }
    },
    {
        emoji: "2️⃣",
        title: "Local Memory (Penyimpanan User)",
        description: "Pusat pembelajaran dan pencatatan di sisi pengguna.",
        content: {
            type: 'list',
            items: [
                "Error Log Lokal → Menyimpan catatan error yang pernah terjadi.",
                "Knowledge Store → Menyimpan solusi yang berhasil dipakai.",
                "Changelog Lokal → Mencatat versi dan perubahan tiap build.",
                "Warning System → Peringatan jika user hapus data."
            ]
        }
    },
    {
        emoji: "3️⃣",
        title: "Offline Workflow",
        description: "Kemampuan sistem untuk beroperasi penuh tanpa koneksi internet.",
        content: {
            type: 'list',
            items: [
                "Semua proses berjalan tanpa internet.",
                "Data pembelajaran disimpan di sisi user.",
                "Bisa build mandiri meski tanpa data lama."
            ]
        }
    },
    {
        emoji: "4️⃣",
        title: "Online Workflow (Minimal)",
        description: "Interaksi online yang hanya dilakukan saat diperlukan.",
        content: {
            type: 'list',
            items: [
                "Push ke GitHub/GitLab → Hanya saat sinkronisasi.",
                "Deploy ke VPS via SSH → Hanya saat pengiriman build.",
                "Konfigurasi Domain/SSL → Hanya saat update."
            ]
        }
    },
    {
        emoji: "5️⃣",
        title: "Proxy & Branding SAT18",
        description: "Menjaga identitas brand dan mengelola akses proyek.",
        content: {
            type: 'list',
            items: [
                "Hasil deploy tampil di domain utama (sat18.site).",
                "Proxy Controller (Node.js) menyamarkan node tujuan.",
                "Multi-project diatur via path (/kasir, /blog, dll)."
            ]
        }
    },
    {
        emoji: "6️⃣",
        title: "Struktur Folder Dasar",
        description: "Organisasi file dan direktori yang logis dan scalable.",
        content: {
            type: 'code',
            items: [
`sat18-system/
├── core/       → engine utama
├── memory/     → penyimpanan lokal
├── release/    → hasil build
│   ├── web/
│   ├── api/
│   └── logs/
├── proxy/      → Node.js proxy
├── scripts/    → helper scripts
└── docs/       → dokumentasi`
            ]
        }
    }
];

export const principlesData: Principle[] = [
    { 
        emoji: "🔌", 
        title: "Offline-first",
        description: "Semua bisa jalan tanpa internet."
    },
    { 
        emoji: "🧠", 
        title: "User-owned memory",
        description: "Pembelajaran disimpan di sisi user."
    },
    { 
        emoji: "❤️‍🩹", 
        title: "Self-healing",
        description: "Memperbaiki kesalahan berdasarkan pengalaman."
    },
    { 
        emoji: "🏷️", 
        title: "SAT18-only branding",
        description: "Semua hasil deploy di domain utama."
    }
];

export const coreEngineDetail = {
  title: "⚙️ Core Engine — Rancangan Dasar",
  modules: [
    {
      id: "build-engine",
      title: "1️⃣ Build Engine",
      description: "Menjalankan proses build, menghasilkan output ke folder `release/`, dan menyediakan log untuk dianalisis.",
      code: `// core/build-engine.js
import { exec } from "child_process";
import fs from "fs";

export function runBuild(command, outputDir) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    exec(command, (error, stdout, stderr) => {
      fs.writeFileSync("./release/logs/build.log", stdout + stderr);
      const duration = (Date.now() - startTime) / 1000;

      if (error) {
        reject({ success: false, message: "Build failed", error, duration });
      } else {
        resolve({ success: true, message: "Build success", outputDir, duration });
      }
    });
  });
}`
    },
    {
      id: "error-analyzer",
      title: "2️⃣ Error Analyzer",
      description: "Membaca `build.log`, mengenali pola error, dan mengembalikan rekomendasi solusi sederhana.",
      code: `// core/error-analyzer.js
import fs from "fs";

export function analyzeErrors(logPath) {
  const log = fs.readFileSync(logPath, "utf-8");
  const suggestions = [];

  if (log.includes("MODULE_NOT_FOUND")) {
    suggestions.push("Periksa dependensi, jalankan \`npm install\`.");
  }
  if (log.includes("SyntaxError")) {
    suggestions.push("Ada kesalahan sintaks, cek kembali file terkait.");
  }
  if (log.includes("EADDRINUSE")) {
    suggestions.push("Port sudah dipakai, coba ubah port di konfigurasi.");
  }

  return {
    hasError: suggestions.length > 0,
    suggestions
  };
}`
    }
  ],
  flow: {
    title: "3️⃣ Alur Dasar Core Engine",
    steps: [
      "User jalankan `runBuild()`.",
      "Build Engine menghasilkan output + log.",
      "Error Analyzer membaca log.",
      "Jika ada error → kembalikan rekomendasi.",
      "Jika sukses → hasil build siap ditempatkan di `release/`."
    ]
  },
  output: {
    title: "4️⃣ Output Pertama",
    items: [
      "`release/web/` → hasil build frontend",
      "`release/api/` → hasil build backend",
      "`release/logs/build.log` → catatan build",
      "`error-analyzer` → rekomendasi solusi"
    ]
  }
};

export const integrationFlowDetail = {
    title: "🚀 Alur Integrasi Sederhana",
    subtitle: "Proof of Concept untuk memastikan semua komponen Core Engine dapat bekerja sama.",
    script: {
        title: "📜 deploy-local.js",
        description: "Skrip ini akan jadi “jembatan” antara Build Engine dan Error Analyzer.",
        code: `// deploy-local.js
import { runBuild } from "./core/build-engine.js";
import { analyzeErrors } from "./core/error-analyzer.js";

async function main() {
  console.log("🚀 Memulai proses build...");

  try {
    const result = await runBuild("npm run build", "./release/web");
    console.log(result.message);

    // Analisa log setelah build
    const analysis = analyzeErrors("./release/logs/build.log");
    if (analysis.hasError) {
      console.log("⚠️ Ditemukan error:");
      analysis.suggestions.forEach(s => console.log("👉 " + s));
    } else {
      console.log("✅ Build sukses tanpa error.");
    }

  } catch (err) {
    console.error("❌ Build gagal:", err.message);
  }
}

main();`
    },
    workflow: {
        title: "🔁 Alur Kerja",
        steps: [
            "Jalankan `node deploy-local.js`",
            "**Build Engine** → compile project → hasil + log",
            "**Error Analyzer** → baca log → beri rekomendasi",
            "Output ditampilkan di terminal"
        ]
    },
    benefits: {
        title: "✅ Manfaat",
        items: [
            "Membuktikan pipeline minimal sudah hidup.",
            "Bisa langsung diuji di lokal (offline).",
            "Memberi data awal untuk Local Memory.",
            "Fondasi untuk iterasi berikutnya."
        ]
    }
};

export const simulationDetail = {
    title: "🧪 Simulasi & Penyempurnaan UX",
    subtitle: "Memvalidasi alur kerja konseptual dan merancang output yang lebih informatif.",
    simulation: {
        title: "🔬 Simulasi Jalannya Pipeline",
        description: "Membayangkan bagaimana `deploy-local.js` berinteraksi dengan pengguna di dunia nyata."
    },
    uxRefinement: {
        title: "✨ Penyempurnaan UX Output",
        description: "Merancang format output terminal yang lebih jelas, profesional, dan kaya informasi.",
        before: `🚀 Memulai proses build...
Build success
✅ Build sukses tanpa error.`,
        after: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🕒  [2025-10-17 02:45:12]
🚀  Memulai proses build...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📂 Output folder : ./release/web
⏱️ Durasi build  : 12.4 detik

✅ STATUS: Build sukses tanpa error
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// -- JIKA GAGAL --

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🕒  [2025-10-17 02:47:03]
🚀  Memulai proses build...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ STATUS: Build gagal
📂 Log file : ./release/logs/build.log

⚠️ Rekomendasi:
👉 Periksa dependensi, jalankan \`npm install\`.
👉 Port sudah dipakai, coba ubah port di konfigurasi.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
    },
    insights: {
        title: "🎯 Insight dari Simulasi",
        items: [
            "**Aliran darah sistem** sudah jelas: Build Engine → Log → Error Analyzer → Output.",
            "**UX awal** sederhana tapi komunikatif: ikon, pesan singkat, rekomendasi.",
            "**Data awal** untuk Local Memory sudah tersedia: log + hasil analisa."
        ]
    }
};

// FIX: Corrected the structure of the uxImplementationDetail object.
// The original code had syntax errors causing incorrect type inference and build failures.
// This new structure is syntactically correct and provides the `refactoredScript`
// property needed by App.tsx.
export const uxImplementationDetail = {
    title: "🛠️ Implementasi UX & Desain Logger",
    subtitle: "Membangun helper yang reusable untuk memastikan output yang konsisten dan profesional.",
    principles: [
        "**Single Responsibility Principle:** `deploy-local.js` mengorkestrasi, `logger.js` menampilkan.",
        "**Don't Repeat Yourself (DRY):** Satu logger untuk semua skrip, hindari duplikasi kode.",
        "**Scalability & Maintainability:** Ubah gaya logging di satu tempat, bukan di banyak file."
    ],
    logger: {
        title: "📜 core/logger.js",
        description: "Modul khusus untuk menangani semua format output ke konsol.",
        code: `// core/logger.js
const SEPARATOR = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';

const getTimestamp = () => new Date().toISOString().replace('T', ' ').substring(0, 19);

export const logger = {
  start: () => {
    console.log(SEPARATOR);
    console.log(\`🕒  [\${getTimestamp()}]\`);
    console.log('🚀  Memulai proses build...');
    console.log(SEPARATOR);
  },
  
  success: (outputDir, duration) => {
    console.log('');
    console.log(\`📂 Output folder : \${outputDir}\`);
    console.log(\`⏱️ Durasi build  : \${duration.toFixed(1)} detik\`);
    console.log('');
    console.log('✅ STATUS: Build sukses tanpa error');
    console.log(SEPARATOR);
  },

  fail: (logPath, suggestions = []) => {
    console.log('');
    console.log('❌ STATUS: Build gagal');
    console.log(\`📂 Log file : \${logPath}\`);
    console.log('');
    if (suggestions.length > 0) {
        console.log('⚠️ Rekomendasi:');
        suggestions.forEach(s => console.log(\`👉 \${s}\`));
    }
    console.log(SEPARATOR);
  }
};
`
    },
    refactoredScript: {
        title: "🔄 deploy-local.js (Refactored)",
        description: "Skrip orkestrasi menjadi lebih bersih dan fokus pada alur kerja.",
        code: `// deploy-local.js
import { runBuild } from "./core/build-engine.js";
import { analyzeErrors } from "./core/error-analyzer.js";
import { logger } from "./core/logger.js";

async function main() {
  logger.start();
  const LOG_PATH = "./release/logs/build.log";

  try {
    const result = await runBuild("npm run build", "./release/web");
    logger.success(result.outputDir, result.duration);

  } catch (err) {
    const analysis = analyzeErrors(LOG_PATH);
    logger.fail(LOG_PATH, analysis.suggestions);
  }
}

main();
`
    }
};
