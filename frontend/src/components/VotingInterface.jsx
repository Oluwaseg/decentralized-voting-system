import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  CheckCircle,
  CheckCircle2,
  Crown,
  Database,
  Globe,
  Info,
  Loader2,
  Network,
  RefreshCw,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Users,
  Vote,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import web3Service from '../utils/web3';

const VotingInterface = () => {
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [voting, setVoting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    loadVotingData();
  }, []);

  const loadVotingData = async () => {
    setLoading(true);
    try {
      // Load candidates
      const candidatesData = await web3Service.getAllCandidates();
      setCandidates(candidatesData);

      // Check if current user has voted
      const voterStatus = await web3Service.hasVoted();
      setHasVoted(voterStatus);

      // Get total votes
      const total = await web3Service.getTotalVotes();
      setTotalVotes(Number(total));

      setMessage('');
    } catch (error) {
      setMessage('ERROR_LOADING_VOTING_DATA: ' + error.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (candidateId) => {
    if (hasVoted) {
      setMessage('YOU_HAVE_ALREADY_VOTED!');
      setMessageType('warning');
      return;
    }

    setVoting(true);
    setMessage('');

    try {
      const tx = await web3Service.vote(candidateId);

      setMessage(`VOTE_CAST_SUCCESSFULLY! TRANSACTION: ${tx.transactionHash}`);
      setMessageType('success');

      // Reload data after successful vote
      await loadVotingData();
    } catch (error) {
      let errorMessage = 'ERROR_CASTING_VOTE: ';

      if (error.message.includes('already voted')) {
        errorMessage += 'YOU_HAVE_ALREADY_VOTED!';
      } else if (error.message.includes('denied')) {
        errorMessage += 'TRANSACTION_WAS_DENIED_BY_USER';
      } else {
        errorMessage += error.message;
      }

      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setVoting(false);
    }
  };

  const getVotePercentage = (voteCount) => {
    if (totalVotes === 0) return 0;
    return ((voteCount / totalVotes) * 100).toFixed(1);
  };

  const getLeadingCandidate = () => {
    if (candidates.length === 0) return null;
    return candidates.reduce((prev, current) =>
      Number(current.voteCount) > Number(prev.voteCount) ? current : prev
    );
  };

  const MessageAlert = ({ message, type }) => {
    const icons = {
      success: CheckCircle2,
      error: AlertTriangle,
      warning: AlertTriangle,
      info: Info,
    };

    const colors = {
      success: 'bg-green-400/10 border-green-400/40 text-green-400',
      error: 'bg-red-400/10 border-red-400/40 text-red-400',
      warning: 'bg-yellow-400/10 border-yellow-400/40 text-yellow-400',
      info: 'bg-cyan-400/10 border-cyan-400/40 text-cyan-400',
    };

    const Icon = icons[type] || Info;

    return (
      <div
        className={`rounded-lg p-4 md:p-8 border backdrop-blur-sm ${colors[type]} mb-8 md:mb-10 font-mono`}
      >
        <div className='flex items-start space-x-3 md:space-x-4'>
          <Icon className='w-6 h-6 md:w-8 md:h-8 mt-0.5 flex-shrink-0' />
          <div className='font-bold break-words text-sm md:text-lg min-w-0 flex-1'>
            {message}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className='bg-black/90 border border-green-400/40 rounded-lg p-12 md:p-20 backdrop-blur-xl text-center'>
        <div className='relative'>
          <Loader2 className='w-12 h-12 md:w-16 md:h-16 animate-spin text-green-400 mx-auto mb-6 md:mb-8' />
          <div className='absolute inset-0 w-12 h-12 md:w-16 md:h-16 mx-auto bg-green-400/20 rounded-full blur-xl animate-pulse'></div>
        </div>
        <p className='text-green-400 font-bold text-lg md:text-xl font-mono mb-2'>
          LOADING_BLOCKCHAIN_DATA...
        </p>
        <p className='text-green-400/60 text-sm font-mono'>
          CONNECTING_TO_ETHEREUM_NETWORK
        </p>
      </div>
    );
  }

  const leadingCandidate = getLeadingCandidate();

  return (
    <div className='space-y-8 md:space-y-12'>
      {/* Status Message */}
      {message && <MessageAlert message={message} type={messageType} />}

      {/* Cyberpunk Statistics Dashboard */}
      <div className='bg-black/90 border border-green-400/40 rounded-lg p-6 md:p-12 backdrop-blur-xl'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 md:mb-12 space-y-4 lg:space-y-0'>
          <div>
            <h2 className='text-3xl md:text-5xl font-black text-green-400 mb-2 md:mb-3 font-mono'>
              LIVE_ANALYTICS
            </h2>
            <p className='text-green-400/80 text-lg md:text-xl font-mono'>
              REAL_TIME_BLOCKCHAIN_DATA
            </p>
          </div>
          <button
            className='group relative inline-flex items-center px-6 py-3 md:px-8 md:py-4 bg-black border-2 border-green-400/50 hover:border-green-400 text-green-400 font-bold rounded-lg transition-all duration-300 backdrop-blur-sm disabled:opacity-50 font-mono text-sm md:text-base'
            onClick={loadVotingData}
            disabled={loading}
          >
            <div className='absolute inset-0 bg-green-400/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            <RefreshCw
              className={`w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 ${
                loading ? 'animate-spin' : ''
              } relative z-10`}
            />
            <span className='relative z-10'>REFRESH_DATA</span>
          </button>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8'>
          <div className='group relative bg-black/80 border border-green-400/30 rounded-lg p-4 md:p-8 backdrop-blur-sm hover:border-green-400/60 transition-all duration-300'>
            <div className='absolute inset-0 bg-green-400/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            <div className='relative'>
              <div className='flex items-center justify-between mb-4 md:mb-6'>
                <Users className='w-8 h-8 md:w-10 md:h-10 text-green-400' />
                <div className='w-3 h-3 md:w-4 md:h-4 bg-green-400 rounded-full animate-pulse'></div>
              </div>
              <p className='text-green-400 font-bold mb-1 md:mb-2 font-mono text-sm md:text-base'>
                CANDIDATES
              </p>
              <p className='text-3xl md:text-5xl font-black text-white font-mono'>
                {candidates.length}
              </p>
            </div>
          </div>

          <div className='group relative bg-black/80 border border-cyan-400/30 rounded-lg p-4 md:p-8 backdrop-blur-sm hover:border-cyan-400/60 transition-all duration-300'>
            <div className='absolute inset-0 bg-cyan-400/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            <div className='relative'>
              <div className='flex items-center justify-between mb-4 md:mb-6'>
                <Vote className='w-8 h-8 md:w-10 md:h-10 text-cyan-400' />
                <div className='w-3 h-3 md:w-4 md:h-4 bg-cyan-400 rounded-full animate-pulse'></div>
              </div>
              <p className='text-cyan-400 font-bold mb-1 md:mb-2 font-mono text-sm md:text-base'>
                VOTES_CAST
              </p>
              <p className='text-3xl md:text-5xl font-black text-white font-mono'>
                {totalVotes.toLocaleString()}
              </p>
            </div>
          </div>

          <div
            className={`group relative rounded-lg p-4 md:p-8 border backdrop-blur-sm transition-all duration-300 ${
              hasVoted
                ? 'bg-black/80 border-green-400/30 hover:border-green-400/60'
                : 'bg-black/80 border-yellow-400/30 hover:border-yellow-400/60'
            }`}
          >
            <div
              className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                hasVoted ? 'bg-green-400/5' : 'bg-yellow-400/5'
              }`}
            ></div>
            <div className='relative'>
              <div className='flex items-center justify-between mb-4 md:mb-6'>
                <CheckCircle
                  className={`w-8 h-8 md:w-10 md:h-10 ${
                    hasVoted ? 'text-green-400' : 'text-yellow-400'
                  }`}
                />
                <div
                  className={`w-3 h-3 md:w-4 md:h-4 rounded-full animate-pulse ${
                    hasVoted ? 'bg-green-400' : 'bg-yellow-400'
                  }`}
                ></div>
              </div>
              <p
                className={`font-bold mb-1 md:mb-2 font-mono text-sm md:text-base ${
                  hasVoted ? 'text-green-400' : 'text-yellow-400'
                }`}
              >
                YOUR_STATUS
              </p>
              <p
                className={`text-2xl md:text-3xl font-black font-mono ${
                  hasVoted ? 'text-white' : 'text-white'
                }`}
              >
                {hasVoted ? 'VOTED' : 'PENDING'}
              </p>
            </div>
          </div>

          {leadingCandidate && totalVotes > 0 && (
            <div className='group relative bg-black/80 border border-yellow-400/30 rounded-lg p-4 md:p-8 backdrop-blur-sm hover:border-yellow-400/60 transition-all duration-300'>
              <div className='absolute inset-0 bg-yellow-400/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              <div className='relative'>
                <div className='flex items-center justify-between mb-4 md:mb-6'>
                  <Crown className='w-8 h-8 md:w-10 md:h-10 text-yellow-400' />
                  <div className='w-3 h-3 md:w-4 md:h-4 bg-yellow-400 rounded-full animate-pulse'></div>
                </div>
                <p className='text-yellow-400 font-bold mb-1 md:mb-2 font-mono text-sm md:text-base'>
                  LEADING
                </p>
                <p className='text-xl md:text-2xl font-black text-white truncate font-mono'>
                  {leadingCandidate.name}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* System Metrics */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-12'>
          <div className='bg-black/60 border border-green-400/20 rounded-lg p-4 md:p-8'>
            <div className='flex items-center mb-4 md:mb-6'>
              <Activity className='w-6 h-6 md:w-8 md:h-8 text-green-400 mr-3 md:mr-4' />
              <span className='text-green-400 font-bold font-mono text-sm md:text-base'>
                NETWORK_STATUS
              </span>
            </div>
            <p className='text-2xl md:text-4xl font-bold text-white font-mono'>
              {totalVotes > 0 ? 'ACTIVE' : 'IDLE'}
            </p>
            <p className='text-green-400/60 text-xs md:text-sm font-mono'>
              BLOCKCHAIN_CONSENSUS
            </p>
          </div>

          <div className='bg-black/60 border border-cyan-400/20 rounded-lg p-4 md:p-8'>
            <div className='flex items-center mb-4 md:mb-6'>
              <Database className='w-6 h-6 md:w-8 md:h-8 text-cyan-400 mr-3 md:mr-4' />
              <span className='text-cyan-400 font-bold font-mono text-sm md:text-base'>
                GAS_EFFICIENCY
              </span>
            </div>
            <p className='text-2xl md:text-4xl font-bold text-white font-mono'>
              OPTIMAL
            </p>
            <p className='text-cyan-400/60 text-xs md:text-sm font-mono'>
              TRANSACTION_COST
            </p>
          </div>

          <div className='bg-black/60 border border-yellow-400/20 rounded-lg p-4 md:p-8'>
            <div className='flex items-center mb-4 md:mb-6'>
              <Network className='w-6 h-6 md:w-8 md:h-8 text-yellow-400 mr-3 md:mr-4' />
              <span className='text-yellow-400 font-bold font-mono text-sm md:text-base'>
                SECURITY_LEVEL
              </span>
            </div>
            <p className='text-2xl md:text-4xl font-bold text-white font-mono'>
              MAXIMUM
            </p>
            <p className='text-yellow-400/60 text-xs md:text-sm font-mono'>
              CRYPTOGRAPHIC_HASH
            </p>
          </div>
        </div>
      </div>

      {/* Candidates Leaderboard */}
      <div className='bg-black/90 border border-green-400/40 rounded-lg p-6 md:p-12 backdrop-blur-xl'>
        <div className='flex items-center mb-8 md:mb-12'>
          <div className='w-12 h-12 md:w-16 md:h-16 bg-black border-2 border-green-400 rounded-lg flex items-center justify-center mr-4 md:mr-6 shadow-lg shadow-green-400/30'>
            <BarChart3 className='w-6 h-6 md:w-10 md:h-10 text-green-400' />
          </div>
          <div>
            <h2 className='text-3xl md:text-5xl font-black text-green-400 font-mono'>
              LEADERBOARD
            </h2>
            <p className='text-green-400/80 text-lg md:text-xl font-mono'>
              LIVE_VOTING_RESULTS
            </p>
          </div>
        </div>

        {candidates.length === 0 ? (
          <div className='text-center py-12 md:py-20'>
            <div className='w-24 h-24 md:w-32 md:h-32 bg-black/60 border border-green-400/30 rounded-lg flex items-center justify-center mx-auto mb-6 md:mb-8'>
              <Users className='w-12 h-12 md:w-16 md:h-16 text-green-400/50' />
            </div>
            <h3 className='text-2xl md:text-3xl font-bold text-green-400/60 mb-3 md:mb-4 font-mono'>
              NO_CANDIDATES_FOUND
            </h3>
            <p className='text-green-400/40 font-mono text-sm md:text-base'>
              CONTRACT_ADDRESS_VERIFICATION_REQUIRED
            </p>
          </div>
        ) : (
          <div className='space-y-6 md:space-y-8'>
            {candidates
              .sort((a, b) => Number(b.voteCount) - Number(a.voteCount))
              .map((candidate, index) => {
                const percentage = getVotePercentage(
                  Number(candidate.voteCount)
                );
                const isLeading =
                  leadingCandidate &&
                  candidate.id === leadingCandidate.id &&
                  totalVotes > 0;
                const isTop3 = index < 3;

                return (
                  <div
                    key={candidate.id}
                    className={`group relative border rounded-lg p-6 md:p-10 transition-all duration-500 backdrop-blur-sm ${
                      isLeading
                        ? 'border-yellow-400/60 bg-yellow-400/5 shadow-lg shadow-yellow-400/20'
                        : isTop3
                        ? 'border-green-400/40 bg-green-400/5 hover:border-green-400/60'
                        : 'border-green-400/20 bg-black/40 hover:border-green-400/40'
                    }`}
                  >
                    {/* Rank Badge */}
                    <div
                      className={`absolute -top-3 -left-3 md:-top-4 md:-left-4 w-8 h-8 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-sm md:text-lg font-bold font-mono ${
                        index === 0
                          ? 'bg-yellow-400 text-black border-2 border-yellow-400'
                          : index === 1
                          ? 'bg-gray-300 text-black border-2 border-gray-300'
                          : index === 2
                          ? 'bg-orange-400 text-black border-2 border-orange-400'
                          : 'bg-black text-green-400 border-2 border-green-400'
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 md:mb-8 space-y-4 lg:space-y-0'>
                      <div className='flex items-center'>
                        <div
                          className={`w-16 h-16 md:w-20 md:h-20 rounded-lg flex items-center justify-center text-white font-black text-2xl md:text-3xl mr-4 md:mr-8 shadow-lg border-2 ${
                            isLeading
                              ? 'bg-black border-yellow-400 shadow-yellow-400/30'
                              : isTop3
                              ? 'bg-black border-green-400 shadow-green-400/30'
                              : 'bg-black border-green-400/50'
                          }`}
                        >
                          {candidate.name.charAt(0).toUpperCase()}
                        </div>
                        <div className='min-w-0 flex-1'>
                          <h3 className='text-xl md:text-3xl font-bold text-white flex items-center mb-2 md:mb-3 font-mono'>
                            <span className='truncate'>
                              {candidate.name.toUpperCase()}
                            </span>
                            {isLeading && (
                              <Crown className='w-6 h-6 md:w-8 md:h-8 text-yellow-400 ml-3 md:ml-4 flex-shrink-0' />
                            )}
                            {isTop3 && !isLeading && (
                              <Star className='w-5 h-5 md:w-6 md:h-6 text-green-400 ml-3 md:ml-4 flex-shrink-0' />
                            )}
                          </h3>
                          <div className='flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-6'>
                            <span className='text-green-400 font-bold font-mono text-sm md:text-lg'>
                              {Number(candidate.voteCount).toLocaleString()}
                              _VOTES
                            </span>
                            <span
                              className={`px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm md:text-lg font-bold font-mono ${
                                isLeading
                                  ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/40'
                                  : 'bg-green-400/20 text-green-400 border border-green-400/40'
                              }`}
                            >
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        className={`group relative px-6 py-3 md:px-10 md:py-6 rounded-lg font-bold text-lg md:text-xl transition-all duration-300 font-mono w-full sm:w-auto ${
                          hasVoted
                            ? 'bg-black/60 border border-green-400/30 text-green-400/50 cursor-not-allowed'
                            : voting
                            ? 'bg-black/60 border border-green-400/30 text-green-400/50 cursor-not-allowed'
                            : 'bg-black border-2 border-green-400 text-green-400 hover:bg-green-400/10 transform hover:scale-105 shadow-xl shadow-green-400/30'
                        }`}
                        onClick={() => handleVote(Number(candidate.id))}
                        disabled={hasVoted || voting}
                      >
                        {!hasVoted && !voting && (
                          <div className='absolute inset-0 bg-green-400/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                        )}
                        <div className='relative flex items-center justify-center'>
                          {voting ? (
                            <>
                              <Loader2 className='w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 animate-spin' />
                              VOTING...
                            </>
                          ) : hasVoted ? (
                            <>
                              <CheckCircle className='w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3' />
                              VOTED
                            </>
                          ) : (
                            <>
                              <Vote className='w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3' />
                              VOTE_NOW
                            </>
                          )}
                        </div>
                      </button>
                    </div>

                    {/* Cyberpunk Progress Bar */}
                    <div className='relative w-full bg-black/60 border border-green-400/20 rounded-lg h-4 md:h-6 overflow-hidden'>
                      <div
                        className={`h-full transition-all duration-1000 ease-out relative ${
                          isLeading
                            ? 'bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400'
                            : isTop3
                            ? 'bg-gradient-to-r from-green-400 via-cyan-400 to-green-400'
                            : 'bg-gradient-to-r from-green-400/60 to-green-400/40'
                        }`}
                        style={{ width: `${percentage}%` }}
                      >
                        <div className='absolute inset-0 bg-white/20 animate-pulse'></div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Cyberpunk Instructions */}
      <div className='bg-black/90 border border-green-400/40 rounded-lg p-6 md:p-12 backdrop-blur-xl'>
        <div className='flex items-center mb-6 md:mb-10'>
          <div className='w-12 h-12 md:w-16 md:h-16 bg-black border-2 border-green-400 rounded-lg flex items-center justify-center mr-4 md:mr-6 shadow-lg shadow-green-400/30'>
            <Info className='w-6 h-6 md:w-10 md:h-10 text-green-400' />
          </div>
          <div>
            <h3 className='text-2xl md:text-4xl font-bold text-green-400 font-mono'>
              VOTING_PROTOCOL
            </h3>
            <p className='text-green-400/80 text-lg md:text-xl font-mono'>
              SYSTEM_INSTRUCTIONS
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12'>
          <div>
            <div className='space-y-6 md:space-y-8'>
              {[
                {
                  icon: Shield,
                  title: 'SECURE_CONNECTION',
                  description:
                    'Verify MetaMask connection to correct network with sufficient ETH for gas fees',
                  color: 'border-green-400',
                },
                {
                  icon: Target,
                  title: 'SELECT_CANDIDATE',
                  description:
                    'Analyze all candidates and execute VOTE_NOW command on preferred choice',
                  color: 'border-cyan-400',
                },
                {
                  icon: Zap,
                  title: 'CONFIRM_TRANSACTION',
                  description:
                    'Approve blockchain transaction in MetaMask and await network confirmation',
                  color: 'border-yellow-400',
                },
              ].map((step, index) => (
                <div key={index} className='flex items-start group'>
                  <div
                    className={`w-12 h-12 md:w-16 md:h-16 bg-black border-2 ${step.color} rounded-lg flex items-center justify-center text-white font-bold text-lg md:text-xl mr-4 md:mr-8 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300 font-mono`}
                  >
                    {index + 1}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <h4 className='text-lg md:text-2xl font-bold text-green-400 mb-2 md:mb-3 flex items-center font-mono'>
                      <step.icon className='w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-green-400/60' />
                      {step.title}
                    </h4>
                    <p className='text-green-300/80 leading-relaxed font-mono text-sm md:text-base'>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='bg-black/60 border border-green-400/20 rounded-lg p-6 md:p-10'>
            <h4 className='text-xl md:text-2xl font-bold text-green-400 mb-6 md:mb-8 flex items-center font-mono'>
              <Sparkles className='w-6 h-6 md:w-8 md:h-8 text-green-400 mr-3 md:mr-4' />
              SECURITY_FEATURES
            </h4>
            <div className='space-y-4 md:space-y-6'>
              {[
                {
                  icon: CheckCircle,
                  text: 'ONE_VOTE_PER_WALLET_ADDRESS',
                  color: 'text-green-400',
                },
                {
                  icon: Shield,
                  text: '256_BIT_BLOCKCHAIN_ENCRYPTION',
                  color: 'text-cyan-400',
                },
                {
                  icon: Globe,
                  text: 'IMMUTABLE_VOTE_RECORDING',
                  color: 'text-yellow-400',
                },
                {
                  icon: Award,
                  text: 'REAL_TIME_RESULT_VERIFICATION',
                  color: 'text-green-400',
                },
                {
                  icon: ShieldCheck,
                  text: 'ANONYMOUS_VOTING_PROCESS',
                  color: 'text-cyan-400',
                },
              ].map((feature, index) => (
                <div key={index} className='flex items-center'>
                  <feature.icon
                    className={`w-5 h-5 md:w-6 md:h-6 mr-3 md:mr-4 ${feature.color}`}
                  />
                  <span
                    className={`${feature.color} font-mono font-bold text-sm md:text-base`}
                  >
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            <div className='mt-6 md:mt-10 p-4 md:p-6 bg-yellow-400/10 border border-yellow-400/30 rounded-lg'>
              <div className='flex items-start space-x-3 md:space-x-4'>
                <AlertTriangle className='w-6 h-6 md:w-8 md:h-8 text-yellow-400 mt-0.5 flex-shrink-0' />
                <div className='min-w-0 flex-1'>
                  <p className='text-yellow-400 font-bold mb-2 font-mono text-sm md:text-base'>
                    CRITICAL_NOTICE
                  </p>
                  <p className='text-yellow-300/80 text-xs md:text-sm font-mono leading-relaxed break-words'>
                    VOTES_ARE_PERMANENT_AND_IMMUTABLE_ONCE_CONFIRMED_ON_BLOCKCHAIN.
                    ENSURE_SUFFICIENT_ETH_FOR_GAS_FEES.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingInterface;
