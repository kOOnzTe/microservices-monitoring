# Simple Node.js Kubernetes Microservice Monitoring via Prometheus

## Setup

### **Prerequisites**

Ensure you have the following installed:

- Docker
- Kubernetes (kubectl)
- Prometheus
- Node.js and npm (for development)

### **Before You Begin**

- Replace Docker user names (e.g., "koonzte") with your own Docker Hub username in the provided files.

---

### **Step 1: Build and Push Docker Images**

1. Build Docker images for `microservice-v1` and `microservice-v2`:

   ```bash
   docker build -t <your-docker-username>/microservice-v1:latest .
   docker build -t <your-docker-username>/microservice-v2:latest .
   ```

2. Push Docker images to Docker Hub:
   ```bash
   docker push <your-docker-username>/microservice-v1:latest
   docker push <your-docker-username>/microservice-v2:latest
   ```

---

### **Step 2: Deploy Kubernetes Resources**

Apply the following Kubernetes manifests in order:

1. Deploy `microservice-v1` and `microservice-v2`:

   ```bash
   kubectl apply -f deployment-v1.yaml
   kubectl apply -f deployment-v2.yaml
   ```

2. Deploy Prometheus configuration:

   ```bash
   kubectl apply -f prometheus-config.yaml
   kubectl apply -f prometheus-deployment.yaml
   kubectl apply -f prometheus-rbac.yaml
   ```

3. Expose services:
   ```bash
   kubectl apply -f service-v1.yaml
   kubectl apply -f service-v2.yaml
   kubectl apply -f prometheus-service.yaml
   ```

---

### **Step 3: Start Prometheus**

Forward the Prometheus port to access the Prometheus UI locally:

```bash
kubectl port-forward deployment/prometheus-server 9090:9090
```

---

### **Step 4: Verify Prometheus**

1. Open the Prometheus UI:

   - [http://localhost:9090](http://localhost:9090)

2. Check the targets:
   - [http://localhost:9090/targets?pool=kubernetes-pods&search=](http://localhost:9090/targets?pool=kubernetes-pods&search=)

---

### **Prometheus Queries**

Use the following queries to monitor your microservices:

1. **CPU Usage**:

   ```promql
   sum(rate(container_cpu_usage_seconds_total{namespace="default"}[5m])) by (pod)
   ```

2. **Memory Usage**:
   ```promql
   sum(container_memory_usage_bytes{namespace="default"}) by (pod)
   ```

---
### **Example Usage**
![Nov-16-2024 21-43-16](https://github.com/user-attachments/assets/3068a8ff-8909-4563-87c5-d47c76977054)

---
### **Troubleshooting**

If you encounter issues:

1. Verify the Prometheus configuration file syntax.
2. Check logs for any errors in the Prometheus pod:

   ```bash
   kubectl logs deployment/prometheus-server
   ```

3. Ensure your microservices are correctly exposing `/metrics` endpoints:

   ```bash
   curl http://<service-ip>:<service-port>/metrics
   ```

4. Confirm Kubernetes annotations are set for scraping Prometheus metrics.

---

Enjoy monitoring your microservices with Prometheus!
