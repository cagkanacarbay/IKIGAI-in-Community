import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { OnboardingStep } from './stepProps';
import { ikigaiCircleIds } from "../../shapes/shapeIds";
import { AspectType } from "@/lib/types";


export const WelcomeMessage: React.FC = () => {

    return (
      <div className="flex flex-col justify-center items-start px-4 text-left text-lg ">
        <p>
          Journey is a space to introspect your life through the lens of <strong>Ikigai</strong>:
        </p>
        {/* <p className="text-xl font-bold text-left mb-2">ikigai</p> */}
        <p className="mb-1 mt-1 ml-4">
          something to live for, the joy and goal of living
        </p>
        <p className="mb-4 ml-4">
          a life worth living, the happiness and benefit of being alive
        </p>
        <p className="mb-4">
          <strong>Journey</strong> is a space for you to reflect, to understand, and to explore.       
        </p>
        <p className="mb-2">
          It&apos;s simple, so let&apos;s get started.
        </p>
  
        {/* <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">Begin your Journey</button> */}
      </div>
    );
  };
  

interface ZonesOverviewStepProps {
    goToStep: (id: string) => void;
  }
  
  export const ZonesOverviewStep: React.FC<ZonesOverviewStepProps> = ({ goToStep }) => {

    const zones = [
      {
        icon: "/icons/zones/heart.png",
        zoneType: "The Heart",
        zoneTypeTextColor: "text-red-300",
        question: "The things you love",
      },
      {
        icon: "/icons/zones/craft.png",
        zoneType: "The Craft",
        zoneTypeTextColor: "text-blue-300",
        question: "How you shape the world",
      },
      {
        icon: "/icons/zones/path.png",
        zoneType: "The Path",
        zoneTypeTextColor: "text-yellow-700",
        question: "Where you're going",
      },
      {
        icon: "/icons/zones/cause.png",
        zoneType: "The Cause",
        zoneTypeTextColor: "text-green-300",
        question: "What the world needs",
      },
    ]

    return (
      <>
        <AlertDescription className='text-black text-lg mt-4 px-4'> 
          <span className='mb-4 font-normal'>
            In Journey, there are four zones each reflecting a different part of your life:
          </span>
          <div className="grid grid-cols-2 gap-4 items-center justify-items-center mt-2 mb-4">
            {zones.map((zone, index) => (
              <div key={index} className="flex flex-col items-center ">
                <span className={`mt-2 block font-semibold text-center text-xl ${zone.zoneTypeTextColor}`}>{zone.zoneType}</span>
                <div className="w-16 h-16 p-2 rounded-full shadow-inner bg-white flex items-center justify-center" onClick={() => goToStep(`${zone.zoneType}-aspect-types`)}>
                  <img src={zone.icon} alt={zone.zoneType} className="w-10 h-10 object-contain" />
                </div>
                <span className="mt-2 block text-center text-lg">{zone.question}</span>
              </div>
            ))}
          </div>
          {/* <span className=''>
            It'll be fun, let's get started.
          </span> */}
        </AlertDescription>
        <div className="flex justify-center">
          <Button className="mt-4 px-12 py-4 text-lg" onClick={() => {/* TODO: add context go to question */}}>
            Ask me a question
          </Button>
        </div>
      </>
    );
  };

  
export const steps: OnboardingStep[] = [
  {
    id: 'welcome',
    component: WelcomeMessage,
    zoom: {
      ids: [ikigaiCircleIds.heart, ikigaiCircleIds.craft, ikigaiCircleIds.cause, ikigaiCircleIds.path],
    },
    props: {
      title: 'Welcome to Journey',
      subtitle: 'an app inspired by IKIGAI',
      subTitleColor: 'text-purple-400',
      iconPath: '/icons/zones/heart.png',
      bgColor: 'bg-purple-50',
      size: 'w-[650px] h-[360px]',
    },
    // skipNavButtons: true,
  },
  {
    id: "zones-overview",
    component: ZonesOverviewStep,
    zoom: {
      ids: [ikigaiCircleIds.heart, ikigaiCircleIds.craft, ikigaiCircleIds.cause, ikigaiCircleIds.path]
    },
    skipNavButtons: true,
    // skipNavButtons: true,
    props: {
      position: "absolute right-[100px] transform -translate-y-1/2 top-1/2",      
      title: "The Zones of Journey",
      bgColor: 'bg-purple-50',
      iconPath: '/icons/zones/heart.png',
      size: 'w-[550px] h-[550px]',
    }
  }
];
