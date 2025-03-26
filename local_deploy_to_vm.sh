#!/bin/bash

# Set your VM details
VM_USER="username"                        # e.g., "azureuser"
VM_IP="xx.xx.xx.xx"                       # e.g., "123.456.789.10"
VM_SSH_KEY_PATH="~/.ssh/vm_key.pem"       # Path to private SSH key

# Export the environment variable to be used by FastAPI
export ENV="prod"

# Set app repository in the VM
REPO_DIR="/home/$VM_USER/todo-list" # Replace with your app directory on the VM

# SSH into the VM and deploy
ssh -i $VM_SSH_KEY_PATH $VM_USER@$VM_IP << EOF
  echo "Pulling latest code from GitHub..."
  cd $REPO_DIR || exit
  git pull origin master || exit

  echo "Stopping existing Docker containers..."
  docker-compose down || exit

  echo "Building and restarting Docker containers..."
  cp .env.prod .env || exit
  docker-compose up -d --build || exit

  echo "Deployment complete!"
EOF

echo "Deployment script finished!"
