#!/bin/bash

echo "================================"
echo "       Iniciando ClassFocus"
echo "================================"

cd frontend || exit 1

if [ ! -d "node_modules" ]; then
    echo ""
    echo "Instalando dependencias..."
    npm install
fi

echo ""
echo "Iniciando servidor..."
echo ""

npm run dev