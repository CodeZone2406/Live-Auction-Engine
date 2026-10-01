# 🚀 Live Auction Engine

A high-performance, real-time full-stack auction platform built for concurrent state synchronization and high-frequency bid submissions. Designed with a robust WebSocket architecture and powered by Redis atomic operations.

## 🛠️ Tech Stack

* **Frontend:** React, TypeScript, Vite, Redux Toolkit
* **Backend:** Node.js, Express, WebSockets (`ws`)
* **State & Concurrency:** Redis Cloud, Atomic Lua Scripting
* **Testing & Performance:** Artillery (Load & Stress Testing)
* **DevOps & Cloud:** Docker, Render (Backend API), Vercel (Frontend UI)

---

## ⚡ Architectural Highlights

* **Race Condition Prevention:** Utilizes custom Redis atomic Lua scripts to safely handle simultaneous high-frequency bids without overselling or state corruption.
* **Real-Time Synchronization:** Maintains instant state broadcasting across multiple connected client tabs/sessions using persistent WebSocket channels.
* **Performance & Load Testing:** Validated system stability and concurrency limits using customized Artillery load-testing scripts (`load-test-4000.yaml`, `load-test-4001.yaml`).
* **Production Deployment:** Fully containerized via Docker and deployed on resilient cloud infrastructure (Render & Vercel).

---

## 📦 Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/CodeZone2406/Live-Auction-Engine.git](https://github.com/CodeZone2406/Live-Auction-Engine.git)
   cd Live-Auction-Engine
   ```
2. **Install root & frontend dependencies:**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```
3. **Run Load Tests with Artillery:**
   ```bash
   npx artillery run load-test-4000.yaml
   ```
