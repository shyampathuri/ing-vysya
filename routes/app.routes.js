const express = require("express");
const errCods = require("../configs/lang.config");
const authController = require('../controllers/auth.controller');
const routeGuards = require("../middleware/jwt.middleware");

const UserController = require("../controllers/user.controller");
const atmController = require("../controllers/atm.controller");

const router = express.Router();

router.all("/", (req, res, next) => {
  res.status(200).json({
    msg: "ING Vysya find ATM server",
  });
  next();
});

router.use("/errlist", (req, res, next) => {
  delete errCods.ACCESS_TOKEN_TYPE;
  delete errCods.REFRESH_TOKEN_TYPE;
  res.status(200).json(errCods);
  next();
});

// login routes
router.post('/login', authController.login);

router.use(routeGuards);

// users routes
router.post("/users", UserController.create);
router.get("/users", UserController.getAll);
router.get("/users/:uid", UserController.get);
router.put("/users/:uid", UserController.update);
router.delete("/users/:uid", UserController.delete);

// atm routes
router.post("/atm", atmController.create);
router.get("/atm/search/:city?", atmController.search);
router.get("/atm/:id", atmController.get);
router.put("/atm/:id", atmController.update);
router.delete("/atm/:id", atmController.delete);

module.exports = router;
