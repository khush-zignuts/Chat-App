# Chat-App
 
```markdown
# 💬 Full-Stack Chat Application

This is a full-stack real-time chat application built with:

- **Backend:** Node.js, Express, Sequelize, PostgreSQL, Redis, Socket.io, Cloudinary
- **Frontend:** React, Vite

---

## 📁 Project Structure

```

Root/
├── BackEnd/           # Node.js Express API
└── FrontEnd/          # React Vite application

````

---

## 🚀 Getting Started

### ⚙️ Prerequisites

- Node.js (v16 or later)
- PostgreSQL
- Redis
- Cloudinary Account (for image uploads)

---

## 🔧 Backend Setup (`BackEnd/`)

### 📦 Install Dependencies

```bash
cd BackEnd
npm install
````

### 🔑 Create `.env` File

```env
PORT=8001
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret_key
REDIS_URL=your_redis_url
CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 🏁 Run the Server

```bash
npm start
```

The backend will run on: `http://localhost:8001`

---

## 🖥️ Frontend Setup (`FrontEnd/`)

### 📦 Install Dependencies

```bash
cd FrontEnd
npm install
```

### 🏁 Run the App

```bash
npm run dev
```

The frontend will run on: `http://localhost:5173`

---

## 🔌 API Endpoints

### Auth

* `POST /api/user/signup`
* `POST /api/user/login`
* `POST /api/user/verify`
* `GET /api/user/logout`

### Chat

* `POST /api/chat/create`
* `GET /api/chat/get/:userId`

### Message

* `POST /api/message/send`
* `GET /api/message/:chatId`
* `DELETE /api/message/delete/:messageId`
* `PUT /api/message/update/:messageId`

### User

* `GET /api/user/me`
* `PUT /api/user/update`
* `POST /api/user/upload-profile`

---

## ✨ Features

* 🔐 User authentication with JWT and OTP verification
* 📬 One-on-one chat with messages
* 🧵 Message editing and soft-deletion (`is_deleted`)
* 🌩️ Real-time messaging with Socket.io
* 📷 Image uploads via Cloudinary
* 🧑 User profile management
* ♻️ Redis for caching/session

---

## 📁 Frontend Pages

* `SignUp`, `Login`, `Verify OTP`, `Logout`
* `Wp.jsx`: Main chat interface
* `ThreeDotMenu.jsx`: Options menu (edit/delete messages)
* `Profile.jsx`: Profile editing

---

## 📂 Backend Directory Breakdown

* `controllers/`: Route handlers for Auth, Chat, Message, etc.
* `routes/`: Express routes
* `models/`: Sequelize models
* `config/`: Configs for DB, Redis, Cloudinary, etc.
* `middlewares/`: Authentication middleware
* `utils/`: Helper functions like `sendEmail`, file uploads

---

## 🛠️ Dev Tips

* Run backend and frontend concurrently using tools like `concurrently` or separate terminals.
* Use Postman to test APIs.
* Make sure to set appropriate CORS policies in the backend if serving frontend separately.

---

