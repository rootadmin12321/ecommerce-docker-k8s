# ecommerce-docker-k8s

> Full-stack e‑commerce (React + Node + PostgreSQL) packaged for Docker and Kubernetes.

---

## Project overview

This repository contains a full working e‑commerce starter: a **React frontend**, **Node/Express backend**, and **PostgreSQL** database. It supports both:

* Local development (run backend + frontend locally, Postgres in Docker), and
* Containerized deployment (Docker images + Kubernetes manifests under `k8s/`).

The README below explains project structure, how to run locally, how to build Docker images, how to deploy to Kubernetes, key endpoints, seeding, and troubleshooting tips. Screenshots / graphics placeholders are included and there is a simple ASCII architecture diagram.

---

## Repository structure

```
/ecommerce-docker-k8s
├─ backend/                 # Node.js + Express app
│  ├─ server.js
│  ├─ db.js
│  ├─ routes/
│  └─ seed.js
├─ frontend/                # React app (CRA)
│  ├─ public/
│  ├─ src/
│  └─ Dockerfile
├─ k8s/                     # Kubernetes manifests (Deployments, Services, Secrets, PVC)
├─ docker-compose.yml       # optional: run Postgres or full stack locally
└─ README.md                # <- this file
```

---

## Quick architecture diagram

```
                        +-----------------------+
                        |  Developer laptop     |
                        |  (frontend + backend) |
                        +----------+------------+
                                   |
                                   |  HTTP
                                   v
     +------------------+     +----------------+     +----------------+
     | Kubernetes /     | <-> | Backend (Node) | <-> | PostgreSQL DB  |
     | Docker Registry   |     | (container)    |     | (Stateful Pod) |
     +------------------+     +----------------+     +----------------+
              ^                        ^
              |                        |
              |                        +--> /api/products, /api/auth, /api/cart
              |
        frontend (Nginx) static files
        served from container -> ports 80
```

---

## Setup & run locally (Postgres in Docker, backend + frontend local)

1. Start Postgres (docker-compose uses service `db`):

```bash
cd <repo-root>
docker-compose up -d db
```

2. Configure backend env (create `backend/.env`):

```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=ecomdb
DB_PASSWORD=postgres
DB_PORT=5432
PORT=5000
JWT_SECRET=your_jwt_secret
```

3. Install & run backend locally:

```bash
cd backend
npm install
npm run dev   # starts at http://localhost:5000
```

4. Seed the DB (if needed):

```bash
node seed.js
```

5. Install & run frontend locally:

```bash
cd frontend
npm install
npm start     # opens http://localhost:3000
```

---

## Build Docker images (production frontend with Nginx)

1. Build backend image (example):

```bash
cd backend
docker build -t <youruser>/ecommerce-backend:latest .
```

2. Build frontend multi-stage image (build + nginx):

```bash
cd frontend
docker build -t <youruser>/ecommerce-frontend:latest .
```

3. Push to registry (Docker Hub / private):

```bash
docker push <youruser>/ecommerce-backend:latest
docker push <youruser>/ecommerce-frontend:latest
```

---

## Kubernetes deployment (example)

K8s manifests are in `k8s/` (Deployments, Services, Secret for Postgres credentials, PVC/PV). Example steps:

1. Create namespace:

```bash
kubectl create ns ecommerce-app
```

2. Apply Secret (postgres credentials):

```bash
kubectl apply -f k8s/postgres-secret.yaml -n ecommerce-app
```

3. Apply PV / PVC, Postgres Deployment + Service:

```bash
kubectl apply -f k8s/postgres-pv-pvc.yaml -n ecommerce-app
kubectl apply -f k8s/postgres-deployment.yaml -n ecommerce-app
```

4. Apply backend + frontend deployments and services:

```bash
kubectl apply -f k8s/backend-deployment.yaml -n ecommerce-app
kubectl apply -f k8s/backend-service.yaml -n ecommerce-app
kubectl apply -f k8s/frontend-deployment.yaml -n ecommerce-app
kubectl apply -f k8s/frontend-service.yaml -n ecommerce-app
```

5. Port-forward for testing (if no external ingress):

```bash
kubectl port-forward svc/backend-service -n ecommerce-app 5000:5000
kubectl port-forward svc/frontend-service -n ecommerce-app 3000:80
```

---

## Important endpoints

* `GET /api/products` — list products
* `GET /api/products/:id` — product details
* `POST /api/auth/register` — register user
* `POST /api/auth/login` — login, returns JWT
* `GET /api/cart` — get user cart (auth)
* `POST /api/orders` — create order (auth)

---

## Seeding

* `backend/seed.js` seeds sample car products. Run `node seed.js` after tables exist or backend init created them automatically.

---

## Troubleshooting tips

* **`ENOTFOUND db`** when running backend locally: make sure `DB_HOST` is `localhost` if Postgres runs on host, or `db` when Postgres runs inside Docker Compose.
* **`password authentication failed`**: use Kubernetes Secret for Postgres credentials and ensure backend uses those env vars.
* **React dev server crashes inside container**: do not run `react-scripts start` in Docker; instead build (`npm run build`) and serve with Nginx.
* **`react-scripts: not found`**: add `react-scripts` to dependencies in `frontend/package.json`.

---

## Visuals & graphics

I added placeholders where you can paste screenshots or images (inside `README` you can replace these with actual images):

* Project architecture (ASCII diagram above)
* Example UI screenshot:

```
![Home page screenshot](docs/screenshots/home.png)
```

* Kubernetes dashboard screenshot:

```
![K8s dashboard](docs/screenshots/k8s.png)
```

---

## How I reviewed your repo

I checked the repository structure and confirmed there are `backend/`, `frontend/`, `k8s/`, and `docker-compose.yml`. I created this README describing how to run locally, build images, and deploy to Kubernetes, plus seeding and common fixes.

---

## Next steps I can help with

* Commit this README into the repo and push a PR.
* Generate example PNG screenshots (mockups) and add to `docs/screenshots/`.
* Create a single `deploy-all.yaml` that applies namespace, secrets, PV/PVC, Postgres, backend, frontend in the right order.
* Add GitHub Actions CI to build and push Docker images automatically.

---

If you want me to commit this README.md into your repository now, confirm and I will prepare the commit (I can show the full markdown in a new commit file).
