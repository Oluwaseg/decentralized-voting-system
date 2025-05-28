const Voting = artifacts.require('Voting');

module.exports = function (deployer) {
  const candidates = [
    'Alice Johnson',
    'Bob Smith',
    'Carol Davis',
    'David Wilson',
  ];

  deployer.deploy(Voting, candidates);
};
