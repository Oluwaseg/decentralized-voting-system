import { useEffect, useState } from 'react';
import './App.css';
import VotingInterface from './components/VotingInterface';
import web3Service from './utils/web3';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [contractInitialized, setContractInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          'accountsChanged',
          handleAccountsChanged
        );
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    try {
      const connected = await web3Service.initWeb3();
      if (connected) {
        const currentAccount = await web3Service.getCurrentAccount();
        setAccount(currentAccount);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      setAccount('');
    } else {
      setAccount(accounts[0]);
      web3Service.account = accounts[0];
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const connectWallet = async () => {
    setLoading(true);
    setError('');

    try {
      const connected = await web3Service.initWeb3();
      if (connected) {
        const currentAccount = await web3Service.getCurrentAccount();
        setAccount(currentAccount);
        setIsConnected(true);
      } else {
        setError('Failed to connect to MetaMask');
      }
    } catch (error) {
      setError('Error connecting to wallet: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContractAddressSubmit = async (e) => {
    e.preventDefault();
    if (contractAddress.trim()) {
      setLoading(true);
      try {
        console.log(
          'Attempting to initialize contract with address:',
          contractAddress.trim()
        );
        web3Service.initContract(contractAddress.trim());

        // Test the contract by calling a simple method
        await web3Service.getAllCandidates();

        setContractInitialized(true);
        setError('✅ Contract connected successfully!');
        console.log('Contract initialized and tested successfully');
      } catch (error) {
        setContractInitialized(false);
        setError('❌ Failed to connect to contract: ' + error.message);
        console.error('Error setting contract address:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className='App'>
      <div className='container'>
        <header className='card'>
          <h1>🗳️ Decentralized Voting System</h1>
          <p>A secure, transparent voting platform built on Ethereum</p>

          {!isConnected ? (
            <div>
              <p>Connect your MetaMask wallet to participate in voting</p>
              <button
                className='button'
                onClick={connectWallet}
                disabled={loading}
              >
                {loading && <span className='loading'></span>}
                Connect MetaMask
              </button>
            </div>
          ) : (
            <div>
              <p>✅ Connected: {account}</p>
              <form onSubmit={handleContractAddressSubmit}>
                <div style={{ marginTop: '20px' }}>
                  <label htmlFor='contractAddress'>Contract Address:</label>
                  <input
                    type='text'
                    id='contractAddress'
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    placeholder='Enter deployed contract address'
                    style={{
                      width: '100%',
                      padding: '10px',
                      margin: '10px 0',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                    }}
                  />
                  <button type='submit' className='button'>
                    Set Contract Address
                  </button>
                </div>
              </form>
            </div>
          )}

          {error && <div className='status-message status-error'>{error}</div>}
        </header>

        {isConnected && contractAddress && contractInitialized && (
          <VotingInterface key={contractAddress} />
        )}

        {!window.ethereum && (
          <div className='card'>
            <h3>MetaMask Required</h3>
            <p>
              This application requires MetaMask to interact with the Ethereum
              blockchain. Please install MetaMask from{' '}
              <a
                href='https://metamask.io/'
                target='_blank'
                rel='noopener noreferrer'
                style={{ color: '#667eea' }}
              >
                metamask.io
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
