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
from sto import views_jwt
from sto import views_users
from sto import views_crm
from sto import views_transactions
from sto import views


urlpatterns = [
    url(r'^$', views.index),
    url(r'^admin/', admin.site.urls),
    url(r'^auth/$', views_jwt.auth_api),
    url(r'^dialogs/$', views.dialogs_list),
    url(r'^dialogs/(?P<pk>[0-9]+)/$', views.dialog_detail),
    url(r'^dialogs/(?P<pk>[0-9]+)/messages/$', views.messages_list),
    url(r'^dialogs/(?P<pk>[0-9]+)/messages/(?P<msg>[0-9]+)/$', views.message_detail),
    url(r'^masters/$', views_crm.masters_list),
    url(r'^masters/(?P<pk>[0-9]+)/$', views_crm.master_detail),
    url(r'^events/$', views_crm.events_list),
    url(r'^events/(?P<pk>[0-9]+)/$', views_crm.event_detail),
    url(r'^transactions/$', views_transactions.transaction_list),
    url(r'^transactions/(?P<pk>[0-9]+)/$', views_transactions.transaction_detail),
    url(r'^users/$', views_users.user_list),
    url(r'^users/(?P<pk>[0-9]+)/$', views_users.user_detail),
]
