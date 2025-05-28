// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Ethereum Mainnet
  1: '0x1234567890123456789012345678901234567890',

  // Sepolia Testnet
  11155111: '0x2345678901234567890123456789012345678901', // Replace with actual Sepolia address

  // Goerli Testnet (deprecated but kept for compatibility)
  5: '0x2345678901234567890123456789012345678901',

  // Polygon Mainnet
  137: '0x3456789012345678901234567890123456789012',

  // Polygon Mumbai Testnet
  80001: '0x4567890123456789012345678901234567890123',

  // Local Ganache (your current setup)
  1337: '0xafD7BD6ba24b94bF45d0C09C6D87890F5ad3feBB',

  // Hardhat local
  31337: '0x5678901234567890123456789012345678901234',
};

export const NETWORK_NAMES = {
  1: 'Ethereum Mainnet',
  11155111: 'Sepolia Testnet',
  5: 'Goerli Testnet',
  137: 'Polygon',
  80001: 'Mumbai Testnet',
  1337: 'Ganache Local',
  31337: 'Hardhat Local',
};

// Get contract address for current network
export const getContractAddress = (chainId) => {
  const address = CONTRACT_ADDRESSES[chainId];
  if (!address) {
    throw new Error(
      `Contract not deployed on network ${chainId} (${
        NETWORK_NAMES[chainId] || 'Unknown'
      })`
    );
  }
  return address;
};

// Check if network is supported
export const isSupportedNetwork = (chainId) => {
  return chainId in CONTRACT_ADDRESSES;
};

// Get network name
export const getNetworkName = (chainId) => {
  return NETWORK_NAMES[chainId] || `Unknown Network (${chainId})`;
};
