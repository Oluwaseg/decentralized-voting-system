import React, { useState, useEffect } from 'react';
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
      console.error('Error loading voting data:', error);
      setMessage('Error loading voting data: ' + error.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (candidateId) => {
    if (hasVoted) {
      setMessage('You have already voted!');
      setMessageType('warning');
      return;
    }

    setVoting(true);
    setMessage('');

    try {
      const tx = await web3Service.vote(candidateId);
      
      setMessage(`Vote cast successfully! Transaction: ${tx.transactionHash}`);
      setMessageType('success');
      
      // Reload data after successful vote
      await loadVotingData();
      
    } catch (error) {
      console.error('Error voting:', error);
      let errorMessage = 'Error casting vote: ';
      
      if (error.message.includes('already voted')) {
        errorMessage += 'You have already voted!';
      } else if (error.message.includes('denied')) {
        errorMessage += 'Transaction was denied by user';
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

  if (loading) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <span className="loading"></span>
          <p>Loading voting data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Status Message */}
      {message && (
        <div className={`status-message status-${messageType}`}>
          {message}
        </div>
      )}

      {/* Voting Status */}
      <div className="card">
        <h2>Voting Status</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{candidates.length}</span>
            <div className="stat-label">Candidates</div>
          </div>
          <div className="stat-item">
            <span className="stat-value">{totalVotes}</span>
            <div className="stat-label">Total Votes</div>
          </div>
          <div className="stat-item">
            <span className="stat-value">{hasVoted ? '✅' : '❌'}</span>
            <div className="stat-label">You Voted</div>
          </div>
        </div>
        
        <button 
          className="button refresh-button" 
          onClick={loadVotingData}
          disabled={loading}
        >
          {loading && <span className="loading"></span>}
          Refresh Data
        </button>
      </div>

      {/* Candidates */}
      <div className="card">
        <h2>Candidates</h2>
        {candidates.length === 0 ? (
          <p>No candidates found. Make sure the contract address is correct.</p>
        ) : (
          <div className="candidate-grid">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="candidate-card">
                <div className="candidate-name">{candidate.name}</div>
                
                <div className="vote-info">
                  <div>
                    <span className="vote-count">{Number(candidate.voteCount)}</span>
                    <span style={{ color: '#666', marginLeft: '5px' }}>
                      votes ({getVotePercentage(Number(candidate.voteCount))}%)
                    </span>
                  </div>
                </div>

                {/* Vote Progress Bar */}
                <div style={{ 
                  background: '#f0f0f0', 
                  borderRadius: '10px', 
                  height: '8px', 
                  margin: '10px 0',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    height: '100%',
                    width: `${getVotePercentage(Number(candidate.voteCount))}%`,
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>

                <button
                  className="vote-button"
                  onClick={() => handleVote(Number(candidate.id))}
                  disabled={hasVoted || voting}
                >
                  {voting ? (
                    <>
                      <span className="loading"></span>
                      Voting...
                    </>
                  ) : hasVoted ? (
                    'Already Voted'
                  ) : (
                    `Vote for ${candidate.name}`
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="card">
        <h3>How to Vote</h3>
        <ol style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <li>Make sure your MetaMask wallet is connected</li>
          <li>Ensure you're on the correct network (local development or testnet)</li>
          <li>Click "Vote" on your preferred candidate</li>
          <li>Confirm the transaction in MetaMask</li>
          <li>Wait for the transaction to be confirmed</li>
          <li>The results will update automatically</li>
        </ol>
        
        <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
          <strong>Note:</strong> Each address can only vote once. Make sure you have enough ETH to pay for gas fees.
        </div>
      </div>
    </div>
  );
};

export default VotingInterface;
