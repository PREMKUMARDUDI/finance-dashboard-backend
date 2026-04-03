# Finance Dashboard API

A robust, RESTful backend built with Node.js, Express, and MongoDB for managing financial records and user access. This project demonstrates a clean, modular architecture with role-based access control (RBAC), data aggregation, and comprehensive error handling.

## 🚀 Features

- **Authentication & Authorization:** Secure JWT-based login and registration.
- **Role-Based Access Control (RBAC):** Distinct permissions for `Admin`, `Analyst`, and `Viewer` roles.
- **Financial Record Management:** Complete CRUD operations for income and expense tracking.
- **Data Aggregation:** MongoDB aggregation pipelines to calculate net balances, category breakdowns, and fetch recent activity for a dashboard.
- **Robust Error Handling:** Global middleware for clean, predictable JSON error responses and Mongoose validation.
- **ES6 Modules:** Built using modern JavaScript `import/export` syntax.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Security:** JSON Web Tokens (JWT) & bcryptjs

## 📂 Project Structure

\`\`\`text
finance-backend/
├── src/
│ ├── config/ # Database connection
│ ├── controllers/ # Business logic (Auth, Records, Summary)
│ ├── data/ # Mock data for seeding
│ ├── middleware/ # JWT protection, RBAC, and Error Handling
│ ├── models/ # Mongoose schemas (User, Record)
│ ├── routes/ # Express routers
│ ├── seeder.js # Script to populate the database
│ └── server.js # App entry point
├── .env # Environment variables
└── package.json
\`\`\`

## ⚙️ Installation & Setup

1.  **Clone the repository**
    \`\`\`bash
    git clone <your-repo-url>
    cd finance-backend
    \`\`\`

2.  **Install dependencies**
    \`\`\`bash
    npm install
    \`\`\`

3.  **Environment Variables**
    Create a \`.env\` file in the root directory and add the following:
    \`\`\`env
    PORT=5000
    MONGO*URI=mongodb://127.0.0.1:27017/finance_dashboard
    JWT_SECRET=your_super_secret_key_here
    \`\`\`
    *(Note: Using a local MongoDB connection for faster development, but a MongoDB Atlas URI works perfectly as well).\_

4.  **Seed the Database (Optional but recommended)**
    Populate the database with test users and financial records.
    \`\`\`bash
    npm run data:import
    \`\`\`
    _Test Accounts created by the seeder (Password for all is `123456`):_
    - admin@example.com (Role: Admin)
    - analyst@example.com (Role: Analyst)
    - viewer@example.com (Role: Viewer)

5.  **Run the Server**
    \`\`\`bash

    # For development (uses nodemon)

    npm run dev

    # For production

    npm start
    \`\`\`

## 🛣️ API Endpoints

### Authentication (\`/api/auth\`)

| Method | Endpoint    | Description                   | Access |
| :----- | :---------- | :---------------------------- | :----- |
| POST   | `/register` | Register a new user           | Public |
| POST   | `/login`    | Authenticate user & get token | Public |

### Financial Records (\`/api/records\`)

| Method | Endpoint | Description                              | Access         |
| :----- | :------- | :--------------------------------------- | :------------- |
| GET    | `/`      | Get all records (supports query filters) | Admin, Analyst |
| POST   | `/`      | Create a new record                      | Admin          |
| GET    | `/:id`   | Get single record by ID                  | Admin, Analyst |
| PUT    | `/:id`   | Update a record                          | Admin          |
| DELETE | `/:id`   | Delete a record                          | Admin          |

### Dashboard Summary (\`/api/summary\`)

| Method | Endpoint | Description                              | Access                 |
| :----- | :------- | :--------------------------------------- | :--------------------- |
| GET    | `/`      | Get dashboard stats (Totals, Categories) | Admin, Analyst, Viewer |

## 🧠 Assumptions & Design Decisions

- **Soft Deletes vs. Hard Deletes:** I opted for hard deletes for simplicity in this assignment, but in a production financial system, I would implement soft deletes (e.g., an `isDeleted` flag) to preserve auditing history.
- **No Viewer Record Access:** Based on the requirements, Viewers only need access to the dashboard. Therefore, I restricted the `/api/records` routes to Analysts and Admins, but allowed Viewers to access the `/api/summary` aggregation endpoint.
