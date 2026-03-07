from django.urls import path
from . import views

urlpatterns = [
    path('user-info/', views.UserInfoView.as_view(), name='user-info'),
    path('social-token/', views.SocialToken.as_view(), name='social-get-jwt'),
    path('reset-password/', views.ResetPassworView.as_view(), name='reset-password'),
]
