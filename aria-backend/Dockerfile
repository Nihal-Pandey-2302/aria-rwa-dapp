# Use a lightweight Python base image
FROM python:3.11-slim

# Install system-level dependencies
RUN apt-get update && apt-get install -y \
    libzbar0 libgl1 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port (Render uses dynamic port, but expose 8080 for docs)
EXPOSE 8080

# Start the app using Gunicorn
CMD exec gunicorn app:app --bind 0.0.0.0:$PORT
