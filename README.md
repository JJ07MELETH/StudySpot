# StudySpot Finder

A cloud-based study spot recommender for students, built with React, Flask, and OpenWeatherMap.

## Services
- **Frontend** — React app on port 3000
- **Backend** — Flask API on port 5000
- **Microservice** — Weather service on port 5001

## Running locally with Docker

1. Add your OpenWeatherMap API key to `microservice/.env`
2. Run:
```bash
   docker-compose up --build
```
3. Open http://localhost:3000

## Running without Docker

### Backend
```bash
cd backend && pip install -r requirements.txt && python app.py
```
### Microservice
```bash
cd microservice && pip install -r requirements.txt && python app.py
```
### Frontend
```bash
cd frontend && npm install && npm start
```