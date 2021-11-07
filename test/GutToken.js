const GutToken = artifacts.require("GutToken");

contract('GutToken', (accounts) => {
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
        it('returns true', async() => {
          const status = await gutToken.transfer.call(accounts[1], 100000);
          assert.isTrue(status);
        });
        
        it('emits a Transfer event', async() => {
          const transaction = await gutToken.transfer(accounts[1], 0);
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
        it('returns true', async() => {
          const status = await gutToken.transfer.call(accounts[1], 100000);
          assert.isTrue(status);
        });
        
        it('emits a Transfer event', async() => {
          const transaction = await gutToken.transfer(accounts[1], 100000);
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
        it('returns true', async() => {
          const status = await gutToken.approve.call(accounts[1], 100);
          assert.isTrue(status);
        });
        
        it('emits Approval event', async() => {
          const transaction = await gutToken.approve(accounts[1], 100);
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
        it('returns true', async() => {
          const status = await gutToken.approve.call(accounts[1], 0);
          assert.isTrue(status);
        });
        
        it('emits Approval event', async() => {
          const transaction = await gutToken.approve(accounts[1], 0);
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

      describe('given new allowance for current spender', () => {
        it('replaces allowance with correct value', async() => {
          await gutToken.approve(accounts[1], 100);
          const allowanceBeforeUpdate = await gutToken.allowance(accounts[0], accounts[1]);
          assert.equal(allowanceBeforeUpdate.toNumber(), 100);

          await gutToken.approve(accounts[1], 1000);
          const allowanceAfterUpdate = await gutToken.allowance(accounts[0], accounts[1]);
          assert.equal(allowanceAfterUpdate.toNumber(), 1000);
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
    spender = accounts[1];
    fromAccount = accounts[2]
    toAccount = accounts[3];

    describe('given valid _from and _to address', () => {
      before(async() => {
        await gutToken.transfer(accounts[2], 1000);
      });

      describe('given 0 value', () => {
        before(async() => {
          await gutToken.approve(spender, 100, { from: fromAccount });
        });
        
        it('returns true', async() => {
          const status = await gutToken.transferFrom.call(fromAccount, toAccount, 0, { from: spender });
          assert.isTrue(status);
        });
        
        it('emits a Transfer event', async() => {
          const transaction = await gutToken.transferFrom(fromAccount, toAccount, 0, { from: spender });
          assert.equal(transaction.logs.length, 1);
          assert.equal(transaction.logs[0].event, 'Transfer');
          assert.equal(transaction.logs[0].args._from, fromAccount);
          assert.equal(transaction.logs[0].args._to, toAccount);
          assert.equal(transaction.logs[0].args._value, 0);
        });

        it('returns correct balance from fromAccount address', async() => {
          const balance = await gutToken.balanceOf(fromAccount);
          assert.equal(balance.toNumber(), 1000);
        });

        it('returns correct balance from toAccount address', async() => {
          const balance = await gutToken.balanceOf(toAccount);
          assert.equal(balance.toNumber(), 0);
        });

        it('decreases spender allowance', async() => {
          const allowance = await gutToken.allowance(fromAccount, spender);
          assert.equal(allowance.toNumber(), 100);
        })
      });
      
      describe('given sufficient value', () => {
        before(async() => {
          await gutToken.approve(spender, 100, { from: fromAccount });
        });
        
        it('returns true', async() => {
          const status = await gutToken.transferFrom.call(fromAccount, toAccount, 100, { from: spender });
          assert.isTrue(status);
        });
        
        it('emits a Transfer event', async() => {
          const transaction = await gutToken.transferFrom(fromAccount, toAccount, 100, { from: spender });
          assert.equal(transaction.logs.length, 1);
          assert.equal(transaction.logs[0].event, 'Transfer');
          assert.equal(transaction.logs[0].args._from, fromAccount);
          assert.equal(transaction.logs[0].args._to, toAccount);
          assert.equal(transaction.logs[0].args._value, 100);
        });

        it('returns correct balance from fromAccount address', async() => {
          const balance = await gutToken.balanceOf(fromAccount);
          assert.equal(balance.toNumber(), 900);
        });

        it('returns correct balance from toAccount address', async() => {
          const balance = await gutToken.balanceOf(toAccount);
          assert.equal(balance.toNumber(), 100);
        });

        it('decreases spender allowance', async() => {
          const allowance = await gutToken.allowance(fromAccount, spender);
          assert.equal(allowance.toNumber(), 0);
        })
      });

      describe('given insufficient value', () => {
        it('throw an error with correct error message', async() => {
          try {
            await gutToken.transferFrom(fromAccount, toAccount, 10000, { from: spender });
            assert.fail('Transaction should throw an error');
          } catch(err) {
            assert.equal(err.reason, 'insufficient funds');
          }
        });
      });

      describe('given larger value than allowance', () => {
        it('throw an error with correct error message', async() => {
          try {
            await gutToken.transferFrom(fromAccount, toAccount, 101, { from: spender });
            assert.fail('Transaction should throw an error');
          } catch(err) {
            assert.equal(err.reason, 'insufficient allowance');
          }
        });
      });

      describe('given negative value', () => {
        it('throw an error with correct error message', async() => {
          try {
            await gutToken.transferFrom(fromAccount, toAccount, -100, { from: spender });
            assert.fail('Transaction should throw an error');
          } catch(err) {
            assert.equal(err.reason, 'value out-of-bounds');
          }
        });
      });
    });

    describe('given invalid _from address', () => {
      it('throw an error with correct error message', async() => {
        try {
          await gutToken.transferFrom('invalid address', toAccount, 100, { from: spender });
          assert.fail('Transaction should throw an error');
        } catch(err) {
          assert.equal(err.value, 'invalid address');
        }
      });
    });

    describe('given invalid _to address', () => {
      it('throw an error with correct error message', async() => {
        try {
          await gutToken.transferFrom(fromAccount, 'invalid address', 100, { from: spender });
          assert.fail('Transaction should throw an error');
        } catch(err) {
          assert.equal(err.value, 'invalid address');
        }
      });
    });
  });
});
