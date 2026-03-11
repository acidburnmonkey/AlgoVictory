from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode


encoded = urlsafe_base64_encode('xoxoxo'.encode())
print('encoded:', encoded)

try:
    decoded = urlsafe_base64_decode(encoded).decode()
    print('decoded:', decoded)

except ValueError:
    print('val err')
