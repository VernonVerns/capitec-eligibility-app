import React from 'react'

const DonutChart = ({ risk, likelihood }) => {
    const radius = 42;
    const circumference = 2 * Math.PI * radius;

    const percentage = Math.max(
        0,
        Math.min(100, Number(likelihood) || 0)
    );

    const strokeDashoffset = circumference * (1 - percentage / 100);

    return (
        <div className='widget-container'>
            <div className='donut-chart'>
                <svg className='donut-svg' viewBox='0 0 100 100' role="img" aria-label={`Eligibility likelihood: ${percentage}%`}>
                    <circle className='donut-track' cx={50} cy={50} r={radius}></circle>
                    <circle 
                        className={`donut-indicator risk-${risk}`} 
                        cx={50} 
                        cy={50} 
                        r={radius} 
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                    ></circle>
                </svg>
                <div className='donut-text'>{likelihood}%</div>
            </div>
        </div>
    )
}

export default DonutChart