# 🗳️ Decentralized Voting System

A secure, transparent voting platform built on Ethereum using Web3 technologies. This system allows users to vote for candidates using their MetaMask wallet, with all votes recorded immutably on the blockchain.

## ✨ Features

- **Smart Contract**: Solidity-based voting contract with candidate management
- **Web3 Integration**: MetaMask wallet connection and transaction signing
- **Modern React Frontend**: Built with Vite for fast development and hot reload
- **Real-time Updates**: Live vote count updates after each transaction
- **Security**: One vote per address restriction
- **Transparency**: All votes are publicly verifiable on the blockchain

## 🛠️ Technology Stack

- **Smart Contracts**: Solidity ^0.8.19
- **Frontend**: React 18 + Vite, Web3.js 4.x
- **Development**: Truffle Suite, Ganache
- **Wallet**: MetaMask integration

## 📋 Prerequisites

Before running this project, make sure you have:

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **npm** (comes with Node.js)
3. **MetaMask** browser extension - [Install here](https://metamask.io/)
4. **Ganache** for local blockchain - [Download here](https://trufflesuite.com/ganache/)
5. **Truffle** framework (will be installed globally)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install Truffle globally
npm install -g truffle
```

### 2. Set Up Local Blockchain

1. **Download and start Ganache**

   - Download from [trufflesuite.com/ganache](https://trufflesuite.com/ganache/)
   - Create a new workspace or use quickstart
   - Note the RPC server URL (usually `http://127.0.0.1:7545`)
   - Note the Chain ID (usually `1337`)

2. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file:

   ```env
   NETWORK_URL=http://127.0.0.1:7545
   PRIVATE_KEY=your_ganache_private_key_here
   ```

   > 💡 **Tip**: Copy a private key from one of the accounts in Ganache

### 3. Deploy Smart Contract

```bash
# Compile the smart contract
npm run compile

# Deploy to local network
npm run migrate

# Note the contract address from the output!
```

**Important**: Save the contract address that appears in the deployment output. You'll need it for the frontend!

### 4. Configure MetaMask

1. **Add Ganache Network to MetaMask**

   - Open MetaMask
   - Click network dropdown → "Add Network" → "Add a network manually"
   - Fill in:
     - **Network Name**: `Ganache Local`
     - **RPC URL**: `http://127.0.0.1:7545`
     - **Chain ID**: `1337` (or as shown in Ganache)
     - **Currency Symbol**: `ETH`

2. **Import Ganache Account**
   - In Ganache, click the key icon next to any account
   - Copy the private key
   - In MetaMask: Account menu → "Import Account" → paste private key

### 5. Start the Frontend

```bash
cd frontend
npm run dev
```

The application will open at `http://localhost:5173`

### 6. Use the Application

1. **Connect MetaMask** - Click "Connect MetaMask" button
2. **Enter Contract Address** - Paste the deployed contract address
3. **Vote!** - Select a candidate and cast your vote

## Smart Contract Details

### Contract Functions

- `vote(uint256 _candidateId)`: Cast a vote for a candidate
- `getAllCandidates()`: Get all candidates with their vote counts
- `getVoterStatus(address _voter)`: Check if an address has voted
- `getTotalVotes()`: Get the total number of votes cast

### Contract Events

- `VoteCast`: Emitted when a vote is cast
- `CandidateAdded`: Emitted when a candidate is added

## Testing

### Run Contract Tests

```bash
npm test
```

### Manual Testing

1. Deploy the contract to Ganache
2. Use the interaction script:
   ```bash
   npm run interact
   ```

## Deployment to Testnet

### Sepolia Testnet

1. **Get testnet ETH**

   - Visit [Sepolia Faucet](https://sepoliafaucet.com/)
   - Request test ETH for your account

2. **Configure for Sepolia**

   ```bash
   # In .env file
   MNEMONIC=your_twelve_word_mnemonic
   INFURA_PROJECT_ID=your_infura_project_id
   ```

3. **Deploy to Sepolia**
   ```bash
   npm run migrate:sepolia
   ```

## Project Structure

```
voting_system/
├── contracts/              # Solidity smart contracts
│   ├── Voting.sol          # Main voting contract
│   └── Migrations.sol      # Truffle migrations
├── migrations/             # Deployment scripts
├── scripts/                # Utility scripts
│   ├── deploy.js          # Contract deployment
│   └── interact.js        # Contract interaction examples
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── utils/         # Web3 utilities
│   │   └── App.js         # Main application
│   └── public/
├── truffle-config.js      # Truffle configuration
└── package.json           # Dependencies and scripts
```

## Troubleshooting

### Common Issues

1. **MetaMask not connecting**

   - Ensure MetaMask is installed and unlocked
   - Check that you're on the correct network
   - Refresh the page and try again

2. **Transaction failures**

   - Check that you have enough ETH for gas fees
   - Verify the contract address is correct
   - Ensure you haven't already voted

3. **Contract not found**
   - Verify the contract is deployed
   - Check the contract address is correct
   - Ensure you're on the right network

### Reset Development Environment

```bash
# Reset Truffle migrations
npm run migrate:reset

# Clear MetaMask activity data
# MetaMask > Settings > Advanced > Reset Account
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## 🔧 Available Scripts

### Backend Scripts

- `npm run compile` - Compile smart contracts
- `npm run migrate` - Deploy to local network
- `npm run migrate:reset` - Reset and redeploy
- `npm run migrate:sepolia` - Deploy to Sepolia testnet
- `npm test` - Run contract tests
- `npm run interact` - Test contract interaction

### Frontend Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎯 How It Works

1. **Smart Contract**: Stores candidates and vote counts on blockchain
2. **MetaMask**: Provides wallet connection and transaction signing
3. **Web3.js**: Bridges frontend and blockchain interaction
4. **React Frontend**: Modern UI for voting interface

## 🔒 Security Features

- **One vote per address**: Smart contract enforces voting restrictions
- **Immutable records**: All votes stored permanently on blockchain
- **Transparent**: Anyone can verify vote counts
- **Decentralized**: No central authority controls the voting

## 📝 Smart Contract Functions

- `vote(candidateId)` - Cast a vote for a candidate
- `getAllCandidates()` - Get all candidates with vote counts
- `getVoterStatus(address)` - Check if address has voted
- `getTotalVotes()` - Get total number of votes cast

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Disclaimer

This is a demonstration project for educational purposes. For production use, consider additional security measures and professional auditing.
