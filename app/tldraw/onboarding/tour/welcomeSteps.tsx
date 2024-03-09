import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { OnboardingStep } from './stepProps';
import { ikigaiCircleIds } from "../../shapes/shapeIds";
import { AspectType } from "@/lib/types";
import { useBoardContext } from "../../boardContext";
import { DriveStep, driver } from "driver.js";
import 'driver.js/dist/driver.css';
import { useEffect, useState } from "react";
import { useEditor, BoxModel, Vec  } from "@tldraw/tldraw";


interface GenericStepProps {
  goToStep: (id: string) => void; 
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
    <AlertDescription className='text-black text-md'>
      {description}
    </AlertDescription>
  );
};


export const IntroduceUserGuide: React.FC<GenericStepProps> = ( { goToStep }) => {

  const editor = useEditor();
  const { userGuideVisible, toggleUserGuideVisibility } = useBoardContext();

  useEffect(() => { 

    // zoom out to contain the entirety of the user guide
    const pageBounds = editor.getCurrentPageBounds()
    if (pageBounds) {
      editor.zoomToBounds(pageBounds, { targetZoom: 0.15, duration: 500 });
    }

    const driverObj = driver({
      // showProgress: true,
      allowClose: false,
      disableActiveInteraction: false,
      steps: [
        {
          element: '#user-guide-button',
          popover: {
            title: 'User Guide',
            description: "The user guide is available at anytime to help you get familiar with Journey. Click this to toggle it on and off.",
          },
        },
        {
          element: '#user-guide-heart-driverjs',
          popover: {
            title: 'The Heart and its Aspects',
            description: "For each zone, there are four types of aspects. The highlighted guide shows how to use each of these types. You can come back to the guide at anytime to freshen up on things as you use Journey.",
            side: 'bottom',
            align: 'center',
          },
          onHighlightStarted: () => {
            if (!userGuideVisible) {
              toggleUserGuideVisibility();
            }
          }
        },
      ],
      showButtons: [],
      onDestroyed: () => {
        // console.log("User guide destroyed, zoomin to content"	)
        editor.slideCamera({speed: 0.2, direction: {x: 0, y: 10, z: 0.5}, friction: 0.1});
        setTimeout(() => {
          // console.log("screen center: ", editor.getViewportScreenCenter())
          editor.zoomIn(editor.getViewportScreenCenter(), { duration: 300 });
        }, 300);
        setTimeout(() => goToStep('introduce-aspects'), 500);
      }
    });

    setTimeout(() => {
      driverObj.drive();
    }, 100);


    // Cleanup function
    return () => {
      driverObj.destroy();
      
    };
  }, []);

  return null;
  
}


export const IntroduceAspects: React.FC<GenericStepProps> = ({goToStep}) => {

  const editor = useEditor();

  useEffect(() => { 

    // const pageBounds = editor.getCurrentPageBounds()

    // if (pageBounds) {
    //   editor.zoomToBounds(pageBounds, { targetZoom: 1, duration: 500 });
    // }

    console.log("In user guide")

    const driverObj = driver({
      // showProgress: true,
      allowClose: false,
      disableActiveInteraction: false,
      steps: [
        {
          element: '#user-guide-interest',
          popover: {
            title: 'Aspects',
            description: "Here is a detailed look at one of the aspect types. You can read it to get a better understanding of what to use this aspect type for. Each aspect type has its own unique icon, so you can recognize it easily.",
            side: 'top',
          },
        },
        {
          element: '#user-guide-interest',
          popover: {
            title: 'Zoom in',
            description: "You can zoom in and out using the minimap here. Alternatively press CTRL/CMD with your mouse wheel to zoom in and out or CTRL/CMD and +/- to zoom in and out.",
            side: 'top',
          },
        },
      ],
      showButtons: [
        // show no buttons. instead force user to click the shown UI.
      ],
      onCloseClick: () => {
        editor.zoomToFit()
      },
      onDestroyed: () => {
        goToStep('introduce-questions-helper');
      }
    });

    setTimeout(() => {
      driverObj.drive();
    }, 100);


    // Cleanup function
    return () => {
      driverObj.destroy();
      
    };
  }, []);

  return null;
}



const introduceQuestionsHelperSteps: DriveStep[] = [

  {
    element: '#questions-helper',
    popover: {
      title: 'Questions Menu',
      description: "This is the question helper. This is the easiest way to get started with Journey. Each question relates to a different aspect of your life. The questions are designed to make it easy to share things about you. If a question doesn't resonate with you, feel free to skip it.",
    },
  },
  {
    element: '#questions-helper-button',
    popover: {
      title: 'Questions Toggle',
      description: "This is the questions toggle. You can open and close the question helper using this button at anytime.",
      side: 'top',
      align: 'center',
      // onNextClick:() => {
      //   const { setQuestionAspectType } = useBoardContext();
      //   useEffect(() => {
      //     setQuestionAspectType("interest");
      //   }, []); // Empty dependency array to run only once on mount
      // },
    },
  },
  {
    element: '.aspect',
    popover: {
      title: 'Your First Aspect',
      description: 'Aspects are simply put: things about you. You have complete freedom in what you write here. You can answer in a word, share a story, or be as eloquent as you wish.',
    },
  },
  {
    element: '#mid-screen-driverjs',
    popover: {
      title: 'Interacting with Aspects',
      description: 'You can double click on the aspect to edit it and just drag&drop with your mouse to move it around. Try that now.',
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '#mid-screen-driverjs',
    popover: {
      title: 'Answering your first question',
      description: "Now that you're familiar with aspects, let's answer a question. Change the question using the prev/random/next buttons if you wish. Double click on the aspect to write text.",
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '#mid-screen-driverjs',
    popover: {
      title: 'Get familiar',
      description: "Those are the basics of Journey. Answer questions, move things around, make aspects larger or smaller as you wish. Now get familiar with some of these things and start putting down some aspects. We'll pick back up after you have at least 5 aspects down.",
      side: 'top',
      align: 'center',
    },
  }
]

const IntroduceQuestionsHelper: React.FC<GenericStepProps> = ({ goToStep }) => {

  const { setQuestionAspectType } = useBoardContext();

  useEffect(() => {
    setQuestionAspectType("interest");
  }, []); // Empty dependency array to run only once on mount


  useEffect(() => {

    console.log("In questions helper")

    const driverObj = driver({
      showProgress: true,
      allowClose: false,
      disableActiveInteraction: false,
      steps: introduceQuestionsHelperSteps,
    });

    setTimeout(() => {
      driverObj.drive();
      console.log("Driver tour started")
    

    }, 100);

    // Cleanup function
    return () => {
      driverObj.destroy();
      
    };
  }, [goToStep]);

  // This component doesn't render anything itself
  return null;
};

export default IntroduceQuestionsHelper;

  
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
  },
  {
    id: "zones-overview",
    component: ZonesOverviewStep,
    zoom: {
      ids: [ikigaiCircleIds.heart, ikigaiCircleIds.craft, ikigaiCircleIds.cause, ikigaiCircleIds.path]
    },
    props: {
      title: "The Zones of Journey",
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
    props: {}, 
    noView: true, // Don't render the parent in welcomeTour, just the component.
  },
  {
    id: 'introduce-aspects',
    component: IntroduceAspects,
    props: {}, 
    noView: true, // Don't render the parent in welcomeTour, just the component.
  },
  {
    id: 'introduce-questions-helper',
    component: IntroduceQuestionsHelper,
    props: {}, 
    noView: true, // Don't render the parent in welcomeTour, just the component.
  }
];
