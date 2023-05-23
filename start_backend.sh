
# Install spatial dependencies
apt-get update -qq && apt-get install binutils libproj-dev gdal-bin -yqq

# Install pdm
curl -sSL https://raw.githubusercontent.com/pdm-project/pdm/main/install-pdm.py | python3 -

# Go to backend folder
cd backend

# install dependencies (no dev dependencies)
pdm install --prod

# activate venv
$(pdm venv activate)

# Start server
gunicorn --preload --bind=0.0.0.0 climateconnect_main.asgi:application -w 4 -k uvicorn.workers.UvicornWorker & celery -A climateconnect_main worker -B -l INFO