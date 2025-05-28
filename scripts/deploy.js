require('dotenv').config();
const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');

// Configuration
const NETWORK_URL = process.env.NETWORK_URL || 'http://127.0.0.1:7545';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function deployContract() {
    try {
        // Initialize Web3
        const web3 = new Web3(NETWORK_URL);
        
        // Get contract artifacts
        const contractPath = path.join(__dirname, '../build/contracts/Voting.json');
        
        if (!fs.existsSync(contractPath)) {
            console.log('Contract not compiled. Please run: truffle compile');
            return;
        }
        
        const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
        const abi = contractJson.abi;
        const bytecode = contractJson.bytecode;
        
        // Setup account
        let account;
        if (PRIVATE_KEY) {
            account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
            web3.eth.accounts.wallet.add(account);
        } else {
            const accounts = await web3.eth.getAccounts();
            account = { address: accounts[0] };
        }
        
        console.log('Deploying from account:', account.address);
        
        // Create contract instance
        const contract = new web3.eth.Contract(abi);
        
        // Define initial candidates
        const candidates = [
            "Alice Johnson",
            "Bob Smith", 
            "Carol Davis",
            "David Wilson"
        ];
        
        console.log('Deploying contract with candidates:', candidates);
        
        // Deploy contract
        const deployTx = contract.deploy({
            data: bytecode,
            arguments: [candidates]
        });
        
        const gas = await deployTx.estimateGas({ from: account.address });
        console.log('Estimated gas:', gas);
        
        const deployedContract = await deployTx.send({
            from: account.address,
            gas: gas,
            gasPrice: await web3.eth.getGasPrice()
        });
        
        console.log('Contract deployed successfully!');
        console.log('Contract address:', deployedContract.options.address);
        console.log('Transaction hash:', deployedContract.transactionHash);
        
        // Save deployment info
        const deploymentInfo = {
            address: deployedContract.options.address,
            transactionHash: deployedContract.transactionHash,
            network: NETWORK_URL,
            deployedAt: new Date().toISOString(),
            candidates: candidates
        };
        
        fs.writeFileSync(
            path.join(__dirname, '../deployment.json'),
            JSON.stringify(deploymentInfo, null, 2)
        );
        
        console.log('Deployment info saved to deployment.json');
        
        return deployedContract;
        
    } catch (error) {
        console.error('Deployment failed:', error);
    }
}

// Run deployment if called directly
if (require.main === module) {
    deployContract();
}

module.exports = deployContract;
