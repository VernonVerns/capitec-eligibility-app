
const axios = require("axios");

const JSON_SERVER_URL =
  process.env.JSON_SERVER_URL || "http://localhost:3001";

// Fetch a single loan product from JSON Server
const fetchProduct = async (productId) => {
  try {
    const response = await axios.get(
      `${JSON_SERVER_URL}/loanProducts/${encodeURIComponent(productId)}`
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      const notFoundError = new Error("Loan product not found.");
      notFoundError.status = 404;
      throw notFoundError;
    }

    throw error;
  }
};

// Use the midpoint of the product's interest rate range.
// This is a mock pricing rule for the simulator.
const getProductInterestRate = (product) => {
  const range = product.interestRateRange;

  if (
    !range ||
    !Number.isFinite(Number(range.min)) ||
    !Number.isFinite(Number(range.max)) ||
    Number(range.min) < 0 ||
    Number(range.max) < Number(range.min)
  ) {
    const error = new Error("The product has an invalid interest rate range.");
    error.status = 500;
    throw error;
  }

  return Number(
    ((Number(range.min) + Number(range.max)) / 2).toFixed(2)
  );
};

// Calculate monthly repayment, total interest and total repayment
const calculateRepayment = (amount, annualRate, termMonths) => {
  const monthlyRate = annualRate / 100 / 12;

  const monthlyPayment =
    monthlyRate === 0
      ? amount / termMonths
      : (amount * monthlyRate) /
        (1 - Math.pow(1 + monthlyRate, -termMonths));

  const totalRepayment = monthlyPayment * termMonths;
  const totalInterest = totalRepayment - amount;

  return {
    monthlyPayment: Number(monthlyPayment.toFixed(2)),
    totalInterest: Number(totalInterest.toFixed(2)),
    totalRepayment: Number(totalRepayment.toFixed(2)),
  };
};

// Validate amount and term against product limits
const validateLoanDetails = (product, amount, termMonths) => {
  if (!Number.isFinite(amount) || amount <= 0) {
    return "Enter a valid loan amount greater than zero.";
  }

  if (amount < product.minAmount || amount > product.maxAmount) {
    return `Loan amount must be between ${product.minAmount} and ${product.maxAmount}.`;
  }

  if (!Number.isInteger(termMonths)) {
    return "Loan term must be a whole number of months.";
  }

  if (termMonths < product.minTerm || termMonths > product.maxTerm) {
    return `Loan term must be between ${product.minTerm} and ${product.maxTerm} months.`;
  }

  return null;
};

// GET /api/loans/products
const getLoanProducts = async (req, res, next) => {
  try {
    const response = await axios.get(`${JSON_SERVER_URL}/loanProducts`);

    return res.json({ products: response.data });
  } catch (error) {
    next(error);
  }
};

// GET /api/loans/validation-rules
const getValidationRules = async (req, res, next) => {
  try {
    const response = await axios.get(`${JSON_SERVER_URL}/validationRules`);

    const rules = response.data[0];

    if (!rules) {
      return res.status(404).json({
        message: "Validation rules not found.",
      });
    }

    const { id, ...validationRules } = rules;

    return res.json(validationRules);
  } catch (error) {
    next(error);
  }
};

