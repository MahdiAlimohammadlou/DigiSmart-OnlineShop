# DigiSmart Online Store

DigiSmart is an online store project designed to offer a smooth and efficient shopping experience. It leverages a variety of technologies including HTML, CSS, Python, Django, Redis, PostgreSQL, Nginx, and Gunicorn. The project adheres to RESTful principles for its API design.

## Setup

### Prerequisites

- Python 3.x installed on your system
- Docker installed on your system

### Environment Variables

Before running the project, you need to set up two environment files: .env and .env.prod.db with the appropriate configurations. You can find sample configurations in the .env.example file.

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