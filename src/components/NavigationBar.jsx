import React from 'react'

const NavigationBar = () => {
  return (
    <nav className="navigation-bar">
        <div className="logo">
            <img src="https://www.capitecbank.co.za/Static/capitec_v2/dist/assets/images/capitec-logo.svg" alt="Capitec Logo" />
        </div>
        <ul className="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
        </ul>
    </nav>
  )
}

export default NavigationBar