from django.db import models
from django.contrib.auth.models import User

class CustomUser(User):
    pass

# to add new type of exercise/material you should create new table that will contain records that describe exercise/material

class Topic(models.Model):

    id = models.BigAutoField(primary_key=True, editable=False)
    type = models.CharField(max_length=255)     # grammar / lexicon
    name = models.CharField(max_length=255)

class Exercise(models.Model):

    id = models.BigAutoField(primary_key=True, editable=False)
    type = models.CharField(max_length=255)     # can be different types of exercises
    topic = models.ForeignKey(Topic, on_delete=models.DO_NOTHING)

class Material(models.Model):

    id = models.BigAutoField(primary_key=True, editable=False)
    topic = models.ForeignKey(Topic, on_delete=models.DO_NOTHING)


if __name__ == "__main__":
    pass