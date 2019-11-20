const { Accounts, Wallets } = require("../models");

const walletsController = {};

walletsController.List = async (req, res, next) => {
  try {
    // CLOSED SOURCE FOR DEMO

    res.json(wallets);
  } catch (err) {
    next(err, req, res);
  }
};

walletsController.ListByAccount = async (req, res, next) => {
  try {
    // CLOSED SOURCE FOR DEMO

    res.json(wallets);
  } catch (err) {
    next(err, req, res);
  }
};

walletsController.Post = async (req, res, next) => {
  try {
    const { publicAddress, coinSymbol, name } = req.body;

    // CLOSED SOURCE FOR DEMO

    res.json(wallet);
  } catch (err) {
    next(err, req, res);
  }
};

walletsController.Get = async (req, res, next) => {
  try {
    // CLOSED SOURCE FOR DEMO

    res.json(wallet || {});
  } catch (err) {
    next(err, req, res);
  }
};

walletsController.Put = async (req, res, next) => {
  const { wallet_id } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).send();
  }
  try {
    // CLOSED SOURCE FOR DEMO
    res.json(wallet);
  } catch (err) {
    next(err, req, res);
  }
};

walletsController.Delete = async (req, res, next) => {
  const { wallet_id } = req.params;

  try {
    // CLOSED SOURCE FOR DEMO
    res.json(wallet);
  } catch (err) {
    next(err, req, res);
  }
};

module.exports = walletsController;
