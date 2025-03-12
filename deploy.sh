#!/bin/bash

# Set your VM details
VM_USER="azureuser"                # e.g., "azureuser"
VM_IP="40.113.94.77"              # e.g., "123.456.789.10"
VM_SSH_KEY_PATH="~/.ssh/demo-app-vm-linux_key.pem"        # Path to your private SSH key

# Export the environment variable to be used by FastAPI
export ENV="prod"

# Set your repository and app directories
REPO_DIR="/home/azureuser/test/todo-list-app" # Replace with your app directory on the VM
# LOCAL_DIR="~/path/to/your/local/code"  # Replace with the path to your local code

# SSH into the VM and deploy
ssh -i $VM_SSH_KEY_PATH $VM_USER@$VM_IP << EOF
  echo "Pulling latest code from GitHub..."
  cd $REPO_DIR || exit
  git pull origin master || exit  # Replace with your Git branch if not 'main'

  echo "Stopping existing Docker containers..."
  docker-compose down || exit

  echo "Building and restarting Docker containers..."
  cp .env.prod .env || exit
  docker-compose up -d --build || exit

  echo "Deployment complete!"
EOF

echo "Deployment script finished!"
