const GutToken = artifacts.require("GutToken");

module.exports = function (deployer) {
  deployer.deploy(GutToken, 1000000);
};
