# Étape 1 : Construction de l'application
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des fichiers de configuration des dépendances
COPY package*.json ./

# Installation des dépendances (y compris de développement pour le build)
RUN npm ci

# Copie du reste du code source
COPY . .

# Build du frontend (Vite) et compilation du backend (esbuild)
RUN npm run build

# Étape 2 : Image d'exécution de production
FROM node:20-alpine

WORKDIR /app

# Copie des fichiers package.json et package-lock.json pour installer les dépendances de production uniquement
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Installation des dépendances de production uniquement pour optimiser la taille de l'image
RUN npm ci --only=production

# Exposition du port requis (3000 pour notre reverse proxy et ingress)
EXPOSE 3000

# Configuration des variables d'environnement de production
ENV NODE_ENV=production
ENV PORT=3000

# Démarrage de l'application full-stack
CMD ["npm", "start"]
