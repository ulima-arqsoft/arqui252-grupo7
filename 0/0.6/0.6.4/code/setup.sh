#!/usr/bin/env bash
# ==============================================
# 🚀 Setup Script - Redis URL Shortener
# Instala dependencias y prepara entorno local
# ==============================================

echo "🔧 Iniciando instalación del entorno..."

# 1️⃣ Verificar Node.js
if ! command -v node &> /dev/null
then
    echo "❌ Node.js no está instalado. Descárgalo desde: https://nodejs.org/"
    exit 1
else
    echo "✅ Node.js detectado: $(node -v)"
fi

# 2️⃣ Verificar npm
if ! command -v npm &> /dev/null
then
    echo "❌ npm no está instalado. Instala Node.js con npm incluido."
    exit 1
else
    echo "✅ npm detectado: $(npm -v)"
fi

# 3️⃣ Verificar Docker
if ! command -v docker &> /dev/null
then
    echo "❌ Docker no está instalado. Descárgalo desde: https://www.docker.com/"
    exit 1
else
    echo "✅ Docker detectado: $(docker -v)"
fi

# 4️⃣ Iniciar Redis con Docker (si no existe)
if [ ! "$(docker ps -q -f name=redis-demo)" ]; then
    if [ "$(docker ps -aq -f status=exited -f name=redis-demo)" ]; then
        echo "🔁 Reiniciando contenedor Redis existente..."
        docker start redis-demo
    else
        echo "🐳 Creando contenedor Redis..."
        docker run --name redis-demo -p 6379:6379 -d redis
    fi
else
    echo "✅ Redis ya está corriendo."
fi

# 5️⃣ Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd backend || exit
npm install
cd ..

# 6️⃣ Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
cd frontend || exit
npm install
cd ..

# 7️⃣ Crear archivos .env si no existen
if [ ! -f backend/.env ]; then
    echo "🧾 Creando backend/.env..."
    cat <<EOF > backend/.env
PORT=3000
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
BASE_URL=http://localhost:3000
URL_TTL_SECONDS=604800
EOF
fi

if [ ! -f frontend/.env ]; then
    echo "🧾 Creando frontend/.env..."
    cat <<EOF > frontend/.env
VITE_API_BASE=http://localhost:3000
EOF
fi

# 8️⃣ Mostrar resumen
echo ""
echo "✅ Instalación completada con éxito."
echo "🚀 Para iniciar el backend:"
echo "   cd backend && npm run dev"
echo ""
echo "🌐 Para iniciar el frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "🐳 Redis está corriendo en localhost:6379"