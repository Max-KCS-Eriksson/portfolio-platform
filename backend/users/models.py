from django.contrib.auth.models import AbstractUser
from django.db import models

from .managers import UserManager


class User(AbstractUser):
    """
    Custom user model using the `email` field as unique identifier.

    Reference the user model with `get_user_model()` or `settings.AUTH_USER_MODEL`.
    See official docs for more info:
    https://docs.djangoproject.com/en/4.1/topics/auth/customizing/#referencing-the-user-model
    """

    # User attributes
    username = None  # Remove username field
    email = models.EmailField(unique=True, verbose_name="email address")

    # Field settings
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email
