# 🚀 Event Reports Management

**Event Reports Management** is a full-stack MERN (MongoDB, Express, React, Node.js) based platform built to streamline the process of managing, monitoring, and reporting student participation in **Hackathons**, **Workshops**, and **Technical Events** across different colleges.

> A one-stop dashboard for all academic event tracking, reporting, and approval flow!

---

## 📂 Project Structure

```bash
Event-Reports-Management/
│
├── client/          # Frontend - React
│
├── server/          # Backend - Express.js + MongoDB
│
└── README.md        # Project documentation
```

## ✨ Features

- 🔐 **Role-based login system**: Super Admin, Principal, Innovation Cell, HOD, Staff, and Students
- 🧑‍🎓 **Student registration and event participation tracking**
- 🧾 **Proof uploads**, event details, and **team formation**
- 📊 **Dynamic reports** with filters (college-wise, role-wise, date-wise)
- 🧠 **Scalable structure** to support multiple colleges
- 🧩 **Modular MVC-based backend** for maintainability

---

## 🛠️ Tech Stack

| Frontend | Backend    | Database | Authentication      |
|----------|------------|----------|----------------------|
| React    | Express.js | MongoDB  | JWT + Middleware     |
| Axios    | Node.js    | Mongoose | Bcrypt               |

---

## 🚧 Installation & Setup

### 📦 Prerequisites

- Node.js & npm installed
- MongoDB (local or Atlas)
- Git

### 🔁 Clone the Project

```bash
git clone https://github.com/kirtick28/Events-Hackathon-Reports.git
cd Events-Hackathon-Reports
```

### 🖥️ Start the Server
```bash
cd server
npm install
npm run dev
```

### 📄 Environment Variables

Create a `.env` file inside the `server/` directory with the following content:

```env
# MongoDB
MONGODB_URI=your_mongodb_atlas_url

# JWT
JWT_SECRET=your_secret_code
JWT_RESET_SECRET=your_reset_Secret_code
JWT_EXPIRES_IN=1d

# AWS S3 Bucket Credentials
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_s3_bucket_name

# Server
PORT=8000
NODE_ENV=development

# Email
EMAIL_USER=your_email
EMAIL_PASSWORD=your_app_password_generated
EMAIL_FROM=sample_email #Fake or real email for just showcase email as sender
CLIENT_URL=your_frontend_url

# Password hashing
BCRYPT_SALT_ROUNDS=10  #Your preferred Salt Rounds for Encryption
```

### 🌐 Start the Client
```bash
cd ../client
npm install
npm start
```

### 📄 Environment Variables

Create a `.env` file inside the `client/` directory with the following content:

```env
VITE_BASE_URL=your_backend_url
```


### 💡 Contribution
Feel free to contribute and make this platform better for the developer and student community!

```bash
# Fork the repository
# Create a new branch
# Make your changes
# Submit a PR
```