// POST /api/loans/eligibility
const checkEligibility = async (req, res, next) => {
  try {
    const { personalInfo, financialInfo, loanDetails } = req.body;

    if (!personalInfo || !financialInfo || !loanDetails) {
      return res.status(400).json({
        message:
          "Personal information, financial information, and loan details are required.",
      });
    }

    const monthlyIncome = Number(financialInfo.monthlyIncome);
    const monthlyExpenses = Number(financialInfo.monthlyExpenses);

    const existingDebt = Number(
      financialInfo.existingDebt ??
      financialInfo.existingDebtRepayments ??
      0
    );

    const requestedAmount = Number(loanDetails.requestedAmount);
    const termMonths = Number(loanDetails.loanTerm);

    if (
      !Number.isFinite(monthlyIncome) ||
      !Number.isFinite(monthlyExpenses) ||
      !Number.isFinite(existingDebt) ||
      monthlyIncome <= 0 ||
      monthlyExpenses < 0 ||
      existingDebt < 0
    ) {
      return res.status(400).json({
        message: "Please provide valid income, expenses, and existing debt.",
      });
    }

    if (!loanDetails.productId) {
      return res.status(400).json({
        message: "Please select a loan product.",
      });
    }

    const product = await fetchProduct(loanDetails.productId);

    const validationMessage = validateLoanDetails(
      product,
      requestedAmount,
      termMonths
    );

    if (validationMessage) {
      return res.status(400).json({
        message: validationMessage,
      });
    }

    const interestRate = getProductInterestRate(product);

    const repayment = calculateRepayment(
      requestedAmount,
      interestRate,
      termMonths
    );

    // Affordability calculations
    const disposableIncome =
      monthlyIncome - monthlyExpenses - existingDebt;

    const remainingIncome =
      disposableIncome - repayment.monthlyPayment;

    const debtToIncomeRatio =
      (existingDebt / monthlyIncome) * 100;

    const loanToIncomeRatio =
      (requestedAmount / (monthlyIncome * 12)) * 100;

    const paymentToIncomeRatio =
      (repayment.monthlyPayment / monthlyIncome) * 100;

    let affordabilityScore = "poor";

    if (remainingIncome > 0) {
      if (
        paymentToIncomeRatio <= 20 &&
        debtToIncomeRatio <= 30
      ) {
        affordabilityScore = "good";
      } else if (
        paymentToIncomeRatio <= 35 &&
        debtToIncomeRatio <= 40
      ) {
        affordabilityScore = "moderate";
      }
    }

    const isEligible =
      remainingIncome > 0 && affordabilityScore !== "poor";

    // Illustrative mock score, not a real approval probability
    const approvalLikelihood = Math.max(
      5,
      Math.min(
        95,
        Math.round(
          100 -
            paymentToIncomeRatio * 1.2 -
            debtToIncomeRatio * 0.7
        )
      )
    );

    const riskCategory =
      affordabilityScore === "good"
        ? "low"
        : affordabilityScore === "moderate"
          ? "medium"
          : "high";

    let decisionReason;

    if (remainingIncome <= 0) {
      decisionReason =
        "Your estimated monthly income may not cover your expenses, existing debt, and proposed loan repayment.";
    } else if (affordabilityScore === "good") {
      decisionReason =
        "Your estimated income and debt commitments indicate good affordability under this simulator's mock rules.";
    } else if (affordabilityScore === "moderate") {
      decisionReason =
        "Your estimated finances indicate moderate affordability. Review the proposed repayment and existing commitments.";
    } else {
      decisionReason =
        "Your estimated remaining income or affordability ratios do not meet this simulator's mock criteria.";
    }

    return res.json({
      eligibility: {
        isEligible,
        likelihood: approvalLikelihood,
        risk: riskCategory,
        reason: decisionReason,
      },

      affordability: {
        monthlyIncome,
        monthlyExpenses,
        existingDebt,
        disposableIncome: Number(disposableIncome.toFixed(2)),
        debtToIncomeRatio: Number(debtToIncomeRatio.toFixed(2)),
        loanToIncomeRatio: Number(loanToIncomeRatio.toFixed(2)),
        paymentToIncomeRatio: Number(paymentToIncomeRatio.toFixed(2)),
        remainingIncome: Number(remainingIncome.toFixed(2)),
        affordabilityScore,
      },

      recommendedLoan: {
        productId: product.id,
        productName: product.name,
        amount: requestedAmount,
        termMonths,
        interestRate,
        ...repayment,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/loans/calculate-rate
const calculateRate = async (req, res, next) => {
  try {
    const { productId, requestedAmount, termMonths } = req.body;

    if (
      !productId ||
      requestedAmount == null ||
      termMonths == null
    ) {
      return res.status(400).json({
        message: "Product, loan amount, and loan term are required.",
      });
    }

    const product = await fetchProduct(productId);

    const amount = Number(requestedAmount);
    const term = Number(termMonths);

    const validationMessage = validateLoanDetails(
      product,
      amount,
      term
    );

    if (validationMessage) {
      return res.status(400).json({
        message: validationMessage,
      });
    }

    const interestRate = getProductInterestRate(product);

    const repayment = calculateRepayment(
      amount,
      interestRate,
      term
    );

    return res.json({
      productId: product.id,
      productName: product.name,
      interestRate,
      ...repayment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkEligibility,
  getLoanProducts,
  calculateRate,
  getValidationRules,
};
