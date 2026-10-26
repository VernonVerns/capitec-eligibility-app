import React, { use, useState } from 'react';
import { useLoanApp } from '../../context/LoanAppContext';
import { useNavigate } from 'react-router-dom';

const PersonalInfoForm = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const { formData, updateSection } = useLoanApp();
    const personalDetails = formData.personalInfo;

    const handleChange = (event) => {
        const { name, value } = event.target;

        updateSection('personalInfo', {
            [name]: value,
        });

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        const age = Number(personalDetails.age);
        const employmentDuration = Number(personalDetails.employmentDuration);

        if (!personalDetails.age) {
            newErrors.age = 'Please enter your age.';
        } else if (age < 18) {
            newErrors.age = 'You must be at least 18 years old.';
        } else if (age > 100) {
            newErrors.age = 'Please enter a valid age.';
        }

        if (!personalDetails.employmentStatus) {
            newErrors.employmentStatus =
                'Please select your employment status.';
        }

        if (
            personalDetails.employmentDuration === '' ||
            personalDetails.employmentDuration === undefined ||
            personalDetails.employmentDuration === null
        ) {
            newErrors.employmentDuration =
                'Please enter your employment duration.';
        } else if (
            !Number.isFinite(employmentDuration) ||
            employmentDuration < 0
        ) {
            newErrors.employmentDuration =
                'Employment duration cannot be negative.';
        } else if (employmentDuration < 3) {
            newErrors.employmentDuration =
                'You must have been employed for at least 3 months.';
        } else if (employmentDuration > 600) {
            newErrors.employmentDuration =
                'Please enter a valid employment duration.';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleBack = () => {
        navigate('/loan-application');
    };

    const handleNext = (e) => {
        e.preventDefault();

        if (validateForm()) {
            navigate('/loan-application/financial-information');
        }
    };
    return (
        <form className='personal-info-form' onSubmit={handleNext}>
            <div className='form-heading'>
                <h2>Let's get to know you</h2>
                <p>
                    Tell us a little about yourself so we can estimate your loan
                    eligibility.
                </p>
            </div>
            <div className='form-fields'>
                <div className='form-group'>
                    <label htmlFor='firstName'>How old are you?</label>
                    <input
                        type='number'
                        id='age'
                        name='age'
                        value={personalDetails.age || ''}
                        onChange={handleChange}
                        placeholder='e.g. 27'
                        min={18}
                        max={65}
                        required
                    />
                    <div className='error-and-helper'>
                        {errors.age ? (
                            <small className='error'>{errors.age}</small>
                        ) : (
                            <small className='helper-text'>
                                You must be at least 18 years old.
                            </small>
                        )}
                    </div>
                </div>
                <div className='form-group'>
                    <label htmlFor='employmentStatus'>
                        What is your employment status?
                    </label>
                    <select
                        id='employmentStatus'
                        name='employmentStatus'
                        value={personalDetails.employmentStatus || ''}
                        onChange={handleChange}
                        required
                    >
                        <option value=''>Select your employment status</option>
                        <option value='employed'>Employed</option>
                        <option value='self-employed'>Self-Employed</option>
                        <option value='unemployed'>Unemployed</option>
                        <option value='retired'>Retired</option>
                    </select>
                    <div className='error-and-helper'>
                        {errors.employmentStatus && (
                            <small className='error'>
                                {errors.employmentStatus}
                            </small>
                        )}
                    </div>
                </div>
                <div className='form-group'>
                    <label htmlFor='employmentDuration'>
                        How long have you been employed? (Months)
                    </label>
                    <input
                        type='number'
                        id='employmentDuration'
                        name='employmentDuration'
                        value={personalDetails.employmentDuration || ''}
                        onChange={handleChange}
                        placeholder='e.g. 36'
                        min={0}
                    />
                    <div className='error-and-helper'>
                        {errors.employmentDuration ? (
                            <small className='error'>
                                {errors.employmentDuration}
                            </small>
                        ) : (
                            <small className='helper-text'>
                                Minimum 3 months of employment.
                            </small>
                        )}
                    </div>
                </div>
                <div className='navigation-buttons'>
                    <button
                        type='button'
                        className='back-button secondary-btn'
                        onClick={handleBack}
                        disabled
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

export default PersonalInfoForm;
