# 🛍️ ECOMMERCE STORE

Fully responsive React application built from a Figma design, featuring product listings, product details, category browsing, and a fully functional cart  powered by the Platzi Fake Store API.

---

## 🌐 Live Demo

🔗 [Live URL](https://ecommerce-store-eight-roan.vercel.app/)

---

## 📁 GitHub Repository

🔗 [GitHub Repo](https://github.com/tareqhasan382/ecommerce-store)

---

## 🧰 Tech Stack

| Category         | Tool                     |
|-----------------|--------------------------|
| Framework        | React Vite               |
| Routing          | React Router DOM v6      |
| State Management | Redux Toolkit            |
| Data Fetching    | RTK Query                |
| Language         | TypeScript               |
| Styling          | Tailwind CSS             |
| Notifications    | React Toastify           |
| Icons            | React Icons              |

---

## ✨ Features

- 🏠 **Landing Page** — Hero section, category list, and product grid fetched from API
- 🗂️ **Category Browsing** — Paginated category cards with navigation
- 🔍 **Product Detail Page** — Full product info, image gallery, size selector, and add to cart
- 🛒 **Cart Page** *(Bonus)* — Add, remove, increase/decrease quantity with localStorage persistence
- 📱 **Fully Responsive** — Mobile-first design for all screen sizes
- ⏳ **UI States** — Loading skeletons, empty states, and error fallbacks on all API calls

---




## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/tareqhasan382/ecommerce-store.git

# Navigate into the project
cd ecommerce-store

# Install dependencies
npm install
```

### Run Development Server

```bash
npm run dev
```

App will be running at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

---

## 🔌 API Integration

Base URL: `https://api.escuelajs.co/api/v1`

| Endpoint                         | Used For                        |
|----------------------------------|---------------------------------|
| `GET /products?offset=0&limit=4` | Product listing (Home page)    |
| `GET /products/{id}`             | Product detail page             |
| `GET /categories`                | Category list (Home page)   |

All API calls are handled via **RTK Query** with automatic caching, loading, and error states.

---

## 🛒 Cart Functionality *(Bonus)*

- Cart state is managed entirely in **Redux** with `cartSlice`
- Data is **persisted to localStorage** so the cart survives page refresh
- Supports: Add to cart, increase/decrease quantity, remove item, clear cart
- Live cart count badge in the Navbar updates in real time

---

## 📸 Pages Overview

| Page           | Route           | Data Source     |
|---------------|-----------------|-----------------|
| Home           | `/`             | API + Static    |
| Product Detail | `/product/:id`  | API             |
| Cart           | `/cart`         | Redux (local)   |

---

## 📝 Notes

- The Figma design was followed as closely as possible for layout, spacing, typography, and color
- All commented sections in the Figma were implemented with live API data
- Non-API sections (hero, banners, etc.) use static content matching the design
- RTK Query handles deduplication and caching automatically  no redundant API calls

---

## 👤 Author

**Your Name**
- GitHub: [@tareqhasan382](https://github.com/tareqhasan382)
- Email: tareqhasan382@gmail.com