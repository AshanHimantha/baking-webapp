const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Trusted by millions worldwide</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Join the community of users who have chosen <span className="text-orange-500">Orbin</span> for their financial journey.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2"><div className="text-4xl font-bold text-banking-primary">2M+</div><div className="text-gray-600">Active Users</div></div>
          <div className="space-y-2"><div className="text-4xl font-bold text-banking-primary">$50B+</div><div className="text-gray-600">Transactions Processed</div></div>
          <div className="space-y-2"><div className="text-4xl font-bold text-banking-primary">99.9%</div><div className="text-gray-600">Uptime Guaranteed</div></div>
        </div>
      </div>
    </section>
  );
};

export default About;