terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# 1. Automatically fetch the latest Ubuntu 24.04 LTS AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
  owners = ["099720109477"] # Canonical
}

# 2. Security group — opens ports for API, SSH
resource "aws_security_group" "attrition_sg" {
  name        = "attrition-api-sg"
  description = "Allow API and SSH access for attrition prediction service"

  # SSH — for GitHub Actions deploy step
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Port 8000 — FastAPI attrition prediction API
  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound — EC2 needs internet to pull Docker image from ghcr.io
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "attrition-api-sg"
    Project = "employee-attrition-mlops"
  }
}

# 3. SSH key pair — same key from your previous project
resource "aws_key_pair" "deployer_key" {
  key_name   = "attrition-deployer-key"
  public_key = var.public_key
}

# 4. EC2 instance
resource "aws_instance" "attrition_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  key_name               = aws_key_pair.deployer_key.key_name
  vpc_security_group_ids = [aws_security_group.attrition_sg.id]

  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    delete_on_termination = true
  }

  # user_data runs once on first boot — installs Docker automatically
  # so GitHub Actions can immediately pull and run the container
  user_data = <<-EOF
    #!/bin/bash
    apt-get update -y
    apt-get install -y ca-certificates curl gnupg

    # Install Docker
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
      https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null

    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io

    # Allow ubuntu user to run docker without sudo
    usermod -aG docker ubuntu

    systemctl enable docker
    systemctl start docker
  EOF

  tags = {
    Name    = "attrition-api-server"
    Project = "employee-attrition-mlops"
  }
}

# 5. Output public IP — copy this into your EC2_HOST GitHub secret
output "ec2_public_ip" {
  value       = aws_instance.attrition_server.public_ip
  description = "Public IP of the attrition API server. Add this to GitHub secret EC2_HOST."
}