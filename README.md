# OpenAPI Documentation

[scalar](https://registry.scalar.com/@algo/apis/algovictory-api@latest)

# Payments

Test stripe

```bash
stripe listen --forward-to 127.0.0.1:8000/payments/stripe-webhook/
```

```bash
stripe trigger payment_intent.succeeded
```
