FROM python:3.9.13-slim

WORKDIR /Server

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5173

CMD ["python", "main.py"]