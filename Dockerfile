FROM python:3.14-alpine

RUN apk add --no-cache gcc musl-dev libffi-dev

COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

COPY . .

RUN mkdir -p /app/data

EXPOSE 8000

CMD ["sh", "-c", "uv run python manage.py migrate && uv run python manage.py collectstatic --noinput && uv run gunicorn divinatio.wsgi:application --bind 0.0.0.0:8000 --workers 3"]
