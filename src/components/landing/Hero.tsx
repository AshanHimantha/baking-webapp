
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, TrendingUp } from "lucide-react";
import { heroStats } from "@/data/landingPageData";
import { ContainerScroll } from "../ui/container-scroll-animation";
import { AnimatedShinyText } from "../magicui/animated-shiny-text";
import { ShimmerButton } from "../magicui/shimmer-button";
import CustomerDashboardMock from "./CustomerDashboardMock";
import Iphone15Pro from "../magicui/iphone-15-pro";

import { motion } from "framer-motion";

const Hero = () => {
  
  return (
    <>
      <div className="relative lg:h-screen h-svh flex items-center  overflow-hidden ">
        <div className="absolute inset-0  m-5 mt-0 rounded-xl   border-t-0 rounded-t-none overflow-hidden bg-gradient-to-b from-transparent to-white ">
          <div className="h-full w-full absolute inset-0 overflow-hidden ">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,_#fff_40%,_#FC9515_200%,_#fdba74_100%)]  z-0 animate-pulse-slow scale-x-[150%] lg:-mt-32 " />
             
           
          </div>
        </div>

        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center h-full w-full overflow-hidden  ">
          <div className="items-center justify-center w-full sm:w-8/12 md:w-7/12 lg:w-5/12  md:translate-y-[-40%] translate-y-[-35%]  ">
            <div className="space-y-4 flex flex-col justify-center items-center w-full">
              <div className="space-y-2 text-center w-full ">
                <motion.span
                  className="text-xs border border-gray-300 px-3 py-1 rounded-full font-medium overflow-hidden inline-block "
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 5, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <span className="mr-1 align-middle">✨</span>
                  <AnimatedShinyText className="align-middle">Welcome to Orbin Bank</AnimatedShinyText>
                </motion.span>
                <motion.h1
                  className="text-4xl lg:text-6xl font-geist text-gray-900 leading-tight"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  Banking made
                  <span className="bg-gradient-to-b from-orange-300 to-orange-500 bg-clip-text text-transparent font-medium">
                    {" "}
                    Simple{" "}
                  </span>
                  and{" "}
                  <span className="bg-gradient-to-b from-orange-300 to-orange-500 bg-clip-text text-transparent font-medium">
                    {" "}
                    Secure
                  </span>
                </motion.h1>
                <motion.p
                  className="text-sm text-gray-600 leading-relaxed "
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  Experience next-generation digital banking with instant
                  transfers, smart savings, and world-class security. Join
                  millions who trust Orbin Bank.
                </motion.p>
              </div>
              <motion.div
                className="flex flex-col justify-center items-center w-full z-50"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <Link to="/signup" className="w-full flex justify-center">
                  <Button
                    size="lg"
                    className="bg-banking-primary duration-300 hover:bg-banking-primaryDark text-white px-6 py-2 rounded-full cursor-pointer z-[9999]"
                  >
                    Open Account <ArrowRight className="ml-2 w-5 h-5 z-[9999]" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full relative h-auto  lg:translate-y-[-50%] translate-y-[-40%] -mb-[90%] md:-mb-[40%] pointer-events-none ">
        <motion.div
          className="overflow-hidden lg:flex items-center justify-center  w-full hidden "
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <ContainerScroll >
            <CustomerDashboardMock />
          </ContainerScroll>
        </motion.div>

        <motion.div
          className=" lg:hidden items-center justify-center  w-full flex p-4 mb-10 overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <Iphone15Pro/>
        </motion.div>
      </div>
    </>
  );
};

export default Hero;
