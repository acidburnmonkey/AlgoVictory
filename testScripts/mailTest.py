from dotenv import load_dotenv
import os

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Category

load_dotenv()


def main():

    key = os.getenv("SENDGRID_API_KEY")

    message = Mail(
        from_email='algovictory.unify491@aleeas.com',
        to_emails='onward3@cocaine.ninja',
        subject='AlgoVictory password reset',
        html_content='<strong>and easy to do anywhere, even with Python</strong>',
    )

    message.category = Category('password reset')

    try:
        sg = SendGridAPIClient(key)
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e)


if __name__ == '__main__':
    main()
