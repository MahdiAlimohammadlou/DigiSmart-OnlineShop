# DigiSmart Online Store

DigiSmart is a full-featured online store project designed to offer a smooth and efficient shopping experience. It is built using a robust tech stack that covers both frontend and backend development, asynchronous task handling, caching, deployment, and containerization.

## 🔧 Technologies Used

- **Frontend**:  
  - `HTML`, `CSS`, `JavaScript`, `jQuery`

- **Backend**:  
  - `Python`, `Django`

- **Asynchronous Task Queue**:  
  - `Celery`, `Redis`

- **Database**:  
  - `PostgreSQL`

- **Deployment & Web Server**:  
  - `Docker`, `Gunicorn`, `Nginx`

This architecture ensures a scalable, maintainable, and high-performance online shopping platform. The project adheres to RESTful principles for its API design.

---

## ⚙️ Setup

### Prerequisites

- Docker installed on your system

---

### 🌍 Environment Variables

Before running the project, set up two environment files: `.env` and `.env.prod.db`, and place them in the root directory.

#### `.env`

```env
SECRET_KEY=your_secret_key
DEBUG=0
DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]

# Database
SQL_ENGINE=django.db.backends.postgresql
SQL_DATABASE=your_database_name
SQL_USER=your_postgres_user
SQL_PASSWORD=your_postgres_password
SQL_HOST=db
SQL_PORT=5432
DATABASE=postgres

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
OTP_REDIS_DB=0
CART_REDIS_DB=1
CACHE_REDIS_DB=2
CELERY_BROKER_REDIS=3
CELERY_BACK_REDIS=4

# Payment & SMS
MERCHANT=your_zarinpal_merchant
MELIPAYAMAK_USER=your_melipayamak_username
MELIPAYAMAK_PASS=your_melipayamak_password
MELIPAYAMAK_NUM=your_melipayamak_number

# Email
EMAIL_HOST_PASSWORD=your_email_host_password
```

#### `.env.prod.db`

```env
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=your_database_name
```

---

## 🐳 Docker Setup

The project is containerized with Docker for easy deployment and scalability.

### 🔨 Build the Containers

```bash
docker-compose build
```

### 🚀 Deploy the Project

```bash
docker-compose up -d
```

This command starts the application in detached mode.

---

## 🌐 Usage

Once deployed, you can access the DigiSmart online store through your web browser at the configured address.
