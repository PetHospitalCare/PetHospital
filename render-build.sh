#!/bin/bash

echo "📦 Installing frontend dependencies..."
cd ph_fe
npm install

echo "🛠️ Building frontend..."
npm run build

echo "📁 Copying frontend build to backend folder..."
rm -rf ../PH_BE/ph_fe/dist
cp -r dist ../PH_BE/ph_fe/

echo "📦 Installing backend dependencies..."
cd ../PH_BE
npm install
