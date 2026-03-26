# API Documentation

## Base URL

Development: `http://localhost:5000/api`
Production: `https://api.edtech-platform.com/api`

## Authentication

All endpoints require JWT token in Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### POST /auth/login
Login with credentials

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Learning

#### GET /learn/paths
Get all learning paths

#### GET /learn/paths/:pathId
Get specific learning path

#### GET /learn/paths/:pathId/courses
Get courses in a learning path

### Quiz

#### GET /quiz
Get all quizzes

#### POST /quiz/:quizId/submit
Submit quiz answers

#### GET /quiz/:quizId/results
Get quiz results

### Hackathon

#### GET /hackathon
Get all hackathons

#### POST /hackathon/:hackathonId/submit
Submit hackathon project

#### GET /hackathon/:hackathonId/leaderboard
Get hackathon leaderboard

### Jobs

#### GET /jobs
Get all job listings

#### POST /jobs/:jobId/apply
Apply for a job

#### GET /jobs/applications
Get user's applications

### Interview

#### GET /interview/sessions
Get interview sessions

#### POST /interview/sessions/:sessionId/submit-response
Submit interview response

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Not authorized to access this resource"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

- API calls are limited to 100 requests per minute per user
- Limit headers are returned in each response:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Pagination

List endpoints support pagination:

```
GET /resource?page=1&limit=20
```

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

## WebSocket Events

Connected to the platform at `http://localhost:5000/socket.io`

### Quiz Events
- `quiz:start` - Start quiz session
- `quiz:submit-answer` - Submit answer
- `quiz:finish` - Finish quiz

### Hackathon Events
- `hackathon:submit` - Submit solution
- `hackathon:update-leaderboard` - Leaderboard update

### Interview Events
- `interview:start` - Start interview session
- `interview:response` - Submit response
