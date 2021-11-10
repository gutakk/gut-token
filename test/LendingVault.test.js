const GutToken = artifacts.require("GutToken");
const DGutToken = artifacts.require("DGutToken");
const LendingVault = artifacts.require("LendingVault");

const depositAmount = 100;
const withdrawAmount = 50;

contract('LendingVault', (accounts) => {
  before(async() => {
    gutToken = await GutToken.deployed();
    dGutToken = await DGutToken.deployed();
    lendingVault = await LendingVault.deployed();
  });

  describe('initialize', () => {
    it('returns non zero contract address', () => {
      assert.notEqual(lendingVault.address, 0x0);
    });

    it('returns non zero GutToken contract address', async() => {
      const gutTokenContract = await lendingVault.gutToken();
      assert.notEqual(gutTokenContract.address, 0x0);
    })
  });

  describe('deposit', () => {
    describe('given 0 amount', () => {
      before(async() => {
        await gutToken.approve(lendingVault.address, 100);
        transaction = await lendingVault.deposit(0);
      });
  
      it('returns correct balance from lending vault after deposit', async() => {
        const contractBalance = await gutToken.balanceOf(lendingVault.address);
        assert.equal(contractBalance.toNumber(), 0);
      });
  
      it('emits Deposit event', async() => {
        assert.equal(transaction.logs.length, 1);
        assert.equal(transaction.logs[0].event, 'Deposit');
        assert.equal(transaction.logs[0].args._amount, 0);
      });
    });

    describe('given valid amount', () => {
      before(async() => {
        await gutToken.approve(lendingVault.address, depositAmount);
        transaction = await lendingVault.deposit(depositAmount);
      });
  
      it('returns correct balance from lending vault after deposit', async() => {
        const contractBalance = await gutToken.balanceOf(lendingVault.address);
        assert.equal(contractBalance.toNumber(), depositAmount);
      });
  
      it('emits Deposit event', async() => {
        assert.equal(transaction.logs.length, 1);
        assert.equal(transaction.logs[0].event, 'Deposit');
        assert.equal(transaction.logs[0].args._amount, depositAmount);
      });

      it('receives correct DGutToken', async() => {
        const dGutTokenBalance = await dGutToken.balanceOf(accounts[0]);
        assert.equal(dGutTokenBalance.toNumber(), depositAmount);
      });
    });

    describe('given negative amount', () => {
      it('throw an error with correct error message', async() => {
        try {
          await gutToken.approve(lendingVault.address, 100);
          await lendingVault.deposit(-100);
          assert.fail('Transaction should throw an error');
        } catch(err) {
          assert.equal(err.reason, 'value out-of-bounds');
        }
      });
    });
  });

  describe('withdraw', () => {
    describe('given 0 amount', () => {
      before(async() => {
        accountBalance = await gutToken.balanceOf(accounts[0])
        transaction = await lendingVault.withdraw(0);
      });

      it('emits Withdraw event', async() => {
        assert.equal(transaction.logs.length, 1);
        assert.equal(transaction.logs[0].event, 'Withdraw');
        assert.equal(transaction.logs[0].args._amount, 0);
      });

      it('does NOT receive GutToken', async() => {
        const finalBalance = await gutToken.balanceOf(accounts[0]);
        assert.equal(finalBalance.toNumber(), accountBalance.toNumber());
      });

      it('does NOT remove dGutToken', async() => {
        const debtBalance = await dGutToken.balanceOf(accounts[0]);
        assert.equal(debtBalance.toNumber(), depositAmount);
      });
    });

    describe('given valid amount', () => {
      before(async() => {
        accountBalance = await gutToken.balanceOf(accounts[0])
        transaction = await lendingVault.withdraw(withdrawAmount);
      });

      it('emits Withdraw event', async() => {
        assert.equal(transaction.logs.length, 1);
        assert.equal(transaction.logs[0].event, 'Withdraw');
        assert.equal(transaction.logs[0].args._amount, withdrawAmount);
      });

      it('receives correct amount of GutToken', async() => {
        const finalBalance = await gutToken.balanceOf(accounts[0]);
        assert.equal(finalBalance.toNumber(), accountBalance.toNumber() + withdrawAmount);
      });

      it('removes correct amount of dGutToken', async() => {
        const debtBalance = await dGutToken.balanceOf(accounts[0]);
        assert.equal(debtBalance.toNumber(), depositAmount - withdrawAmount);
      });
    });

    describe('given amount exceeds debt token balance', () => {
      before(async() => {
        accountBalance = await gutToken.balanceOf(accounts[0])
        debtBalance = await dGutToken.balanceOf(accounts[0])
      });

      it('throw an error with correct error message', async() => {
        try {
          await lendingVault.withdraw(9999);
          assert.fail('Transaction should throw an error');
        } catch(err) {
          assert.equal(err.reason, 'burn amount exceeds balance');
        }
      });

      it('does NOT transfer GutToken from contract', async() => {
        try {
          await lendingVault.withdraw(9999);
          assert.fail('Transaction should throw an error');
        } catch(err) {
          const finalBalance = await gutToken.balanceOf(accounts[0]);
          assert.equal(finalBalance.toNumber(), accountBalance.toNumber());
        }
      });

      it('does NOT remove dGutToken from account', async() => {
        try {
          await lendingVault.withdraw(9999);
          assert.fail('Transaction should throw an error');
        } catch(err) {
          const finalDebtBalance = await dGutToken.balanceOf(accounts[0]);
         assert.equal(finalDebtBalance.toNumber(), debtBalance);
        }
      });
    });

    describe('given negative amount', () => {
      it('throw an error with correct error message', async() => {
        try {
          await lendingVault.withdraw(-100);
          assert.fail('Transaction should throw an error');
        } catch(err) {
          assert.equal(err.reason, 'value out-of-bounds');
        }
      });
    });
  });
});
