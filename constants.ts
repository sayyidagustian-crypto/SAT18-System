
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
