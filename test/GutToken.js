const GutToken = artifacts.require("GutToken");

contract('GutToken', (accounts) => {
  describe('Initialize', () => {
    let gutToken;
    
    before(async() => {
      gutToken = await GutToken.deployed();
    });

    it('returns correct total supply', async() => {
      const totalSupply = await gutToken.totalSupply();

      assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');
    });

    describe('balanceOf', () => {
      it('returns correct balance from deployer address', async() => {
        const balance = await gutToken.balanceOf(accounts[0]);

        assert.equal(balance.toNumber(), 1000000, 'allocates initial supply to deployer account');
      });
    });
  });
});
