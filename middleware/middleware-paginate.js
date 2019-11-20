const paginateChecker = {};

paginateChecker.requirePagination = (req, res, next) => {
  if(!req.query.page || isNaN(req.query.page) || req.query.page < 1) {
    req.query.page = 1;
  }

  req.query.page = parseInt(req.query.page);

  if(!req.query.limit || isNaN(req.query.limit) || req.query.limit < 1) {
    req.query.limit = 50;
  }

  req.query.limit = parseInt(req.query.limit);

  next();
}

module.exports = paginateChecker;
