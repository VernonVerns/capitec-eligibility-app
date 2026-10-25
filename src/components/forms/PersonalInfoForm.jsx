import React from 'react'
import { useLoanApp } from '../../context/LoanAppContext';
import { useNavigate } from 'react-router-dom';

const PersonalInfoForm = ({ errors  = {}}) => {
    const navigate = useNavigate();
    const { formData, updateSection } = useLoanApp();
    const personalDetails = formData.personalInfo;

    const handleChange = (event) => {
        const { name, value } = event.target;

        updateSection("personalInfo", {
            [name]: value,
        });
    };

    const handleBack = () => {
        navigate("/loan-application");
    };

    const handleNext = (e) => {
        e.preventDefault();

        navigate("/loan-application/financial-information");
    }
  return (
    <form className="personal-info-form" onSubmit={handleNext}>
        <div className="form-heading">
            <h2>Let's get to know you</h2>
            <p>Tell us a little about yourself so we can estimate your loan eligibility.</p>
        </div>
        <div className="form-fields">
            <div className="form-group">
                <label htmlFor="firstName">How old are you?</label>
                <input
                    type="number"
                    id="age"
                    name="age"
                    value={personalDetails.age || ''}
                    onChange={handleChange}
                    placeholder="e.g. 27"
                    min="18"
                    required
                />
                <div className="error-and-helper">
                    {errors.age ? 
                        (<small className="error">{errors.age}</small>) : (<small className="helper-text">You must be at least 18 years old.</small>)}
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="employmentStatus">What is your employment status?</label>
                <select
                    id="employmentStatus"
                    name="employmentStatus"
                    value={personalDetails.employmentStatus || ''}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select your employment status</option>
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="retired">Retired</option>
                </select>
                <div className="error-and-helper">
                    {errors.employmentStatus && (<small className="error">{errors.employmentStatus}</small>)}
                </div>
            </div>
            <div className="form-group">    
                <label htmlFor="employmentDuration">How long have you been employed? (Months)</label>
                <input
                    type="number"
                    id="employmentDuration"
                    name="employmentDuration"
                    value={personalDetails.employmentDuration || ''}
                    onChange={handleChange}
                    placeholder="e.g. 36"
                    min={0}
                />
                <div className="error-and-helper">
                    {errors.employmentDuration ? 
                        (<small className="error">{errors.employmentDuration}</small>) : (<small className="helper-text">Minimum 3 months of employment.</small>)}
                </div>
            </div>
            <div className="navigation-buttons">
                <button type='button' className="back-button secondary-btn" onClick={handleBack} disabled>Back</button>
                <button type='submit' className="next-button main-btn">Next</button>
            </div>
        </div>
    </form>
  )
}

export default PersonalInfoForm