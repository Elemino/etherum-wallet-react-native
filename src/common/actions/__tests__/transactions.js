import { wallet as WalletStore } from '@common/stores';
import { Wallet as WalletUtils, Transaction as TransactionUtils } from '@common/utils';
import * as Transactions from '../transactions';
import { ethers } from 'ethers';

const WALLET_PK = '62384683889eae6de8440eb735856f31bb4f17815888f847c8567b3c87f00be8';
const DESTINATION_ADDRESS = '0x407428BF09ea7Dac2824A64AfE88171041a02b14';

describe('TransactionsActions', () => {

  beforeEach(() => WalletStore.reset());

  it('`sendTransaction` should break if the the wallet or the transaction is invalid', async function() {
    const mnemonics = WalletUtils.generateMnemonics();
    const wallet = WalletUtils.loadWalletFromMnemonics(mnemonics);
    try {
      await Transactions.sendTransaction(null);
      fail('should have thrown an Error.');
    } catch (e) { expect(e.message).toBe('Invalid wallet'); }

    try {
      await Transactions.sendTransaction(wallet, {});
      fail('should have thrown an Error.');
    } catch (e) { expect(e.message).toBe('Invalid transaction'); }
  });

  it('`sendTransaction` should send ether to some address when there are funds available', async function() {
    jest.setTimeout(60000);
    const wallet = WalletUtils.loadWalletFromPrivateKey(WALLET_PK);
    const value = '0.002';
    let txn = TransactionUtils.createTransaction(DESTINATION_ADDRESS, value);
    try {
      txn = await Transactions.sendTransaction(wallet, txn);
      expect(txn.from).toBe(wallet.address);
      expect(txn.to).toBe(DESTINATION_ADDRESS);
      expect(txn.value.toString()).toBe(ethers.utils.parseEther(value).toString());
      expect(WalletStore.pendingTransactions.length).toBe(1);
    } catch (e) { fail(e); }
  });
});