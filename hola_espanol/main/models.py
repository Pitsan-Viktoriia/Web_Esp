from django.db import models
from django.contrib.auth.models import User

class CustomUser(User):
    pass

# to add new type of exercise/material you should create new table that will contain records that describe exercise/material

class Topic(models.Model):

    id = models.BigAutoField(primary_key=True, editable=False)
    type = models.CharField(max_length=255)     # grammar / lexicon
    name = models.CharField(max_length=255)
    json = models.JSONField()   # all exercise needed content by type

class Exercise(models.Model):

    id = models.BigAutoField(primary_key=True, editable=False)
    type = models.CharField(max_length=255)     # can be different types of exercises
    topic = models.ForeignKey(Topic, on_delete=models.DO_NOTHING, related_name='topicOfExercise')

class Material(models.Model):

    id = models.BigAutoField(primary_key=True, editable=False)
    type = models.CharField(max_length=255)     # can be different types of materials
    topic = models.ForeignKey(Topic, on_delete=models.DO_NOTHING)
    json = models.JSONField()   # all material needed content by type


if __name__ == "__main__":
    pass