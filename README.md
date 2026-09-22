# Task 15 – Pagination + Debounced Search E-Commerce App

A modern full-stack web application with SQLite database pagination (`LIMIT` / `OFFSET`), debounced search via custom React hook (`useDebounce`), reusable `Pagination` component, and animated skeleton loaders.

## Features Included

1. **SQL Database Pagination (`LIMIT` / `OFFSET`):**
   - Backend `GET /api/products` & `GET /api/orders` calculate exact `OFFSET = (page - 1) * limit`.
   - Returns metadata `{ products, total, page, limit, total_pages }`.
2. **Debounced Search Hook (`useDebounce`):**
   - Instant typing feedback on input state.
   - API requests delayed by `300ms` with automatic `clearTimeout` timer cleanup.
3. **Reusable Pagination Component (`Pagination.jsx`):**
   - Numbered page buttons, Prev/Next disabled states, Page X of Y indicator.
   - Items-per-page selector (8, 16, 24, 32).
   - Reused across Customer Catalog (`Home.jsx`) and Admin Orders (`AdminOrders.jsx`).
4. **Automatic Page Reset:**
   - Resets `currentPage` to 1 automatically on search query or filter changes.
5. **Bonus Features:**
   - Skeleton loader cards while data fetches.
   - Real-time API Call Counter badge in header.
   - Scroll-to-top on page change.

---

## How to Run

### 1. Start Backend (Flask API)
```bash
cd backend
pip install -r requirements.txt
python app.py
```
*Backend runs on `http://localhost:5000` and automatically seeds 48 sample products and 30 sample orders.*

### 2. Start Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## Technical Answers & Write-Up
See [`TASK_15_WRITEUP.md`](./TASK_15_WRITEUP.md) for full answers to all 4 submission questions.
