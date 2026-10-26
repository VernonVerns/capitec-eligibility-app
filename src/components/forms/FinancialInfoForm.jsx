import React, { useState } from 'react';
import { useLoanApp } from '../../context/LoanAppContext';
import { useNavigate } from 'react-router-dom';

const FinancialInfoForm = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const { formData, updateSection } = useLoanApp();

    const financialDetails = formData.financialInfo;

    const validateForm = () => {
        const newErrors = {};

        const monthlyIncome = Number(financialDetails.monthlyIncome);
        const monthlyExpenses = Number(financialDetails.monthlyExpenses);
        const existingDebt = Number(financialDetails.existingDebt);
        const creditScore = Number(financialDetails.creditScore);

        // Monthly income
        if (
            financialDetails.monthlyIncome === '' ||
            financialDetails.monthlyIncome === undefined
        ) {
            newErrors.monthlyIncome = 'Please enter your monthly income.';
        } else if (!Number.isFinite(monthlyIncome) || monthlyIncome <= 5000) {
            newErrors.monthlyIncome =
                'Monthly income must be greater than R5000.';
        }

        // Monthly expenses
        if (
            financialDetails.monthlyExpenses === '' ||
            financialDetails.monthlyExpenses === undefined
        ) {
            newErrors.monthlyExpenses = 'Please enter your monthly expenses.';
        } else if (!Number.isFinite(monthlyExpenses) || monthlyExpenses < 0) {
            newErrors.monthlyExpenses = 'Monthly expenses cannot be negative.';
        } else if (
            Number.isFinite(monthlyIncome) &&
            monthlyIncome > 0 &&
            monthlyExpenses > monthlyIncome
        ) {
            newErrors.monthlyExpenses =
                'Monthly expenses cannot exceed your monthly income.';
        }

        // Existing debt repayments
        if (
            financialDetails.existingDebt === '' ||
            financialDetails.existingDebt === undefined
        ) {
            newErrors.existingDebt =
                'Please enter your existing monthly debt repayments (enter 0 if none).';
        } else if (!Number.isFinite(existingDebt) || existingDebt < 0) {
            newErrors.existingDebt =
                'Existing debt repayments cannot be negative.';
        }

        // Credit score
        if (
            financialDetails.creditScore !== '' &&
            financialDetails.creditScore !== undefined &&
            financialDetails.creditScore !== null
        ) {
            if (
                !Number.isInteger(Number(financialDetails.creditScore)) ||
                Number(financialDetails.creditScore) < 300 ||
                Number(financialDetails.creditScore) > 850
            ) {
                newErrors.creditScore =
                    'Please enter a valid credit score between 300 and 850.';
            }
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        updateSection('financialInfo', {
            [name]: value,
        });

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const handleBack = () => {
        navigate('/loan-application');
    };

    const handleNext = (e) => {
        e.preventDefault();

        if (validateForm()) {
            navigate('/loan-application/loan-details');
        }
    };

    return (
        <form className='financial-info-form' onSubmit={handleNext}>
            <div className='form-heading'>
                <h2>Let's look at your finances</h2>
                <p>
                    Tell us about your monthly income and expenses so we can
                    estimate your loan eligibility.
                </p>
            </div>
            <div className='form-fields'>
                <div className='form-group'>
                    <label htmlFor='monthlyIncome'>
                        What is your monthly income? (R)
                    </label>
                    <input
                        type='number'
                        id='monthlyIncome'
                        name='monthlyIncome'
                        value={financialDetails.monthlyIncome || ''}
                        onChange={handleChange}
                        placeholder='e.g. 25000'
                        min='5000'
                        required
                    />
                    <div className='error-and-helper'>
                        {errors.monthlyIncome ? (
                            <small className='error'>
                                {errors.monthlyIncome}
                            </small>
                        ) : (
                            <small className='helper-text'>
                                Enter your total monthly income. Minimum of
                                R5000
                            </small>
                        )}
                    </div>
                </div>
                <div className='form-group'>
                    <label htmlFor='monthlyExpenses'>
                        What are your total monthly expenses? (R)
                    </label>
                    <input
                        type='number'
                        id='monthlyExpenses'
                        name='monthlyExpenses'
                        value={financialDetails.monthlyExpenses || ''}
                        onChange={handleChange}
                        placeholder='e.g. 12000'
                        min='0'
                        step='0.01'
                        required
                    />
                    <div className='error-and-helper'>
                        {errors.monthlyExpenses ? (
                            <small className='error'>
                                {errors.monthlyExpenses}
                            </small>
                        ) : (
                            <small className='helper-text'>
                                Include living costs, bills and other regular
                                expenses.
                            </small>
                        )}
                    </div>
                </div>
                <div className='form-group'>
                    <label htmlFor='existingDebt'>
                        What are your monthly debt repayments? (R)
                    </label>
                    <input
                        type='number'
                        id='existingDebt'
                        name='existingDebt'
                        value={financialDetails.existingDebt || ''}
                        onChange={handleChange}
                        placeholder='e.g. 2500'
                        min='0'
                        step='0.01'
                        required
                    />
                    <div className='error-and-helper'>
                        {errors.existingDebt ? (
                            <small className='error'>
                                {errors.existingDebt}
                            </small>
                        ) : (
                            <small className='helper-text'>
                                Enter your monthly repayments for existing
                                loans.
                            </small>
                        )}
                    </div>
                </div>
                <div className='form-group'>
                    <label htmlFor='creditScore'>
                        Do you know your credit score?
                    </label>
                    <input
                        type='number'
                        id='creditScore'
                        name='creditScore'
                        value={financialDetails.creditScore || ''}
                        onChange={handleChange}
                        placeholder='e.g. 650'
                        min='300'
                        max='850'
                    />
                    <div className='error-and-helper'>
                        {errors.creditScore ? (
                            <small className='error'>
                                {errors.creditScore}
                            </small>
                        ) : (
                            <small className='helper-text'>
                                Optional. Enter your score if you know it.
                            </small>
                        )}
                    </div>
                </div>
                <div className='navigation-buttons'>
                    <button
                        type='button'
                        className='back-button secondary-btn'
                        onClick={handleBack}
                    >
                        Back
                    </button>
                    <button type='submit' className='next-button main-btn'>
                        Next
                    </button>
                </div>
            </div>
        </form>
    );
};

export default FinancialInfoForm;
