import { Card } from "@/components/ui/card";
import { securityData } from "@/data/landingPageData";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const Security = () => {
  return (
    <section id="security" className="py-20 bg-gradient-to-br from-gray-50 to-banking-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Your security is our <span className="text-banking-primary">top priority</span></h2>
              <p className="text-xl text-gray-600 leading-relaxed">We use cutting-edge technology and industry best practices to keep your money and data safe.</p>
            </div>
            <div className="space-y-6">
              {securityData.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-banking-primary/10 flex items-center justify-center flex-shrink-0"><item.icon className="w-5 h-5 text-banking-primary" /></div>
                  <div><h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3><p className="text-gray-600">{item.description}</p></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <Card className="p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-gray-900">Security Dashboard</h3><div className="flex items-center space-x-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div><span className="text-sm text-green-600">All systems secure</span></div></div>
                <div className="space-y-4">
                  <motion.div className="flex items-center justify-between p-3 bg-green-50 rounded-lg" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }} viewport={{ once: true, amount: 0.3 }}><div className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-green-500" /><span className="text-sm font-medium text-green-900">Account Verification</span></div><span className="text-xs text-green-600">Active</span></motion.div>
                  <motion.div className="flex items-center justify-between p-3 bg-green-50 rounded-lg" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }} viewport={{ once: true, amount: 0.3 }}><div className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-green-500" /><span className="text-sm font-medium text-green-900">Two-Factor Authentication</span></div><span className="text-xs text-green-600">Enabled</span></motion.div>
                  <motion.div className="flex items-center justify-between p-3 bg-green-50 rounded-lg" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }} viewport={{ once: true, amount: 0.3 }}><div className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-green-500" /><span className="text-sm font-medium text-green-900">Device Recognition</span></div><span className="text-xs text-green-600">Protected</span></motion.div>
                  <div className="pt-4 border-t border-gray-100"><div className="text-sm text-gray-600">Last security scan</div><div className="text-sm font-medium text-gray-900">2 minutes ago</div></div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Security;