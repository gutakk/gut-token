const GutToken = artifacts.require("GutToken");

contract('GutToken', (accounts) => {
  describe('initialize', () => {
    let gutToken;
    before(async() => {
      gutToken = await GutToken.deployed();
    });

    it('sets correct total supply', async() => {
      const totalSupply = await gutToken.totalSupply();
      assert.equal(totalSupply.toNumber(), 1000000);
    });

    it('sets correct token name', async() => {
      const tokenName = await gutToken.name();
      assert.equal(tokenName, 'GutToken');
    });

    it('sets correct token symbol', async() => {
      const tokenSymbol = await gutToken.symbol();
      assert.equal(tokenSymbol, 'GUT');
    });

    it('sets correct token decimals', async() => {
      const tokenDecimals = await gutToken.decimals();
      assert.equal(tokenDecimals, 18);
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
      });
    });
  });

  describe('transfer', () => {
    describe('given valid recipient address', () => {
      let gutToken;
      before(async() => {
        gutToken = await GutToken.deployed();
      })

      describe('given 0 value', () => {
        let transaction;
        before(async() => {
          transaction = await gutToken.transfer(accounts[1], 0);
        });

        it('returns true', async() => {
          const status = await gutToken.transfer.call(accounts[1], 100000);
          assert.isTrue(status);
        });

        it('emits a Transfer event', () => {
          assert.equal(transaction.logs.length, 1);
          assert.equal(transaction.logs[0].event, 'Transfer');
          assert.equal(transaction.logs[0].args._from, accounts[0]);
          assert.equal(transaction.logs[0].args._to, accounts[1]);
          assert.equal(transaction.logs[0].args._value, 0);
        });

        it('returns correct balance from msg.sender address', async() => {
          const balance = await gutToken.balanceOf(accounts[0]);
          assert.equal(balance.toNumber(), 1000000);
        });

        it('returns 0 balance from recipient address', async() => {
          const balance = await gutToken.balanceOf(accounts[1]);
          assert.equal(balance.toNumber(), 0);
        });
      });

      describe('given sufficient value', () => {
        let transaction;
        before(async() => {
          transaction = await gutToken.transfer(accounts[1], 100000);
        });

        it('returns true', async() => {
          const status = await gutToken.transfer.call(accounts[1], 100000);
          assert.isTrue(status);
        });

        it('emits a Transfer event', () => {
          assert.equal(transaction.logs.length, 1);
          assert.equal(transaction.logs[0].event, 'Transfer');
          assert.equal(transaction.logs[0].args._from, accounts[0]);
          assert.equal(transaction.logs[0].args._to, accounts[1]);
          assert.equal(transaction.logs[0].args._value, 100000);
        });

        it('returns correct balance from msg.sender address', async() => {
          const balance = await gutToken.balanceOf(accounts[0]);
          assert.equal(balance.toNumber(), 900000);
        });

        it('returns correct balance from recipient address', async() => {
          const balance = await gutToken.balanceOf(accounts[1]);
          assert.equal(balance.toNumber(), 100000);
        });
      });
  
      describe('given insufficient value', () => {
        it('throws an error with correct error message', async() => {
          try {
            await gutToken.transfer(accounts[1], 999999999);
            assert.fail('Transaction should throw an error');
          } catch(err) {
            assert.equal(err.reason, 'insufficient funds');
          }
        });
      });
  
      describe('given negative value', () => {
        it('throw an error with correct error message', async() => {
          try {
            await gutToken.transfer(accounts[1], -100);
            assert.fail('Transaction should throw an error');
          } catch(err) {
            assert.equal(err.reason, 'value out-of-bounds');
          }
        });
      });
    });

    describe('given invalid recipient address', () => {
      it('throw an error with correct error message', async() => {
        const gutToken = await GutToken.deployed();
        try {
          await gutToken.transfer('invalid address', 100000);
          assert.fail('Transaction should throw an error');
        } catch(err) {
          assert.equal(err.value, 'invalid address');
        }
      });
    });
  });

  describe('approve', () => {
    describe('given valid spender address', () => {
      let gutToken, transaction;
      before(async() => {
        gutToken = await GutToken.deployed();
        transaction = await gutToken.approve(accounts[1], 100);
      });

      describe('given valid value', () => {
        it('returns true', async() => {
          const status = await gutToken.approve.call(accounts[1], 100);
          assert.isTrue(status);
        });

        it('emits Approval event', () => {
          assert.equal(transaction.logs.length, 1);
          assert.equal(transaction.logs[0].event, 'Approval');
          assert.equal(transaction.logs[0].args._owner, accounts[0]);
          assert.equal(transaction.logs[0].args._spender, accounts[1]);
          assert.equal(transaction.logs[0].args._value, 100);
        });
      });
    });
  });
});
