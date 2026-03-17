from django.urls import path

from payments.views import PayStripe, StripeWebHook

urlpatterns = [
    path('stripe-pay/', PayStripe.as_view(), name='pay with Stripe'),
    path('stripe-webhook/', StripeWebHook.as_view(), name='processed stripe-webhook'),
]
