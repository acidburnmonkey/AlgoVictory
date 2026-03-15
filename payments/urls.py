from django.urls import path

from payments.views import CancelledPayment, PayStripe, SuccessPayment

urlpatterns = [
    path('stripe-pay/', PayStripe.as_view(), name='pay with Stripe'),
    path('success/', SuccessPayment.as_view(), name='successful payment'),
    path('cancel/', CancelledPayment.as_view(), name='cancelled payment'),
]
