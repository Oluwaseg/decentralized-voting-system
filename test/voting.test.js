const Voting = artifacts.require("Voting");

contract("Voting", (accounts) => {
  let votingInstance;
  const candidates = ["Alice Johnson", "Bob Smith", "Carol Davis"];
  const [owner, voter1, voter2, voter3] = accounts;

  beforeEach(async () => {
    votingInstance = await Voting.new(candidates);
  });

  describe("Contract Deployment", () => {
    it("should deploy with correct candidates", async () => {
      const candidatesCount = await votingInstance.candidatesCount();
      assert.equal(candidatesCount.toNumber(), 3, "Should have 3 candidates");

      const allCandidates = await votingInstance.getAllCandidates();
      assert.equal(allCandidates.length, 3, "Should return 3 candidates");
      assert.equal(allCandidates[0].name, "Alice Johnson", "First candidate should be Alice Johnson");
      assert.equal(allCandidates[1].name, "Bob Smith", "Second candidate should be Bob Smith");
      assert.equal(allCandidates[2].name, "Carol Davis", "Third candidate should be Carol Davis");
    });

    it("should initialize with zero votes", async () => {
      const allCandidates = await votingInstance.getAllCandidates();
      allCandidates.forEach((candidate, index) => {
        assert.equal(candidate.voteCount.toNumber(), 0, `Candidate ${index + 1} should have 0 votes`);
      });
    });

    it("should set the correct owner", async () => {
      const contractOwner = await votingInstance.owner();
      assert.equal(contractOwner, owner, "Owner should be the deployer");
    });
  });

  describe("Voting Functionality", () => {
    it("should allow a user to vote", async () => {
      await votingInstance.vote(1, { from: voter1 });
      
      const candidate = await votingInstance.getCandidate(1);
      assert.equal(candidate[2].toNumber(), 1, "Candidate should have 1 vote");
      
      const hasVoted = await votingInstance.getVoterStatus(voter1);
      assert.equal(hasVoted, true, "Voter should be marked as having voted");
    });

    it("should prevent double voting", async () => {
      await votingInstance.vote(1, { from: voter1 });
      
      try {
        await votingInstance.vote(2, { from: voter1 });
        assert.fail("Should not allow double voting");
      } catch (error) {
        assert(error.message.includes("You have already voted"), "Should throw 'already voted' error");
      }
    });

    it("should reject invalid candidate IDs", async () => {
      try {
        await votingInstance.vote(0, { from: voter1 });
        assert.fail("Should not allow voting for candidate ID 0");
      } catch (error) {
        assert(error.message.includes("Invalid candidate ID"), "Should throw 'Invalid candidate ID' error");
      }

      try {
        await votingInstance.vote(4, { from: voter1 });
        assert.fail("Should not allow voting for non-existent candidate");
      } catch (error) {
        assert(error.message.includes("Invalid candidate ID"), "Should throw 'Invalid candidate ID' error");
      }
    });

    it("should track total votes correctly", async () => {
      await votingInstance.vote(1, { from: voter1 });
      await votingInstance.vote(2, { from: voter2 });
      await votingInstance.vote(1, { from: voter3 });

      const totalVotes = await votingInstance.getTotalVotes();
      assert.equal(totalVotes.toNumber(), 3, "Total votes should be 3");

      const candidate1 = await votingInstance.getCandidate(1);
      const candidate2 = await votingInstance.getCandidate(2);
      
      assert.equal(candidate1[2].toNumber(), 2, "Candidate 1 should have 2 votes");
      assert.equal(candidate2[2].toNumber(), 1, "Candidate 2 should have 1 vote");
    });
  });

  describe("View Functions", () => {
    beforeEach(async () => {
      await votingInstance.vote(1, { from: voter1 });
      await votingInstance.vote(2, { from: voter2 });
      await votingInstance.vote(1, { from: voter3 });
    });

    it("should return correct candidate information", async () => {
      const candidate1 = await votingInstance.getCandidate(1);
      assert.equal(candidate1[0].toNumber(), 1, "Candidate ID should be 1");
      assert.equal(candidate1[1], "Alice Johnson", "Candidate name should be Alice Johnson");
      assert.equal(candidate1[2].toNumber(), 2, "Candidate should have 2 votes");
    });

    it("should return all candidates with correct vote counts", async () => {
      const allCandidates = await votingInstance.getAllCandidates();
      
      assert.equal(allCandidates[0].voteCount.toNumber(), 2, "Alice should have 2 votes");
      assert.equal(allCandidates[1].voteCount.toNumber(), 1, "Bob should have 1 vote");
      assert.equal(allCandidates[2].voteCount.toNumber(), 0, "Carol should have 0 votes");
    });

    it("should return correct voter status", async () => {
      const voter1Status = await votingInstance.getVoterStatus(voter1);
      const voter2Status = await votingInstance.getVoterStatus(voter2);
      const nonVoterStatus = await votingInstance.getVoterStatus(accounts[4]);

      assert.equal(voter1Status, true, "Voter1 should have voted");
      assert.equal(voter2Status, true, "Voter2 should have voted");
      assert.equal(nonVoterStatus, false, "Non-voter should not have voted");
    });
  });

  describe("Events", () => {
    it("should emit VoteCast event when voting", async () => {
      const result = await votingInstance.vote(1, { from: voter1 });
      
      assert.equal(result.logs.length, 1, "Should emit one event");
      assert.equal(result.logs[0].event, "VoteCast", "Should emit VoteCast event");
      assert.equal(result.logs[0].args.voter, voter1, "Should log correct voter");
      assert.equal(result.logs[0].args.candidateId.toNumber(), 1, "Should log correct candidate ID");
      assert.equal(result.logs[0].args.candidateName, "Alice Johnson", "Should log correct candidate name");
    });
  });
});
