const DGutTokenMock = artifacts.require("DGutTokenMock");

contract('DGutToken', (accounts) => {
  before(async() => {
    dGutTokenMock = await DGutTokenMock.new();
  });

  describe('initialize', () => {
    it('sets correct token name', async() => {
      const tokenName = await dGutTokenMock.name();
      assert.equal(tokenName, 'DebtGutToken');
    });

    it('sets correct token symbol', async() => {
      const tokenSymbol = await dGutTokenMock.symbol();
      assert.equal(tokenSymbol, 'dGUT');
    });

    it('sets correct token decimals', async() => {
      const tokenDecimals = await dGutTokenMock.decimals();
      assert.equal(tokenDecimals, 18);
    });
  });

  describe('mint token', () => {
    describe('given valid target address', () => {
      before(async() => {
        transaction = await dGutTokenMock.mint(accounts[0], 100);
      });

      it('emit Transfer event', async() => {
        assert.equal(transaction.logs.length, 1);
        assert.equal(transaction.logs[0].event, 'Transfer');
        assert.equal(transaction.logs[0].args._from, 0x0);
        assert.equal(transaction.logs[0].args._to, accounts[0]);
        assert.equal(transaction.logs[0].args._value, 100);
      });

      it('mints correct balance to target address', async() => {
        const balance = await dGutTokenMock.balanceOf(accounts[0]);
        assert.equal(balance.toNumber(), 100);
      });

      it('updates correct total supply', async() => {
        const totalSupply = await dGutTokenMock.totalSupply();
        assert.equal(totalSupply.toNumber(), 100);
      });
    });

    describe('given invalid target address', () => {
      it('throw an error with correct error message', async() => {
        try {
          await dGutTokenMock.mint('invalid address', 100);
          assert.fail('Transaction should throw an error');
        } catch(err) {
          assert.equal(err.value, 'invalid address');
        }
      });
    });
  });
});
