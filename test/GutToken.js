const GutToken = artifacts.require("GutToken");

contract('GutToken', (accounts) => {
  describe('Initialize', () => {
    let gutToken;
    
    before(async() => {
      gutToken = await GutToken.deployed();
    });

    it('returns correct total supply', async() => {
      const totalSupply = await gutToken.totalSupply();

      assert.equal(totalSupply.toNumber(), 1000000);
    });
  });

  describe('balanceOf', () => {
    describe('given initial supply from initialize step', () => {
      let gutToken;
    
      before(async() => {
        gutToken = await GutToken.deployed();
      });

      it('returns total supply as a balance from deployer address', async() => {
        const balance = await gutToken.balanceOf(accounts[0]);
  
        assert.equal(balance.toNumber(), 1000000);
      });

      it('returns 0 balance from non deployer address', async() => {
        const balance = await gutToken.balanceOf(accounts[1]);

        assert.equal(balance.toNumber(), 0);
      })
    });
  });
});
