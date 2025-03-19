# Azure-Powered To-Do List Application

## Project Overview
A full-stack to-do list application with robust features, scalable architecture, and cloud-native design.

FastAPI + Next.js + PostgreSQL + Redis + Celery

## Deployment
### PaaS: Render, Railway
### Container-Based
- Docker Compose: Great for local dev, not ideal for production
- Azure Container Apps	
- IaaS: Azure VM
- Serverless Functions. No Redis support
  - FastAPI: as serverless func
  - managed DB 


## Technology Stack
### Frontend
User interacts with the React/Angular app, Makes API calls to the backend for CRUD operations.

- Framework: Next.js
- State Management: Redux or Zustand
- Data fetching and caching: React Query
- UI Library: Shadcn/UI or Chakra UI
- Styling: Tailwind CSS, Material-UI, or Bootstrap
- API Communication: Axios or Fetch API
- Deployment: Azure Static Web Apps / App services

### Backend
Handles business logic and communicates with the database, Sends notifications via Azure Service Bus or Communication Services.

- Framework: FastAPI (Python)
- Authentication
    - Azure Active Directory B2C for secure, scalable authentication (Not implemented for training)
    - OAuth2
    - JWT
- Data validation: Pydantic
- API Design: RESTful with OpenAPI/Swagger (FastAPI has built-in support)
- Dependency injection for services
- Deployment:
    - VM
    - Azure Functions
    - App Services

### Database
Stores user data, tasks, and other relevant information.

- NoSQL
    - Azure Cosmos DB (NoSQL, allows flexible schema and horizontal scaling)
    - Partition Key: User ID
    - Data Model: Task documents with metadata
- Relational SQL
    - PostgreSQL
    - Azure SQL Database. Azure Db for PostgreSQL
- ORM
    - SQLAlchemy
    - SQLModel

### Messaging/Notification Service
Sends reminders or notifications to users.

- Service
    - Azure Service Bus: For event-driven tasks like task reminders and notifications.
    - Azure notification Hub
    - Azure Communication Services: For sending emails or SMS notifications. (X)
    - WebSockets: For real-time updates.
    - Redis / RabbitMQ

### Hosting
- Azure App Service
- Azure Static web apps
- AKS (Free tier)

- Frontend
    - Azure Static web apps
    - Azure App Service
- Backend
    - Azure App Service
    - Azure Functions (serverless)

### Additional Services
- Azure Functions (Serverless Compute)
- Azure Key Vault (Secrets Management)
- Azure Application Insights (Monitoring)
- Azure API Management (API Gateway)
- Azure DevOps

## Key Features
1. User Authentication
    - Sign up, login, and logout
2. CRUD Operations for Tasks
    - Create, read, update, and delete (CRUD) tasks.
    - Mark tasks as completed.
    - Set due dates and priorities.
3. Task Categorization
4. (Optional)Search and Filter
    - Search for tasks and filter by status, priority, or due date
4. Priority and Status Tracking
5. Reminders and Notifications
    - Send reminders or notifications for upcoming tasks (e.g., via email or SMS using Azure Communication Services).
    - Scheduled notifications using Azure Functions + Service Bus
6. (Advanced)Real-Time Updates
    - Use WebSockets for real-time updates across devices


## Architecture Diagram Concept
- User interacts with React Frontend
- Frontend calls FastAPI Backend
- Backend processes requests via Cosmos DB
- Service Bus handles async messaging
- Azure AD manages authentication

## Proposed Project Structure
```
todo-app/
│
├── frontend/               # React TypeScript Project
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── redux/
│   │   └── App.tsx
│   └── package.json
│
├── backend/                # FastAPI Python Project
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── main.py
│   └── requirements.txt
│
├── infrastructure/         # Terraform/Bicep for Azure
│   ├── main.tf
│   └── variables.tf
│
└── azure-pipelines.yml     # CI/CD Configuration
```

## Development Phases
1. Project Setup
2. Basic CRUD Functionality
3. Testing and Optimization
4. Deployment
5. Advanced Features

## Estimated Effort
- Frontend: 2-3 weeks
- Backend: 2-3 weeks
- Infrastructure: 1 week
- Integration and Testing: 2 weeks


uvicorn main:app --host 0.0.0.0 --port 8000 --reload

redis-cli -h 127.0.0.1 -p 6379 ping
sudo netstat -tlnp | grep 6379

uvicorn: uvicorn main:app --workers 4
gunicorn: gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker

GUNICORN is a WSGI framework,  is not compatible with Fastapi, since Fastapi uses the ASGI standard (i.e. asynchronous). his means that Gunicorn will have to use some layer of abstraction (uvicorn.workers.UvicornWorker) in order to communicate with the asynchronous calls.

On the other hand, Uvicorn is an ASGI framework which has been developed with asynchronous in mind and can interact directly with the underlying Fastapi application.

## Optional: Celery

celery -A tasks worker --loglevel=info

celery: for background messaging

✅ Basic Messaging: Use Redis Pub/Sub.
✅ WebSockets + Redis: Real-time messaging.
✅ Background Processing: Use Celery + Redis.
✅ Docker Integration: Use Docker Compose.