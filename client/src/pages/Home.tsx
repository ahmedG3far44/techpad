import SEO from "../components/SEO";
import FeaturedProducts from "../components/landing/FeaturedProducts";
import Feedbacks from "../components/landing/Testimonials";
import Footer from "../components/landing/Footer";
import Header from "../components/landing/Header";
import Hero from "../components/landing/Hero";

function Home() {
  return (
    <div className="min-h-screen bg-white">
      <SEO title="Home" description="Premium PC accessories and tech peripherals. Shop keyboards, mice, headsets, monitors, and more." />
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        <Feedbacks />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
