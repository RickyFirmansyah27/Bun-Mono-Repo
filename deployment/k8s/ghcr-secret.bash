kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=rickyfirmansyah27 \
  --docker-password="${GHCR_TOKEN}" \
