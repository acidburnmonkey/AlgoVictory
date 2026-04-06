import os

from allauth.account.adapter import DefaultAccountAdapter
from dotenv import load_dotenv
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Category, Mail

from .dev import FRONTEND_URL, get_logger

load_dotenv()
logger = get_logger(__name__)


class AllauthAdapter(DefaultAccountAdapter):
    def send_mail(self, template_prefix, email, context):
        if 'password_reset_key' not in template_prefix:
            return super().send_mail(template_prefix, email, context)

        key = context.get('key', '')
        uid = context.get('uid', '')
        reset_url = f"{FRONTEND_URL}/reset-password/{uid}&{key}"

        logger.debug(f"key : {key}")
        logger.debug(f"uid : {uid}")

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

        message = Mail(
            from_email='algovictory.unify491@aleeas.com',
            to_emails=email,
            subject='AlgoVictory - Reset Your Password',
            html_content=html_content,
        )
        message.category = Category('password reset')

        try:
            sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
            sg.send(message)
            logger.debug(" Password reset Email sent")
        except Exception as e:
            logger.critical(f"Failed to send reset email: {e}")
