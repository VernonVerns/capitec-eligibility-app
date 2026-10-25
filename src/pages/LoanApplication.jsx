import React from 'react'
import ProgressIndicator from '../components/ProgressIndicator'
import { Outlet, useLocation } from 'react-router-dom'

const steps = [
    { path: '/loan-application', title: 'Personal Information', description: 'Please provide your personal details' },
    { path: '/loan-application/financial-information', title: 'Financial Information', description: 'Please provide your financial details' },
    { path: '/loan-application/loan-details', title: 'Loan Details', description: 'Please provide details about your loan request' }
]

const LoanApplication = () => {
    const location = useLocation();

    const currentStep = steps.findIndex(
        (step) => step.path === location.pathname
    );

    const activeStep = currentStep === -1 ? 0 : currentStep;
    const step = steps[activeStep];

    return (
        <div id='loan_application'>
            <h1>Loan Application</h1>
            <ProgressIndicator 
                currentStep={activeStep} 
                totalSteps={steps.length} 
                stepTitle={step.title}
            />
            <div className="form-container">
                <Outlet />
            </div>
        </div>
    )
}

export default LoanApplication