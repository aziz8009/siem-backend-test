# SIEM Backend - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed on your system:

| Software                | Version        | Purpose                         |
| ----------------------- | -------------- | ------------------------------- |
| Node.js                 | 18.x or higher | Runtime environment             |
| npm                     | 8.x or higher  | Package manager                 |
| PostgreSQL              | 15.x or higher | Primary database                |
| Elasticsearch           | 8.x or higher  | Search engine and alert storage |
| Docker & Docker Compose | Latest         | Containerization (optional)     |
| Git                     | Latest         | Version control                 |

### Verify Installations

```bash
node --version
npm --version
psql --version
docker --version
docker-compose --version
```

### Project Structure

```bash
siem-backend-test/
├── src/
│   ├── bootstrap/
│   │   ├── database.ts
│   │   ├── elasticsearch.ts
│   │   └── shutdown.ts
│   ├── config/                 # Configuration files
│   │   ├── database.ts
│   │   ├── elasticsearch.ts
│   │   └── environment.ts
│   ├── controllers/            # Request handlers
│   │   ├── alert.controller.ts
│   │   ├── dashboard.controller.ts
│   │   ├── highlighted-ip.controller.ts
│   │   └── health.controller.ts
│   ├── middlewares/            # Express middlewares
│   │   ├── error.middleware.ts
│   │   ├── validate.middleware.ts
│   │   └── logger.middleware.ts
│   ├── migrations/                 # Database migrations
│   │   └── 001-create-highlighted-ips.ts
│   ├── seeders/                    # Seed data
│   │   └── 001-initial-data.ts
│   ├── models/                 # Database models
│   │   ├── asset.model.ts
│   │   ├── highlighted-ip.model.ts
│   │   └── alert.model.ts
│   ├── repositories/           # Data access layer
│   │   ├── asset.repository.ts
│   │   ├── highlighted-ip.repository.ts
│   │   └── alert.repository.ts
│   ├── services/               # Business logic
│   │   ├── alert.service.ts
│   │   ├── dashboard.service.ts
│   │   ├── highlighted-ip.service.ts
│   │   └── health.service.ts
│   ├── validators/             # Request validation
│   │   ├── alert.validator.ts
│   │   ├── highlighted-ip.validator.ts
│   │   ├── ip-validator.ts
│   │   └── index.ts
│   ├── utils/                  # Utility functions
│   │   ├── logger.ts
│   │   └── response.ts
│   ├── routes/                 # API routes
│   │   ├── alert.routes.ts
│   │   ├── dashboard.routes.ts
│   │   ├── highlighted-ip.routes.ts
│   │   └── health.routes.ts
│   ├── types/                  # TypeScript types
│   │   ├── alert.types.ts
│   │   ├── asset.types.ts
│   │   └── highlighted-ip.types.ts
│   └── app.ts                  # Express app setup
├── tests/                      # Test files
│   ├── unit/
│   └── integration/
├── .env.example                # Environment variables example
├── .gitignore                  # Git ignore file
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── docker-compose.yml          # Docker compose configuration
├── Dockerfile                  # Docker build file
├── .sequelizerc                # Sequelize configuration
├── README.md                   # Project overview
└── SETUP.md                    # Setup instructions (this file)
```

### Quick Start (Docker Compose)

```bash
git clone <your-repository-url>
cd siem-backend

cp .env.example .env

```

### Edit .env

```bash

NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=backend_user
DB_PASSWORD=secretpassword
DB_NAME=siem_db
DB_POOL_MIN=2
DB_POOL_MAX=10

ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_INDEX=security-alerts
ELASTICSEARCH_TIMEOUT=30000

LOG_LEVEL=info

```

### Build and Start Services

```bash
docker-compose up -d
```

### Run Database Migrations

```bash
docker-compose exec app npm run migrate
```

### Seed Sample Data (Optional)

```bash
docker-compose exec app npm run seed
```

## Manual Setup (Without Docker)

```bash
git clone <your-repository-url>
cd siem-backend

npm install

cp .env.example .env

NODE_ENV=development
PORT=3000

## update .env

DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=siem_db
DB_POOL_MIN=2
DB_POOL_MAX=10

ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_INDEX=security-alerts
ELASTICSEARCH_TIMEOUT=30000

LOG_LEVEL=info

### Setup PostgreSQL

docker run -d \
  --name siem-postgres \
  -e POSTGRES_USER=backend_user \
  -e POSTGRES_PASSWORD=secretpassword \
  -e POSTGRES_DB=siem_db \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine

```

### Setup Elasticsearch

```bash

docker run -d \
  --name siem-elasticsearch \
  -e discovery.type=single-node \
  -e xpack.security.enabled=false \
  -e ES_JAVA_OPTS="-Xms512m -Xmx512m" \
  -p 9200:9200 \
  -v elasticsearch_data:/usr/share/elasticsearch/data \
  docker.elastic.co/elasticsearch/elasticsearch:8.8.1

```

### Setup Kibana

```bash
docker run -d \
  --name siem-kibana \
  -e ELASTICSEARCH_HOSTS=http://localhost:9200 \
  -p 5601:5601 \
  docker.elastic.co/kibana/kibana:8.8.1



### akses kibana
http://localhost:5601
```

### Start Development Server

```bash
npm run dev
```

### Build For Production

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## Service URLs

## Service URLs

Setelah aplikasi berhasil dijalankan (`docker compose up` atau `make run`), service dapat diakses melalui URL berikut:

| Service         | URL                                             | Description              |
| --------------- | ----------------------------------------------- | ------------------------ |
| Backend API     | http://localhost:3000                           | Main application         |
| API Root        | http://localhost:3000/                          | API information          |
| Health Check    | http://localhost:3000/api/health                | Service health status    |
| Alerts          | http://localhost:3000/api/alerts                | Alert filtering endpoint |
| Dashboard       | http://localhost:3000/api/dashboard/top-targets | Top targets endpoint     |
| Highlighted IPs | http://localhost:3000/api/highlighted-ips       | IP management endpoint   |
| PostgreSQL      | localhost:5432                                  | Database                 |
| Elasticsearch   | http://localhost:9200                           | Search engine            |
| Kibana          | http://localhost:5601                           | Elasticsearch UI         |

> **Note:** Pastikan seluruh container telah berjalan sebelum mengakses endpoint di atas.
