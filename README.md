# DRS Project — Distributed Quiz Platform

Distributed quiz platform composed of a React frontend, a Flask API server, and a separate Flask-based Quiz Service.

## To install:
- pyenv (3.9)
- pipenv
- flask
- SQLAlchemy

## Tech Stack

### Frontend
- **React + TypeScript + Vite**
- Notable libraries: `axios`, `react-router-dom`, `jwt-decode`, `react-hot-toast`

### API Server
- **Python Flask**
- **SQLAlchemy** (ORM)
- **JWT authentication**
- Sends emails using **Mailjet**

### Quiz Service
- **Python Flask**
- **Flask-SQLAlchemy**
- Uses **MySQL** for persistence and **Redis** (cache)

## Authentication & Security (current implementation)

### JWT
- Login returns a JWT token that contains:
- Token is validated in protected routes using a decorator.

### Failed login lockout
- Failed login attempts are tracked in-memory.
- After **3 failed attempts**, the account is temporarily locked.
- Current lock duration is configured as **1 minute** (for testing).

### Password hashing
- Passwords are hashed using **Flask-Bcrypt**.

## Roles

Roles are stored on the `User` model and used by the `protected(required_role=...)` decorator.

## Implemented API Endpoints (API Server)

The API server (Gateway) handles user management and forwards quiz-related operations to the Quiz Service.
