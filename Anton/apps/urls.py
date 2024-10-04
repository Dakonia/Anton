from django.urls import path
from .views import *

urlpatterns = [
    path('', home, name='home'),
    path('test', index, name='test'),
    path('game', game, name='game')   
]