const meController = {}

// TODO - Secure returnables
meController.GetUserInfo = async (req, res, next) => {
  res.json(req.user.toJSON({ virtuals: true }));
}

module.exports = meController;
