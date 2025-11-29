# Finsight — Aplikasi Pencatat Keuangan

Finsight adalah aplikasi sederhana untuk mencatat pemasukan dan pengeluaran pribadi. Aplikasi ini dibuat dengan Next.js dan TypeScript.

Fitur utama:

- Menambahkan, mengedit, dan menghapus transaksi.
- Menampilkan saldo, total pemasukan, dan total pengeluaran.
- Ringkasan pengeluaran berdasarkan kategori.

Struktur Folder:
finsight-next/
├─ .next/ # Next build artifacts
├─ dist/ # Standalone build output (after build:standalone)
├─ node_modules/
├─ public/ # static assets (logo.svg, favicon.svg)
├─ scripts/ # helper scripts (build/start)
├─ src/
│ ├─ pages/ # Next.js pages (index.tsx, \_app.tsx)
│ ├─ components/ # Button, Dashboard, TransactionForm, TransactionList, Modal
│ └─ styles/ # globals.css (Tailwind directives)
├─ Dockerfile
├─ package.json
├─ next.config.mjs
├─ tsconfig.json
└─ README.md

Cara menjalankan (singkat):

Prasyarat: Node.js 18+ dan npm.

1. Install dependensi:

```bash
npm ci
```

2. Jalankan mode development:

```bash
npm run dev
# buka http://localhost:3000
```

3. Build untuk produksi (standalone):

```bash
npm ci
npm run build:standalone
node dist/server.js
```
