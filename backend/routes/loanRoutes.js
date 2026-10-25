const express = require("express");

const {
  checkEligibility,
  getLoanProducts,
  calculateRate,
  getValidationRules,
} = require("../controller/loanController");

const router = express.Router();

router.post("/eligibility", checkEligibility);

router.get("/products", getLoanProducts);

router.post("/calculate-rate", calculateRate);

router.get("/validation-rules", getValidationRules);

module.exports = router;