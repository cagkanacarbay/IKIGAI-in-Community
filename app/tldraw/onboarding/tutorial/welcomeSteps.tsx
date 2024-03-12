import { AlertDescription } from "@/components/ui/alert";
import { ikigaiCircleIds } from "../../shapes/shapeIds";
import { useBoardContext } from "../../boardContext";
import { TLShapeId } from "@tldraw/tldraw";
import 'driver.js/dist/driver.css';
import "./driverjs.css";
import { IntroduceUserGuide, IntroduceAspects, IntroduceQuestionsHelper } from "./driverJsSteps";
import { motion } from 'framer-motion';

export interface GenericStepProps {
  goToStep: (id: string) => void; 
  goToPreviousStep: () => void;
  goToNextStep: () => void;
}

export const WelcomeMessage: React.FC = () => {

      return (
      <div className="flex flex-col justify-center items-start px-4 text-left text-lg ">
        <p>
          Journey is a space to view your life through the lens of <strong>Ikigai</strong>:
        </p>
        {/* <p className="text-xl font-bold text-left mb-2">ikigai</p> */}
        <p className="mb-1 mt-1 ml-4">
          something to live for, the joy and goal of living
        </p>
        <p className="mb-4 ml-4">
          a life worth living, the happiness and benefit of being alive
        </p>
        <p className="mb-4">
          A space to reflect, to understand, and to explore the possibilities of your life.    
        </p>
        <p className="mb-2">
          Let&apos;s get started.
        </p>
        {/* <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">Begin your Journey</button> */}
      </div>
    );
  };
  

export const ZonesOverviewStep: React.FC<GenericStepProps> = ({ goToStep }) => {

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
        <span className=''>
          Together, they form your Ikigai. Let's take a quick look at each zone and what it is about.
        </span>
      </AlertDescription>
    </>
  );
};

interface IntroduceZoneStepProps {
  description: JSX.Element;

}

/**
 * This component introduces the zones to the user. 
 * Each zone has a title, subtitle, description, icon, and color.
 */
export const IntroduceZoneStep: React.FC<IntroduceZoneStepProps> = ({ description }) => {
  return (
    <AlertDescription className='text-black text-md mx-4 mt-4'>
      {description}
    </AlertDescription>
  );
};


export const TeachZoomMechanics: React.FC<GenericStepProps> = () => {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      >
      <AlertDescription className='text-black text-md mt-4 ml-4'>
        <span>
          You can zoom in and out by:
          <ul className="ml-4 mt-2">
            <li>- using the minimap on the bottom left of the screen</li>
            <li>- pressing CTRL/CMD and use your mouse wheel</li>
            <li>- pressing CTRL/CMD and +/- </li>
          </ul>
        </span>
      </AlertDescription>
    </motion.div>

  );
};


export const TeachMovementMechanics: React.FC<GenericStepProps> = () => {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      >
      <AlertDescription className='text-black text-md mt-4 ml-4'>
        <span>
          You can move the camera by:
          <ul className="ml-4 mt-2">
            <li>- selecting the hand tool by pressing (H) and left clicking and dragging the mouse</li>
            <li>- or clicking with the mouse wheel and dragging</li>
          </ul>
        </span>
      </AlertDescription>
    </motion.div>

  );
};


export const TutorialDone: React.FC<GenericStepProps> = () => {
  const { setStep } = useBoardContext();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      >
      <div className="top-20 -left-56 mb-10 w-full max-w-xs rounded-md border bg-white px-6 shadow-md lg:absolute lg:w-56">
      {/* <div className="pb-2 text-xl font-medium text-purple-600">Table of Contents</div> */}
      <AlertDescription className='text-black text-md mt-2'>
        <div className="mt-4">
          {tutorialSteps.map((step, index) => (

            <div key={step.id} className="mb-3 rounded hover:bg-purple-100 hover:text-purple-600">
              <a 
                onClick={() => setStep(index)}
                className="text-lg font-medium  ">
                {index+1}. {step.props.title}
              </a>
            </div>
          ))}

          </div>
        </AlertDescription>
      </div>
    </motion.div>

  );
};



export interface OnboardingStep {
  id: string;
  component: React.FC<any>;
  zoom?: { ids: TLShapeId[], targetZoom?: number };
  props: any;
  skipNavButtons?: boolean;
  noView?: boolean;
}
  
