import os

from django.shortcuts import render
from django.http import HttpResponse
from django.views import View
from django.db.utils import IntegrityError
from django.contrib.auth import authenticate, login

from .models import CustomUser

class RegisterView(View):

    def get(self, request):
        template_path = os.path.abspath(os.path.join(os.path.abspath(__file__), '..', 'templates', 'register.html'))    # this expression gets absolute path to register.html file
        with open(template_path, 'r') as f:
            return HttpResponse(f.read())

    def post(self, request):
        if (request.POST.get('password1') != request.POST.get('password2')):
            return HttpResponse('Passwords do not match!')
        try:
            CustomUser.objects.create_user(username=request.POST.get('username'), password=request.POST.get('password1'))
            return HttpResponse('User has been successfully created!')
        except IntegrityError:      # this exception occurs when we try to create_user with username that already exists
            return HttpResponse('User with this username already exists!')
        

class LoginView(View):

    def get(self, request):
        template_path = os.path.abspath(os.path.join(os.path.abspath(__file__), '..', 'templates', 'login.html'))
        with open(template_path, 'r') as f:
            return HttpResponse(f.read())
        
    def post(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if (user is not None):
            login(request=request, user=user)
            return HttpResponse('Successfully logged in!')
        else:
            return HttpResponse('Wrong credentials!')
        

class HomePageView(View):

    def get(self, request):
        template_path = os.path.abspath(os.path.join(os.path.abspath(__file__), '..', 'templates', 'index.html'))
        with open(template_path, 'r') as f:
            return HttpResponse(f.read())