from django.utils.http import base36_to_int, int_to_base36, urlsafe_base64_decode, urlsafe_base64_encode


def main():

    encoded = urlsafe_base64_encode('NQ'.encode())
    print('encoded:', encoded)

    try:
        decoded = urlsafe_base64_decode(encoded).decode()
        print('decoded:', decoded)

    except ValueError:
        print('val err')

    base36_encoded = int_to_base36(12)
    print('base36_encoded:', base36_encoded)

    base36_decoded = base36_to_int('c')
    print('base36_decoded:', base36_decoded)


if __name__ == '__main__':
    main()
