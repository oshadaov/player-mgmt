import React from 'react'
import HeroSection from "../components/HeroSection"
import FeaturesSection from '../components/FeaturesSection'
import ActivitySection from '../components/ActivitySection'
import ClubsSection from '../components/ClubsSection'
import Footer from '../components/Footer'

const LandingPage = () => {
  return (
    <div>
      <HeroSection/>
      <FeaturesSection/>
      <ClubsSection/>
      <ActivitySection/>
      <Footer/>
      </div>
  )
}

export default LandingPage