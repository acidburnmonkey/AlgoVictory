import os

import resend
from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter

from .dev import FRONTEND_URL, get_logger

logger = get_logger(__name__)

resend.api_key = os.getenv("RESEND_API_KEY")


class AllauthAdapter(DefaultAccountAdapter):
    def send_mail(self, template_prefix, email, context):
        if 'password_reset_key' not in template_prefix:
            return super().send_mail(template_prefix, email, context)

        key = context.get('key', '')
        uid = context.get('uid', '')
        reset_url = f"{FRONTEND_URL}/reset-password/{uid}&{key}"

        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">AlgoVictory Password Reset</h2>
            <p>We received a request to reset your password.</p>
            <p>
                <a href="{reset_url}"
                   style="background-color: #4CAF50; color: white; padding: 12px 24px;
                          text-decoration: none; border-radius: 4px; display: inline-block;">
                    Reset My Password
                </a>
            </p>
            <p style="color: #666; font-size: 14px;">
                If you didn't request this, you can safely ignore this email.
            </p>
            <p style="color: #666; font-size: 14px;">
                This link will expire in 24 hours.
            </p>
            <br>
            <p>— The AlgoVictory Team</p>
        </div>
        """

        try:
            resend.Emails.send(
                {
                    "from": "noreply@algovictory.com",
                    "to": email,
                    "subject": "AlgoVictory - Reset Your Password",
                    "html": html_content,
                }
            )
            logger.debug("Password reset email sent")
        except Exception as e:
            logger.critical(f"Failed to send reset email: {e}")


class SocialAccountAdapter(DefaultSocialAccountAdapter):
    def populate_username(self, request, sociallogin):
        from django.contrib.auth import get_user_model

        User = get_user_model()

        user = sociallogin.user
        if user.username:
            return

        base = (user.email or '').split('@')[0] or 'user'
        username = base
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base}{counter}"
            counter += 1
        user.username = username
