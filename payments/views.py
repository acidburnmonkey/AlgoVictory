import os

import stripe
from django.contrib.auth import get_user_model
from dotenv import load_dotenv
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from api.dev import SERVER_URL, get_logger

User = get_user_model()
load_dotenv()
logger = get_logger(__name__)

stripe.api_key = os.getenv('STRIPE_SECRET')


class PayStripe(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request):

        email = request.user.email or ''  # pyright: ignore

        try:
            session = stripe.checkout.Session.create(
                customer_email=email,
                line_items=[
                    {
                        'price_data': {
                            'currency': 'usd',
                            'unit_amount': 500,
                            'product_data': {
                                'name': 'mebership',
                            },
                        },
                        'quantity': 1,
                    }
                ],
                mode='payment',
                success_url=f'{SERVER_URL}/payments/success/',
                cancel_url=f'{SERVER_URL}/payments/cancel/',
            )

            return Response({'url': session.url})

        except stripe.AuthenticationError:
            logger.critical("No API key provided for stripe")

        return Response({'error': "stripe payment failed"})


class SuccessPayment(APIView):
    permission_classes = [IsAuthenticated]
    pass


class CancelledPayment(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        return Response({'status': 'cancelled'})
