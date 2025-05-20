from django.contrib import admin
from django.urls import path

from .views import RegisterView, LoginView, LogoutView, HomePageView, UserInfoView, ProfileView

urlpatterns = [
    path('accounts/register/', RegisterView.as_view()),
    path('accounts/login/', LoginView.as_view()),
    path('accounts/logout/', LogoutView.as_view()),
    path('accounts/profile/', ProfileView.as_view()),
    path('info/myuser/', UserInfoView.as_view()),

    path('home/', HomePageView.as_view()),
    path('learning/', LearningView.as_view()),
]