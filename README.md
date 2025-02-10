# The simplest Node.js Kubernetes Microservice Monitoring via Prometheus
```Disclaimer: the focus is only monitoring a kubernetes system, NOT the structure of the microservices.```
## Setup

### **Prerequisites**

Ensure you have the following installed:

- Docker
- Kubernetes (kubectl)
- Prometheus
- Node.js and npm (for development)

### **Before You Begin**  

- Replace Docker user names (e.g., "koonzte") with your own Docker Hub username in the provided files.  
- If you're using Docker Desktop for Kubernetes, ensure Kubernetes is enabled in the Docker Desktop settings.  

---

### **Step 1: Build and Push Docker Images**  

1. Pull or build Docker images for `microservice-v1` and `microservice-v2`:  

   ```bash
   docker pull koonzte/microservice-v1:latest
   docker pull koonzte/microservice-v2:latest
   ```

   OR, If you'd like to build them locally, you can use:  

   ```bash
   docker build -t <your-docker-username>/microservice-v1:latest ./microservice-v1
   docker build -t <your-docker-username>/microservice-v2:latest ./microservice-v2
   ```  

2. Push Docker images to Docker Hub (if built locally):  
   ```bash
   docker push <your-docker-username>/microservice-v1:latest  
   docker push <your-docker-username>/microservice-v2:latest  
   ```

---

### **Step 2: Deploy Kubernetes Resources**

Apply the following Kubernetes manifests:

1. **Create the Monitoring Namespace:**  
   ```bash
   kubectl create namespace monitoring  
   ```

2. Deploy `microservice-v1` and `microservice-v2`:

   ```bash
   kubectl apply -f deployment-v1.yaml
   kubectl apply -f deployment-v2.yaml
   ```

3. **Deploy Prometheus Using Helm:**  
   Add the Helm chart repository:  
   ```bash
   helm repo add prometheus-community https://prometheus-community.github.io/helm-charts  
   helm repo update  
   ```

   Deploy Prometheus with the following command:  
   ```bash
   helm install prometheus prometheus-community/prometheus -n monitoring --create-namespace  
   ```

4. (Optional):: Deploy Prometheus configuration:

   ```bash
   kubectl apply -f prometheus-config.yaml
   kubectl apply -f prometheus-deployment.yaml
   kubectl apply -f prometheus-rbac.yaml
   ```

5. **Verify All Pods Are Running:**  
   ```bash
   kubectl get pods -n monitoring
   ```

6. Expose services:
   ```bash
   kubectl apply -f service-v1.yaml
   kubectl apply -f service-v2.yaml
   kubectl apply -f prometheus-service.yaml
   ```

---

### **Step 3: Start Prometheus**

Forward the Prometheus port to access the Prometheus UI locally:

```bash
kubectl port-forward -n monitoring deployment/prometheus-server 9090:9090
```

---

### **Step 4: Verify Prometheus**

1. Open the Prometheus UI:

   - [http://localhost:9090](http://localhost:9090)

2. Check the targets:
   - [http://localhost:9090/targets?pool=kubernetes-pods&search=](http://localhost:9090/targets?pool=kubernetes-pods&search=)

3. Confirm that your `microservice-v1` and `microservice-v2` endpoints are listed under `kubernetes-pods`

---

### **Prometheus Queries**  

Use the following queries to monitor your microservices:  

1. **CPU Usage:**  
   ```promql
   sum(rate(container_cpu_usage_seconds_total{namespace="default"}[5m])) by (pod)
   ```

2. **Memory Usage:**  
   ```promql
   sum(container_memory_usage_bytes{namespace="default"}) by (pod)
   ```

---
### **Example Usage**
![Nov-16-2024 21-43-16](https://github.com/user-attachments/assets/3068a8ff-8909-4563-87c5-d47c76977054)

---
### **Troubleshooting**  

1. **Check Helm Installation:**  
   If Prometheus fails to deploy, verify the Helm installation:  
   ```bash
   helm list -n monitoring  
   ```

2. **Inspect Prometheus Pods:**  
   Check the logs of the Prometheus pods to troubleshoot issues:  
   ```bash
   kubectl logs -n monitoring deployment/prometheus-server  
   ```

3. **Node Exporter Issues:**  
   If the Node Exporter is in `CrashLoopBackOff`, inspect its logs:  
   ```bash
   kubectl logs -n monitoring daemonset/prometheus-prometheus-node-exporter  
   ```

4. **Verify Microservices Metrics Endpoint:**  
   Ensure `/metrics` endpoints of `microservice-v1` and `microservice-v2` are accessible:  
   ```bash
   curl http://<service-ip>:<service-port>/metrics  
   ```

5. **Port Forwarding Issues:**  
   If you cannot forward the Prometheus port, confirm the correct deployment name:  
   ```bash
   kubectl get deployments -n monitoring  
   ```

6. **Update Context:**  
   Ensure you are using the correct Kubernetes context:  
   ```bash
   kubectl config current-context  
   ```

---

Enjoy monitoring your microservices with Prometheus 🎉!
