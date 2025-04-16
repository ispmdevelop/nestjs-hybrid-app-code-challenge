# README.md

This project sets up a **NestJS** backend with **RabbitMQ** and **PostgreSQL** using Docker Compose. It includes a message queue for task processing and a database for storage, with Swagger UI for API documentation.

## Environment Variables

Copy `.env.example` to `.env` to configure the services:

```bash
cp .env.example .env
```

### `.env.example`

```plaintext
# RabbitMQ
RABBITMQ_DEFAULT_USER="strong-user"
RABBITMQ_DEFAULT_PASS="strong-password"

# PostgreSQL
POSTGRES_USER="db-user"
POSTGRES_PASSWORD="db-password"
POSTGRES_DB="demo"
POSTGRES_PORT="5003"

# Backend
DATABASE_URL="postgresql://db-user:db-password@localhost:5003/demo"
PORT=3000
RABBIT_MQ_BROKER_URL="amqp://strong-user:strong-password@localhost:5672"
```

Edit `.env` if needed. The defaults work for local development.

## Docker Compose Highlights

- **RabbitMQ**:

  - Image: `rabbitmq:4.0.2-management`
  - Volume: `rabbitmq_data` (persistent data)
  - Ports: `5672` (AMQP), `15672` (Management UI)
  - Healthcheck: Runs `rabbitmqctl status` every 30s
  - Resources: Limited to 0.5 CPU, 512MB memory

- **PostgreSQL**:

  - Image: `postgres:16.4-bullseye`
  - Volume: `postgres_data` (persistent data)
  - Port: `5003:5432` (maps to `${POSTGRES_PORT}`)
  - Environment: Uses `${POSTGRES_USER}`, `${POSTGRES_PASSWORD}`, `${POSTGRES_DB}`

- **NestJS Backend**:

  - Built from `./Dockerfile`
  - Port: `3000`
  - Depends on `rabbitmq` and `db`
  - Environment: Connects to RabbitMQ and PostgreSQL via `DATABASE_URL` and `RABBIT_MQ_BROKER_URL`

- **Network**: All services use `app-network` (bridge) for communication.
- **Volumes**: Named volumes `rabbitmq_data` and `postgres_data` for persistence.

## Running Locally

1. **Install Docker**:
   Ensure Docker and Docker Compose are installed.

2. **Set Up `.env`**:

   ```bash
   cp .env.example .env
   ```

3. **Start Services**:

   ```bash
   sudo docker compose up -d --build
   ```

4. **Verify**:
   Check containers:

   ```bash
   docker ps
   ```

## Access Services

- **Swagger UI**: `http://localhost:3000/docs`
- **OpenAPI JSON**: `http://localhost:3000/docs/json`
- **PostgreSQL**: `localhost:5003` (use `psql -h localhost -p 5003 -U db-user -d demo`)
- **RabbitMQ Management**: `http://localhost:15672` (login: `strong-user`/`strong-password`)

## Stopping

Stop without removing data:

```bash
sudo docker compose down
```

Stop and remove data:

```bash
sudo docker compose down -v
```

## Notes

- **Security**: Use strong passwords in `.env` for production.
- **Data**: Volumes persist data. Remove with `docker volume rm rabbitmq_data postgres_data` if needed.
- **Troubleshooting**: Check logs with `docker compose logs <service>` (e.g., `rabbitmq`, `postgres-db`, `nestjs_backend`).
