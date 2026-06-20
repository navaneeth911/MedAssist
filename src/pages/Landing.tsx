import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";

export default function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
    </>
  );
}