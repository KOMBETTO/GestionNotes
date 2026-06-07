# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Builder l'application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Installer serve pour servir l'app
RUN npm install -g serve

# Copier le build depuis le stage de build
COPY --from=builder /app/build ./build

# Exposer le port
EXPOSE 3000

# Variables d'environnement
ENV REACT_APP_API_URL=http://localhost:3000/api

# Commande de démarrage
CMD ["serve", "-s", "build", "-l", "3000"]
