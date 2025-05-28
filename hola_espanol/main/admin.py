from django.contrib import admin
from .models import CustomUser, Topic, Exercise, Material

# Register your models here.

admin.site.register([CustomUser, Topic, Exercise, Material])