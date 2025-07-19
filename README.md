# 🛒 Ecommerce Go + Next.js

![Go](https://img.shields.io/badge/Go-1.22-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blueviolet)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Docker](https://img.shields.io/badge/Docker-ready-blue)

Proyek ini adalah **aplikasi e-commerce fullstack** yang dibangun dengan:
- **Backend**: Go + Echo Framework (REST API).
- **Frontend**: Next.js + Tailwind CSS.
- **Database**: MySQL (via Docker Compose).
- **Authentication**: JWT dengan HttpOnly Cookie.
- **Deployment Ready**: Vercel (frontend) + Railway/Render (backend).

---

## 🚀 Fitur Utama
- **Produk**: Lihat daftar produk, detail produk, CRUD untuk admin.
- **Authentication**: Register, login, logout dengan JWT HttpOnly Cookie.
- **Checkout & Pesanan**: User dapat membuat pesanan.
- **Admin Dashboard**: Admin dapat melihat semua pesanan & kelola produk.
- **Docker Support**: `docker-compose` untuk backend + database.

## 📡 API Endpoint
**Public Routes:**
- `GET /products` – Ambil semua produk (mendukung pagination).
- `GET /products/:id` – Ambil detail produk.
- `POST /products` – Tambah produk baru (admin).
- `PUT /products/:id` – Update produk (admin).
- `DELETE /products/:id` – Hapus produk (admin).
- `POST /register` – Registrasi user.
- `POST /login` – Login user.
- `POST /logout` – Logout user.

**Protected Routes (JWT):**
- `POST /orders` – Buat pesanan baru.
- `GET /orders` – Ambil pesanan user.
- `GET /admin/orders` – Ambil semua pesanan (hanya admin).
---

## 🏗️ Struktur Project
```
ecommerce-go-next/
│
├── ecommerce-backend/ # Backend Go + Echo
│ ├── handlers/ # Handler API
│ ├── models/ # Model database
│ ├── routes/ # Routing
│ ├── middleware/ # JWT middleware
│ ├── docker-compose.yml # Docker setup
│ └── main.go
│
├── ecommerce-frontend/ # Frontend Next.js + Tailwind
│ ├── app/
│ ├── components/
│ └── public/
│
├── README.md
├── LICENSE
└── .gitignore
```
## ⚙️ Cara Menjalankan

**1. Backend (Go + Echo)**
```bash
cd ecommerce-backend
go mod tidy
docker-compose up -d   # Jalankan MySQL via Docker
go run main.go
Backend akan berjalan di: http://localhost:8080
```
**2. Frontend (Next.js)**
```bash
cd ecommerce-frontend
npm install
npm run dev
Frontend akan berjalan di: http://localhost:3000
```
**3. Jalankan dengan Docker (Opsional)**
```bash
Jika ingin jalankan fullstack (backend + DB):
docker-compose up --build