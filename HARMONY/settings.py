from pathlib import Path
import os
import dj_database_url
from dotenv import load_dotenv

# Load .env for local development
load_dotenv()

# --------------------------
# BASE DIR
# --------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# --------------------------
# SECURITY
# --------------------------
SECRET_KEY = os.environ.get("SECRET_KEY", "fallback-secret-for-dev")
DEBUG = os.environ.get("DEBUG", "False") == "True"

ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
    ".railway.app",
    ".up.railway.app",
    "philharmonia-website-production.up.railway.app",
]

CSRF_TRUSTED_ORIGINS = [
    "https://philharmonia-website-production.up.railway.app",
    "https://*.railway.app",
]

# --------------------------
# APPLICATION DEFINITION
# --------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",

    # Local apps
    "app.apps.AppConfig",

    # Third-party apps
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    "storages",  # Cloudflare R2
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "allauth.account.middleware.AccountMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "app.middleware.LoginRedirectMiddleware",
]

ROOT_URLCONF = "HARMONY.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "HARMONY.wsgi.application"

# --------------------------
# DATABASE
# --------------------------
# Render provides DATABASE_URL, Railway provides DATABASE_URL
# Both will work with this configuration
DATABASE_URL = os.environ.get("DATABASE_URL")
if DATABASE_URL:
    DATABASES = {
        "default": dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
else:
    # Local development
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": "Philharmonia_db",
            "USER": "Philharmonia_user",
            "PASSWORD": "Philharmonia",
            "HOST": "localhost",
            "PORT": "5432",
        }
    }

# --------------------------
# PASSWORD VALIDATORS
# --------------------------
AUTH_PASSWORD_VALIDATORS = []

# --------------------------
# INTERNATIONALIZATION
# --------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# --------------------------
# STATIC FILES
# --------------------------
STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"

# --------------------------
# DEFAULT MEDIA (Will be overridden by R2 if available)
# --------------------------
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "images"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --------------------------
# AUTHENTICATION
# --------------------------
AUTH_USER_MODEL = "app.CustomUser"

AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
]

# Set SITE_ID to the production site ID
SITE_ID = 2  # Change if your production site has a different ID

LOGIN_REDIRECT_URL = "/user_home/"
LOGOUT_REDIRECT_URL = "/"
LOGIN_URL = "/login/"

# --------------------------
# ALLAUTH SETTINGS
# --------------------------
ACCOUNT_LOGIN_METHODS = {"email"}
ACCOUNT_SIGNUP_FIELDS = ["email*", "password1*", "password2*"]
ACCOUNT_EMAIL_VERIFICATION = "optional"
ACCOUNT_LOGOUT_ON_GET = True
ACCOUNT_SESSION_REMEMBER = True
ACCOUNT_PREVENT_ENUMERATION = False

SOCIALACCOUNT_LOGIN_ON_GET = True
SOCIALACCOUNT_AUTO_SIGNUP = True
SOCIALACCOUNT_EMAIL_VERIFICATION = "optional"
SOCIALACCOUNT_EMAIL_REQUIRED = True
SOCIALACCOUNT_STORE_TOKENS = True
SOCIALACCOUNT_QUERY_EMAIL = True

SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "APP": {
            "client_id": os.environ.get("GOOGLE_CLIENT_ID"),
            "secret": os.environ.get("GOOGLE_SECRET"),
            "key": ""
        },
        "SCOPE": ["profile", "email"],
        "AUTH_PARAMS": {"access_type": "online"},
        "OAUTH_PKCE_ENABLED": True,
    }
}

# ================= PLATFORM DETECTION =================
IS_RAILWAY = os.environ.get("RAILWAY_ENVIRONMENT") is not None
IS_RENDER = os.environ.get('RENDER', '').lower() == 'true'
IS_PRODUCTION = IS_RAILWAY or IS_RENDER

