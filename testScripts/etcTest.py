from datetime import datetime
from dateutil.relativedelta import relativedelta


def time_format():
    payment_expires = datetime.now() + relativedelta(months=1)

    print(f'{payment_expires.time()} {payment_expires.date()}')
    print(f'{payment_expires.strftime("%I:%M %p on %B %d, %Y")}')


if __name__ == '__main__':
    time_format()
