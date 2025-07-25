import { Card } from "@/components/ui/card";
import { featuresData } from "@/data/landingPageData";

const FeatureCard = ({ icon: Icon, title, description, color, index }) => (
  <Card className="p-6 hover:shadow-banking-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
    <div className="space-y-4">
      <div className={`w-12 h-12 rounded-lg bg-white shadow-md flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  </Card>
);

const Features = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Everything you need in one place
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From instant transfers to intelligent budgeting, discover features designed for modern banking.
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