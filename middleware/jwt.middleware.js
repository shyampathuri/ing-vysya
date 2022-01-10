const createError = require('http-errors');
const lang = require('../configs/lang.config');
const JwtUtil = require('../utils/jwt.util');

module.exports = function protectRoute(req, res, next) {
    if (req.headers.authorization === undefined || req.headers.authorization === "" || req.headers.authorization.indexOf("Bearer ") !== 0) {
        res.status(401).send(lang.UNAUTHORIZED);
    } else {
        let token = req.headers.authorization.replace("Bearer ", "");
        JwtUtil.validateToken(token).then((data) => {
            if(data.message != undefined && data.message == "Invalid token."){
                next(createError(401, {errcode:lang.INVALID_TOKEN_ERRCODE, message: lang.INVALID_TOKEN}));
            }else if(data.message != undefined && data.message == "jwt expired"){
                next(createError(401, {errcode:lang.EXPIRED_TOKEN_ERRCODE, message: lang.EXPIRED_TOKEN}));
            }else{
                delete data.iat;
                delete data.exp;
                
                res.locals = data;
                next();
            }
        }).catch((err) => {
            console.log(err);
            if(err.message != undefined && err.message == "jwt expired"){
                next(createError(401, {errcode:lang.EXPIRED_TOKEN_ERRCODE, message: lang.EXPIRED_TOKEN}));
            }else{
                next(createError(401, {errcode:lang.INVALID_TOKEN_ERRCODE, message: lang.INVALID_TOKEN}));
            }
        });
    }
};