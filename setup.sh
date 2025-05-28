#!/bin/bash

# 🗳️ Decentralized Voting System Setup Script
# This script helps you set up the entire voting system quickly

echo "🗳️  Setting up Decentralized Voting System..."
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
npm install

# Install Truffle globally if not already installed
if ! command -v truffle &> /dev/null; then
    echo "📦 Installing Truffle globally..."
    npm install -g truffle
else
    echo "✅ Truffle already installed: $(truffle version | head -1)"
fi

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your Ganache settings."
else
    echo "✅ .env file already exists."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. 📥 Download and start Ganache from https://trufflesuite.com/ganache/"
echo "2. 🔧 Edit .env file with your Ganache private key"
echo "3. 🚀 Run: npm run compile"
echo "4. 🚀 Run: npm run migrate"
echo "5. 🌐 Run: cd frontend && npm run dev"
echo "6. 🦊 Configure MetaMask with Ganache network"
echo ""
echo "📖 See README.md for detailed instructions!"
