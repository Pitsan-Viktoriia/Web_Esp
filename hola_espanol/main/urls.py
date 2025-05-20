from django.contrib import admin
from django.urls import path

from .views import RegisterView, LoginView, LogoutView, HomePageView, UserInfoView, ProfileView, LearningView, LexiconView, GrammarView, TopicInfoView, AllTopicsIdView, ExerciseInfoView

urlpatterns = [
    path('accounts/register/', RegisterView.as_view()),
    path('accounts/login/', LoginView.as_view()),
    path('accounts/logout/', LogoutView.as_view()),
    path('accounts/profile/', ProfileView.as_view()),
    path('info/myuser/', UserInfoView.as_view()),

    path('home/', HomePageView.as_view()),
    path('learning/', LearningView.as_view()),
    path('learning/lexicon/', LexiconView.as_view()),
    path('learning/grammar/', GrammarView.as_view()),
    path('info/topic/<int:pk>/', TopicInfoView.as_view()),
    path('info/topic/all/', AllTopicsIdView.as_view()),
    path('info/exercise/<int:pk>/', ExerciseInfoView.as_view()),
]