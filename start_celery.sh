# Enter virtual env
source pythonenv3/bin/activate

apt-get update -qq && apt-get install binutils libproj-dev gdal-bin -yqq

# go to backend folder
cd backend

# Install requirements
pip install -r requirements.txt

# starting celery beat (scheduled job) server
celery -A climateconnect_main -l INFO