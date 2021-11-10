const GutToken = artifacts.require("GutToken");
const DGutToken = artifacts.require("DGutToken");
const LendingVault = artifacts.require("LendingVault");

module.exports = async function (deployer) {
  await deployer.deploy(GutToken, 1000000);
  const gutTokenInstance = await GutToken.deployed();

  await deployer.deploy(DGutToken);
  const dGutTokenInstance = await DGutToken.deployed();

  await deployer.deploy(LendingVault, gutTokenInstance.address, dGutTokenInstance.address)
};
