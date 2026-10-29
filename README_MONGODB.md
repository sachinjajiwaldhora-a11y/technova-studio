# 🍃 Technova Studio // MongoDB Integration Guide

This guide walks you through connecting your **MongoDB Atlas** or **local MongoDB** database to Technova Studio.

---

## ⚡ What was configured

1. **MongoDB Native Driver (`mongodb`):** Installed and configured with singleton connection pooling for Next.js App Router (`lib/mongodb.ts`).
2. **Secure Server-side API Endpoints:**
   - **`POST /api/auth/login`**: Authenticates team members against MongoDB `studio_members` collection, with automatic fallback if MongoDB is offline or unconfigured.
   - **`GET | POST | PUT | DELETE /api/data/[collection]`**: Unified REST operations for `projects`, `inquiries`, `members`, `announcements`, `sheets`, `cms`, and `join_requests`.
   - **`GET | POST /api/seed`**: One-click HTTP database seeding endpoint.
3. **Frontend Client Adapter (`lib/mongodb-client.ts`):** Lightweight client utilities for querying and synchronizing with MongoDB.
4. **Standalone CLI Seed Script (`scripts/seed-mongodb.mjs`):** Run `npm run seed:mongo` anytime to populate or refresh collections.
5. **Zero Front-end Interruption:** The front-end UI, client state, and animations remain 100% functional. If `MONGODB_URI` is not provided, the app continues to operate in fallback mode without throwing errors.

---

## 🚀 What's Next: Step-by-Step Connection Instructions

### Step 1: Get your MongoDB Connection String

#### Option A: MongoDB Atlas (Cloud - Recommended)
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Database** -> Click **Connect** on your cluster.
3. Select **Drivers** (Node.js).
4. Copy your connection string. It looks like:
   ```text
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your database user credentials.
   *(Make sure your database user has read/write permissions and your current IP is added in Network Access -> Add IP Address / Allow Anywhere `0.0.0.0/0`).*

#### Option B: Local MongoDB
If running MongoDB locally on your machine:
```text
mongodb://127.0.0.1:27017/technova_studio
```

---

### Step 2: Add credentials to `.env.local`

Open your [.env.local](file:///d:/00_Dev_Hub/03_Projects/technova/my-studio-website/.env.local) file and uncomment/set:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=technova_studio
```

---

### Step 3: Seed the Database

Once your connection string is in `.env.local`, seed initial members, projects, and inquiries:

#### Using Terminal:
```bash
npm run seed:mongo
```

#### Or using your browser:
With `npm run dev` running, open:
[http://localhost:3000/api/seed](http://localhost:3000/api/seed)

---

### Step 4: Test Login with Seed Admin Credentials

Navigate to [http://localhost:3000/login](http://localhost:3000/login) and log in with:

- **Admin Account 1:**
  - **Email:** `sachinjajiwaldhora@gmail.com`
  - **Password:** `NOVA-SACHIN-2025`
- **Admin Account 2:**
  - **Email:** `anujb2296@gmail.com`
  - **Password:** `NOVA-ANUJ-2025`
