# Azure Deployment Notes

## Docker Compose: Deploy your app locally or on a single server.

### Set Up Your Azure VM
```bash
# 1. create a VM with SSH keys
az login  # Login to Azure
# az group create --name myResourceGroup --location eastus
# az vm create \
#     --resource-group myResourceGroup \
#     --name myDockerVM \
#     --image Ubuntu2204 \
#     --admin-username azureuser \
#     --generate-ssh-keys \
#     --size Standard_B1s

# Allow inbound traffic on ports
# 80 (HTTP)
# 443 (HTTPS) if using SSL
# 3000 (if running Next.js separately)
# 8000 (if running FastAPI separately)
# 5432 (only if you need remote DB access)
az vm open-port --resource-group myResourceGroup --name myDockerVM --port 3000 --priority 1001
az vm open-port --resource-group myResourceGroup --name myDockerVM --port 8000 --priority 1002
az vm open-port --resource-group myResourceGroup --name myDockerVM --port 5432 --priority 1003

# check vm ip
az vm list-ip-addresses
# connect via SSH
ssh -i ~/.ssh/demo-app-vm-linux_key.pem azureuser@40.113.94.77  
```

## Install Dependencies on the VM
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io docker-compose
docker-compose --version  # Verify installation

# Enable & Start Docker
sudo systemctl enable docker
sudo systemctl start docker

# Add user to Docker group (avoid sudo for Docker)
sudo usermod -aG docker $USER
newgrp docker  # Apply changes without logout
```

### Transfer Your Project to the VM
```bash
# a SSH key may need to be gernerated in the VM and add the public key to Github to grant authentication
git clone https://github.com/yourusername/yourproject.git
cd yourproject
# Or
scp -r /path/to/yourproject azureuser@your-vm-ip:~/
```

### Use an Azure Public DNS Name
Azure allows you to assign a DNS name to your VM without buying a domain. https://learn.microsoft.com/en-us/azure/virtual-machines/custom-domain

Steps:

- VM -> DNS name / custom domain?
- Or vm-ip -> Configuration -> DNS name label

### Run the Docker Containers
```bash
# Before setup, some configs need to be updated
# Update ALLOW_ORIGINS, NEXT_PUBLIC_API_URL in .env.prod with the VM DNS name, and then
cp .env.prod .env
# Update server_name in nginx.prod.conf
# Update NEXT_PUBLIC_API_URL in frontend/Dockerfile with the VM DNS name

# Start the service
docker-compose up -d

# Stop the service
docker-compose down

# Check running
docker ps

# Debugging
docker exec -it nginx_proxy nginx -t
docker-compose logs -f
docker logs nginx_proxy

# Stop all the containers
docker stop $(docker ps -aq)
# Remove all the images
docker rmi -f $(docker images -aq)
```

### Access app
- After setting DNS name, you could access from `<domain>:3000`
- Frontend: `http://<your-vm-ip>:3000` / `<domain>:3000`
- Backend: `http://<your-vm-ip>/8000` / `<domain>:8000`
- PostgreSQL: If needed, connect using psql with `postgresql://youruser:yourpassword@<your-vm-ip>:5432/yourdb`

### Set Up a Reverse Proxy with Nginx

Nginx:
-   Reverse Proxy: It forwards client requests to backend servers (like FastAPI or Next.js).
-   Load Balancing: Distributes traffic across multiple backend servers.
-   SSL Termination: Handles HTTPS requests with SSL/TLS certificates.
-   Caching: Speeds up responses by caching static assets.
-   Security: Protects against DDoS attacks and limits access to services.
-   
In this case:
- Serve as a reverse proxy for your Next.js frontend (localhost:3000) and FastAPI backend (localhost:8000).
- Make the services accessible via standard ports (so users don’t have to enter :3000 or :8000 manually).
- Handle HTTPS traffic if you enable SSL.   

If not containerize nginx (Not tested)
```bash
sudo apt install nginx -y

# /etc/nginx/sites-available/default
server {
    listen 80;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

sudo systemctl restart nginx
```
Now, when users visit:

http://your-vm-ip/ → They see your Next.js frontend

http://your-vm-ip/api/ → Requests are forwarded to FastAPI

**Note**: Calling backend API from frontend needs to consider CORS. Backend needs to be configured

#### Optional: Secure with SSL
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
### Azure authentication for Github Actions

**Conclusion**: No permission to create service principal then might be impossible to login azure from github actions

#### Azure Credentials

**Fails** in create Service Principal with grant roles: AuthorizationFailed

Settings → Secrets and variables → Actions -> New repository secret -> AZURE_CREDENTIALS -> entire JSON output from Azure output

