import os
from dateutil.relativedelta import relativedelta
from django.utils import timezone

import stripe
from typing import cast

from api.models import User
from dotenv import load_dotenv
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from api.dev import FRONTEND_URL, STRIPE_WEBHOOK_SECRET, get_logger


load_dotenv()
logger = get_logger(__name__)

stripe.api_key = os.getenv('STRIPE_SECRET')


class PayStripe(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request):

        user = cast(User, request.user)
        email = user.email or ''

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
                metadata={"user_id": user.id},  # pyright: ignore
                success_url=f'{FRONTEND_URL}/payments/success/',
                cancel_url=f'{FRONTEND_URL}/payments/cancel/',
            )

            return Response({'url': session.url})

        except stripe.AuthenticationError:
            logger.critical("No API key provided for stripe")

        return Response({'error': "stripe payment failed"})


class StripeWebHook(APIView):
    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:

        logger.debug("Stripe Webhook triggred")

        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

        try:
            event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
        except ValueError:
            logger.error("Invalid payload from Stripe")
            return Response(status=400)
        except stripe.StripeError:
            logger.error("StripeError")
            return Response(status=400)

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            user_id = session['metadata']['user_id']

            user = User.objects.get(id=user_id)
            user.premium = True
            user.payment_date = timezone.now()
            user.payment_expires = timezone.now() + relativedelta(months=1)
            user.save(update_fields=['premium', 'payment_date', 'payment_expires'])
            logger.info(f'user {user.username} made a payment via Stripe')

        return Response(status=200)
