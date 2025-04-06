# To-Do List

## Project Overview
A simple to-do list app serving as a training project for implementing containerization and cloud deployment strategies.

### Features
- Basic operations for tasks
- Simple UI for demonstration purposes
- RESTful API endpoints
- Containerized setup for practicing Docker concepts
- Cloud services implementation for practicing Azure services

### Technology Stack

#### Frontend
- Framework: Next.js
- Styling: Tailwind CSS
- API Communication: Axios

#### Backend
- Option 1
  - Framework: FastAPI (Python)
  - Data validation: Pydantic
  - API Design: RESTful API
- Option 2 (`backend_azure_func_app_with_azure_table` branch)
  - Azure Function Apps

#### Database
Options
- PostgreSQL for data persistence. Managed through Docker container
- Azure Table Storage as cloud solution
  
#### Others
- Nginx for reverse Proxy for dockerization solution

## Development

### Development with Docker

1. **Development Environment Setup**
   ```bash
   # Environment variables for development. Required for both frontend and backend services
   cp .env .env.dev
   # nginx Configuration for development
   cp nginx.conf nginx.dev.conf
   ```

2. **Running the Development Environment**
   ```bash
   # Start all services
   docker-compose -f docker-compose.dev.yml up --build

   # Stop all services
   docker-compose -f docker-compose.dev.yml down

   # View logs for specific service
   docker-compose -f docker-compose.dev.yml logs -f <service_name>
   ```
   - Frontend accessible at `http://localhost`
   - Backend API accessible at `http://localhost/api/`
   - PostgreSQL accessible at `localhost:5432`

3. **Development Commands**
   ```bash
   # Access frontend container shell
   docker exec -it frontend sh
   ```

   ```bash
   # Access backend container shell
   docker exec -it backend sh
   ```

   ```bash
   # View backend logs
   docker-compose -f docker-compose.dev.yml logs -f backend
   ```

   ```bash
   # Access PostgreSQL container
   docker exec -it postgres psql -U postgres

   # List databases
   \l

   # Connect to todo_db
   \c todo_db

   # List tables
   \dt
   ```

## Azure Deployment

### Azure VM
Master branch focuses on Docker containerization and local development.

- Options of Azure VM deployment:
  - via `local_deploy_to_vm.sh`
  - GitHub Actions `cd-container-apps-azure-vm.yml`

#### Azure VM Deployment Workflow
<p align="center">
  <img src="assets/azure_vm_workflow.png" alt="Azure VM Deployment Workflow Diagram" />
</p>

#### Containerized Application Architecture
<p align="center">
  <img src="assets/container_app_architecture.png" alt="Containerized Application Architecture Diagram" />
</p>



### Other Azure Cloud Services
Azure-specific branches explore different Azure deployment strategies with Azure table storage as the database.

- Frontend
  - `.github/workflows/cd-frontend-azure-static-web-apps.yml` takes actions to deploy the frontend to Azure Static Web App service. the backend base API `NEXT_PUBLIC_API_URL` is store as GitHub secrets.

- Backend
  - `backend_azure_web_app_with_azure_table` branch: `.github/workflows/cd-backend-azure-web-app.yml` takes actions to deploy the backend to Azure App Service Web Apps.
  - `backend_azure_func_app_with_azure_table` branch: Backend is built with Azure Function Apps. `.github/workflows/cd-backend-azure-func-app.yml` takes actions to deploy the function app to Azure cloud.
  - The branches also contain the implementations of Azure Service Bus (sending scheduled messages) and AI chatbox built with Azure AI Service.

#### Azure Cloud Solution Architecture
<p align="center">
  <img src="assets/cloud_solution_architecture.png" alt="Cloud Solution Architecture Diagram" />
</p>

## Other Deployments

### Deploying FastAPI backend to Render
Add new `Web Service` instance from `Render` dashboard:
   1. **Connect to the GitHub repository**
   2. Configure the following settings:
      - **Name**: Choose a name for your service
      - **Project** (Optional): Create/Add to a project
      - **Language**: Choose `Docker`
      - **Branch**: Select the branch to deploy (usually master)
      - **Region**: Select your preferred region
      - **Root Directory**: `./backend`
   3. Add **Environment Variables**:
      - `ENV`: `prod` for production
      - `DATABASE_URL`: PostgreSQL URL. If using Render PostgreSQL instance, create one as the 2nd step and then add `Internal Database URL` value
      - `ALLOW_ORIGINS`: Any allowed origins as needed, e.g., `['*']`

      Environment variables also could be set in `.env` file and import at a time.

### Create PostgreSQL database in Render
   Add new `Postgres` service from `Render` dashboard. 

   Configure the following settings:
   - **Name**: Choose a name for the db
   - **Project** (Optional): Add to the same project as the backend
   - **Database**: `todo_db`
   - **User**: `dbuser`
   - **Region**: Select your preferred region

### Deploying Next.js frontend to Vercel
Add new `project`
1. Import the Git repository
2. Configure the following settings:
   1. **Project Name**: Give a name for the frontend
   2. **Root Directory**: Choose `frontend`
   3. **Framework Preset**: Choose `Next.js`
   4. **Environment Variables**
      - `NEXT_PUBLIC_API_URL`: backend URL (e.g., from web service deployed to Render)
   5. Click **Deploy**