const createError = require("http-errors");
const Users = require("../models/users.model");
const cHelper = require("../helpers/common.helper");
const JwtUtil = require("../utils/jwt.util");
const lang = require("../configs/lang.config");
const { hashSync } = require("bcrypt");

/***
  for user login
***/

class AuthController {
  constructor() {}

  async login(req, res, next) {
    let userData = req.body;
    if (
      Object.keys(userData).length != 2 &&
      Object.keys(userData).join(",") !== "username,password"
    ) {
      res
        .status(401)
        .json({
          errcode: lang.INVALID_USER_ERRCODE,
          message: lang.INVALID_USER,
        });
      res.end();
    } else {
      userData.password = hashSync(userData.password, cHelper.getSalt());
      let data = await Users.loginUser(userData);
      if (data === undefined) {
        res
          .status(401)
          .json({
            errcode: lang.INVALID_USER_ERRCODE,
            message: lang.INVALID_USER,
          });
        res.end();
      }

      let resData = {};
      JwtUtil.createToken(data, parseInt(process.env.ACCESS_TOKEN_TIMEOUT) * 60)
        .then((token) => {
          resData.access_token = token;
          resData.access_token_timeout =
            parseInt(process.env.ACCESS_TOKEN_TIMEOUT) * 60;
          resData.access_token_type = lang.ACCESS_TOKEN_TYPE;

          JwtUtil.createToken(
            data,
            parseInt(process.env.REFRESH_TOKEN_TIMEOUT) * 60
          )
            .then((token) => {
              resData.refresh_token = token;
              resData.refresh_token_timeout =
                parseInt(process.env.REFRESH_TOKEN_TIMEOUT) * 60;
              resData.refresh_token_type = lang.REFRESH_TOKEN_TYPE;
              // returning dat
              res.status(200).json(resData);
            })
            .catch((e) => {
              next(
                createError(500, {
                  errcode: lang.UNABLE_TO_CREATE_TOKEN_ERRCODE,
                  message: lang.UNABLE_TO_CREATE_TOKEN,
                })
              );
            });
        })
        .catch((e) => {
          next(
            createError(500, {
              errcode: lang.UNABLE_TO_CREATE_TOKEN_ERRCODE,
              message: lang.UNABLE_TO_CREATE_TOKEN,
            })
          );
        });
    }
  }

}

module.exports = new AuthController();
