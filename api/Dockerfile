# Dockerfile
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the FastAPI app code to the container
COPY . .

# Expose the port that FastAPI runs on
EXPOSE 4000

# Run the FastAPI app with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "4000"]
