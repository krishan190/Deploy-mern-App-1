const ensureAuthenticated = require("../Middlewares/Auth");

const router = require("express").Router();

router.get("/", ensureAuthenticated, (req, res) => {
  console.log("---logged in user details----", req.user);

  res.status(200).json([
    { name: "Mobile", price: 1000 },
    { name: "Phone", price: 20000 },
  ]);
});

module.exports = router;
