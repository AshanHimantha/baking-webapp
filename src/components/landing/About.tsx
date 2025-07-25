
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";


function useCountUp(to: number, duration = 1, decimals = 0, start = false) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>();
  useEffect(() => {
    if (!start) {
      setValue(0);
      return;
    }
    let startTime: number | null = null;
    function animate(ts: number) {
      if (startTime === null) startTime = ts;
      const progress = Math.min((ts - startTime) / (duration * 1000), 1);
      setValue(Number((progress * to).toFixed(decimals)));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
      else setValue(Number(to.toFixed(decimals)));
    }
    raf.current = requestAnimationFrame(animate);
    return () => raf.current && cancelAnimationFrame(raf.current);
  }, [to, duration, decimals, start]);
  return value;
}

const About = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const users = useCountUp(2, 1.2, 1, isInView); // 2M+
  const transactions = useCountUp(50, 1.2, 1, isInView); // $50B+
  const uptime = useCountUp(99.9, 1.2, 1, isInView); // 99.9%
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Trusted by millions worldwide</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Join the community of users who have chosen <span className="text-orange-500">Orbin</span> for their financial journey.</p>
        </div>
        <div ref={ref} className="grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <motion.div
              className="text-4xl font-bold text-banking-primary"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            >
              {users.toLocaleString(undefined, { maximumFractionDigits: 1 })}M+
            </motion.div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="space-y-2">
            <motion.div
              className="text-4xl font-bold text-banking-primary"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              ${transactions.toLocaleString(undefined, { maximumFractionDigits: 1 })}B+
            </motion.div>
            <div className="text-gray-600">Transactions Processed</div>
          </div>
          <div className="space-y-2">
            <motion.div
              className="text-4xl font-bold text-banking-primary"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            >
              {uptime.toLocaleString(undefined, { maximumFractionDigits: 1 })}%
            </motion.div>
            <div className="text-gray-600">Uptime Guaranteed</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;