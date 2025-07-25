
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { featuresData } from "@/data/landingPageData";

// Custom hook to detect if an element is in view
function useInView(options) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // Only animate once
        }
      },
      options
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [options]);

  return [ref, inView];
}

const FeatureCard = ({ icon: Icon, title, description, color, index, img }) => {
  const [ref, inView] = useInView({ threshold: 0.2 });
  return (
    <Card
      ref={ref}
      className={`hover:shadow-banking-lg transition-all duration-700 
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
      style={inView ? { transitionDelay: `${index * 100}ms` } : {}}
    >
      <div className="space-y-2 ">
        <div className="overflow-hidden relative">
          <img src={img} className="object-cover w-full rounded-lg" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 1%, rgba(255,255,255,0) 30%)",
            }}
          />
        </div>

        <div className="flex items-center  gap-4 p-3">
          <div
            className={`w-16 h-16 rounded-lg bg-white shadow-md flex items-center justify-center ${color}`}
          >
            <Icon className="w-10 " />
          </div>
          <div className="bg-white  rounded-lg ">
            <h3 className="text-xl font-semibold text-gray-900 ">{title}</h3>
            <p className="text-gray-600 leading-relaxed text-xs">{description}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

const Features = () => {
  return (
    <section id="features" className=" bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:-mt-32">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Everything you need in one place
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From instant transfers to intelligent budgeting, discover features
            designed for modern banking.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
