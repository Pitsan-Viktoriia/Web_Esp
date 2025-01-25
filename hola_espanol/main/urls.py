from django.contrib import admin
from django.urls import path

from .views import RegisterView, LoginView

urlpatterns = [
    path('accounts/register/', RegisterView.as_view()),
    path('accounts/login/', LoginView.as_view()),
]