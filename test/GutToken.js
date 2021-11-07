const GutToken = artifacts.require("GutToken");

contract('GutToken', (accounts) => {
  let gutToken;
  before(async() => {
    gutToken = await GutToken.deployed();
  });

  describe('initialize', () => {
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
    it('returns total supply as a balance from deployer address', async() => {
      const balance = await gutToken.balanceOf(accounts[0]);
      assert.equal(balance.toNumber(), 1000000);
    });

    it('returns 0 balance from non deployer address', async() => {
      const balance = await gutToken.balanceOf(accounts[1]);
      assert.equal(balance.toNumber(), 0);
    });
  });

  describe('transfer', () => {
    describe('given valid recipient address', () => {
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
        try {
          await gutToken.transfer('invalid address', 100000);
          assert.fail('Transaction should throw an error');
        } catch(err) {
          assert.equal(err.value, 'invalid address');
        }
      });
    });
  });

  describe('approve and allowance', () => {
    describe('given valid spender address', () => {
      describe('given valid value', () => {
        let transaction;
        before(async() => {
          transaction = await gutToken.approve(accounts[1], 100);
        });

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

        it('updates allowance with correct value', async() => {
          const allowance = await gutToken.allowance(accounts[0], accounts[1]);
          assert.equal(allowance.toNumber(), 100);
        });
      });

      describe('given 0 value', () => {
        let transaction;
        before(async() => {
          transaction = await gutToken.approve(accounts[1], 0);
        });

        it('returns true', async() => {
          const status = await gutToken.approve.call(accounts[1], 0);
          assert.isTrue(status);
        });

        it('emits Approval event', () => {
          assert.equal(transaction.logs.length, 1);
          assert.equal(transaction.logs[0].event, 'Approval');
          assert.equal(transaction.logs[0].args._owner, accounts[0]);
          assert.equal(transaction.logs[0].args._spender, accounts[1]);
          assert.equal(transaction.logs[0].args._value, 0);
        });

        it('updates allowance with correct value', async() => {
          const allowance = await gutToken.allowance(accounts[0], accounts[1]);
          assert.equal(allowance.toNumber(), 0);
        });
      });

      describe('given negative value', () => {
        it('throw an error with correct error message', async() => {
          try {
            await gutToken.approve(accounts[1], -100);
            assert.fail('Transaction should throw an error');
          } catch(err) {
            assert.equal(err.reason, 'value out-of-bounds');
          }
        });
      });
    });

    describe('given invalid spender address', () => {
      it('throw an error with correct error message', async() => {
        try {
          await gutToken.approve('invalid address', 100);
          assert.fail('Transaction should throw an error');
        } catch(err) {
          assert.equal(err.value, 'invalid address');
        }
      });
    });
  });

  describe('transferFrom', () => {
    describe('given valid _from and _to address', () => {
      describe('given sufficient value', () => {
        it('returns true', async() => {
          const status = await gutToken.transferFrom.call(accounts[0], accounts[1], 100);
          assert.isTrue(status);
        });
      })
    });

    // describe('given invalid _from address', () => {

    // });

    // describe('given invalid _to address', () => {

    // })
  });
});
