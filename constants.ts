// FIX: Removed unused import to resolve module error. The `types.ts` file was empty.
import type { KnowledgeBaseEntry } from './types';
import { NodeIcon, ReactIcon, LaravelIcon, DockerIcon } from './components/FrameworkIcons';


export const KNOWLEDGE_BASE_DATA: KnowledgeBaseEntry[] = [
    {
        framework: "Node.js / NPM",
        icon: NodeIcon,
        errors: [
            { error: "MODULE_NOT_FOUND", solution: "Pastikan dependensi terinstall, jalankan `npm install`." },
            { error: "EADDRINUSE", solution: "Port sudah dipakai, ubah port di `.env` atau `server.js`." },
            { error: "SyntaxError: Unexpected token", solution: "Cek kembali file terkait, biasanya ada typo atau kesalahan sintaks." },
            { error: "ReferenceError", solution: "Variabel belum didefinisikan atau di luar scope, periksa kembali kode Anda." }
        ]
    },
    {
        framework: "React / Next.js",
        icon: ReactIcon,
        errors: [
            { error: "React is not defined", solution: "Pastikan `import React from 'react'` ada di file (untuk React versi lama)." },
            { error: "Hydration failed", solution: "Periksa perbedaan antara hasil render di server dan client." },
            { error: "Module not found: Can't resolve 'X'", solution: "Cek path import, pastikan file atau package yang diimpor sudah benar." },
            { error: "Error: ENOENT: no such file or directory, open '.next/...'`", solution: "Jalankan ulang proses build dengan `npm run build`." }
        ]
    },
    {
        framework: "Laravel / PHP",
        icon: LaravelIcon,
        errors: [
            { error: "Class not found", solution: "Jalankan `composer dump-autoload` untuk meregenerasi class map." },
            { error: "SQLSTATE[HY000]", solution: "Cek koneksi dan konfigurasi database di file `.env`." },
            { error: "Target class [Controller] does not exist", solution: "Pastikan namespace pada controller sudah benar dan sesuai dengan path filenya." },
            { error: "Permission denied on storage/", solution: "Ubah permission folder `storage/` dan `bootstrap/cache/` (e.g., `chmod -R 775 storage`)." }
        ]
    },
    {
        framework: "Docker / CI/CD",
        icon: DockerIcon,
        errors: [
            { error: "no space left on device", solution: "Bersihkan cache dan volume Docker yang tidak terpakai dengan `docker system prune -af`." },
            { error: "failed to connect to database container", solution: "Pastikan service database sudah berjalan dan berada di network yang sama." },
            { error: "permission denied while trying to connect to the Docker daemon", solution: "Jalankan perintah dengan `sudo` atau tambahkan user Anda ke grup `docker`." },
        ]
    }
];