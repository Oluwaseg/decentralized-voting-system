import {
  AlertCircle,
  CheckCircle,
  Cpu,
  Database,
  ExternalLink,
  Globe,
  Info,
  Loader2,
  Network,
  Settings,
  Shield,
  ShieldCheck,
  Star,
  Vote,
  Wallet,
  Wifi,
  WifiOff,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import VotingInterface from './components/VotingInterface';
import web3Service from './utils/web3';

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [contractInitialized, setContractInitialized] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const [networkName, setNetworkName] = useState('');
  const [autoDetectionEnabled, setAutoDetectionEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Supported networks data
  const supportedNetworks = [
    { id: 11155111, name: 'Sepolia Testnet', icon: '🧪', status: 'active' },
    { id: 1337, name: 'Ganache Local', icon: '⚙️', status: 'active' },
  ];

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

        // Auto-detect network and contract address
        if (autoDetectionEnabled) {
          await autoDetectContract();
        }
      }
    } catch {
      setError('Failed to check wallet connection');
    }
  };

  const autoDetectContract = async () => {
    setLoading(true);
    try {
      const networkInfo = await web3Service.autoDetectAndInitContract();

      setCurrentNetwork(networkInfo.chainId);
      setNetworkName(networkInfo.networkName);
      setContractAddress(networkInfo.contractAddress);
      setContractInitialized(true);
      setError(
        `✅ CONNECTED_TO_${networkInfo.networkName
          .toUpperCase()
          .replace(/\s+/g, '_')}_VOTING_CONTRACT`
      );
    } catch (error) {
      setContractInitialized(false);
      setError('❌ ' + error.message);
    } finally {
      setLoading(false);
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

        // Auto-detect network and contract address
        if (autoDetectionEnabled) {
          await autoDetectContract();
        }
      } else {
        setError('FAILED_TO_CONNECT_TO_METAMASK');
      }
    } catch (error) {
      setError('ERROR_CONNECTING_TO_WALLET: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContractAddressSubmit = async (e) => {
    e.preventDefault();
    if (contractAddress.trim()) {
      setLoading(true);
      try {
        web3Service.initContract(contractAddress.trim());

        // Test the contract by calling a simple method
        await web3Service.getAllCandidates();

        setContractInitialized(true);
        setError('✅ CONTRACT_CONNECTED_SUCCESSFULLY!');
      } catch (error) {
        setContractInitialized(false);
        setError('❌ FAILED_TO_CONNECT_TO_CONTRACT: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className='min-h-screen bg-black relative overflow-hidden'>
      {/* Matrix-style background */}
      <div className='absolute inset-0 bg-black'>
        <div className='absolute inset-0 opacity-20'>
          <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-500/5 via-transparent to-cyan-500/5'></div>
          <div className='absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse'></div>
          <div className='absolute bottom-0 left-0 w-48 h-48 md:w-96 md:h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000'></div>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-green-400/5 rounded-full blur-3xl animate-pulse delay-500'></div>
        </div>
      </div>

      {/* Cyberpunk grid overlay */}
      <div className='absolute inset-0 opacity-10'>
        <div
          className='w-full h-full'
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '25px 25px md:50px md:50px',
          }}
        ></div>
      </div>

      {/* Floating binary code */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className='absolute text-green-400/20 font-mono text-xs animate-pulse'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className='relative z-10 bg-black/90 backdrop-blur-xl border-b border-green-400/20 sticky top-0'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0'>
            <div className='flex items-center space-x-3 md:space-x-4'>
              <div className='relative'>
                <div className='w-10 h-10 md:w-14 md:h-14 bg-black border-2 border-green-400 rounded-lg flex items-center justify-center shadow-lg shadow-green-400/50 relative overflow-hidden'>
                  <div className='absolute inset-0 bg-gradient-to-br from-green-400/20 to-cyan-400/20'></div>
                  <Vote className='w-5 h-5 md:w-8 md:h-8 text-green-400 relative z-10' />
                </div>
                <div className='absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-400 rounded-full animate-ping'></div>
                <div className='absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-400 rounded-full'></div>
              </div>
              <div>
                <h1 className='text-2xl md:text-4xl font-black text-green-400 font-mono tracking-wider'>
                  VOTE<span className='text-cyan-400'>CHAIN</span>
                </h1>
                <p className='text-green-300/80 font-mono text-xs md:text-sm tracking-wide'>
                  DECENTRALIZED_DEMOCRACY.EXE
                </p>
              </div>
            </div>
            <div className='flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4'>
              {networkName && (
                <div className='flex items-center space-x-2 bg-black/80 border border-cyan-400/50 px-3 py-2 md:px-4 md:py-2 rounded-lg'>
                  <Network className='w-3 h-3 md:w-4 md:h-4 text-cyan-400' />
                  <span className='text-cyan-400 font-mono text-xs md:text-sm font-bold'>
                    {networkName.toUpperCase().replace(/\s+/g, '_')}
                  </span>
                </div>
              )}
              {isConnected && (
                <div className='flex items-center space-x-2 md:space-x-3 bg-black/80 border border-green-400/50 px-4 py-2 md:px-6 md:py-3 rounded-lg backdrop-blur-sm'>
                  <div className='w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full animate-pulse'></div>
                  <span className='text-green-400 font-mono font-bold text-xs md:text-sm tracking-wider'>
                    {account.slice(0, 4)}...{account.slice(-4)}
                  </span>
                  <CheckCircle className='w-4 h-4 md:w-5 md:h-5 text-green-400' />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12'>
        {/* Hero Section */}
        <div className='text-center mb-12 md:mb-16'>
          <div className='inline-flex items-center space-x-2 bg-black/80 border border-green-400/30 px-4 py-2 md:px-8 md:py-4 rounded-lg mb-6 md:mb-8'>
            <Cpu className='w-4 h-4 md:w-6 md:h-6 text-green-400 animate-pulse' />
            <span className='text-green-400 font-mono font-bold tracking-wider text-xs md:text-base'>
              ETHEREUM_BLOCKCHAIN_PROTOCOL
            </span>
          </div>

          <h2 className='text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 md:mb-8 leading-tight font-mono'>
            <span className='text-green-400'>CYBER</span>
            <span className='block text-cyan-400 animate-pulse'>DEMOCRACY</span>
          </h2>

          <div className='max-w-4xl mx-auto mb-8 md:mb-12'>
            <p className='text-lg md:text-xl text-green-300 font-mono leading-relaxed mb-4 md:mb-6'>
              {'>'} INITIALIZING QUANTUM-SECURED VOTING PROTOCOL...
            </p>
            <div className='text-sm md:text-lg text-cyan-300/80 font-mono leading-relaxed space-y-1'>
              <p>{'>'} BLOCKCHAIN IMMUTABILITY: [ACTIVE]</p>
              <p>{'>'} CRYPTOGRAPHIC SECURITY: [MAXIMUM]</p>
              <p>{'>'} MULTI-NETWORK SUPPORT: [ENABLED]</p>
              <p>
                {'>'} AUTO-DETECTION: [
                {autoDetectionEnabled ? 'ACTIVE' : 'DISABLED'}]
              </p>
            </div>
          </div>

          <div className='flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-6 text-xs sm:text-sm md:text-base'>
            <div className='flex items-center space-x-1 sm:space-x-2 md:space-x-3 bg-black/60 border border-green-400/30 px-2 sm:px-3 md:px-6 py-2 md:py-3 rounded-lg'>
              <ShieldCheck className='w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-400' />
              <span className='text-green-400 font-mono break-words'>
                256-BIT_ENCRYPTION
              </span>
            </div>
            <div className='flex items-center space-x-1 sm:space-x-2 md:space-x-3 bg-black/60 border border-cyan-400/30 px-2 sm:px-3 md:px-6 py-2 md:py-3 rounded-lg'>
              <Network className='w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-cyan-400' />
              <span className='text-cyan-400 font-mono break-words'>
                MULTI_NETWORK
              </span>
            </div>
            <div className='flex items-center space-x-1 sm:space-x-2 md:space-x-3 bg-black/60 border border-yellow-400/30 px-2 sm:px-3 md:px-6 py-2 md:py-3 rounded-lg'>
              <Zap className='w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-400' />
              <span className='text-yellow-400 font-mono break-words'>
                INSTANT_CONSENSUS
              </span>
            </div>
          </div>
        </div>

        {/* Supported Networks Section */}
        <div className='bg-black/90 border border-cyan-400/40 rounded-lg p-6 md:p-12 backdrop-blur-xl mb-8 md:mb-16'>
          <div className='flex items-center mb-6 md:mb-10'>
            <div className='w-12 h-12 md:w-16 md:h-16 bg-black border-2 border-cyan-400 rounded-lg flex items-center justify-center mr-4 md:mr-6 shadow-lg shadow-cyan-400/30'>
              <Globe className='w-6 h-6 md:w-10 md:h-10 text-cyan-400' />
            </div>
            <div>
              <h2 className='text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-black text-cyan-400 font-mono break-words leading-tight'>
                SUPPORTED_NETWORKS
              </h2>
              <p className='text-cyan-400/80 text-sm sm:text-base md:text-lg lg:text-xl font-mono break-words leading-tight'>
                COMPATIBLE_BLOCKCHAIN_PROTOCOLS
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
            {supportedNetworks.map((network) => (
              <div
                key={network.id}
                className={`group relative bg-black/60 border rounded-lg p-4 md:p-6 backdrop-blur-sm transition-all duration-300 ${
                  currentNetwork === network.id
                    ? 'border-green-400/60 bg-green-400/10 shadow-lg shadow-green-400/20'
                    : 'border-cyan-400/30 hover:border-cyan-400/60'
                }`}
              >
                <div className='flex items-center justify-between mb-3 md:mb-4'>
                  <div className='flex items-center space-x-3'>
                    <span className='text-2xl md:text-3xl'>{network.icon}</span>
                    <div>
                      <h3 className='text-white font-bold font-mono text-xs sm:text-sm md:text-lg break-words leading-tight'>
                        {network.name.toUpperCase().replace(/\s+/g, '_')}
                      </h3>
                      <p className='text-cyan-400/60 font-mono text-xs md:text-sm break-words'>
                        CHAIN_ID: {network.id}
                      </p>
                    </div>
                  </div>
                  {currentNetwork === network.id && (
                    <div className='flex items-center space-x-2'>
                      <div className='w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full animate-pulse'></div>
                      <span className='text-green-400 font-mono font-bold text-xs md:text-sm'>
                        ACTIVE
                      </span>
                    </div>
                  )}
                </div>
                <div className='flex items-center justify-between'>
                  <span
                    className={`px-2 py-1 md:px-3 md:py-1 rounded-lg text-xs md:text-sm font-bold font-mono ${
                      network.status === 'active'
                        ? 'bg-green-400/20 text-green-400 border border-green-400/40'
                        : 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/40'
                    }`}
                  >
                    {network.status.toUpperCase()}
                  </span>
                  <ExternalLink className='w-3 h-3 md:w-4 md:h-4 text-cyan-400/60' />
                </div>
              </div>
            ))}
          </div>

          <div className='mt-6 md:mt-8 p-4 md:p-6 bg-cyan-400/10 border border-cyan-400/30 rounded-lg'>
            <div className='flex items-start space-x-3 md:space-x-4'>
              <Info className='w-5 h-5 md:w-6 md:h-6 text-cyan-400 mt-0.5 flex-shrink-0' />
              <div className='min-w-0 flex-1'>
                <p className='text-cyan-400 font-bold mb-2 font-mono text-xs sm:text-sm md:text-base break-words'>
                  NETWORK_COMPATIBILITY_NOTICE
                </p>
                <p className='text-cyan-300/80 text-xs md:text-sm font-mono leading-relaxed break-words'>
                  ENSURE_YOUR_METAMASK_IS_CONNECTED_TO_ONE_OF_THE_SUPPORTED_NETWORKS_ABOVE.
                  AUTO_DETECTION_WILL_AUTOMATICALLY_SELECT_THE_CORRECT_CONTRACT_ADDRESS_FOR_YOUR_CURRENT_NETWORK.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16'>
          <div className='group relative bg-black/80 border border-green-400/30 rounded-lg p-6 md:p-8 backdrop-blur-sm hover:border-green-400/60 transition-all duration-500 hover:shadow-lg hover:shadow-green-400/20'>
            <div className='absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
            <div className='relative'>
              <div className='w-12 h-12 md:w-16 md:h-16 bg-black border-2 border-green-400 rounded-lg flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-green-400/30'>
                <Shield className='w-6 h-6 md:w-8 md:h-8 text-green-400' />
              </div>
              <h3 className='text-xl md:text-2xl font-bold text-green-400 mb-3 md:mb-4 font-mono'>
                QUANTUM_SECURITY
              </h3>
              <p className='text-green-300/80 leading-relaxed font-mono text-sm'>
                Military-grade cryptographic protocols ensure vote immutability
                through blockchain consensus mechanisms.
              </p>
            </div>
          </div>

          <div className='group relative bg-black/80 border border-cyan-400/30 rounded-lg p-6 md:p-8 backdrop-blur-sm hover:border-cyan-400/60 transition-all duration-500 hover:shadow-lg hover:shadow-cyan-400/20'>
            <div className='absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
            <div className='relative'>
              <div className='w-12 h-12 md:w-16 md:h-16 bg-black border-2 border-cyan-400 rounded-lg flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-cyan-400/30'>
                <Database className='w-6 h-6 md:w-8 md:h-8 text-cyan-400' />
              </div>
              <h3 className='text-xl md:text-2xl font-bold text-cyan-400 mb-3 md:mb-4 font-mono'>
                REAL_TIME_DATA
              </h3>
              <p className='text-cyan-300/80 leading-relaxed font-mono text-sm'>
                Live blockchain analytics with transparent vote tracking and
                immutable result verification systems.
              </p>
            </div>
          </div>

          <div className='group relative bg-black/80 border border-yellow-400/30 rounded-lg p-6 md:p-8 backdrop-blur-sm hover:border-yellow-400/60 transition-all duration-500 hover:shadow-lg hover:shadow-yellow-400/20'>
            <div className='absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
            <div className='relative'>
              <div className='w-12 h-12 md:w-16 md:h-16 bg-black border-2 border-yellow-400 rounded-lg flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-yellow-400/30'>
                <Globe className='w-6 h-6 md:w-8 md:h-8 text-yellow-400' />
              </div>
              <h3 className='text-xl md:text-2xl font-bold text-yellow-400 mb-3 md:mb-4 font-mono'>
                MULTI_NETWORK
              </h3>
              <p className='text-yellow-300/80 leading-relaxed font-mono text-sm'>
                Cross-chain compatibility with Ethereum, Polygon, and local
                networks. Auto-detection enabled.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='space-y-6 md:space-y-8'>
          {!isConnected ? (
            <div className='relative bg-black/90 border border-green-400/40 rounded-lg p-8 md:p-16 backdrop-blur-xl text-center overflow-hidden'>
              <div className='absolute inset-0 bg-gradient-to-r from-green-400/5 via-cyan-400/5 to-green-400/5'></div>
              <div className='relative'>
                <div className='w-24 h-24 md:w-32 md:h-32 bg-black border-4 border-green-400 rounded-lg flex items-center justify-center mx-auto mb-6 md:mb-10 shadow-2xl shadow-green-400/50 relative overflow-hidden'>
                  <div className='absolute inset-0 bg-gradient-to-br from-green-400/20 to-cyan-400/20 animate-pulse'></div>
                  <Wallet className='w-12 h-12 md:w-16 md:h-16 text-green-400 relative z-10' />
                </div>
                <h3 className='text-3xl md:text-5xl font-bold text-green-400 mb-4 md:mb-6 font-mono'>
                  CONNECT_WALLET
                </h3>
                <div className='text-lg md:text-xl text-green-300/80 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed font-mono space-y-1'>
                  <p>{'>'} INITIALIZING WEB3 CONNECTION...</p>
                  <p>{'>'} METAMASK INTEGRATION REQUIRED</p>
                  <p>{'>'} PREPARING BLOCKCHAIN INTERFACE...</p>
                </div>
                <button
                  className='group relative inline-flex items-center px-8 py-4 md:px-16 md:py-8 bg-black border-2 border-green-400 text-green-400 font-bold text-lg md:text-xl rounded-lg hover:bg-green-400/10 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-green-400/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-mono'
                  onClick={connectWallet}
                  disabled={loading}
                >
                  <div className='absolute inset-0 bg-green-400/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                  <div className='relative flex items-center'>
                    {loading && (
                      <Loader2 className='w-6 h-6 md:w-8 md:h-8 mr-3 md:mr-4 animate-spin' />
                    )}
                    <Wallet className='w-6 h-6 md:w-8 md:h-8 mr-3 md:mr-4' />
                    {loading ? 'CONNECTING...' : 'CONNECT_METAMASK'}
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className='bg-black/90 border border-green-400/40 rounded-lg p-6 md:p-12 backdrop-blur-xl'>
              <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 md:mb-10 space-y-4 lg:space-y-0'>
                <div>
                  <h3 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-green-400 mb-2 md:mb-3 font-mono break-words'>
                    CONTRACT_INTERFACE
                  </h3>
                  <p className='text-green-300/80 text-sm sm:text-base md:text-lg font-mono break-words'>
                    {autoDetectionEnabled
                      ? 'AUTO_DETECTING_CONTRACT_BASED_ON_NETWORK'
                      : 'MANUAL_CONTRACT_ADDRESS_INPUT_MODE'}
                  </p>
                  {networkName && (
                    <p className='text-cyan-400 font-bold mt-2 font-mono text-xs sm:text-sm md:text-base break-words'>
                      🌐 NETWORK:{' '}
                      <span className='break-all'>
                        {networkName.toUpperCase().replace(/\s+/g, '_')}
                      </span>
                    </p>
                  )}
                </div>
                <div className='flex items-center space-x-3 md:space-x-4 bg-black/80 border border-green-400/50 px-4 py-3 md:px-8 md:py-4 rounded-lg'>
                  <Star className='w-6 h-6 md:w-8 md:h-8 text-green-400 animate-pulse' />
                  <span className='text-green-400 font-mono font-bold text-sm md:text-lg'>
                    WALLET_CONNECTED
                  </span>
                </div>
              </div>

              {/* Auto-detection Toggle */}
              <div className='mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between p-4 md:p-6 bg-black/60 border border-green-400/20 rounded-lg space-y-4 sm:space-y-0 sm:space-x-4'>
                <div className='flex items-start space-x-3 md:space-x-4 flex-1 min-w-0'>
                  <Settings className='w-6 h-6 md:w-8 md:h-8 text-cyan-400 flex-shrink-0 mt-1' />
                  <div className='min-w-0 flex-1'>
                    <h4 className='text-cyan-400 font-bold font-mono text-sm sm:text-base md:text-lg break-words leading-tight mb-1'>
                      AUTO_DETECTION_PROTOCOL
                    </h4>
                    <p className='text-cyan-300/60 text-xs sm:text-sm md:text-sm font-mono break-words leading-tight'>
                      AUTOMATICALLY_DETECT_CONTRACT_BASED_ON_NETWORK_ID
                    </p>
                  </div>
                </div>
                <div className='flex items-center justify-center sm:justify-end flex-shrink-0'>
                  <button
                    onClick={() =>
                      setAutoDetectionEnabled(!autoDetectionEnabled)
                    }
                    className={`relative inline-flex h-6 w-12 md:h-8 md:w-16 items-center rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400/50 ${
                      autoDetectionEnabled
                        ? 'bg-green-400/20 border-green-400'
                        : 'bg-black/60 border-green-400/30'
                    }`}
                    aria-label={`Toggle auto-detection ${
                      autoDetectionEnabled ? 'off' : 'on'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 md:h-6 md:w-6 transform rounded-lg bg-green-400 transition-transform font-mono text-xs flex items-center justify-center text-black font-bold ${
                        autoDetectionEnabled
                          ? 'translate-x-6 md:translate-x-8'
                          : 'translate-x-1'
                      }`}
                    >
                      {autoDetectionEnabled ? (
                        <Wifi className='w-2 h-2 md:w-3 md:h-3' />
                      ) : (
                        <WifiOff className='w-2 h-2 md:w-3 md:h-3' />
                      )}
                    </span>
                  </button>
                </div>
              </div>

              {autoDetectionEnabled ? (
                <div className='text-center py-8 md:py-12 border border-green-400/20 rounded-lg bg-black/40'>
                  <div className='w-16 h-16 md:w-20 md:h-20 bg-black border-2 border-green-400 rounded-lg flex items-center justify-center mx-auto mb-4 md:mb-6 animate-pulse shadow-lg shadow-green-400/30'>
                    <Zap className='w-8 h-8 md:w-10 md:h-10 text-green-400' />
                  </div>
                  <h4 className='text-lg sm:text-xl md:text-2xl font-bold text-green-400 mb-3 md:mb-4 font-mono break-words leading-tight px-4'>
                    AUTO_DETECTION_ACTIVE
                  </h4>
                  <div className='text-green-300/80 font-mono mb-4 md:mb-6 space-y-2 text-xs sm:text-sm md:text-base px-4 max-w-2xl mx-auto'>
                    <p className='break-words leading-relaxed'>
                      CONTRACT_ADDRESS_WILL_BE_DETECTED_AUTOMATICALLY
                    </p>
                    <p className='break-words leading-relaxed'>
                      BASED_ON_YOUR_CURRENT_NETWORK_ID
                    </p>
                  </div>
                  {contractAddress && (
                    <div className='mt-4 md:mt-6 mx-4 p-4 md:p-6 bg-green-400/10 border border-green-400/30 rounded-lg'>
                      <p className='text-green-400 font-bold font-mono text-xs sm:text-sm md:text-base break-all leading-relaxed'>
                        📄 CONTRACT:{' '}
                        <span className='inline-block'>{contractAddress}</span>
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <form
                  onSubmit={handleContractAddressSubmit}
                  className='space-y-6 md:space-y-8'
                >
                  <div>
                    <label
                      htmlFor='contractAddress'
                      className='block text-lg md:text-xl font-bold text-green-400 mb-4 md:mb-6 font-mono'
                    >
                      SMART_CONTRACT_ADDRESS:
                    </label>
                    <div className='relative'>
                      <input
                        type='text'
                        id='contractAddress'
                        value={contractAddress}
                        onChange={(e) => setContractAddress(e.target.value)}
                        placeholder='0x742d35Cc6634C0532925a3b8D4C9db96590c6C87'
                        className='w-full px-4 py-4 md:px-8 md:py-6 bg-black border-2 border-green-400/50 rounded-lg focus:border-green-400 focus:outline-none transition-all text-green-400 placeholder-green-400/50 text-sm md:text-lg font-mono tracking-wider'
                      />
                      <div className='absolute inset-0 bg-green-400/5 rounded-lg opacity-0 focus-within:opacity-100 transition-opacity pointer-events-none'></div>
                    </div>
                  </div>
                  <button
                    type='submit'
                    disabled={loading || !contractAddress.trim()}
                    className='group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 md:px-12 md:py-6 bg-black border-2 border-cyan-400 text-cyan-400 font-bold text-lg md:text-xl rounded-lg hover:bg-cyan-400/10 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-cyan-400/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-mono'
                  >
                    <div className='absolute inset-0 bg-cyan-400/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    <div className='relative flex items-center'>
                      {loading && (
                        <Loader2 className='w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 animate-spin' />
                      )}
                      <Zap className='w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3' />
                      {loading ? 'INITIALIZING...' : 'INITIALIZE_CONTRACT'}
                    </div>
                  </button>
                </form>
              )}
            </div>
          )}

          {error && (
            <div
              className={`rounded-lg p-4 md:p-8 border backdrop-blur-sm ${
                error.includes('✅')
                  ? 'bg-green-400/10 border-green-400/40'
                  : 'bg-red-400/10 border-red-400/40'
              }`}
            >
              <div className='flex items-start space-x-3 md:space-x-4'>
                {error.includes('✅') ? (
                  <CheckCircle className='w-6 h-6 md:w-8 md:h-8 text-green-400 mt-0.5 flex-shrink-0' />
                ) : (
                  <AlertCircle className='w-6 h-6 md:w-8 md:h-8 text-red-400 mt-0.5 flex-shrink-0' />
                )}
                <span
                  className={`font-bold font-mono text-xs sm:text-sm md:text-base lg:text-lg break-all leading-tight ${
                    error.includes('✅') ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {error}
                </span>
              </div>
            </div>
          )}

          {isConnected && contractAddress && contractInitialized && (
            <VotingInterface key={contractAddress} />
          )}

          {!window.ethereum && (
            <div className='bg-black/90 border border-yellow-400/40 rounded-lg p-8 md:p-12 text-center backdrop-blur-sm'>
              <div className='w-20 h-20 md:w-24 md:h-24 bg-black border-4 border-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-lg shadow-yellow-400/30'>
                <Wallet className='w-10 h-10 md:w-12 md:h-12 text-yellow-400' />
              </div>
              <h3 className='text-2xl md:text-3xl font-bold text-yellow-400 mb-4 md:mb-6 font-mono'>
                METAMASK_REQUIRED
              </h3>
              <p className='text-yellow-300/80 mb-6 md:mb-8 text-base md:text-lg font-mono'>
                WEB3_WALLET_INTEGRATION_NEEDED
              </p>
              <a
                href='https://metamask.io/'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center px-6 py-4 md:px-10 md:py-6 bg-black border-2 border-yellow-400 text-yellow-400 font-bold rounded-lg hover:bg-yellow-400/10 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-yellow-400/30 font-mono text-sm md:text-base'
              >
                <Wallet className='w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3' />
                INSTALL_METAMASK
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className='mt-16 md:mt-24 pt-8 md:pt-12 border-t border-green-400/20'>
          <div className='text-center'>
            <div className='flex justify-center items-center space-x-3 md:space-x-4 mb-4 md:mb-6'>
              <div className='w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full animate-pulse'></div>
              <div className='w-2 h-2 md:w-3 md:h-3 bg-cyan-400 rounded-full animate-pulse delay-200'></div>
              <div className='w-2 h-2 md:w-3 md:h-3 bg-yellow-400 rounded-full animate-pulse delay-400'></div>
            </div>
            <p className='text-green-400/80 text-sm md:text-lg font-mono'>
              BUILT_ON_ETHEREUM • QUANTUM_SECURED • MULTI_NETWORK • IMMUTABLE
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
