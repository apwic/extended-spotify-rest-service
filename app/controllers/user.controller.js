exports.allAccess = (req, res) => {
  res.status(200).send("Public content.");
}

exports.userAccess = (req, res) => {
  res.status(200).send("User content.");
}

exports.adminAccess = (req, res) => {
  res.status(200).send("Admin content.");
}