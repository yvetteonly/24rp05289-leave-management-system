# Leave Management System

A modern leave management system built with Node.js, featuring microservices architecture, Docker containerization, and Kubernetes deployment.

## Overview

This system helps organizations manage employee leave requests efficiently. It provides a secure backend API for handling leave applications, user authentication, and leave status tracking.

## Features

- User authentication and authorization
- Leave request submission and tracking
- Multiple service architecture (backend + microservice)
- Containerized deployment with Docker
- Kubernetes orchestration
- Automated CI/CD pipeline with Jenkins

## Prerequisites

- Node.js (v14 or higher)
- Docker
- Kubernetes cluster
- SQLite (for development)

## Quick Start

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd leave-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the variables as needed

4. Start the application:
   ```bash
   npm start
   ```

### Using Docker Compose

1. Build and run the containers:
   ```bash
   docker-compose up --build
   ```

The application will be available at `http://localhost:3000`

## Deployment

### Kubernetes Deployment

1. Apply the Kubernetes configurations:
   ```bash
   kubectl apply -f k8s/nginx-ingress.yaml
   kubectl apply -f k8s/backend-deployment.yaml
   kubectl apply -f k8s/microservice-deployment.yaml
   ```

2. Verify the deployments:
   ```bash
   kubectl get pods
   kubectl get services
   ```

### CI/CD Pipeline

The project includes a Jenkins pipeline that automates:
- Code checkout
- Dependency installation
- Testing
- Code linting
- Docker image building
- Kubernetes deployment

The pipeline configuration is available in `jenkins/Jenkinsfile`.

## Project Structure

```
├── src/
│   ├── config/         # Configuration files
│   ├── middleware/     # Custom middleware
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   └── scripts/        # Utility scripts
├── k8s/                # Kubernetes configurations
├── jenkins/           # Jenkins pipeline
└── docker-compose.yml # Docker composition
```

## Development

### Running Tests

```bash
npm run test
```

### Linting

```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

