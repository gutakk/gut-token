const DGutToken = artifacts.require("DGutToken");

contract('DGutToken', (accounts) => {
  before(async() => {
    dGutToken = await DGutToken.deployed();
  });

  describe('initialize', () => {
    it('sets correct token name', async() => {
      const tokenName = await dGutToken.name();
      assert.equal(tokenName, 'DebtGutToken');
    });

    it('sets correct token symbol', async() => {
      const tokenSymbol = await dGutToken.symbol();
      assert.equal(tokenSymbol, 'dGUT');
    });

    it('sets correct token decimals', async() => {
      const tokenDecimals = await dGutToken.decimals();
      assert.equal(tokenDecimals, 18);
    });
  })
});
