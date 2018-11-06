from django.db import models
from django.contrib.auth.models import AbstractBaseUser

class Account(AbstractBaseUser):
	email = models.EmailField(verbose_name='email address', max_length=255, unique=True)
	first_name = models.CharField(max_length=40, blank=True)
	last_name = models.CharField(max_length=40, blank=True)

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['first_name', 'last_name']