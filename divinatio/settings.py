import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent


if os.getenv('production'):
    SITE_ID = 3
    DEBUG = False
else:
    SITE_ID = 2
    DEBUG = True

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')


if os.getenv('production'):
    ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost').split(',')
else:
    ALLOWED_HOSTS = ['127.0.0.1', 'localhost']


REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
        'rest_framework.throttling.ScopedRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '10/second',
        'user': '20/second',
        'login': '5/min',
        'register': '10/hour',
        'password_reset': '4/hour',
    },
}


SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=8),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=2),
}


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'rest_framework',
    'corsheaders',
    'django_apscheduler',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.twitter',
    'api.apps.ApiConfig',
    'payments.apps.PaymentsConfig',
    'sports.apps.SportsConfig',
    'divinatio.apps.AlgoVictoryConfig',
]


MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

ROOT_URLCONF = 'divinatio.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'divinatio.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': Path(os.getenv('DB_PATH', str(BASE_DIR / 'db.sqlite3'))),
        'OPTIONS': {'timeout': 20},
    }
}


if os.getenv('production'):
    AUTH_PASSWORD_VALIDATORS = [
        {
            'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
        },
    ]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STORAGES = {
    'staticfiles': {
        'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
    },
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = "api.User"

# app scheduler
# https://pypi.org/project/django-apscheduler/
APSCHEDULER_DATETIME_FORMAT = "N j, Y, f:s a"
APSCHEDULER_RUN_NOW_TIMEOUT = 60

# ALLAUTH settings
# social auth , google

SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "SCOPE": ["profile", "email"],
        "AUTH_PARAMS": {
            "access_type": "online",
        },
        "VERIFIED_EMAIL": True,
    },
    "twitter": {},
}

SOCIALACCOUNT_QUERY_EMAIL = True
EMAIL_BACKEND = 'django.core.mail.backends.dummy.EmailBackend'
DEFAULT_FROM_EMAIL = 'noreply@algovictory.com'
ACCOUNT_ADAPTER = 'api.adapters.AllauthAdapter'
SOCIALACCOUNT_ADAPTER = 'api.adapters.SocialAccountAdapter'
SOCIALACCOUNT_AUTO_SIGNUP = True

SOCIALACCOUNT_LOGIN_ON_GET = True
SOCIALACCOUNT_EMAIL_AUTHENTICATION_AUTO_CONNECT = True
ACCOUNT_ALLOW_EXTERNAL_REDIRECTS = False

if os.getenv('production'):
    ACCOUNT_DEFAULT_HTTP_PROTOCOL = 'https'
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')


AUTHENTICATION_BACKENDS = (
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
)


LOGIN_REDIRECT_URL = '/api/social-token/'  # exchanging session for JWT
LOGOUT_REDIRECT_URL = '/login/'

CORS_ALLOW_CREDENTIALS = True

if os.getenv('production'):
    _origins = [o for o in os.getenv('CORS_ALLOWED_ORIGINS', '').split(',') if o]
    CORS_ALLOWED_ORIGINS = _origins
    CSRF_TRUSTED_ORIGINS = _origins
else:
    CORS_ALLOWED_ORIGINS = [
        'http://127.0.0.1:5173',
        'http://localhost:5173',
    ]
    CSRF_TRUSTED_ORIGINS = [
        'http://127.0.0.1:5173',
        'http://localhost:5173',
    ]