print(f"🚀 Platform: {'Railway' if IS_RAILWAY else 'Render' if IS_RENDER else 'Local'}")

# ================= RENDER SPECIFIC SETTINGS =================
if IS_RENDER:
    # Add Render hostname to allowed hosts
    RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
    if RENDER_EXTERNAL_HOSTNAME:
        ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)
        CSRF_TRUSTED_ORIGINS.append(f'https://{RENDER_EXTERNAL_HOSTNAME}')
        print(f"✅ Added {RENDER_EXTERNAL_HOSTNAME} to allowed hosts")

# ================= PRODUCTION SECURITY SETTINGS =================
if IS_PRODUCTION:
    SECURE_SSL_REDIRECT = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    DEBUG = False
    
    # 🔥 FIX: Static files with WhiteNoise - Use CompressedStaticFilesStorage
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

# ================= CLOUDFLARE R2 CONFIGURATION =================
# Support both R2_ and AWS_ environment variable names
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID") or os.environ.get("R2_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY") or os.environ.get("R2_SECRET_ACCESS_KEY")
AWS_STORAGE_BUCKET_NAME = os.environ.get("AWS_STORAGE_BUCKET_NAME") or os.environ.get("R2_BUCKET_NAME", "philharmonia-media")
AWS_S3_ENDPOINT_URL = os.environ.get("AWS_S3_ENDPOINT_URL") or "https://0b418dde0bb4950435f6df4b43427951.r2.cloudflarestorage.com"
AWS_S3_REGION_NAME = "auto"
AWS_S3_CUSTOM_DOMAIN = os.environ.get("AWS_S3_CUSTOM_DOMAIN") or "pub-a8c070b615064b4391ac33a8916b8b24.r2.dev"

# Enable R2 if credentials are available (for both Railway and Render)
if AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY:
    print(f"✅ R2 Storage Enabled - Bucket: {AWS_STORAGE_BUCKET_NAME}")
    
    # Use R2 for media files
    DEFAULT_FILE_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"
    MEDIA_URL = f"https://{AWS_S3_CUSTOM_DOMAIN}/"
    
    # R2 configuration
    AWS_S3_OBJECT_PARAMETERS = {"CacheControl": "max-age=86400"}
    AWS_DEFAULT_ACL = "public-read"
    AWS_QUERYSTRING_AUTH = False
    AWS_S3_FILE_OVERWRITE = False
    
    if IS_RENDER:
        print("🎯 Storage: Using R2 on RENDER deployment")
    elif IS_RAILWAY:
        print("🎯 Storage: Using R2 on RAILWAY deployment")
    else:
        print("🎯 Storage: Using R2 on LOCAL development")
else:
    print("⚠️ R2 credentials not found, using local media storage")
    # Keep default MEDIA_URL and MEDIA_ROOT from above

# ================= RENDER EMERGENCY OVERRIDE =================
# This MUST be the LAST section in the file
# It OVERRIDES everything above for Render deployment
if os.environ.get('RENDER'):
    print("=" * 60)
    print("🚨 RENDER EMERGENCY OVERRIDE ACTIVE")
    print("=" * 60)
    
    # CRITICAL: Disable R2 temporarily to get site working
    print("🔧 OVERRIDE: Force disabling R2, using local storage")
    DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
    MEDIA_URL = '/media/'
    
    # Force production settings
    DEBUG = False
    SECURE_SSL_REDIRECT = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    
    # Force correct static files storage
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'
    
    # Ensure Render host is in allowed hosts
    RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
    if RENDER_EXTERNAL_HOSTNAME and RENDER_EXTERNAL_HOSTNAME not in ALLOWED_HOSTS:
        ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)
        print(f"✅ OVERRIDE: Added {RENDER_EXTERNAL_HOSTNAME} to ALLOWED_HOSTS")
    
    print("🎯 OVERRIDE COMPLETE: R2 disabled, using local storage")
    print("🎯 Site should now work on Render")
    print("=" * 60)