# Finance Dashboard API - Financial Data Processing System

[![Deployment Status](https://img.shields.io/badge/Render-Deployed-success?logo=render)](https://finance-dashboard-backend-fdau.onrender.com)

A comprehensive, scalable backend system built with Node.js and Express to manage financial records, process data aggregates for dashboard visualisations, and enforce strict role-based access control.

## 🚀 Features

### Core Financial Features

- **Records Management**: Complete CRUD operations for tracking income and expenses.
- **Dynamic Filtering**: Fetch records filtered by date ranges, categories, and transaction types.
- **Dashboard Analytics**: Real-time data aggregation calculating total net balances, category-wise spending breakdowns, and recent activity streams.

### Security & Access Control

- **User Authentication**: Secure JWT-based authentication system with bcrypt password hashing.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `Admin` (full access), `Analyst` (read-only data access), and `Viewer` (dashboard summary access only).
- **Account Status Management**: Capability to toggle user access (Active/Inactive) at the database level.

### Advanced System Features

- **MongoDB Aggregation Pipelines**: High-performance database-level calculations reducing server memory overhead.
- **Global Error Handling**: Custom middleware ensuring predictable, clean JSON error responses for validation and 404s.
- **Database Seeding**: Automated scripts to instantly populate the database with mock users and financial transactions for testing.

## 🏗️ Architecture

### System Design

```text
┌─────────────────┐       HTTP/REST API      ┌─────────────────┐
│                 │  ◄──────────────────►    │   Express.js    │
│   Any Client    │        (JSON)            │    Backend      │
│ (Postman/App)   │                          │   (Node.js)     │
└─────────────────┘                          └─────────────────┘
                                                      │
                                                      │
                                                 ┌────▼─────┐
                                                 │ MongoDB  │
                                                 │ Database │
                                                 └──────────┘
```

### Technology Stack

- **Runtime**: Node.js utilizing modern ES6 Modules (`import`/`export`).
- **Framework**: Express.js for routing and middleware management.
- **Database**: MongoDB with Mongoose ODM for strict schema validation.
- **Authentication**: `jsonwebtoken` (JWT) for secure, stateless sessions.
- **Security**: `bcryptjs` for cryptographic password hashing.
- **Architecture**: Modular MVC pattern ensuring separation of concerns.

## 📁 Project Structure

```bash
finance-backend/
├── src/                              # Main application source
│   ├── config/                       # System configuration
│   │   └── db.js                     # MongoDB connection handler
│   ├── controllers/                  # Business logic & request handling
│   │   ├── authController.js         # Authentication & registration
│   │   ├── recordController.js       # Financial records CRUD
│   │   └── summaryController.js      # Dashboard aggregation logic
│   ├── data/                         # Mock data for seeding
│   │   ├── records.js                # Sample transactions
│   │   └── users.js                  # Sample RBAC accounts
│   ├── middleware/                   # Express middlewares
│   │   ├── authMiddleware.js         # JWT verification
│   │   ├── errorMiddleware.js        # Global error interceptor
│   │   └── roleMiddleware.js         # RBAC enforcer
│   ├── models/                       # Mongoose database schemas
│   │   ├── Record.js                 # Financial entry schema
│   │   └── User.js                   # User account schema
│   ├── routes/                       # API route definitions
│   │   ├── authRoutes.js             # /api/auth endpoints
│   │   ├── recordRoutes.js           # /api/records endpoints
│   │   └── summaryRoutes.js          # /api/summary endpoints
│   ├── seeder.js                     # Database import/destroy script
│   └── server.js                     # Application entry point
├── .env                              # Environment variables (git-ignored)
└── package.json                      # Dependencies and NPM scripts
```

## 🔌 API Endpoints

### Authentication & Users (`/api/auth`)

| Method | Endpoint    | Access | Description                 | Payload                           |
| :----- | :---------- | :----- | :-------------------------- | :-------------------------------- |
| `POST` | `/register` | Public | Register a new user         | `{ name, email, password, role }` |
| `POST` | `/login`    | Public | Authenticate user & get JWT | `{ email, password }`             |

### Financial Records (`/api/records`)

| Method   | Endpoint | Access             | Description                 | Payload / Query                           |
| :------- | :------- | :----------------- | :-------------------------- | :---------------------------------------- |
| `POST`   | `/`      | **Admin**          | Create new financial record | `{ amount, type, category, date, notes }` |
| `GET`    | `/`      | **Admin, Analyst** | Get all records             | `?type=income&startDate=YYYY-MM-DD`       |
| `GET`    | `/:id`   | **Admin, Analyst** | Get a single record by ID   | _None_                                    |
| `PUT`    | `/:id`   | **Admin**          | Update an existing record   | `{ amount, category, etc. }`              |
| `DELETE` | `/:id`   | **Admin**          | Remove a record permanently | _None_                                    |

### Dashboard Analytics (`/api/summary`)

| Method | Endpoint | Access                     | Description              | Output Structure                                  |
| :----- | :------- | :------------------------- | :----------------------- | :------------------------------------------------ |
| `GET`  | `/`      | **Admin, Analyst, Viewer** | Fetch aggregated metrics | `{ overview, categoryBreakdown, recentActivity }` |

## 📊 Database Schema

### User Model

```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed
  role: {
    type: String,
    enum: ['Viewer', 'Analyst', 'Admin'],
    default: 'Viewer'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Record Model

```javascript
{
  amount: { type: Number, required: true },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  notes: { type: String },
  createdBy: { type: ObjectId, ref: 'User', required: true },
  createdAt: Date,
  updatedAt: Date
}
```

## 🌐 Environment & Setup

### Local Development

1. **Clone the repository**

   ```bash
   git clone [https://github.com/PREMKUMARDUDI/finance-dashboard-backend.git](https://github.com/PREMKUMARDUDI/finance-dashboard-backend.git)
   cd finance-dashboard-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:

   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/finance_dashboard
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```

4. **Seed the Database (Optional)**
   Populate the database with test data:

   ```bash
   npm run data:import
   ```

5. **Start the Server**
   ```bash
   npm run dev
   ```

### Production Deployment

This API is designed for modern cloud deployment.

- **Platform**: Fully compatible with Render web services.
- **Configuration**: Uses `npm start` (standard Node execution) for production environments.
- **Database**: Connects seamlessly to MongoDB Atlas using the `MONGO_URI` environment variable.

## 👨‍💻 Author

**Prem Kumar Dudi**

- GitHub: [@PREMKUMARDUDI](https://github.com/PREMKUMARDUDI)
- LinkedIn: [Connect with me](https://linkedin.com/in/dudipremkumar)

## 🙏 Acknowledgments

- Express.js community for robust backend patterns.
- MongoDB for powerful aggregation frameworks.
- Inspired by modern fintech dashboard architectures.

---

⭐ **Star this repository if you found it helpful!**

_Empowering financial decisions through data processing._
