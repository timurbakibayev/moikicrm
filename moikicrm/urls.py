"""moikicrm URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from main import views_jwt
from main import views_users
from main import views


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^auth/$', views_jwt.auth_api),
    # url(r'^dialogs/$', views.dialog_list),
    # url(r'^dialogs/(?P<pk>[0-9]+)/$', views.dialog_detail),
    # url(r'^dialogs/(?P<pk>[0-9]+)/messages/$', views.messages_list),
    # url(r'^dialogs/(?P<pk>[0-9]+)/messages/(?P<msg>[0-9]+)/$', views.messages_detail),
    # url(r'^masters/$', views.master_list),
    # url(r'^masters/(?P<pk>[0-9]+)/$', views.master_detail),
    # url(r'^events/$', views.event_list),
    # url(r'^events/(?P<pk>[0-9]+)/$', views.events_detail),
    url(r'^users/$', views_users.user_list),
    url(r'^users/(?P<pk>[0-9]+)/$', views_users.user_detail),
]
