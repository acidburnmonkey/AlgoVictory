# OpenAPI Documentation

[scalar](https://registry.scalar.com/@algo/apis/algovictory-api@0.1.0)

# Payments

Test stripe

```bash
stripe listen --forward-to http://127.0.0.1:5173/payment/success/
```

```bash
stripe trigger payment_intent.succeeded
```
