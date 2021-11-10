const DGutToken = artifacts.require("DGutToken");

const mintAmount = 100;

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
  });

  describe('mint token', () => {
    describe('given valid target address', () => {
      describe('given 0 amount', () => {
        before(async() => {
          transaction = await dGutToken.mint(accounts[0], 0);
        });
  
        it('emit Transfer event', async() => {
          assert.equal(transaction.logs.length, 1);
          assert.equal(transaction.logs[0].event, 'Transfer');
          assert.equal(transaction.logs[0].args._from, 0x0);
          assert.equal(transaction.logs[0].args._to, accounts[0]);
          assert.equal(transaction.logs[0].args._value, 0);
        });
  
        it('mints correct balance to target address', async() => {
          const balance = await dGutToken.balanceOf(accounts[0]);
          assert.equal(balance.toNumber(), 0);
        });
  
        it('updates correct total supply', async() => {
          const totalSupply = await dGutToken.totalSupply();
          assert.equal(totalSupply.toNumber(), 0);
        });
      });

      describe('given positive amount', () => {
        before(async() => {
          transaction = await dGutToken.mint(accounts[0], mintAmount);
        });
  
        it('emit Transfer event', async() => {
          assert.equal(transaction.logs.length, 1);
          assert.equal(transaction.logs[0].event, 'Transfer');
          assert.equal(transaction.logs[0].args._from, 0x0);
          assert.equal(transaction.logs[0].args._to, accounts[0]);
          assert.equal(transaction.logs[0].args._value, mintAmount);
        });
  
        it('mints correct balance to target address', async() => {
          const balance = await dGutToken.balanceOf(accounts[0]);
          assert.equal(balance.toNumber(), mintAmount);
        });
  
        it('updates correct total supply', async() => {
          const totalSupply = await dGutToken.totalSupply();
          assert.equal(totalSupply.toNumber(), mintAmount);
        });
      });

      describe('given negative amount', () => {
        it('throw an error with correct error message', async() => {
          try {
            await dGutToken.mint(accounts[1], -100);
            assert.fail('Transaction should throw an error');
          } catch(err) {
            assert.equal(err.reason, 'value out-of-bounds');
          }
        });
      });
    });

    describe('given invalid target address', () => {
      it('throw an error with correct error message', async() => {
        try {
          await dGutToken.mint('invalid address', mintAmount);
          assert.fail('Transaction should throw an error');
        } catch(err) {
          assert.equal(err.value, 'invalid address');
        }
      });
    });
  });

  describe('burn token', () => {
    describe('given valid target address', () => {
      describe('given 0 amount', () => {
        before(async() => {
          transaction = await dGutToken.burn(accounts[0], 0);
        });

        it('emit Transfer event', async() => {
          assert.equal(transaction.logs.length, 1);
          assert.equal(transaction.logs[0].event, 'Transfer');
          assert.equal(transaction.logs[0].args._from, accounts[0]);
          assert.equal(transaction.logs[0].args._to, 0x0);
          assert.equal(transaction.logs[0].args._value, 0);
        });

        it('does NOT burn balance from target address', async() => {
          const balance = await dGutToken.balanceOf(accounts[0]);
          assert.equal(balance.toNumber(), mintAmount);
        });
  
        it('does NOT decrease total supply', async() => {
          const totalSupply = await dGutToken.totalSupply();
          assert.equal(totalSupply.toNumber(), mintAmount);
        });
      });

      describe('given positive amount', () => {
        before(async() => {
          transaction = await dGutToken.burn(accounts[0], 50);
        });

        it('emit Transfer event', async() => {
          assert.equal(transaction.logs.length, 1);
          assert.equal(transaction.logs[0].event, 'Transfer');
          assert.equal(transaction.logs[0].args._from, accounts[0]);
          assert.equal(transaction.logs[0].args._to, 0x0);
          assert.equal(transaction.logs[0].args._value, 50);
        });

        it('burns correct amount from target address', async() => {
          const balance = await dGutToken.balanceOf(accounts[0]);
          assert.equal(balance.toNumber(), 50);
        });
  
        it('decreases correct amount from total supply', async() => {
          const totalSupply = await dGutToken.totalSupply();
          assert.equal(totalSupply.toNumber(), 50);
        });
      });

      describe('given burn amount exceeds target address balance', () => {
        it('throw an error with correct error message', async() => {
          try {
            await dGutToken.burn(accounts[0], 9999);
            assert.fail('Transaction should throw an error');
          } catch(err) {
            assert.equal(err.reason, 'burn amount exceeds balance');
          }
        });
      });

      describe('given negative amount', () => {
        it('throw an error with correct error message', async() => {
          try {
            await dGutToken.burn(accounts[1], -100);
            assert.fail('Transaction should throw an error');
          } catch(err) {
            assert.equal(err.reason, 'value out-of-bounds');
          }
        });
      });
    });
  });
});
