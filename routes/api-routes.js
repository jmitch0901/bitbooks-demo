// Deps
const Express = require("express"),
  Passport = require("passport");
// Controllers
const {
  AccountsController,
  WalletsController,
  TransactionsController,
  RecordsController
} = require("../controllers");

// Middleware
const {
  MiddlewareIsAuthenticated,
  MiddlewarePaginate
} = require("../middleware");

const apiRouter = Express.Router();

// TODO
// Accounts
apiRouter.get("/accounts", MiddlewareIsAuthenticated, AccountsController.List);
apiRouter.post("/accounts", MiddlewareIsAuthenticated, AccountsController.Post);

apiRouter.get(
  "/accounts/summary",
  MiddlewareIsAuthenticated,
  AccountsController.GetAccountsSummary
);
apiRouter.get(
  "/accounts/availableYears",
  MiddlewareIsAuthenticated,
  AccountsController.GetAvailableYears
);
apiRouter.get(
  "/accounts/records",
  MiddlewareIsAuthenticated,
  RecordsController.GetFees
);

apiRouter.get(
  "/accounts/:account_id",
  MiddlewareIsAuthenticated,
  AccountsController.Get
);
apiRouter.put(
  "/accounts/:account_id",
  MiddlewareIsAuthenticated,
  AccountsController.Put
);
apiRouter.delete(
  "/accounts/:account_id",
  MiddlewareIsAuthenticated,
  AccountsController.Delete
);

apiRouter.get(
  "/accounts/:account_id/records",
  MiddlewareIsAuthenticated,
  RecordsController.List
);

// Wallets
apiRouter.get("/wallets", MiddlewareIsAuthenticated, WalletsController.List);
apiRouter.put(
  "/wallets/:wallet_id",
  MiddlewareIsAuthenticated,
  WalletsController.Put
);
apiRouter.delete(
  "/wallets/:wallet_id",
  MiddlewareIsAuthenticated,
  WalletsController.Delete
);

apiRouter.get(
  "/accounts/:account_id/wallets",
  MiddlewareIsAuthenticated,
  WalletsController.ListByAccount
);
apiRouter.post(
  "/accounts/:account_id/wallets",
  MiddlewareIsAuthenticated,
  WalletsController.Post
);
apiRouter.get(
  "/accounts/:account_id/wallets/:wallet_id",
  MiddlewareIsAuthenticated,
  WalletsController.Get
);
apiRouter.put(
  "/accounts/:account_id/wallets/:wallet_id",
  MiddlewareIsAuthenticated,
  WalletsController.Put
);
apiRouter.delete(
  "/accounts/:account_id/wallets/:wallet_id",
  MiddlewareIsAuthenticated,
  WalletsController.Delete
);

// Transactions
apiRouter.get(
  "/accounts/:account_id/wallets/:wallet_id/transactions",
  MiddlewareIsAuthenticated,
  MiddlewarePaginate,
  TransactionsController.List
);
apiRouter.get(
  "/accounts/:account_id/wallets/:wallet_id/transactions/:tx_id",
  MiddlewareIsAuthenticated,
  TransactionsController.Get
);
apiRouter.put(
  "/accounts/:account_id/wallets/:wallet_id/transactions/:tx_id",
  MiddlewareIsAuthenticated,
  TransactionsController.Put
);

apiRouter.get(
  "/transactions",
  MiddlewareIsAuthenticated,
  MiddlewarePaginate,
  TransactionsController.List
);
apiRouter.get(
  "/transactions/filterableCoins",
  MiddlewareIsAuthenticated,
  TransactionsController.GetFilterableCoins
);
apiRouter.get(
  "/transactions/:tx_id",
  MiddlewareIsAuthenticated,
  TransactionsController.Get
);
apiRouter.put(
  "/transactions/:tx_id/accept",
  MiddlewareIsAuthenticated,
  TransactionsController.Accept
);
apiRouter.put(
  "/transactions/:tx_id/discard",
  MiddlewareIsAuthenticated,
  TransactionsController.Discard
);

apiRouter.put(
  "/transactions/bulkAccept",
  MiddlewareIsAuthenticated,
  TransactionsController.BulkAcceptTransactions
);
apiRouter.put(
  "/transactions/bulkDiscard",
  MiddlewareIsAuthenticated,
  TransactionsController.BulkDiscardTransactions
);

// Records
apiRouter.get("/records", MiddlewareIsAuthenticated, RecordsController.List);
apiRouter.get(
  "/records/types",
  MiddlewareIsAuthenticated,
  RecordsController.GetTypes
);

// Catch All
apiRouter.get("*", (req, res) => res.status(404).json({ error: "Not Found" }));

// Error Handler
apiRouter.use((err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.error(err);
    return res.status(500).json(err);
  }

  if (!err || !err.response || !err.response.status) {
    return res.status(500).json({ error: "Unknown server error." });
  }

  const dataResponse = err.response.data ? { error: err.response.data } : "";
  return res.status(err.response.status).json(dataResponse);
});

module.exports = apiRouter;
