const AtmModel = require("../models/atm.model");
const lang = require("../configs/lang.config");

/***
  for atm entity crud operations
***/

class AtmController {
  async create(req, res, next) {
    if (Object.keys(req.body).length === 0) {
      res.json({
        errcode: lang.INVALID_DATA_SUBMITTED_ERRCODE,
        message: lang.INVALID_DATA_SUBMITTED,
      });
    } else {
      let reqData = req.body;
      let resultData = await AtmModel.createAtm(reqData);
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

  async search(req, res, next) {
    let resultData = await AtmModel.search();
    if (resultData === undefined) {
      res.status(500).json({
        errcode: lang.SOMTHING_WENT_WRONG_ERRCODE,
        message: lang.SOMTHING_WENT_WRONG,
      });
      res.end();
    } else {
      let finalResult = [];
      if (!req.params.city) {
        finalResult = resultData;
      } else {
        finalResult = resultData.filter((rec) => {
          return rec.address.city === req.params.city;
        });
      }
      res.status(200).json({ total: finalResult.length, data: finalResult });
    }
    next();
  }

  async get(req, res, next) {
    let resultData = await AtmModel.getAtm(req.params.id);

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

  async update(req, res, next) {
    let reqData = req.body;
    let resultData = await AtmModel.updateAtm(req.params.id, reqData);
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
    let resultData = await AtmModel.deleteAtm(req.params.id);
    if (resultData === undefined) {
      res.status(500).json({
        errcode: lang.SOMTHING_WENT_WRONG_ERRCODE,
        message: lang.SOMTHING_WENT_WRONG,
      });
      res.end();
    } else {
      res.status(200).json({ message: "ATM deleted successfully." });
    }
    next();
  }
}

module.exports = new AtmController();
