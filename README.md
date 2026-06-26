# SIEM Backend API

Security Information and Event Management (SIEM) Dashboard Backend Service

## Features

- Advanced Alert Filtering with asset correlation
- Dashboard Aggregation & Enrichment
- Highlighted IP Management (CRUD)
- Activity Monitoring for Highlighted IPs
- Health Check
- Clean Architecture
- TypeScript
- Sequelize ORM
- Elasticsearch Integration

## Tech Stack

- Node.js 18+
- Express.js
- TypeScript
- Sequelize (PostgreSQL)
- Elasticsearch
- Joi (Validation)
- Winston (Logging)

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Elasticsearch 8+
- Docker (optional)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd siem-backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npm run migrate

# Start development server
npm run dev
```
