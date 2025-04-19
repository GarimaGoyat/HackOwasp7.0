#!/bin/bash

echo "======================================================"
echo "🛍️  Blinket Gap Filler - Setup and Startup Script  🛍️"
echo "======================================================"

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for required tools
echo "✅ Checking required tools..."

if ! command_exists go; then
  echo "❌ Error: Go is not installed. Please install Go first."
  echo "   Visit https://golang.org/doc/install for installation instructions."
  exit 1
fi

if ! command_exists npm; then
  echo "❌ Error: npm is not installed. Please install Node.js and npm first."
  echo "   Visit https://nodejs.org/ for installation instructions."
  exit 1
fi

# Setup backend
echo -e "\n🔧 Setting up backend..."
cd backend || { echo "❌ Error: backend directory not found!"; exit 1; }

echo "   Installing Go dependencies..."
go mod tidy || { echo "❌ Error: Failed to install Go dependencies!"; exit 1; }

# Return to project root
cd ..

# Setup frontend
echo -e "\n🔧 Setting up frontend..."
cd frontend || { echo "❌ Error: frontend directory not found!"; exit 1; }

echo "   Installing npm packages (this may take a moment)..."
npm install || { echo "❌ Error: Failed to install npm packages!"; exit 1; }

# Check for specific essential packages
echo "   Checking for essential packages..."
if ! npm list web-vitals --silent > /dev/null 2>&1; then
  echo "   Installing missing web-vitals package..."
  npm install --save web-vitals
fi

# Return to project root
cd ..

echo -e "\n✨ Setup completed successfully!\n"

# Start services
echo "🚀 Starting services..."

# Start the backend server
echo "   Starting Go backend server..."
(cd backend && go run main.go) &
BACKEND_PID=$!

# Wait a bit for backend to initialize
echo "   Waiting for backend to initialize..."
sleep 3

# Start the frontend server
echo "   Starting React frontend server..."
(cd frontend && npm start) &
FRONTEND_PID=$!

echo -e "\n📱 Services are now running!"
echo "   - Backend: http://localhost:8080"
echo "   - Frontend: http://localhost:3000"
echo -e "\n⚠️  Press Ctrl+C to stop all services"

# Trap Ctrl+C to gracefully shut down both servers
trap 'echo -e "\n🛑 Stopping services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo "Done!"; exit 0' INT

# Wait for both processes to finish (they won't unless manually stopped)
wait