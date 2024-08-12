const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409).json({
        // conflict
        message: "user is already exist, You can Login",
        success: false,
      });
    }
    const userModel = new UserModel({ name, email, password });
    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();
    res.status(201).json({ message: "Signup Successfully", success: true });
  } catch (error) {
    res.staus(500).json({
      message: "internal Server error",
      success: false,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const mailMsg = "email is not valid First register";
    if (!user) {
      return res.status(403).json({
        message: mailMsg,
        success: false,
      });
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    const passMsg = "incorrect Password";
    if (!isPassEqual) {
      return res.status(403).json({
        //forbidden
        message: passMsg,
        success: false,
      });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login Success",
      success: true,
      jwtToken,
      email,
      name: user.name,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal Server error",
      success: false,
    });
  }
};

module.exports = {
  signup,
  login,
};
