import os

from django.shortcuts import render
from django.http import HttpResponse
from django.views import View

class RegisterView(View):

    def get(self, request):
        template_path = os.path.abspath(os.path.join(os.path.abspath(__file__), '..', 'templates', 'register.html'))    # this expression gets absolute path to register.html file
        with open(template_path, 'r') as f:
            return HttpResponse(f.read())