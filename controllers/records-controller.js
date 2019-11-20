const { Records } = require("../models");

const recordTypes = [
  { type: "INC", label: "Income" },
  { type: "FEE", label: "Fee" },
  { type: "SND", label: "Send" },
  { type: "SELL", label: "Sell" }
];

const recordsController = {};

recordsController.GetTypes = async (req, res, next) => {
  res.json(recordTypes);
};

recordsController.List = async (req, res, next) => {
  let {
    year = null,
    recordType = null,
    coinSymbol = null,
    page = 1,
    limit = 100
  } = req.query;

  try {
    // TODO clean query string
    if (!page || isNaN(page)) {
      page = 1;
    }
    if (!limit || isNaN(limit)) {
      limit = 100;
    }
    page = parseInt(page);
    limit = parseInt(limit);

    // Get account records on a per-year basis
    if (!year || isNaN(year)) {
      year = new Date().getFullYear();
    }
    year = parseInt(year);

    // Determine which record type to show
    recordType = recordType === null ? null : recordType.toUpperCase().trim();

    if (
      recordType !== "INC" &&
      (recordType !== "FEE") & (recordType !== "SELL") &&
      recordType !== "SND"
    ) {
      recordType = null;
    }

    // Get all accepted records for user, in the relevant year
    const queryCritera = {
      user: req.user._id,
      isAcceptedByUser: true,
      txTime: { $gte: new Date(year, 1, 1), $lte: new Date(year, 12, 31) } // For full year
    };

    // Apply record type if applicable
    if (recordType !== null) {
      queryCritera.type = recordType;
    }

    // Apply coinSymbol if applicable
    if (coinSymbol !== null) {
      queryCritera.coinSymbol = coinSymbol;
    }

    // CLOSED SOURCE FOR DEMO

    const responseObject = {
      records: usersRecordsPaged,
      total: runningBalance,
      coinTotal: runningCoinBalance
    };

    res.json(responseObject);
  } catch (err) {
    next(err, req, res);
  }
};

recordsController.GetFees = async (req, res, next) => {
  try {
    // Get account records on a per-year basis
    let year = req.query.year;
    if (!year || isNaN(year)) {
      year = new Date().getFullYear();
    }
    year = parseInt(year);

    let runningBalance = 0;
    let runningCoinBalance = 0;

    // CLOSED SOURCE FOR DEMO

    res.json(mappedRecords);
  } catch (err) {
    next(err, req, res);
  }
};

module.exports = recordsController;
