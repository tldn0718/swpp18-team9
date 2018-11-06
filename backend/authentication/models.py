from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class AccountManager(BaseUserManager):
	def create_user(self, email, first_name, last_name, password=None):
		if not email:
			raise ValueError('Users must have an email address')
		user = self.model(
			email=self.normalize_email(email),
			first_name = first_name,
			last_name = last_name,
		)

		user.set_password(password)
		user.save(using=self._db)
		return user
	def create_superuser(self, email, first_name, last_name, password):
		user = self.create_user(
			email,
			password=password,
			first_name = first_name,
			last_name = last_name,
		)
		user.is_admin = True
		user.save(using=self._db)
		return user

class Account(AbstractBaseUser):
	email = models.EmailField(verbose_name='email address', max_length=255, unique=True)
	first_name = models.CharField(max_length=40, blank=True)
	last_name = models.CharField(max_length=40, blank=True)
	is_admin = models.BooleanField(default=False)

	objects = AccountManager()

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['first_name', 'last_name']