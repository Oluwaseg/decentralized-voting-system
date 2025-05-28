// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    mapping(uint256 => Candidate) public candidates;
    mapping(address => bool) public hasVoted;
    uint256 public candidatesCount;
    address public owner;

    event VoteCast(address indexed voter, uint256 indexed candidateId, string candidateName);
    event CandidateAdded(uint256 indexed candidateId, string name);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier hasNotVoted() {
        require(!hasVoted[msg.sender], "You have already voted");
        _;
    }

    modifier validCandidate(uint256 _candidateId) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");
        _;
    }

    constructor(string[] memory _candidateNames) {
        owner = msg.sender;
        
        // Initialize candidates
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidatesCount++;
            candidates[candidatesCount] = Candidate(candidatesCount, _candidateNames[i], 0);
            emit CandidateAdded(candidatesCount, _candidateNames[i]);
        }
    }

    function vote(uint256 _candidateId) public hasNotVoted validCandidate(_candidateId) {
        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        
        emit VoteCast(msg.sender, _candidateId, candidates[_candidateId].name);
    }

    function getCandidate(uint256 _candidateId) public view validCandidate(_candidateId) returns (uint256, string memory, uint256) {
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.id, candidate.name, candidate.voteCount);
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](candidatesCount);
        
        for (uint256 i = 1; i <= candidatesCount; i++) {
            allCandidates[i - 1] = candidates[i];
        }
        
        return allCandidates;
    }

    function getTotalVotes() public view returns (uint256) {
        uint256 totalVotes = 0;
        for (uint256 i = 1; i <= candidatesCount; i++) {
            totalVotes += candidates[i].voteCount;
        }
        return totalVotes;
    }

    function getVoterStatus(address _voter) public view returns (bool) {
        return hasVoted[_voter];
    }

    function getCandidatesCount() public view returns (uint256) {
        return candidatesCount;
    }
}
