import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Security from "@/components/landing/Security";
import About from "@/components/landing/About";
import Cta from "@/components/landing/Cta";
import Footer from "@/components/landing/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-geist">
      <Header />
      <main>
        <Hero />
        <Features />
        <Security />
        <About />
        <Cta />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;