import React from 'react'
import Home from "../Home/Home.jsx";
import WhatsAppButton from "../components/WhatsAppButton.jsx";

const LandingPage = () => {
  return (
    <div className="relative">
      <Home/>
      <WhatsAppButton variant="floating" />
    </div>
  )
}

export default LandingPage
