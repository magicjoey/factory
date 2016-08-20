"""factory URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from show import views


urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^index/', views.index),
    url(r'^input/', views.input),
    url(r'^output/', views.output),
    url(r'^process/', views.process),
    url(r'^progress/', views.progress),
    url(r'^query/', views.query),
    url(r'^recall/', views.recall),
    url(r'^auth_list/', views.auth_list),
    url(r'^auth_menu/', views.auth_menu),
    url(r'^auth_mine/', views.auth_mine),
    url(r'^auth_role/', views.auth_role),
    url(r'^auth_user/', views.auth_user),
    url(r'^auth_ajaxAdd/', views.auth_ajaxAdd),
    url(r'^auth_ajaxAddMenu/', views.auth_ajaxAddMenu),
    url(r'^auth_ajaxDelMenu/', views.auth_ajaxDelMenu),
    url(r'^auth_ajaxAddRole/', views.auth_ajaxAddRole),
    url(r'^auth_ajaxDelRole/', views.auth_ajaxDelRole),
    url(r'^auth_ajaxAllotRolePrivilege/', views.auth_ajaxAllotRolePrivilege),
    url(r'^auth_ajaxAddUser/', views.auth_ajaxAddUser),
    url(r'^auth_ajaxAllotUserRole/', views.auth_ajaxAllotUserRole),
    url(r'^login/', views.login),
    url(r'^profile/', views.profile),
    url(r'^password/', views.password),
]
