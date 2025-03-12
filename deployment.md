# Deployment

## Docker Compose: Deploy your app locally or on a single server.

### Set Up Your Azure VM
```bash
# 1. create a VM with SSH keys
az login  # Login to Azure
az group create --name myResourceGroup --location eastus
az vm create \
    --resource-group myResourceGroup \
    --name myDockerVM \
    --image Ubuntu2204 \
    --admin-username azureuser \
    --generate-ssh-keys \
    --size Standard_B1s

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

### Run the Docker Containers
```bash
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

### Use an Azure Public DNS Name
Azure allows you to assign a DNS name to your VM without buying a domain. https://learn.microsoft.com/en-us/azure/virtual-machines/custom-domain

Steps:

- vm -> DNS name / custom domain?
- Or vm-ip -> Configuration -> DNS name label

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

### Optional: Secure with SSL
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
### Try azure authentication for Github Actions

#### 1. Generate Azure Credentials

**Fails** in create Service Principal: AuthorizationFailed

> The client 'qianqian.qin@janijarvinenintertechno.onmicrosoft.com' with object id '875e83ac-71e7-4b91-8b4c-911805c1775c' does not have authorization to perform action 'Microsoft.Authorization/roleAssignments/write' over scope '/subscriptions/d7a19591-07c4-4235-a5c8-ba15f47f5b3e/resourceGroups/rg-azuretraining-qianqian/providers/Microsoft.Authorization/roleAssignments/36b16ac7-efd2-40ca-91a9-f9aaf87917cd' or the scope is invalid. If access was recently granted, please refresh your credentials.

CI/CD pipeline in GitHub may not work

#### 2. Add AZURE_CREDENTIALS to GitHub Secrets

Settings → Secrets and variables → Actions -> New repository secret -> AZURE_CREDENTIALS -> entire JSON output from Azure output

#### 3.Use AZURE_CREDENTIALS in GitHub Actions
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

#### 4. Try Azure DevOps PAT for Github Actions
- Azure DevOps setup GitHub connection
- Azure DevOps config PAT: github-deploy: 43Cg7plKmFKv1UOaDDSz80KRuR6q7Ct1w9Ve1pWiGXn6JZoCJwlvJQQJ99BCACAAAAAovqbIAAASAZDO1X40
- `.github/workflows/ci-azure.yml`: failed to login

Info:
 - https://learn.microsoft.com/en-us/azure/developer/github/github-actions

 - https://learn.microsoft.com/en-us/azure/developer/github/connect-from-azure

**Conclusion**: No permission to create service principal then might be impossible to
login azure from github actions

#### 4. Azure DevOps

- Azure DevOps setup GitHub connection
- Azure DevOps config PAT
github-deploy: 43Cg7plKmFKv1UOaDDSz80KRuR6q7Ct1w9Ve1pWiGXn6JZoCJwlvJQQJ99BCACAAAAAovqbIAAASAZDO1X40


#### Deploy from local env with script
- Ensure You Have SSH Access to the VM

- Make sure you have SSH access to your Azure VM. You need the public IP of the VM and the private key associated with the VM's SSH key.

- Ensure Docker & Docker Compose Are Installed on Your VM

- exec `deploy.sh`

- For local testing
    ```bash
    cp .env.dev .env
    docker compose up --build -d
    ```

##### Optional
```bash
az login

# Use Azure CLI to Execute Commands on VM
az vm run-command invoke --command-id RunShellScript \
  --name your_vm_name \
  --resource-group your_resource_group \
  --scripts "cd /path/to/your/app && git pull && docker-compose up -d --build"

```