import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Cta = () => {
  return (
    <section className="py-20 bg-gradient-orange">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">Ready to transform your banking experience?</h2>
          <p className="text-xl text-white/90 leading-relaxed">Join millions of users who have already made the switch to smarter, faster, and more secure banking.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup"><Button size="lg" variant="secondary" className="bg-white text-banking-primary hover:bg-gray-100 px-8 py-4 text-lg">Open Your Account <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-banking-primary px-8 py-4 text-lg">Schedule a Demo</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;