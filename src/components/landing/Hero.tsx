import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, TrendingUp } from "lucide-react";
import { heroStats } from "@/data/landingPageData";
import { ContainerScroll } from "../ui/container-scroll-animation";

const Hero = () => {
  return (
    <>
      <div className="relative h-screen flex items-center justify-center overflow-hidden ">
        
        <div className="absolute inset-0  m-5 mt-0 rounded-xl border border-gray-200 border-t-0 rounded-t-none overflow-hidden bg-gradient-to-b from-transparent to-white ">
          <div className="h-full w-full absolute inset-0 overflow-hidden ">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,_#fff_20%,_#FC9515_120%,_#fdba74_100%)]  z-0 animate-pulse scale-x-[150%] lg:-mt-32 " />
          </div>
        </div>

        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center h-full w-full overflow-hidden lg:-mt-44 ">
          <div className="items-center justify-center w-full sm:w-8/12 md:w-7/12 lg:w-5/12 ">
            <div className="space-y-8 flex flex-col justify-center items-center w-full">
              <div className="space-y-2 text-center w-full ">
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="bg-banking-primary hover:bg-banking-primaryDark text-white px-8 py-4  rounded-full"
                  >
                    Open Account <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-banking-primary text-banking-primary hover:bg-banking-primary hover:text-white px-8   rounded-full"
                >
                  <Play className="mr-2 w-5 h-5" /> Watch Demo
                </Button>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="lg:h-screen overflow-hidden flex items-center justify-center md:translate-y-[-45%] xl:translate-y-[-45%] 2xl:translate-y-[-60%] pb-20 ">
        <ContainerScroll>
          <img
            src={`/pc.png`}
            alt="hero"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl h-full object-cover object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>
    </>
  );
};

export default Hero;
