const { Accounts, Records } = require("../models");

// CONTROLLER START

const accountsController = {};

accountsController.List = async (req, res, next) => {
  try {
    const accounts = await Accounts.find({ user: req.user._id })
      .lean()
      .exec();
    res.json(accounts);
  } catch (err) {
    next(err, req, res);
  }
};

accountsController.Post = async (req, res, next) => {
  try {
    const { name, coinSymbol } = req.body;
    const account = await new Accounts({
      name,
      user: req.user._id,
      coinSymbol
    }).save();
    res.json(account);
  } catch (err) {
    next(err, req, res);
  }
};

accountsController.Get = async (req, res, next) => {
  try {
    const account = await Accounts.findOne({
      _id: req.params.account_id,
      user: req.user._id
    })
      .lean()
      .exec();
    res.json(account || {});
  } catch (err) {
    next(err, req, res);
  }
};

// NOTE - Only allow account name to be edited
accountsController.Put = async (req, res, next) => {
  try {
    const { account_id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).send();
    }

    const account = await Accounts.findOne({
      _id: account_id,
      user: req.user._id
    });
    if (!account) {
      return res.status(404).send();
    }
    account.name = name;
    await account.save();
    res.json(account);
  } catch (err) {
    next(err, req, res);
  }
};

accountsController.GetAvailableYears = async (req, res, next) => {
  try {
    // CLOSED SOURCE FOR DEMO
  } catch (err) {
    next(err, req, res);
  }
};

accountsController.GetAccountsSummary = async (req, res, next) => {
  // Get account summary on a per-year basis
  let year = req.query.year;
  if (!year || isNaN(year)) {
    year = new Date().getFullYear();
  }
  year = parseInt(year);

  try {
    // CLOSED SOURCE FOR DEMO
  } catch (err) {
    next(err, req, res);
  }
};

module.exports = accountsController;
