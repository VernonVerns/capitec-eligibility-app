import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import DonutChart from '../DonutChart';
import { checkEligibility } from '../../services/loanApi';
import { useLoanApp } from '../../context/LoanAppContext';

const EligibilityResults = () => {
    const { formData } = useLoanApp();
    const location = useLocation();
    const navigate = useNavigate();

    const loanDetails = formData.loanDetails;

    // Prefer the submitted form data passed from LoanDetailsForm
    const submittedFormData = location.state?.formData || formData;

    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        const fetchResults = async () => {
            try {
                setLoading(true);
                setError('');

                const data = await checkEligibility(submittedFormData);

                if (!cancelled) {
                    setResults(data);
                }
            } catch (err) {
                console.error('Eligibility request failed:', err);

                if (!cancelled) {
                    setError(
                        err.response?.data?.message ||
                            'Unable to calculate your eligibility. Please try again.',
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchResults();

        return () => {
            cancelled = true;
        };
    }, [submittedFormData]);

    const formatCurrency = (value) =>
        new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(value) || 0);

    if (loading) {
        return <p>Calculating your eligibility...</p>;
    }

    if (error) {
        return (
            <div>
                <p className='alert' role='alert'>
                    {error}
                </p>

                <button
                    type='button'
                    className='secondary-btn'
                    onClick={() => navigate('/loan-application/loan-details')}
                >
                    Back to loan details
                </button>

                <button
                    type='button'
                    className='main-btn'
                    onClick={() => {
                        setError('');
                        setLoading(true);
                        setResults(null);
                        navigate('/loan-application/loan-details', {
                            replace: true,
                        });
                    }}
                >
                    Try again
                </button>
            </div>
        );
    }

    if (!results) {
        return <p>No assessment results available.</p>;
    }

    const { eligibility, affordability, recommendedLoan } = results;

    return (
        <div className='eligibility-results'>
            <div className='page-title'>
                <h1>Your Loan Assessment</h1>
                <p>Based on the information you provided</p>
            </div>
            <section className='high-level-results'>
                <div className='loan-amounts'>
                    <h2>{formatCurrency(recommendedLoan.amount)}</h2>
                    <h4>
                        Recommended Amount:{' '}
                        {formatCurrency(loanDetails.recommendedMax)}
                    </h4>
                </div>
                <div className='figures'>
                    <div className='figure-item'>
                        <div>Monthly Repayment:</div>
                        <h3>
                            {formatCurrency(recommendedLoan.monthlyPayment)}
                        </h3>
                    </div>
                    <div className='figure-item'>
                        <div>Interest Rate:</div>
                        <h3>{recommendedLoan.interestRate}%</h3>
                    </div>
                    <div className='figure-item'>
                        <div>Total Repayments</div>
                        <h3>
                            {formatCurrency(recommendedLoan.totalRepayment)}
                        </h3>
                    </div>
                </div>
            </section>
            <hr />
            <section className='eligibility-overview'>
                <h2>Eligibility Overview</h2>

                <div className='eligibility-chart-container'>
                    <DonutChart
                        likelihood={eligibility.likelihood}
                        risk={eligibility.risk}
                    />

                    <div className='text-side'>
                        <div className={`risk-badge risk-${eligibility.risk}`}>
                            {eligibility.risk === 'low'
                                ? 'Low Risk'
                                : eligibility.risk === 'medium'
                                  ? 'Medium Risk'
                                  : 'High Risk'}
                        </div>

                        <h3>
                            {eligibility.isEligible
                                ? 'Good potential'
                                : 'More assessment needed'}
                        </h3>

                        <p>{eligibility.reason}</p>
                    </div>
                </div>
            </section>

            <hr />

            <section className='affordability-summary'>
                <h2>Affordability Summary</h2>

                <div className='summary-details'>
                    <div className='detail-item'>
                        <div className='detail-label'>Monthly Income</div>
                        <h3 className='detail-value'>
                            {formatCurrency(affordability.monthlyIncome)}
                        </h3>
                    </div>

                    <div className='detail-item'>
                        <div className='detail-label'>Monthly Expenses</div>
                        <h3 className='detail-value'>
                            {formatCurrency(affordability.monthlyExpenses)}
                        </h3>
                    </div>

                    <div className='detail-item'>
                        <div className='detail-label'>Existing Debt</div>
                        <h3 className='detail-value'>
                            {formatCurrency(affordability.existingDebt)}
                        </h3>
                    </div>

                    <div className='detail-item'>
                        <div className='detail-label'>Disposable Income</div>
                        <h3 className='detail-value'>
                            {formatCurrency(affordability.disposableIncome)}
                        </h3>
                    </div>

                    <div className='detail-item'>
                        <div className='detail-label'>
                            Estimated Remaining Income
                        </div>
                        <h3 className='detail-value'>
                            {formatCurrency(affordability.remainingIncome)}
                        </h3>
                    </div>

                    <div className='detail-item'>
                        <div className='detail-label'>
                            Monthly Repayment / Income
                        </div>
                        <h3 className='detail-value'>
                            {affordability.paymentToIncomeRatio}%
                        </h3>
                    </div>

                    <div className='detail-item'>
                        <div className='detail-label'>
                            Affordability Assessment
                        </div>
                        <h3 className='detail-value'>
                            {affordability.affordabilityScore}
                        </h3>
                    </div>
                </div>
            </section>

            <hr />

            <section className='recommended-loan'>
                <h2>Your Loan Estimate</h2>

                <div className='summary-details'>
                    <div className='detail-item'>
                        <div className='detail-label'>Loan Product</div>
                        <h3 className='detail-value'>
                            {recommendedLoan.productName}
                        </h3>
                    </div>

                    <div className='detail-item'>
                        <div className='detail-label'>Requested Amount</div>
                        <h3 className='detail-value'>
                            {formatCurrency(recommendedLoan.amount)}
                        </h3>
                    </div>

                    <div className='detail-item'>
                        <div className='detail-label'>
                            Estimated Interest Rate
                        </div>
                        <h3 className='detail-value'>
                            {recommendedLoan.interestRate}%
                        </h3>
                    </div>

                    <div className='detail-item'>
                        <div className='detail-label'>Repayment Term</div>
                        <h3 className='detail-value'>
                            {recommendedLoan.termMonths} months
                        </h3>
                    </div>

                    <div className='detail-item'>
                        <div className='detail-label'>
                            Estimated Monthly Repayment
                        </div>
                        <h3 className='detail-value'>
                            {formatCurrency(recommendedLoan.monthlyPayment)}
                        </h3>
                    </div>

                    <div className='detail-item'>
                        <div className='detail-label'>Total Interest</div>
                        <h3 className='detail-value'>
                            {formatCurrency(recommendedLoan.totalInterest)}
                        </h3>
                    </div>

                    <div className='detail-item'>
                        <div className='detail-label'>Total Repayment</div>
                        <h3 className='detail-value'>
                            {formatCurrency(recommendedLoan.totalRepayment)}
                        </h3>
                    </div>
                </div>
            </section>

            <div className='navigation-buttons'>
                <button
                    type='button'
                    className='secondary-btn'
                    onClick={() => navigate('/loan-application/loan-details')}
                >
                    Edit Loan Details
                </button>
            </div>
        </div>
    );
};

export default EligibilityResults;
