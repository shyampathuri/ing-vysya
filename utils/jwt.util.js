const jwt = require("jsonwebtoken");
const lang = require("../configs/lang.config");

class JwtUtil {
  async createToken(data = {}, expires) {
    if (expires == "") {
      expires = process.env.TOKEN_DEFAULT_TIMEOUT;
    }

    if (Object.keys(data).length) {
      try {
        return jwt.sign(data, process.env.SALT, {
          expiresIn: expires,
        });
      } catch (err) {
        console.log(err);
        return new Error({
          errcode: lang.UNABLE_TO_CREATE_TOKEN_ERRCODE,
          message: lang.UNABLE_TO_CREATE_TOKEN,
        });
      }
    } else {
      return new Error({
        errcode: lang.INVALID_DATA_SEND_TO_CREATE_TOKEN_ERRCODE,
        message: lang.INVALID_DATA_SEND_TO_CREATE_TOKEN,
      });
    }
  }

  async validateToken(token) {
    try {
      return jwt.verify(token, process.env.SALT, (err, result) => {
        return new Promise((resolve, reject) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    } catch (err) {
      console.log(err);
      return new Error({
        errcode: lang.INVALID_TOKEN_ERRCODE,
        message: lang.INVALID_TOKEN,
      });
    }
  }
}

module.exports = new JwtUtil();
