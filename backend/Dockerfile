# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias e instálalas
COPY package*.json ./
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto que usa la aplicación
EXPOSE 5000

# Comando para iniciar la aplicación
CMD ["npm", "start"]