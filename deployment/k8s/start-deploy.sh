# Scale the deployment back to 1 replica
kubectl --namespace default scale deployment $(kubectl --namespace default get deployment --no-headers | awk '{print $1}') --replicas 1
