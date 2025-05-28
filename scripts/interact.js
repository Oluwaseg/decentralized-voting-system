require('dotenv').config();
const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');

// Configuration
const NETWORK_URL = process.env.NETWORK_URL || 'http://127.0.0.1:7545';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function interactWithContract() {
    try {
        // Initialize Web3
        const web3 = new Web3(NETWORK_URL);
        
        // Load deployment info
        const deploymentPath = path.join(__dirname, '../deployment.json');
        if (!fs.existsSync(deploymentPath)) {
            console.log('No deployment found. Please deploy the contract first.');
            return;
        }
        
        const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
        console.log('Interacting with contract at:', deployment.address);
        
        // Load contract ABI
        const contractPath = path.join(__dirname, '../build/contracts/Voting.json');
        const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
        const abi = contractJson.abi;
        
        // Create contract instance
        const contract = new web3.eth.Contract(abi, deployment.address);
        
        // Setup account
        let account;
        if (PRIVATE_KEY) {
            account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
            web3.eth.accounts.wallet.add(account);
        } else {
            const accounts = await web3.eth.getAccounts();
            account = { address: accounts[0] };
        }
        
        console.log('Using account:', account.address);
        
        // Get all candidates
        console.log('\n=== Current Candidates ===');
        const candidates = await contract.methods.getAllCandidates().call();
        candidates.forEach((candidate, index) => {
            console.log(`${candidate.id}: ${candidate.name} - ${candidate.voteCount} votes`);
        });
        
        // Check if user has voted
        const hasVoted = await contract.methods.getVoterStatus(account.address).call();
        console.log(`\nHas ${account.address} voted?`, hasVoted);
        
        // Get total votes
        const totalVotes = await contract.methods.getTotalVotes().call();
        console.log('Total votes cast:', totalVotes.toString());
        
        // Example: Vote for candidate 1 (if not already voted)
        if (!hasVoted && candidates.length > 0) {
            console.log('\n=== Casting Vote ===');
            console.log('Voting for candidate 1:', candidates[0].name);
            
            const voteTx = await contract.methods.vote(1).send({
                from: account.address,
                gas: 100000
            });
            
            console.log('Vote cast! Transaction hash:', voteTx.transactionHash);
            
            // Get updated candidates
            console.log('\n=== Updated Results ===');
            const updatedCandidates = await contract.methods.getAllCandidates().call();
            updatedCandidates.forEach((candidate, index) => {
                console.log(`${candidate.id}: ${candidate.name} - ${candidate.voteCount} votes`);
            });
        } else if (hasVoted) {
            console.log('\nAccount has already voted!');
        }
        
    } catch (error) {
        console.error('Interaction failed:', error);
    }
}

// Run interaction if called directly
if (require.main === module) {
    interactWithContract();
}

module.exports = interactWithContract;
