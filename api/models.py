from django.db import models
from django.contrib.auth.models import  AbstractUser

class User(AbstractUser):
    email = models.EmailField(unique=True)


class Note(models.Model):
    title = models.CharField(max_length=100)
    content_type = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')

    def __str__(self):
        return self.title
