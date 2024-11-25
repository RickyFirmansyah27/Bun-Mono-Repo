# Gunakan base image
FROM debian:latest

# Set working directory
WORKDIR /app

# Salin semua file aplikasi
COPY . /app

# Salin file vector dan konfigurasinya
COPY vector/config/vector.yaml /app/metrics/vector/config/
COPY vector/bin/vector.exe /app/metrics/vector/bin/vector.exe

# Berikan izin eksekusi untuk binary vector
RUN chmod +x /app/metrics/vector/bin/vector.exe

# Set entry point
ENTRYPOINT ["/app/metrics/vector/bin/vector.exe"]
