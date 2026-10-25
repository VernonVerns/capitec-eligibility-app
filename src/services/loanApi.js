
import api from "./api";

// Retrieve available loan products
export const getLoanProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

// Retrieve validation rules
export const getValidationRules = async () => {
  const response = await api.get("/validation-rules");
  return response.data;
};

// Check eligibility using the completed form data
export const checkEligibility = async (formData) => {
  const response = await api.post("/eligibility", formData);
  return response.data;
};

// Calculate the applicable interest rate
export const calculateRate = async (loanData) => {
  const response = await api.post("/calculate-rate", loanData);
  return response.data;
};
