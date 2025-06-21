// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Sepolia Testnet
  11155111: '0xC17f0B472f0ce9535Cf5f84e79f7aAD28d3B253C',

  // Local Ganache
  1337: '0x793439F18d286595Ae78559E431fc7809E41bd03',
};

export const NETWORK_NAMES = {
  11155111: 'Sepolia Testnet',
  1337: 'Ganache Local',
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
