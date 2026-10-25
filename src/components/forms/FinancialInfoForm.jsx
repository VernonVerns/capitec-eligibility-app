import React from 'react'
import { useLoanApp } from '../../context/LoanAppContext';
import { useNavigate } from 'react-router-dom';

const FinancialInfoForm = ({errors = {}}) => {
	const navigate = useNavigate();
	const { formData, updateSection } = useLoanApp();
	
	const financialDetails = formData.financialInfo

	const handleChange = (event) => {
        const { name, value } = event.target;

        updateSection("financialInfo", {
            [name]: value,
        });
    };

	const handleBack = () => {
        navigate("/loan-application");
    };

    const handleNext = (e) => {
        e.preventDefault();

        navigate("/loan-application/loan-details");
    }

	return (
		<form className='financial-info-form' onSubmit={handleNext}>
			<div className="form-heading">
				<h2>Let's look at your finances</h2>
				<p>
					Tell us about your monthly income and expenses so we
					can estimate your loan eligibility.
				</p>
			</div>
			<div className="form-fields">
				<div className="form-group">
					<label htmlFor="monthlyIncome">
            			What is your monthly income? (R)
          			</label>
					<input
						type="number"
						id="monthlyIncome"
						name="monthlyIncome"
						value={financialDetails.monthlyIncome || ""}
						onChange={handleChange}
						placeholder="e.g. 25000"
						min="0"
						step="0.01"
						required
					/>
					<div className="error-and-helper">
						{errors.monthlyIncome ? (
							<small className="error">{errors.monthlyIncome}</small>
						) : (
							<small className="helper-text">
								Enter your total monthly income in South African rand.
							</small>
						)}
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="monthlyExpenses">
						What are your total monthly expenses? (R)
					</label>
					<input
						type="number"
						id="monthlyExpenses"
						name="monthlyExpenses"
						value={financialDetails.monthlyExpenses || ""}
						onChange={handleChange}
						placeholder="e.g. 12000"
						min="0"
						step="0.01"
						required
          			/>
					<div className="error-and-helper">
						{errors.monthlyExpenses ? (
							<small className="error">{errors.monthlyExpenses}</small>
						) : (
							<small className="helper-text">
								Include living costs, bills and other regular expenses.
							</small>
						)}
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="existingDebt">
						What are your monthly debt repayments? (R)
					</label>
					<input
						type="number"
						id="existingDebt"
						name="existingDebt"
						value={financialDetails.existingDebt || ""}
						onChange={handleChange}
						placeholder="e.g. 2500"
						min="0"
						step="0.01"
						required
					/>
					<div className="error-and-helper">
						{errors.existingDebt ? (
							<small className="error">{errors.existingDebt}</small>
						) : (
							<small className="helper-text">
								Enter your monthly repayments for existing loans or credit.
								Enter 0 if you have none.
							</small>
						)}
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="creditScore">
						Do you know your credit score?
					</label>
					<input
						type="number"
						id="creditScore"
						name="creditScore"
						value={financialDetails.creditScore || ""}
						onChange={handleChange}
						placeholder="e.g. 650"
						min="0"
					/>
					<div className="error-and-helper">
						{errors.creditScore ? (
							<small className="error">{errors.creditScore}</small>
						) : (
							<small className="helper-text">
								Optional. Enter your score if you know it.
							</small>
						)}
					</div>
				</div>
				<div className="navigation-buttons">
					<button type='button' className="back-button secondary-btn" onClick={handleBack}>Back</button>
                	<button type='submit' className="next-button main-btn">Next</button>
				</div>
			</div>
		</form>
	)
}

export default FinancialInfoForm