const GutToken = artifacts.require("GutToken");
const LendingVault = artifacts.require("LendingVault");

module.exports = function (deployer) {
  deployer.deploy(GutToken, 1000000).then(function() {
    return deployer.deploy(LendingVault, GutToken.address);
  });
};
