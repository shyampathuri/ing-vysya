const UserModel = require("../models/users.model");
const bcript = require("bcrypt");
const cHelper = require("../helpers/common.helper");
const lang = require("../configs/lang.config");

/***
  for user entity crud operations
***/

class UserController {
  async create(req, res, next) {
    if (Object.keys(req.body).length === 0) {
      res.json({
        errcode: lang.INVALID_DATA_SUBMITTED_ERRCODE,
        message: lang.INVALID_DATA_SUBMITTED,
      });
    } else {
      let reqData = req.body;
      reqData.password = await bcript.hash(reqData.password, cHelper.getSalt());
      let resultData = await UserModel.createUser(reqData);
      if (resultData === undefined) {
        res.status(500).json({
          errcode: lang.SOMTHING_WENT_WRONG_ERRCODE,
          message: lang.SOMTHING_WENT_WRONG,
        });
        res.end();
      } else {
        res.status(200).json(resultData);
      }
    }
    next();
  }

  async getAll(req, res, next) {
    let resultData = await UserModel.getAllUsers();

    if (resultData === undefined) {
      res.status(500).json({
        errcode: lang.SOMTHING_WENT_WRONG_ERRCODE,
        message: lang.SOMTHING_WENT_WRONG,
      });
      res.end();
    } else {
      let result = JSON.parse(JSON.stringify(resultData));
      result.forEach((r, i) => {
        delete r.password;
        result[i] = r;
      });
      res.status(200).json(result);
    }
    next();
  }

  async get(req, res, next) {
    let resultData = await UserModel.getUser(req.params.uid);
    if (resultData === undefined) {
      res.status(500).json({
        errcode: lang.SOMTHING_WENT_WRONG_ERRCODE,
        message: lang.SOMTHING_WENT_WRONG,
      });
      res.end();
    } else {
      let result = JSON.parse(JSON.stringify(resultData));
      delete result.password;
      res.status(200).json(result);
    }
    next();
  }

  async update(req, res, next) {
    let reqData = req.body;
    reqData.password = await bcript.hash(reqData.password, cHelper.getSalt());
    let resultData = await UserModel.updateUser(req.params.uid, reqData);
    if (resultData === undefined) {
      res.status(500).json({
        errcode: lang.SOMTHING_WENT_WRONG_ERRCODE,
        message: lang.SOMTHING_WENT_WRONG,
      });
      res.end();
    } else {
      res.status(200).json(resultData);
    }
    next();
  }

  async delete(req, res, next) {
    let resultData = await UserModel.deleteUser(req.params.uid);
    if (resultData === undefined) {
      res.status(500).json({
        errcode: lang.SOMTHING_WENT_WRONG_ERRCODE,
        message: lang.SOMTHING_WENT_WRONG,
      });
      res.end();
    } else {
      res.status(200).json({ message: "User deleted successfully." });
    }
    next();
  }
}

module.exports = new UserController();
