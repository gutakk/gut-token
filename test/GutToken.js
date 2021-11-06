const GutToken = artifacts.require("GutToken");

contract('GutToken', (accounts) => {
  describe('Total Supply', () => {
    it('returns correct total supply', async () => {
      const instance = await GutToken.deployed();
      const totalSupply = await instance.totalSupply();
      
      assert.equal(totalSupply.toNumber(), 1000000);
    });
  });
});
