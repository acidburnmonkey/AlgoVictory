#!/bin/bash

setsid chromium-browser --use-gl=desktop --profile-directory='Default' "http://localhost:8000/" > /dev/null 2>&1 < /dev/null &
setsid  firefox -p 'devfox'  > /dev/null 2>&1  < /dev/null &

# tmux new-window -c frontend 'npm run dev'

tmux send-keys "source .venv/bin/activate && python3 manage.py runserver" C-m
tmux split-window -h "cd frontend && npm run dev"
