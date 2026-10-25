import React from 'react'

const ProgressIndicator = ({ currentStep, totalSteps, stepTitle }) => {
  return (
    <div className="progress-indicator">
        <div className='step'>
           <div className='title-header'>
                 <h3>{stepTitle}</h3>
                <span>Step {currentStep + 1} of {totalSteps} </span>
           </div>
           <div className='progress-container'>
                <div className='progress-bar' style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}></div>
           </div>
        </div>
    </div>
  )
}

export default ProgressIndicator