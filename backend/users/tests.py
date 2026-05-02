from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.test import TestCase


class UserManagerTest(TestCase):
    """Tests for the custom UserManager."""

    def setUp(self):
        self.User = get_user_model()
        self.normal_user = {
            "email": "normal@user.com",
            "password": "A_very_secure_password",
        }
        self.superuser = {
            "email": "super@user.com",
            "password": "A_very_secure_password",
        }

        return super().setUp()

    def test_unique_identifier(self):
        """Attempt to use same email twice."""
        user_creation_kwargs = {
            "email": "willBeAttemptedTwice@user.com",
            "password": "A_very_secure_password",
        }

        self.User.objects.create_user(**user_creation_kwargs)
        with self.assertRaises(IntegrityError):
            self.User.objects.create_user(**user_creation_kwargs)

    def test_vaild_user_creation(self):
        """Attempt valid user creation."""
        new_user = self.User.objects.create_user(**self.normal_user)

        self.assertIsNone(new_user.username)
        self.assertEqual(new_user.email, self.normal_user["email"])
        self.assertTrue(new_user.is_active)
        self.assertFalse(new_user.is_staff)
        self.assertFalse(new_user.is_superuser)

    def test_user_creation_fail_with_no_arguments(self):
        """Attempt to create user without any information."""
        with self.assertRaises(TypeError):
            self.User.objects.create_user()

    def test_user_creation_fail_with_empty_string_email(self):
        """Appempt to create user with an empty string as email."""
        with self.assertRaises(TypeError):
            self.User.objects.create_user(email="")
        with self.assertRaises(ValueError):
            self.User.objects.create_user(
                email="", password=self.normal_user["password"]
            )

    def test_valid_superuser_creation(self):
        """Attempt valid superuser creation."""
        new_superuser = self.User.objects.create_superuser(**self.superuser)

        self.assertIsNone(new_superuser.username)
        self.assertEqual(new_superuser.email, self.superuser["email"])
        self.assertTrue(new_superuser.is_active)
        self.assertTrue(new_superuser.is_staff)
        self.assertTrue(new_superuser.is_superuser)

    def test_superuser_creation_must_set_is_superuser_to_true(self):
        """Attempt to create superuser with `is_superuser` set to `False`."""
        with self.assertRaises(ValueError):
            self.User.objects.create_superuser(is_superuser=False, **self.superuser)
