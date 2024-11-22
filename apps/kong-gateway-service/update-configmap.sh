kubectl create configmap kong-config-bun --from-file=./config --dry-run=client -o yaml | kubectl apply -f -
