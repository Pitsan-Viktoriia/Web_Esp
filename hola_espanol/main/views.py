import os

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views import View
from django.db.utils import IntegrityError
from django.contrib.auth import authenticate, login, logout

from .models import CustomUser, Topic, Exercise, Material
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
        

class LearningView(View):

    def get(self, request):
        template_path = os.path.abspath(os.path.join(os.path.abspath(__file__), '..', 'templates', 'learning_ua.html'))
        with open(template_path, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read())
        
class LexiconView(View):

    def get(self, request):
        template_path = os.path.abspath(os.path.join(os.path.abspath(__file__), '..', 'templates', 'lexicon_ua.html'))
        with open(template_path, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read())
        
class GrammarView(View):

    def get(self, request):
        template_path = os.path.abspath(os.path.join(os.path.abspath(__file__), '..', 'templates', 'grammar_ua.html'))
        with open(template_path, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read())
        

class TopicInfoView(View):

    def get(self, request, pk):
        try:
            requested_topic = Topic.objects.get(pk=pk)
            return JsonResponse({'id': pk,
                                'type': requested_topic.type,
                                'name': requested_topic.name})
        except Topic.DoesNotExist:
            return JsonResponse({'message': f'topic with id = {pk} not found'})
        

class AllTopicsIdView(View):

    def get(self, request):
        id_list = []
        for topic_record in Topic.objects.all().iterator():
            id_list.append(topic_record.id)
        return JsonResponse({'id_list': id_list})
    

class ExerciseInfoView(View):
    def get(self, request, pk):
        try:
            requested_exercise = Exercise.objects.get(pk=pk)
            return JsonResponse({'id': pk,
                                'type': requested_exercise.type,
                                'topic_id': requested_exercise.topic.id,
                                'content': requested_exercise.json})
        except Exercise.DoesNotExist:
            return JsonResponse({'message': f'exercise with id = {pk} not found'})
        

class ExercisesByTopicIdView(View):
    def get(self, request, pk):
        requested_topic = Topic.objects.get(pk=pk)
        id_list = []
        for exercise in requested_topic.topicOfExercise.all():
            id_list.append(exercise.id)
        return JsonResponse({'id_list': id_list})
    

class MaterialInfoView(View):
    def get(self, request, pk):
        try:
            requested_material = Material.objects.get(pk=pk)
            return JsonResponse({'id': pk,
                                'type': requested_material.type,
                                'topic_id': requested_material.topic.id,
                                'content': requested_material.json})
        except Material.DoesNotExist:
            return JsonResponse({'message': f'material with id = {pk} not found'})
        
    
class MaterialsByTopicIdView(View):
    def get(self, request, pk):
        requested_topic = Topic.objects.get(pk=pk)
        id_list = []
        for material in requested_topic.topicOfMaterial.all():
            id_list.append(material.id)
        return JsonResponse({'id_list': id_list})
    

class MaterialPageView(View):
    def get(self, request, pk):
        template_path = os.path.abspath(os.path.join(os.path.abspath(__file__), '..', 'templates', 'material_ua.html'))
        with open(template_path, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read())
        

class ExercisePageView(View):
    def get(self, request, pk):
        template_path = os.path.abspath(os.path.join(os.path.abspath(__file__), '..', 'templates', 'exercise_ua.html'))
        with open(template_path, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read())