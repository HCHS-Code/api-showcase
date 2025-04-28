FROM node:20-slim
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*
EXPOSE 4321
CMD ["npm", "run", "dev"]