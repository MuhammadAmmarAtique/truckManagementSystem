# 🚚 Truck Management System

A full-stack **truck and job management platform** built with modern web technologies.
It enables logistics teams to manage **vehicles**, **jobs**, and **allocations** efficiently while providing real-time updates through GraphQL subscriptions and a user-friendly web interface.

---

## 📂 Project Structure

```
TruckManagementSystem/
│
├── graphql-api       # Backend GraphQL API built with Node.js & Apollo
└── webapp            # Frontend web application built with Next.js & React
```

---

## ⚡ Tech Stack

### **Backend** (`graphql-api`)

- 🚀 Node.js + Express
- 🧭 Apollo Server
- 🧬 GraphQL
- 🗄️ Mongoose + MongoDB
- 🔐 express-jwt, jwks-rsa (Authentication)
- 🌐 WebSockets (Real-time subscriptions)

### **Frontend** (`webapp`)

- ⚡ Next.js + React
- 🧭 @apollo/client (GraphQL client)
- 🧰 Material UI (MUI v7) for UI components
- 🧭 react-hook-form + yup (Form handling & validation)
- 🗺️ maplibre-gl for map integration
- 📊 ag-Grid for data grids

---

## 🧱 Backend (graphql-api)

### 📁 Directory Structure

```
graphql-api/
├── src/
│   ├── config/           # Authentication & environment setup
│   ├── database/         # DB connection
│   ├── graphql/          # Resolvers, typedefs, subscriptions, schema
│   ├── middlewares/      # Error & auth middlewares
│   ├── models/           # Mongoose models (Job, Vehicle)
│   └── server/           # Apollo, Express, WebSocket setup
├── index.ts              # Server entry point
├── .env
├── package.json
└── tsconfig.json
```

## 🖥️ Frontend (webapp)

### 📁 Directory Structure

```
webapp/
├── public/
│   ├── Jobs-Images/
│   ├── PWA-Images/
│   ├── Vehicle-Images/
│   └── Vehicle-Videos/
├── src/
│   ├── components/       # Reusable UI components (AppBar, Jobs, Vehicles, etc.)
│   ├── config/           # Vehicle field configuration
│   ├── contexts/         # Global context providers (Theme, Snackbar, Jobs, etc.)
│   ├── entities/
│   │   ├── types/        # Job & Vehicle Type Definitions
│   │   └── validation/   # Validation schemas
│   ├── graphql/          # Apollo client config, queries, mutations, subscriptions
│   ├── hooks/
│   ├── pages/
│   ├── theme/
│   └── utils/
├── .env.local
├── package.json
└── tsconfig.json

```

## 🚛 Core Features

### 1. **Job Management**

- Create and manage jobs with details:

  - Name, date, job type, payment type, delivery type
  - Custom field groups & templates
  - Associated documents

### 2. **Vehicle Management**

- Manage vehicle records including:

  - Chassis Number, Engine Number
  - Tonnage (Capacity)
  - Registration expiry
  - Odometer reading
  - Vehicle documents

### 3. **Allocation**

- Assign and unassign jobs to specific vehicles.
- View real-time allocation status.

### 4. **PWA Page**

- View allocated vehicles and their shift timings.
- Complete assigned jobs through a mobile-friendly interface.

---

## 🧑‍💻 Getting Started

### 1. **Clone the Repository**

```bash
git clone https://github.com/your-username/truck-management-system.git
cd truck-management-system
```

### 2. **Install Dependencies**

**Backend**

```bash
cd graphql-api
npm install
```

**Frontend**

```bash
cd ../webapp
npm install
```

### 3. **Environment Variables**

- Create a `.env` file in `graphql-api/` for backend configuration.
- Create a `.env.local` file in `webapp/` for frontend configuration.

### 4. **Run Development Servers**

**Backend**

```bash
npm run dev
```

**Frontend**

```bash
npm run dev
```

Visit 👉 `http://localhost:3000` for the web app.

---

## 🧭 Authentication

The project uses **JWT** authentication with **Auth0** integration (frontend) and **express-jwt** with **JWKS-RSA** (backend).
Users must be authenticated to access most features.

---

## 🛡️ PWA Support

The frontend is also a **Progressive Web App**, allowing users to:

- Install the app on mobile or desktop
- Access offline features (limited)
- Get a more native experience

---

---

## 🙌 Credits

- Jobs & PWA modules developed by **[Ammar Atique](https://github.com/MuhammadAmmarAtique)**
- Vehicle & Allocation modules contributed by **[Haris Raees](https://github.com/harrisrais)**

---

## 📜 License

This project is licensed under the **MIT License** — feel free to use and modify it.

---

## 🏗️ Future Improvements

- ✅ Advanced analytics dashboard
- 🚦 Real-time tracking of vehicles
- 📲 Push notifications
- 📡 WebSocket optimization

---
