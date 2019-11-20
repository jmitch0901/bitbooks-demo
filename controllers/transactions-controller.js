const { Transactions, Records, Accounts } = require("../models");

const transactionsController = {};

transactionsController.List = async (req, res, next) => {
  try {
    // CLOSED SOURCE FOR DEMO
    res.json(transactions);
  } catch (err) {
    next(err, req, res);
  }
};

transactionsController.Get = async (req, res, next) => {
  try {
    const { tx_id } = req.params;
    // CLOSED SOURCE FOR DEMO
    res.json(foundTransaction);
  } catch (err) {
    next(err, req, res);
  }
};

transactionsController.Put = async (req, res, next) => {
  try {
    // CLOSED SOURCE FOR DEMO
    res.status(404).send();
  } catch (err) {
    next(err, req, res);
  }
};

transactionsController.Accept = async (req, res, next) => {
  try {
    const { tx_id } = req.params;
    const { records, timeOfTxValue } = req.body;
    await _acceptTransaction(txId);
    await _updateUsersAccountBalances(req.user);
    // CLOSED SOURCE FOR DEMO
    res.json(acceptedTransaction);
  } catch (err) {
    next(err, req, res);
  }
};

transactionsController.Discard = async (req, res, next) => {
  try {
    const { tx_id } = req.params;
    const { records } = req.body;
    // CLOSED SOURCE FOR DEMO
    await transaction.save();
    res.json(transaction);
  } catch (err) {
    next(err, req, res);
  }
};

transactionsController.BulkAcceptTransactions = async (req, res, next) => {
  try {
    const acceptedTransactionIds = Array.from(new Set(req.body));
    const bulkAcceptPromises = acceptedTransactionIds.map(tx_id =>
      _acceptTransaction(req.user, tx_id)
    );
    const acceptedTransactions = await Promise.all(bulkAcceptPromises);
    await _updateUsersAccountBalances(req.user);
    res.json(acceptedTransactions);
  } catch (err) {
    next(err, req, res);
  }
};

transactionsController.BulkDiscardTransactions = async (req, res, next) => {
  try {
    const discardedTransactionIds = Array.from(new Set(req.body));
    const bulkDiscardPromises = discardedTransactionIds.map(tx_id =>
      _discardTransaction(req.user, tx_id)
    );
    const discardedTransactions = await Promise.all(bulkDiscardPromises);
    res.json(discardedTransactions);
  } catch (err) {
    next(err, req, res);
  }
};

transactionsController.GetFilterableCoins = async (req, res, next) => {
  try {
    const availableFilterableCoins = await _getAvailableCoinsToFilter(req.user);
    res.json(availableFilterableCoins);
  } catch (err) {
    next(err, req, res);
  }
};

module.exports = transactionsController;
