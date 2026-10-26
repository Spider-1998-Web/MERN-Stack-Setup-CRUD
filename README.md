# MERN Stack Setup (CRUD)

A starter template for MERN (MongoDB, Express, React, Node) CRUD projects.

## ⚠️ Reminder: before you run anything

1. **Create a `.env` file** in the server (backend) folder.
2. **Add your MongoDB URI** (`MONGO_URI`) to it.
3. **Set the port** (`PORT`) the server should run on.

Example `.env`:

```dotenv
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

## Checklist

- [ ] `.env` file created
- [ ] `MONGO_URI` added (replace username, password, cluster and database)
- [ ] `PORT` set
- [ ] `.env` is listed in `.gitignore` (never push it to GitHub)
- [ ] Dependencies installed (`pnpm install`)

## Run

```bash
pnpm install
pnpm dev
```