```yaml
- name: Login to Azure
    uses: azure/login@v1
    with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}

- name: Deploy to Azure VM
    run: |
        az vm run-command invoke --command-id RunShellScript \
        --name <VM_NAME> --resource-group <RESOURCE_GROUP> \
        --scripts "cd /your/app/directory && git pull && docker-compose up -d --build"
```

Info:
 - https://learn.microsoft.com/en-us/azure/developer/github/github-actions

 - https://learn.microsoft.com/en-us/azure/developer/github/connect-from-azure


#### Azure DevOps PAT

**Not Tested, might fail**

- Azure DevOps setup GitHub connection
- Azure DevOps config PAT

### Deploy from local env with script
- Ensure You Have SSH Access to the VM

- Make sure you have SSH access to your Azure VM. You need the public IP of the VM and the private key associated with the VM's SSH key.

- Ensure Docker & Docker Compose Are Installed on Your VM

- exec `deploy.sh`

- For local testing
    ```bash
    cp .env.dev .env
    docker compose up --build -d
    ```

### Deploy via Azure CLI
**Not tested**
```bash
az login

# Use Azure CLI to Execute Commands on VM
az vm run-command invoke --command-id RunShellScript \
  --name your_vm_name \
  --resource-group your_resource_group \
  --scripts "cd /path/to/your/app && git pull && docker-compose up -d --build"

```

### Final solution for deployment to VM via GitHub Actions

- Use `scp` to trasfer the code to the VM
- In Github, navigate to Settings > Secrets and variables > Actions to add secrets required by cicd yaml files
- `.github/workflows/cd-azure-vm.yml`
- In VM, some configs need to be set first. e.g.,
make sure the directory where the code will be deployed exists
```bash
mkdir -p /home/azureuser/app
chown azureuser:azureuser /home/azureuser/app
```
- Optional step
    ```yaml
    - name: Pull latest Docker images
    run: |
        ssh -o StrictHostKeyChecking=no ${{ secrets.AZURE_VM_USER }}@${{ secrets.AZURE_VM_IP }} "cd /home/azureuser/app && docker-compose pull"

    - name: Check Docker Compose logs
    run: |
        ssh -o StrictHostKeyChecking=no ${{ secrets.AZURE_VM_USER }}@${{ secrets.AZURE_VM_IP }} "cd /home/azureuser/app && docker-compose logs"
    ```

## Azure Container Apps (Not Tested)

- Each component (FastAPI, Next.js, PostgreSQL, Nginx) is containerized using Docker
- Push Docker Images to Azure Container Registry (ACR)
    - Create an Azure Container Registry and log in
    - Build and push the Docker images for FastAPI, Next.js, and Nginx to ACR
- Deploy to Azure Container Apps
    - Create an Azure Container Apps Environment
    - Deploy containers from images
- Azure credentials are required for Github Actions

## Azure Kubernetes Service (Not Tested) 

https://learn.microsoft.com/en-us/azure/aks/learn/quick-kubernetes-deploy-cli


- Each component (FastAPI, Next.js, PostgreSQL, Nginx) needs to be containerized using Docker.
- Push Docker Images to Azure Container Registry (ACR)
- Create an AKS Cluster
- Get AKS credentials to connect
- Create Kubernetes manifests (YAML files)
- Deploy to AKS
- Access: Get the external IP of the Nginx service: `kubectl get svc nginx`

## Static Web App for frontend

https://learn.microsoft.com/en-us/azure/static-web-apps/deploy-nextjs-hybrid

- Best for Static frontends
- Free tier available
- GitHub Actions built-in
- Set API url: GitHub repo Settings -> secret
- Monitoring
    - Monitoring -> Metrics
    - Static Web Apps Diagnostics
    - Application Insights

The Microsoft Azure Monitor Application Insights JavaScript SDK collects usage data, which allows you to monitor and analyze the performance of JavaScript web applications. 

## App Service for backend

- Free plan, but might be unstable
> Error: The requested app service plan cannot be created in the current resource group 'rg-azuretraining-qianqian' because it does not support free Linux app service plans. It has free plan for Windows app service.
- Limited Runtime stack and version

