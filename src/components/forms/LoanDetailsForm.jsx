
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoanApp } from "../../context/LoanAppContext";
import { getLoanProducts, checkEligibility } from "../../services/loanApi";

const loanPurpose = [
    { label: "Debt Consolidation", id: "debt_consolidation" },
    { label: "Home Improvement", id: "home_improvement" },
    { label: "Education", id: "education" },
    { label: "Medical", id: "medical" },
    { label: "New Vehicle", id: "new_vehicle" },
    { label: "Used Vehicle", id: "used_vehicle" },
    { label: "Other", id: "other" },
];

const LoanDetailsForm = ({ errors = {} }) => {
    const navigate = useNavigate();
    const { formData, updateSection } = useLoanApp();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loanDetails = formData.loanDetails || {};
    const personalInfo = formData.personalInfo || {};
    const financialInfo = formData.financialInfo || {};

    // Fetch loan products from the API
    useEffect(() => {
        const loadProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getLoanProducts();

            setProducts(data.products ?? data);
        } catch (err) {
            console.error("Failed to load loan products:", err);
            setError("Unable to load loan products. Please try again.");
        } finally {
            setLoading(false);
        }
        };

        loadProducts();
    }, []);

    // Match the selected purpose to a loan product
    const selectedProduct = products.find((product) =>
        product.purposes?.includes(loanDetails.loanPurpose)
    );

    // Update loan purpose
    const handlePurposeChange = (event) => {
        const loanPurpose = event.target.value;

        updateSection("loanDetails", {
        loanPurpose,
        requestedAmount: "",
        loanTerm: "",
        });
    };

    // Update amount and term fields
    const handleChange = (event) => {
        const { name, value } = event.target;

        updateSection("loanDetails", {
        [name]: value,
        });
    };

    // Update the amount slider
    const handleAmountSliderChange = (event) => {
        updateSection("loanDetails", {
        requestedAmount: event.target.value,
        });
    };

    // Navigate back to financial information
    const handleBack = () => {
        navigate("/loan-application/financial-information");
    };

    // Validate the form before proceeding
    const handleNext = (event) => {
        event.preventDefault();

        setError("");

        if (!selectedProduct) {
            setError("Please select a valid loan purpose.");
            return;
        }

        const amount = Number(loanDetails.requestedAmount);
        const termMonths = Number(loanDetails.loanTerm);

        if (
            loanDetails.requestedAmount === "" ||
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            setError("Please enter a valid loan amount.");
            return;
        }

        if (
            amount < selectedProduct.minAmount ||
            amount > selectedProduct.maxAmount
        ) {
            setError(
            `Please enter an amount between ${formatCurrency(
                selectedProduct.minAmount
            )} and ${formatCurrency(selectedProduct.maxAmount)}.`
            );
            return;
        }

        if (
            loanDetails.termMonths === "" ||
            !Number.isInteger(termMonths)
        ) {
            setError("Please enter a valid repayment term in months.");
            return;
        }

        if (
            termMonths < selectedProduct.minTerm ||
            termMonths > selectedProduct.maxTerm
        ) {
            setError(
            `Please select a term between ${selectedProduct.minTerm} and ${selectedProduct.maxTerm} months.`
            );
            return;
        }

        // Save the values using the field names expected by the backend
        updateSection("loanDetails", {
            productId: selectedProduct.id,
            requestedAmount: amount,
            termMonths,
        });

        navigate("/loan-application/eligibility-results");
    };

    
    function formatCurrency(value) {
        return new Intl.NumberFormat("en-ZA", {
            style: "currency",
            currency: "ZAR",
            maximumFractionDigits: 0,
        }).format(value);
    }

    const minAmount = selectedProduct?.minAmount ?? 5000;
    const maxAmount = selectedProduct?.maxAmount ?? 300000;

    const amount = Number(loanDetails.requestedAmount) || minAmount;

    if (loading) {
        return <p>Loading loan products...</p>;
    }

    if (error && products.length === 0) {
        return (
            <div>
                <p role="alert">{error}</p>
                <button type="button" onClick={() => window.location.reload()}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <form className="loan-details-form" onSubmit={handleNext}>
            <div className="form-heading">
                <h2>Tell us about your loan</h2>
                <p>
                    How much would you like to borrow, and what do you plan to use it for?
                </p>
            </div>

            <div className="form-fields">
                {/* Loan purpose */}
                <div className="form-group">
                    <label htmlFor="loanPurpose">
                        What is the loan for?
                    </label>

                    <select
                        id="loanPurpose"
                        name="loanPurpose"
                        value={loanDetails.loanPurpose || ""}
                        onChange={handlePurposeChange}
                        required
                    >
                        <option value="" disabled>
                            Select loan purpose
                        </option>

                        {loanPurpose.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.label}
                            </option>
                        ))}
                    </select>

                    <div className="error-and-helper">
                        {errors.loanPurpose && (
                            <small className="error">
                                {errors.loanPurpose}
                            </small>
                        )}
                    </div>
                </div>

                {/* Display fields only after finding a matching product */}
                {selectedProduct ? (
                    <>

                        {/* Loan amount */}
                        <div className="form-group">
                            <label htmlFor="requestedAmountSlider">
                                How much would you like to borrow?
                            </label>

                            <div className="loan-amount-display">
                                {formatCurrency(amount)}
                            </div>

                            <input
                                type="range"
                                id="requestedAmountSlider"
                                min={minAmount}
                                max={maxAmount}
                                step="1000"
                                value={Math.min(
                                    maxAmount,
                                    Math.max(minAmount, amount)
                                )}
                                onChange={handleAmountSliderChange}
                                aria-label="Requested loan amount slider"
                            />

                            <div className="slider-labels">
                                <span>{formatCurrency(minAmount)}</span>
                                <span>{formatCurrency(maxAmount)}</span>
                            </div>

                            <label htmlFor="requestedAmount">
                                Or enter an exact amount (R)
                            </label>

                            <input
                                type="number"
                                id="requestedAmount"
                                name="requestedAmount"
                                value={loanDetails.requestedAmount || ""}
                                onChange={handleChange}
                                placeholder="e.g. 50000"
                                min={minAmount}
                                max={maxAmount}
                                step="1000"
                                required
                            />

                            <div className="error-and-helper">
                                {errors.requestedAmount ? (
                                <small className="error">
                                    {errors.requestedAmount}
                                </small>
                                ) : (
                                <small className="helper-text">
                                    Choose an amount between {formatCurrency(minAmount)}{" "}
                                    and {formatCurrency(maxAmount)}.
                                </small>
                                )}
                            </div>
                        </div>

                        {/* Loan term */}
                        <div className="form-group">
                            <label htmlFor="loanTerm">
                                How long would you like to repay the loan?
                            </label>

                            <input
                                type="number"
                                id="loanTerm"
                                name="loanTerm"
                                value={loanDetails.loanTerm || ""}
                                onChange={handleChange}
                                placeholder="e.g. 12"
                                min={selectedProduct.minTerm}
                                max={selectedProduct.maxTerm}
                                required
                            />

                            <div className="error-and-helper">
                                {errors.loanTerm ? (
                                <small className="error">
                                    {errors.loanTerm}
                                </small>
                                ) : (
                                <small className="helper-text">
                                    Minimum is {selectedProduct.minTerm} months
                                    and maximum is {selectedProduct.maxTerm} months.
                                </small>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="helper-text">
                        {loanDetails.loanPurpose
                        ? "No loan product matches this purpose. Please select another purpose."
                        : "Select a loan purpose to view the available loan options and limits."}
                    </p>
                )}

                {error && <p className="error" role="alert">{error}</p>}

                {/* Navigation */}
                <div className="navigation-buttons">
                    <button
                        type="button"
                        className="back-button secondary-btn"
                        onClick={handleBack}
                    >
                        Back
                    </button>

                    <button
                        type="submit"
                        className="next-button main-btn"
                        disabled={!selectedProduct}
                    >
                        Check Eligibility
                    </button>
                </div>
            </div>
        </form>
    );
};

export default LoanDetailsForm;
