# DigiSmart Online Store

DigiSmart is an online store project designed to offer a smooth and efficient shopping experience. It leverages a variety of technologies including HTML, CSS, Python, Django, Redis, PostgreSQL, Nginx, and Gunicorn. The project adheres to RESTful principles for its API design.

## Setup

### Prerequisites

- Docker installed on your system

### Environment Variables

Before running the project, you need to set up two environment files: .env and .env.prod.db with the appropriate configurations. Place these files in the root directory of the project.

    ```env
    # .env

    SECRET_KEY=your_secret_key
    DEBUG=0
    DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]

    #data base
    SQL_ENGINE=django.db.backends.postgresql
    SQL_DATABASE=your_database_name
    SQL_USER=your_postgres_user
    SQL_PASSWORD=your_postgres_password
    SQL_HOST=db
    SQL_PORT=5432
    DATABASE=postgres

    #redis
    REDIS_HOST=redis
    REDIS_PORT=6379
    OTP_REDIS_DB=0
    CART_REDIS_DB=1
    CACHE_REDIS_DB=2
    CELERY_BROKER_REDIS=3
    CELERY_BACK_REDIS=4

    #zarinpal
    MERCHANT=your_zarinpal_merchant

    #melipayamak
    MELIPAYAMAK_USER=your_melipayamak_username
    MELIPAYAMAK_PASS=your_melipayamak_password
    MELIPAYAMAK_NUM=your_melipayamak_number

    #gmail
    EMAIL_HOST_PASSWORD=your_email_host_password
    ```

    ```.env.prod.db
    # .env.prod.db
    
    POSTGRES_USER=your_postgres_user
    POSTGRES_PASSWORD=your_postgres_password
    POSTGRES_DB=your_database_name
    ```


### Docker Setup

The project is containerized with Docker, ensuring easy deployment and scalability.

#### Build

To build the project, execute the following command:

bash
docker-compose build


#### Deployment

To deploy the project, use the following command:

bash
docker-compose up -d


This command will start the project in detached mode, allowing it to run in the background.

## Usage

Once the project is deployed, you can access the DigiSmart online store through your web browser.
