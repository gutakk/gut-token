const GutToken = artifacts.require("GutToken");
const DGutToken = artifacts.require("DGutToken");
const LendingVault = artifacts.require("LendingVault");

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
        depositAmount = 0;
        await gutToken.approve(lendingVault.address, 100);
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
    });

    describe('given valid amount', () => {
      before(async() => {
        depositAmount = 100;
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
});