Steps
- Settings -> Configuration -> Enabling SCM
- Deployment Center -> multiple sources -> GitHub
- Download publish profile and add to github secret
- Set environment variables: Settings -> Env Var
- Settings -> Configuration -> Add startup command: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app`
- Log stream to debug deployment

Issues:
    - https://learn.microsoft.com/en-us/azure/app-service/configure-language-python#modulenotfounderror-when-app-starts

    Solution: Set SCM_DO_BUILD_DURING_DEPLOYMENT as 1, and also add required environment variables to Azure Web App

## Azure Function App for backend
✅ Pros:

✔️ No need to maintain a separate FastAPI App Service

✔️ Serverless & cost-efficient

❌ Cons:

❌ More difficult to manage complex APIs

Create a Function App in Azure.

> Application Insights code-less monitoring isn't supported with your selections of subscription, runtime stack, operating system, publish type, region, or resource group. If you want to keep these selections, you can use the Application Insights SDK to monitor your app.

> When try Cosumption plan, I got the error {"code":"InvalidTemplateDeployment","details":[{"code":"ValidationForResourceFailed","message":"Validation failed for a resource. Check 'Error.Details[0]' for more information.","details":[{"code":"LinuxDynamicWorkersNotAllowedInResourceGroup","message":"Linux dynamic workers are not available in resource group rg-azuretraining-qianqian. Use this link to learn more http://go.microsoft.com/fwlink/?LinkId=825764."}]}],"message":"The template deployment 'Microsoft.Web-FunctionApp-Portal-97a818cd-b364' is not valid according to the validation procedure. The tracking id is '1b2037ed-19b3-40ab-9d02-5d0abd0c9ace'. See inner errors for details."}. After changing to Flex Consumption plan it works

Local development
```bash
func init --python
func init MyProjFolder --worker-runtime python --model V2
func new --name ManageTask --template "HTTP trigger" --authlevel "anonymous"
# run locally
func start
# publish
func azure functionapp publish <APP_NAME>

# info
az functionapp list --resource-group rg-azuretraining-qianqian --output table
```

- API -> CORS to allow frontend requests
- Monitoring: Advior recommendations, Application Insights, .etc.
- Settings -> Environment Variables: TableName, TableStorageConnectionString
### Deployment issues

- FastAPI app deployment failure
https://stackoverflow.com/questions/77470247/python-fastapi-az-functions-working-locally-but-not-when-deployed

    Deploy the fastAPI application to Azure Function app with Consumption plan, but couldn't sync the triggers after deployment. Instead, you can deploy your FastAPI function to Function App with App Service Plan

    **Solution**: Migrate FastAPI to Azure Function App

- Github Action deployment with zip file fails when uploading and unzip
    **Solution**: Dropped

- Github Action deployment with deployment directly

    Using RBAC for authentication. Error: No credentials found. Add an Azure login action before this action. 

    >Reason: Publish profile as an authentication method is not supported when your app is hosted on Linux in a Consumption plan and the project contains an executable file, such as a custom handler, or chrome in Puppeteer/Playwright.(Source: https://github.com/Azure/functions-action?tab=readme-ov-file#workflow-templates)

    Can’t use a service principal or Managed Identity (no permission to assign roles)

    "Login With System-assigned Managed Identity" is only supported on GitHub self-hosted runners and the self-hosted runners need to be hosted by Azure virtual machines.

    No Local Git and FTP Deployment options available

**Final Solution** Local deployment

## Database
Options:
    - Azure DB for PostgreSQL (PaaS)
    - SQL Server on Azure VMs (IaaS)
    - NoSQL, e.g., CosmosDB

Considering the cost limitation, using Table Storage as db.

- Create storage account -> - create table
- Monitoring: storage account -> Monitoring


## Application Insights

Best Practices for Monitoring Multiple Apps

- Use a Single Resource for Related Apps:

    If your applications are part of the same system (e.g., microservices), use a single Application Insights resource for centralized monitoring and correlation.

- Use Separate Resources for Isolated Apps:

    If your applications are unrelated or managed by different teams, use separate Application Insights resources for isolation.

- Tag Telemetry Data:

    Use custom properties (e.g., appName, environment) to distinguish telemetry data from different apps or environments.

- Set Up Alerts:

    Configure alerts for critical metrics (e.g., response time, failure rate) for each app.

- Use Dashboards:

    Create custom dashboards in the Azure portal to visualize metrics and logs for multiple apps in one place.

- Leverage Distributed Tracing:

    Enable distributed tracing to monitor and debug interactions between services.

## Events and Messages

- No permission to create event grid, event hub
- Using Service Bus


### Service Bus

- Create Service Bus namespace: basic tier, no topic option
- Create a queue
- RBAC or connetion string
    - connection string -> Shared access policies -> RootManageSharedAccessKey
- Schedules a message to appear on Service Bus at a later time: Azure SDK for .NET. No SDK for python

## Logic App
- Consumption
- log analytics workspace enabled
- Initial idea: ->
    - new entity in table storage -> enqueue a new message to Service Bus (scheduled) -> Notification Service
    - Azure Table Storage built-in connector, which is available only for Standard workflows in single-tenant Azure Logic Apps.
- Try HTTP trigger with backend api: No trigger
- HTTP trigger -> get entity -> put in service bus queue

- Notificaiton service
    - Free tier available
    - No permission to create

## Azure AI

- Create Azure AI Service
- Azure AI Foundry to deploy a model. gpt-4o-mini
- https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety:
**Never deploy your key in client-side environments like browsers or mobile apps.**
