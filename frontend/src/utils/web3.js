import { Web3 } from 'web3';

// Contract ABI - This should match your deployed contract
const VOTING_ABI = [
  {
    inputs: [
      {
        internalType: 'string[]',
        name: '_candidateNames',
        type: 'string[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'candidateId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
    ],
    name: 'CandidateAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'voter',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'candidateId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'candidateName',
        type: 'string',
      },
    ],
    name: 'VoteCast',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_candidateId',
        type: 'uint256',
      },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllCandidates',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'voteCount',
            type: 'uint256',
          },
        ],
        internalType: 'struct Voting.Candidate[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_voter',
        type: 'address',
      },
    ],
    name: 'getVoterStatus',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'candidatesCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

class Web3Service {
  constructor() {
    this.web3 = null;
    this.contract = null;
    this.account = null;
    this.contractAddress = null;
  }

  async initWeb3() {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await this.web3.eth.getAccounts();
        this.account = accounts[0];
        return true;
      } catch (error) {
        console.error('User denied account access', error);
        return false;
      }
    } else if (window.web3) {
      this.web3 = new Web3(window.web3.currentProvider);
      const accounts = await this.web3.eth.getAccounts();
      this.account = accounts[0];
      return true;
    } else {
      console.log('Non-Ethereum browser detected. Consider trying MetaMask!');
      return false;
    }
  }

  setContractAddress(address) {
    this.contractAddress = address;
    if (this.web3) {
      this.contract = new this.web3.eth.Contract(VOTING_ABI, address);
    }
  }

  initContract(address) {
    if (!this.web3) {
      throw new Error('Web3 not initialized');
    }
    console.log('Initializing contract with address:', address);
    console.log('Web3 instance:', this.web3);
    this.contract = new this.web3.eth.Contract(VOTING_ABI, address);
    this.contractAddress = address;
    console.log('Contract initialized:', this.contract);
  }

  async getAllCandidates() {
    if (!this.contract) {
      console.error('Contract not initialized. Contract:', this.contract);
      console.error('Contract address:', this.contractAddress);
      throw new Error('Contract not initialized');
    }
    console.log('Calling getAllCandidates on contract:', this.contractAddress);
    try {
      const result = await this.contract.methods.getAllCandidates().call();
      console.log('getAllCandidates result:', result);
      return result;
    } catch (error) {
      console.error('Error calling getAllCandidates:', error);
      throw error;
    }
  }

  async vote(candidateId) {
    if (!this.contract || !this.account) {
      throw new Error('Contract or account not initialized');
    }

    return await this.contract.methods.vote(candidateId).send({
      from: this.account,
      gas: 100000,
    });
  }

  async hasVoted(address = this.account) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }
    return await this.contract.methods.getVoterStatus(address).call();
  }

  async getTotalVotes() {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }
    return await this.contract.methods.getTotalVotes().call();
  }

  async getCurrentAccount() {
    if (!this.web3) {
      return null;
    }
    const accounts = await this.web3.eth.getAccounts();
    this.account = accounts[0];
    return this.account;
  }

  isConnected() {
    return this.web3 && this.account;
  }
}

export default new Web3Service();
