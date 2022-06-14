const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  //check if user provided username and password
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  //check if user exists in the DB
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Please enter a valid email and password");
  }

  //compare password
  const isPasswordCorrect = await user.comparePassword(password);

  //check if password is correct
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Please provide valid email and password");
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
