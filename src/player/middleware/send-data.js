const sendJsonData = (req, res, _) =>
  res.status(req.data.status).json(req.data.body);

export default sendJsonData;
