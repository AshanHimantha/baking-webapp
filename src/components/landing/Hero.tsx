import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, TrendingUp } from "lucide-react";
import { heroStats } from "@/data/landingPageData";
import { ContainerScroll } from "../ui/container-scroll-animation";
import Iphone15Pro from "../magicui/iphone-15-pro";
import { AnimatedShinyText } from "../magicui/animated-shiny-text";
import { ShimmerButton } from "../magicui/shimmer-button";
import CustomerDashboardMock from "./CustomerDashboardMock";

const Hero = () => {
  return (
    <>
      <div className="relative lg:h-screen h-svh flex items-center justify-center overflow-hidden ">
        <div className="absolute inset-0  m-5 mt-0 rounded-xl   border-t-0 rounded-t-none overflow-hidden bg-gradient-to-b from-transparent to-white ">
          <div className="h-full w-full absolute inset-0 overflow-hidden ">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,_#fff_40%,_#FC9515_200%,_#fdba74_100%)]  z-0 animate-pulse-slow scale-x-[150%] lg:-mt-32 " />
          </div>
        </div>

        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center h-full w-full overflow-hidden lg:-mt-52 -mt-44 ">
          <div className="items-center justify-center w-full sm:w-8/12 md:w-7/12 lg:w-5/12 ">
            <div className="space-y-4 flex flex-col justify-center items-center w-full">
              <div className="space-y-2 text-center w-full ">
                <span className="text-xs border border-gray-300 px-3 py-1 rounded-full text-gray-700 font-medium">
                  ✨ Welcome to Orbin Bank
                </span>
                <h1 className="text-4xl lg:text-6xl font-geist text-gray-900 leading-tight">
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
                </h1>
                <p className="text-sm text-gray-600 leading-relaxed ">
                  Experience next-generation digital banking with instant
                  transfers, smart savings, and world-class security. Join
                  millions who trust Orbin Bank.
                </p>
              </div>
              <div className="flex flex-col justify-center items-center w-full z-[49]">
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="bg-banking-primary hover:bg-banking-primaryDark text-white px-6 py-2  rounded-full  cursor-pointer "
                  >
                    Open Account <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full relative h-auto">
        <div className="overflow-hidden md:flex items-center justify-center md:-mt-[39%] 2xl:-mt-[36%]   w-full hidden">
          <ContainerScroll>
  
            <CustomerDashboardMock />
          </ContainerScroll>
        </div>

        <div className="overflow-hidden md:hidden items-center justify-center -mt-[70%]  w-full flex p-4 mb-10">

          <Iphone15Pro />
        </div>
      </div>
    </>
  );
};

export default Hero;
