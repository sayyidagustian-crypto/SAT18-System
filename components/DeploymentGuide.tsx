import React from 'react';

const CodeSnippet: React.FC<{ children: React.ReactNode, language?: string }> = ({ children, language = 'bash' }) => (
    <pre className="bg-sat-blue p-3 rounded-md border border-sat-gray/50 text-sm text-sat-white overflow-x-auto font-mono my-2">
        <code className={`language-${language}`}>{children}</code>
    </pre>
);

export const DeploymentGuide: React.FC = () => {
    const deployYml = `name: SAT18 Deploy

on:
  push:
    branches: ["main"]

jobs:
  build-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Build app
        run: npm run build

      - name: Archive dist
        run: |
          mkdir -p artifacts
          tar -czf artifacts/sat18-dist.tar.gz -C dist .

      - name: Prepare Dirs & Snapshot on VPS
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: \${{ secrets.VPS_HOST }}
          username: \${{ secrets.VPS_USER }}
          key: \${{ secrets.VPS_KEY }}
          port: \${{ secrets.VPS_PORT }}
          script: |
            set -e
            REMOTE_DIR=~/sat18-deploy
            mkdir -p $REMOTE_DIR/snapshots $REMOTE_DIR/current
            if [ -n "$(ls -A $REMOTE_DIR/current 2>/dev/null)" ]; then
              TS=$(date +"%Y%m%d-%H%M%S")
              tar -czf $REMOTE_DIR/snapshots/snapshot-$TS.tar.gz -C $REMOTE_DIR/current .
              echo "Snapshot created: snapshot-$TS.tar.gz"
            fi

      - name: Transfer new build
        uses: appleboy/scp-action@v0.1.7
        with:
          host: \${{ secrets.VPS_HOST }}
          username: \${{ secrets.VPS_USER }}
          key: \${{ secrets.VPS_KEY }}
          port: \${{ secrets.VPS_PORT }}
          source: "artifacts/sat18-dist.tar.gz"
          target: "~/sat18-deploy/"

      - name: Unpack & Restart PM2
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: \${{ secrets.VPS_HOST }}
          username: \${{ secrets.VPS_USER }}
          key: \${{ secrets.VPS_KEY }}
          port: \${{ secrets.VPS_PORT }}
          script: |
            set -e
            REMOTE_DIR=~/sat18-deploy
            cd $REMOTE_DIR
            rm -rf current/*
            tar -xzf sat18-dist.tar.gz -C current
            rm -f sat18-dist.tar.gz
            pm2 restart sat18-proxy || pm2 start server/ecosystem.config.js --only sat18-proxy
            pm2 save
            echo "Deploy successful."`;

    const rollbackYml = `name: SAT18 Rollback

on:
  workflow_dispatch:
    inputs:
      snapshot_name:
        description: "Snapshot name (optional). Leave empty for latest."
        required: false
        default: ""

jobs:
  rollback:
    runs-on: ubuntu-latest
    steps:
      - name: Rollback on VPS
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: \${{ secrets.VPS_HOST }}
          username: \${{ secrets.VPS_USER }}
          key: \${{ secrets.VPS_KEY }}
          port: \${{ secrets.VPS_PORT }}
          script: |
            set -e
            REMOTE_DIR=~/sat18-deploy
            SNAP_INPUT="\${{ github.event.inputs.snapshot_name }}"
            cd $REMOTE_DIR
            
            if [ -z "$SNAP_INPUT" ]; then
              SNAP=$(ls -t snapshots | head -n 1)
            else
              SNAP="$SNAP_INPUT"
            fi

            if [ -z "$SNAP" ]; then
              echo "ERROR: No snapshot found."
              exit 1
            fi

            echo "Rolling back to snapshot: $SNAP"
            pm2 stop sat18-proxy || true
            rm -rf current/*
            tar -xzf snapshots/$SNAP -C current
            pm2 restart sat18-proxy || pm2 start server/ecosystem.config.js --only sat18-proxy
            pm2 save
            echo "Rollback successful."`;

    const serverJs = `// server/server.js
import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the static files from the 'current' directory
const staticPath = path.resolve(process.cwd(), "../current");
app.use(express.static(staticPath));

// Handle SPA routing: send all other requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve(staticPath, 'index.html'));
});

app.listen(PORT, () => console.log(\`SAT18 Proxy active on port \${PORT}\`));
`;
    
    const ecosystemJs = `// server/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "sat18-proxy",
      script: "server/server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};`;

    const nginxConf = `server {
    listen 80;
    server_name sat18.site www.sat18.site;

    # Redirect all HTTP traffic to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name sat18.site www.sat18.site;

    # SSL Certs managed by Certbot
    ssl_certificate /etc/letsencrypt/live/sat18.site/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sat18.site/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`;

    return (
        <div className="space-y-6 text-sat-lightgray">
            <p>
                <strong>Analogi:</strong> Ini adalah pabrik perakitan otomatis SAT18. Setiap kali ada komponen baru (push ke `main`), lini produksi berjalan, menguji, mengemas, dan mengirimkannya. Jika ada masalah, kita memiliki tombol darurat untuk segera kembali ke produk stabil sebelumnya.
            </p>

            <div>
                <h3 className="text-xl font-bold text-sat-accent mb-2">1. Alur Kerja CI/CD GitHub Actions</h3>
                <p className="text-sm mb-2">Sistem ini menggunakan dua alur kerja utama yang berjalan langsung dari repositori GitHub Anda.</p>
                
                <h4 className="text-lg font-semibold text-sat-white mt-4">Deploy Otomatis (`.github/workflows/deploy.yml`)</h4>
                <p className="text-sm mb-2">Alur kerja ini terpicu secara otomatis setiap kali ada `push` ke branch `main`. Ia akan membangun aplikasi, membuat snapshot versi sebelumnya, dan mendeploy versi baru.</p>
                <CodeSnippet language="yaml">{deployYml}</CodeSnippet>

                <h4 className="text-lg font-semibold text-sat-white mt-4">Rollback Manual (`.github/workflows/rollback.yml`)</h4>
                <p className="text-sm mb-2">Alur kerja ini dipicu secara manual dari tab "Actions" di GitHub. Anda bisa memilih snapshot spesifik atau membiarkannya kosong untuk kembali ke versi terakhir.</p>
                <CodeSnippet language="yaml">{rollbackYml}</CodeSnippet>
            </div>

            <div className="pt-4 border-t border-sat-gray/50">
                <h3 className="text-xl font-bold text-sat-accent mb-2">2. Pengaturan Repositori & VPS</h3>
                <h4 className="text-lg font-semibold text-sat-white">GitHub Repository Secrets</h4>
                <p className="text-sm mb-2">Navigasi ke `Settings` → `Secrets and variables` → `Actions` dan tambahkan secrets berikut:</p>
                <ul className="list-disc list-inside text-sm space-y-1 pl-4">
                    <li><code className="bg-sat-blue text-amber-300 p-1 rounded">VPS_HOST</code>: IP Address atau domain VPS Anda.</li>
                    <li><code className="bg-sat-blue text-amber-300 p-1 rounded">VPS_PORT</code>: Port SSH (misalnya `22`).</li>
                    <li><code className="bg-sat-blue text-amber-300 p-1 rounded">VPS_USER</code>: Nama pengguna untuk login SSH.</li>
                    <li><code className="bg-sat-blue text-amber-300 p-1 rounded">VPS_KEY</code>: Kunci privat SSH untuk autentikasi tanpa kata sandi.</li>
                </ul>
            </div>
            
            <div className="pt-4 border-t border-sat-gray/50">
                 <h3 className="text-xl font-bold text-sat-accent mb-2">3. Konfigurasi Server di VPS</h3>
                 <p className="text-sm mb-2">File-file ini harus ada di repositori Anda agar PM2 dapat menjalankannya di VPS. Mereka bertanggung jawab untuk menyajikan file statis aplikasi.</p>
                 <h4 className="text-lg font-semibold text-sat-white mt-4">Proxy Server (`server/server.js`)</h4>
                 <CodeSnippet language="javascript">{serverJs}</CodeSnippet>
                 <h4 className="text-lg font-semibold text-sat-white mt-4">Process Manager (`server/ecosystem.config.js`)</h4>
                 <CodeSnippet language="javascript">{ecosystemJs}</CodeSnippet>
            </div>

             <div className="pt-4 border-t border-sat-gray/50">
                 <h3 className="text-xl font-bold text-sat-accent mb-2">4. Domain & SSL (Direkomendasikan)</h3>
                 <p className="text-sm mb-2">Untuk production, gunakan Nginx sebagai reverse proxy untuk menangani traffic dan SSL. Setelah mengarahkan domain Anda, instal Nginx dan Certbot, lalu gunakan konfigurasi berikut.</p>
                 <CodeSnippet language="nginx">{nginxConf}</CodeSnippet>
            </div>
        </div>
    );
};
