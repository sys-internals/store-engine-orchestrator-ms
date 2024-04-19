# store-engine-orchestrator-ms

## Table of Contents
- [Description](#description)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Test](#test)
- [Docker](#docker)
  - [Image Resource Usage Metrics](#image-resource-usage-metrics)
- [Kubernetes](#kubernetes)
  - [Pod Resource Usage Metrics](#pod-resource-usage-metrics)

## Description

Store's Engine Microservice example using [Nest](https://github.com/nestjs/nest) framework.

## Installation

```bash
$ npm install
```

## Running the app
The following commands allow you to run the application

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker

```bash
# Build Docker image
docker build -t store-engine-orchestrator-ms:latest -f Dockerfile .

# Run Docker container (with example port mappings and environment variables)
docker run -p 2500:2500 -e NODE_ENV=production store-engine-orchestrator-ms:latest
```

### Image resource usage metrics

The table below shows resource usage metrics for the `store-engine-orchestrator-ms` Docker container.

| REPOSITORY                      | TAG    | IMAGE ID      | CREATED      | SIZE  |
|---------------------------------|--------|---------------|--------------|-------|
| store-engine-orchestrator-ms    | latest | 2d7fd7093928  | 2 hours ago  | 243MB |


## Kubernetes

```bash
# Start Minikube to create a local Kubernetes cluster
minikube start

# Configure the shell to use Minikube's Docker daemon
& minikube -p minikube docker-env --shell powershell | Invoke-Expression

# Build Docker image with a specific tag and Dockerfile
docker build -t store-engine-orchestrator-ms:latest -f Dockerfile .

# Apply Kubernetes configuration to create a pod
kubectl apply -f kubernetes/pod.yaml

# Port-forward to access the Kubernetes pod locally
kubectl port-forward store-engine-orchestrator-ms-pod 2500:2500
```

### Pod resource usage metrics

The table below shows resource usage metrics for the `store-engine-orchestrator-ms-pod` pod.

```bash
minikube addons enable metrics-server
kubectl top pods
```

**Note:** If you just enabled the metrics-server addon, remember to wait a couple of seconds before running the `kubectl top pods` command.


| NAME                          | CPU(cores) | MEMORY(bytes) |
|-------------------------------|------------|---------------|
| store-engine-orchestrator-ms  | 1m         | 38Mi          |
