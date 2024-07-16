# Dockerfile
# Sử dụng một base image Node.js phiên bản 18
FROM node:18-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các dependencies cả runtime và development
RUN npm install

# Sao chép mã nguồn của ứng dụng vào container
COPY . .

# Build ứng dụng NestJS
RUN npm run build

# Expose cổng mà ứng dụng chạy trên (port mặc định của NestJS là 3000)
EXPOSE 3000

# Khởi chạy ứng dụng khi container được khởi động
CMD ["node", "dist/main"]
