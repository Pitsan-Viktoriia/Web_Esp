from django.contrib import admin
from django.urls import path

from .views import RegisterView

urlpatterns = [
    path('accounts/register/', RegisterView.as_view()),
]