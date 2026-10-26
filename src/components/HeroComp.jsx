import React from 'react';
import HeroImage from '../assets/imgs/cash-back-image.jpg';

const HeroComp = () => {
    return (
        <div className='hero-section'>
            <div className='content-side'>
                <h1>Loan Simulator</h1>
                <p>
                    Get an instant estimate of your loan repayments with our
                    easy-to-use loan simulator. Adjust the loan amount and term
                    to see how it affects your monthly payments.
                </p>
                <div className='hero-cta'>
                    <a href='/loan-application' className='main-btn'>
                        Start Application Now
                    </a>
                    <a href='/learn-more' className='secondary-btn'>
                        Learn More
                    </a>
                </div>
            </div>
            <div className='image-side'>
                <img src={HeroImage} alt='Hero Image' />
            </div>
        </div>
    );
};

export default HeroComp;
