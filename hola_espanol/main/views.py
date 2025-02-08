import os

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views import View
from django.db.utils import IntegrityError
from django.contrib.auth import authenticate, login, logout

from .models import CustomUser
from .utils import get_html_message

class RegisterView(View):

    def get(self, request):
        template_path = os.path.abspath(os.path.join(os.path.abspath(__file__), '..', 'templates', 'register_ua.html'))    # this expression gets absolute path to register.html file
        with open(template_path, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read())

    def post(self, request):
        if (request.POST.get('password1') != request.POST.get('password2')):
            return HttpResponse(get_html_message('Passwords do not match!'))
        try:
            CustomUser.objects.create_user(username=request.POST.get('username'), password=request.POST.get('password1'))
            return HttpResponse(get_html_message('User has been successfully created!'))
        except IntegrityError:      # this exception occurs when we try to create_user with username that already exists
            return HttpResponse(get_html_message('User with this username already exists!'))
        

class LoginView(View):

    def get(self, request):
        template_path = os.path.abspath(os.path.join(os.path.abspath(__file__), '..', 'templates', 'login_ua.html'))
        with open(template_path, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read())
        
    def post(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if (user is not None):
            login(request=request, user=user)
            return HttpResponse(get_html_message('Successfully logged in!'))
        else:
            return HttpResponse(get_html_message('Wrong credentials!'))
        

class LogoutView(View):

    def get(self, request):
        logout(request=request)
        return HttpResponse(get_html_message('Successfully logged out!'))
        

class HomePageView(View):

    def get(self, request):
        template_path = os.path.abspath(os.path.join(os.path.abspath(__file__), '..', 'templates', 'index_ua.html'))
        with open(template_path, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read())
        

class ProfileView(View):

    def get(self, request):
        template_path = os.path.abspath(os.path.join(os.path.abspath(__file__), '..', 'templates', 'profile_ua.html'))
        with open(template_path, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read())


class UserInfoView(View):

    def get(self, request):
        try:
            username = request.user.username
            date_joined = str(CustomUser.objects.get(username=request.user.username).date_joined).split()[0]
            return JsonResponse({'username': f'{request.user.username}',
                                'date_joined': date_joined})
        except:
            return JsonResponse({'message': 'user not found'})