export const tutorialSteps: OnboardingStep[] = [
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
  },
  {
    id: "zones-overview",
    component: ZonesOverviewStep,
    zoom: {
      ids: [ikigaiCircleIds.heart, ikigaiCircleIds.craft, ikigaiCircleIds.cause, ikigaiCircleIds.path]
    },
    props: {
      title: "The 4 Zones of Journey",
      bgColor: 'bg-purple-50',
      iconPath: '/icons/zones/heart.png',
      size: 'w-[550px] h-[550px]',
    }
  },
  {
    id: 'introduce-heart',
    component: IntroduceZoneStep,
    zoom: {
      ids: [ikigaiCircleIds.heart],
    },
    props: {
      title: 'The Heart',
      subtitle: 'What you love',
      subTitleColor: 'text-red-300',
      description: (
        <>
          The Heart is your <strong>guide</strong> in Journey.
          <br /><br />
          It is made up of the things you love from the heart. The things that make you curious, that shape you 
        </>
      ),
      iconPath: '/icons/zones/heart.png',
      bgColor: 'bg-red-50',
    }
  },
  {
    id: 'introduce-craft',
    zoom: {
      ids: [ikigaiCircleIds.craft],
    },
    component: IntroduceZoneStep,
    props: {
      title: 'The Craft',
      subtitle: 'What you are good at',
      subTitleColor: 'text-blue-400',
      description: (
        <>
          The Craft is how you <strong>shape the world</strong>.
          <br /><br />
          It&apos;s what you&apos;re good at and what you can offer. What skills have you cultivated, what knowledge have you gained, what can you do?
        </>
      ),
      iconPath: '/icons/zones/craft.png',
      bgColor: 'bg-blue-50'
    }
  },
  {
    id: 'introduce-cause',
    zoom: {
      ids: [ikigaiCircleIds.cause],
    },
    component: IntroduceZoneStep,
    props: {
      title: 'The Cause',
      subtitle: 'What the world needs',
      subTitleColor: 'text-green-400',
      description: (
        <>
          The Cause is your <strong>call to action</strong>.
          <br /><br />
          The world is rife with problems waiting to be solved ranging from your local community to the entire planet.
          Which of them will you claim?
        </>
      ),
      iconPath: '/icons/zones/cause.png',
      bgColor: 'bg-green-50'
    }
  },
  {
    id: 'introduce-path',
    zoom: {
      ids: [ikigaiCircleIds.path],
    },
    component: IntroduceZoneStep,
    props: {
      title: 'The Path',
      subtitle: 'Where you are going',
      subTitleColor: 'text-yellow-700',
      description: (
        <>
          The Path is the <strong>world of opportunities</strong>.
          <br /><br />
          What careers align with your skills? What industries offer the right rewards? Where should you go to find purpose?
        </>
      ),
      iconPath: '/icons/zones/path.png',
      bgColor: 'bg-yellow-50'
    }
  },
  {
    id: 'introduce-user-guide',
    component: IntroduceUserGuide,
    props: {
      title: 'User Guide',
    }, 
    noView: true, // Don't render the parent in welcomeTour, just the component.
  },
  {
    id: 'introduce-aspects',
    component: IntroduceAspects,
    props: {
      title: 'Aspects',
    }, 
    noView: true, // Don't render the parent in welcomeTour, just the component.
  },
  {
    id: 'teach-zoom',
    component: TeachZoomMechanics,
    props: {
      title: 'Zooming In and Out',
      // subtitle: 'Where you are going',
      // subTitleColor: 'text-yellow-700',
      bgColor: 'bg-purple-50'
    }
  },
  {
    id: 'teach-movement',
    component: TeachMovementMechanics,
    props: {
      title: 'Moving Around the Canvas',
      // subtitle: 'Where you are going',
      // subTitleColor: 'text-yellow-700',
      bgColor: 'bg-purple-50'
    }
  },
  {
    id: 'introduce-questions-helper',
    component: IntroduceQuestionsHelper,
    props: {
      title: 'Questions Helper',
    }, 
    noView: true, // Don't render the parent in welcomeTour, just the component.
  },
  {
    id: 'tutorial-done',
    component: TutorialDone,
    skipNavButtons: true,
    zoom: {
      ids: [ikigaiCircleIds.heart, ikigaiCircleIds.craft, ikigaiCircleIds.cause, ikigaiCircleIds.path]
    },
    props: {
      title: 'Tutorial Completed',
      subtitle: 'Redo any step by clicking below',
      subTitleColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      size: 'w-[350px] h-[600px]',

    },
  },
];
