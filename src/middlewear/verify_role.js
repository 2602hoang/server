export function isAdmin(req, res, next) {
  const { id_role } = req.decoded;
  if (id_role !== 123) {
    return res
      .status(403)
      .json({ message: "Only administrators can access this resource." });
  }
  next();
}

export function isStaff(req, res, next) {
  const { id_role } = req.decoded;
  if (id_role !== 124) {
    return res
      .status(403)
      .json({ message: "Only staff members can access this resource." });
  }
  next();
}

export function isCustomer(req, res, next) {
  const { id_role } = req.decoded;
  if (id_role !== 125) {
    return res
      .status(403)
      .json({ message: "Only customers can access this resource." });
  }
  next();
}
