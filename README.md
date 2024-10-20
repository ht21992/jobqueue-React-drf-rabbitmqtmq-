# Conversion App

This app allows users to convert videos and images to various formats, built with Django (backend), React (frontend), Redux Toolkit (state management), RabbitMQ (message broker), and Celery (task queue).

---

## Prerequisites
- Python 3.x
- Node.js and npm
- RabbitMQ
- Virtual environment (recommended)

---

## Setup

### 1. Clone the Repository
```bash
git clone https://github.com/ht21992/jobqueue-React-drf-rabbitmqtmq-.git
cd <project_directory>
```

### 2. Create Python Virtual Environment

```
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

```

### 3. Install Backend Dependencies
```
pip install -r requirements.txt

```

### 4. Setup RabbitMQ (Ubuntu)
```
sudo apt update
sudo apt install rabbitmq-server
sudo systemctl enable rabbitmq-server
sudo systemctl start rabbitmq-server
sudo systemctl status rabbitmq-server


```

Optional RabbitMQ Setup (if needed)
If RabbitMQ is not listening on the expected port (5672):
```
sudo apt install net-tools
netstat -plnt | grep 5672

```

Open or create the configuration file:
```
sudo nano /etc/rabbitmq/rabbitmq.conf

```

Add the following:
```

listeners.tcp.default = 0.0.0.0:5672

```

Save the file and restart RabbitMQ:
```
sudo service rabbitmq-server restart

```

### 5. Create .env File
Create a .env file in the project directory and add the following values:

```
CELERY_BROKER_URL=<value>
CELERY_RESULT_BACKEND=<value>
DJ_SECRET_KEY=<your_django_secret_key>


```

### 6. Frontend Setup
Navigate to the frontend directory:

```
cd frontend
npm install
npm run dev

```

### 7. Running Celery
Ensure RabbitMQ is running. In the project directory, start the Celery worker:

```
celery -A jobqueue worker -l info -P event


```


### 8. Running the Django Backend
In the backend directory, run the Django development server:

```
python manage.py runserver

```


## Summary
This project integrates various tools to convert videos and images seamlessly. RabbitMQ and Celery handle background tasks, while React and Django manage the frontend and backend operations. Make sure all services are up and running to ensure smooth functionality.