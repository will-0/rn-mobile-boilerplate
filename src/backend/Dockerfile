# Use the official Python image from Docker Hub
FROM python:3.12

# Poetry environment settings
ENV POETRY_VERSION=1.8

# See https://python-poetry.org/docs/#ci-recommendations
RUN pip install "poetry==${POETRY_VERSION}"

# Set working directory inside the container
WORKDIR /app 

# Copy only pyproject.toml and poetry.lock for dependency installation
COPY ./pyproject.toml /app/pyproject.toml

# Install dependencies in development mode
RUN poetry install --no-root

# Copy the backend application code
COPY . /app/

CMD ["poetry", "run", "python", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "80"]

