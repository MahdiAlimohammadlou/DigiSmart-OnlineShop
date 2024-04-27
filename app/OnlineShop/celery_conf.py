from celery import Celery
from datetime import timedelta
import os
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'OnlineShop.settings')
celery_app = Celery('OnlineShop')
celery_app.autodiscover_tasks()
celery_app.conf.broker_url = f'redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.CELERY_BROKER_REDIS}'
celery_app.conf.result_backend = f'redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.CELERY_BACK_REDIS}'
celery_app.conf.task_serializer = 'json'
celery_app.conf.result_serializer = 'pickle'
celery_app.conf.accept_content = ['pickle', 'json']
celery_app.conf.result_expires = timedelta(days = 1)
celery_app.conf.task_always_eager = False
celery_app.conf.worker_prefetch_multiplier = 4
