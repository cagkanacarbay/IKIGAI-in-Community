
import { useBoardContext } from "../../boardContext";
import { DriveStep, driver, Driver } from "driver.js";
import 'driver.js/dist/driver.css';
import { useEffect, useState, useRef } from "react";
import { useEditor } from "@tldraw/tldraw";
import "./driverjs.css";
import { tutorialSteps, GenericStepProps } from "./welcomeSteps";


export const useDriverJs = (
  driverRef: React.MutableRefObject<Driver | null>,
  driverJsSteps: DriveStep[],
  tutorialStepId: string,
  toggleOnDestroy?: () => void
) => {
  
  const { step, toggleTutorialVisibility, tutorialVisible } = useBoardContext();
  const [ driverDestroyed, setDriverDestroyed ] = useState<boolean>(false);
  
  useEffect(() => {


      driverRef.current = driver({
        disableActiveInteraction: false,

        doneBtnText: "Next ->", // Since each driverJs instance is part of the alrger tutorial sequence, Next over Done
        steps: driverJsSteps,

        onHighlightStarted: () => {
          // console.log("highlight started")
          setDriverDestroyed(false);
        },

        onDestroyed: () => {
          // console.log("DriverJS destroyed: ")
          setDriverDestroyed(true);
          if (toggleOnDestroy) {
            toggleOnDestroy();
          }
        }
      });
  
    setTimeout(() => {
      if (driverRef.current){
        driverRef.current.drive();
      }
    }, 300);

    return () => {
      if (driverRef.current){
        driverRef.current.destroy();
        // console.log("DriverJS destroyed: ", driverRef)
      }
    };

  }, []);

  useEffect(() => {
    // console.log("driverDestroyed: ", driverDestroyed)
    if (tutorialVisible && driverDestroyed) {
        const thisComponentsStepIndex = tutorialSteps.findIndex((step) => step.id === tutorialStepId);
        // console.log("thisComponentsStepIndex: ", thisComponentsStepIndex, "step: ", step)
        if (step === thisComponentsStepIndex) {
          // this means the the user has just exit the tutorial 
          // but have not gone to the next Tutorial step
          // so toggle visibility off
          // console.log("toggling off tutorial visibility: ",	tutorialVisible)
          toggleTutorialVisibility();
        }    
      }
  }, [driverDestroyed]);
}



export const IntroduceUserGuide: React.FC<GenericStepProps> = ( { goToStep, goToPreviousStep }) => {
  
  const { userGuideVisible, toggleUserGuideVisibility } = useBoardContext();
  const editor = useEditor();
  const driverRef = useRef<Driver | null>(null);

  const pageBounds = editor.getCurrentPageBounds()
  if (pageBounds) {
    editor.zoomToBounds(pageBounds, { targetZoom: 0.15, duration: 500 });
  }
  
  const steps: DriveStep[] = [    
    {
      // Prepend a dummy step to driverJsSteps, so we can have a custom previous button in 
      // step 1 of the driverJS tutorial that allows us to move to the previous tutorial step
      // dummy step simply moves to the next step which is an exact copy.
      element: '#user-guide-button',
      popover: {
        title: 'User Guide',
        description: "The user guide is available at anytime to help you get familiar with Journey. Click this to toggle it on and off.",
        onPopoverRender: () => {
          if (driverRef.current){
            driverRef.current.moveNext();
          }
        },
      },
    },
    {
      element: '#user-guide-button',
      popover: {
        title: 'User Guide',
        description: "The user guide is available at anytime to help you get familiar with Journey. Click this to toggle it on and off.",
        onPrevClick: () => {              
          console.log("trying to go back")
          goToPreviousStep();
        },
      },
    },
    {
      element: '#user-guide-heart-driverjs',
      popover: {
        title: 'The Heart and its Aspects',
        description: "For each zone, there are four types of aspects. The highlighted guide shows how to use each of these types. You can come back to the guide at anytime to freshen up on things as you use Journey.",
        side: 'bottom',
        align: 'center',
        onNextClick: () => {
          setTimeout(() => goToStep('introduce-aspects'), 500);
        },
      },
      onHighlightStarted: () => {
        if (!userGuideVisible) {
          // Show the user guide if the user didnt click it in the first step
          toggleUserGuideVisibility();
        }
      }
    },
  ];

  
  useDriverJs(driverRef, steps, "introduce-user-guide");

  return null;

}


export const IntroduceAspects: React.FC<GenericStepProps> = ({goToStep, goToPreviousStep}) => {

  const editor = useEditor();
  const { toggleTutorialVisibility, tutorialVisible, step, userGuideVisible, toggleUserGuideVisibility } = useBoardContext();
  const driverRef = useRef<Driver | null>(null);

  useEffect(() => {
    // Do some magic to move the camera to Heart Aspects Guide
    const pageBounds = editor.getCurrentPageBounds()
    if (pageBounds) {
      editor.zoomToBounds(pageBounds, { targetZoom: 0.15, duration: 200 });
      console.log("User guide destroyed, zoomin to content"	)
      setTimeout(() => {
        editor.slideCamera({speed: 0.2, direction: {x: 0, y: 10, z: 0.5}, friction: 0.1});
      }, 200)
      setTimeout(() => {
        // console.log("screen center: ", editor.getViewportScreenCenter())
        editor.zoomIn(editor.getViewportScreenCenter(), { duration: 300 });
      }, 500);
    }
  }, [])


  if (!userGuideVisible) {
    // Show the user guide if it isn't opened
    toggleUserGuideVisibility();
  }


  const steps: DriveStep[] = [
    {
      // this step is a dummy. it goes to next one immediately, 
      // so in the next one, the user can press the 
      // otherwise disabled Previous button to go to the previous tutorial step
      element: '#user-guide-interest',
      popover: {
        title: 'Aspects',
        description: "Here is a detailed look at one of the aspect types. You can read it to get a better understanding of what to use this aspect type for. Each aspect type has its own unique icon, so you can recognize it easily.",
        side: 'top',
        onPopoverRender: () => {
          if (driverRef.current){
            driverRef.current.moveNext();
          }
        },
      },
    },
    {
      element: '#user-guide-interest',
      popover: {
        title: 'Aspects',
        description: "Here is a detailed look at one of the aspect types. You can read it to get a better understanding of what to use this aspect type for. Each aspect type has its own unique icon, so you can recognize it easily.",
        side: 'top',
        onPrevClick: () => {
          goToPreviousStep();
        },
        onNextClick: () => {
          goToStep('teach-zoom');
        }
      },
    },
  ]

  useDriverJs(driverRef, steps, "introduce-aspects");

  return null;
}


export const IntroduceQuestionsHelper: React.FC<GenericStepProps> = ({ goToStep, goToPreviousStep }) => {

  
  const { setQuestionAspectType, questionHelperVisible, toggleQuestionHelperVisibility } = useBoardContext();
  const driverRef = useRef<Driver | null>(null);

  useEffect(() => {
    setQuestionAspectType("interest");
    if (!questionHelperVisible) {
      toggleQuestionHelperVisibility();
    }
  }, []);


  useEffect(() => {
    // Destroy the driver if the question helper is closed
    if (!questionHelperVisible && driverRef.current) {
      driverRef.current.destroy();
    }
  }, [questionHelperVisible]);


  const steps: DriveStep[] = [
    {
      // this step is a dummy. it goes to next one immediately, 
      // so in the next one, the user can press the 
      // otherwise disabled Previous button to go to the previous tutorial step
      element: '#questions-helper',
      popover: {
        title: 'Questions Menu',
        description: "This is the question helper. This is the easiest way to get started with Journey. If a question doesn't resonate with you, feel free to skip it.",
        onPopoverRender: () => {
          if (driverRef.current){
            driverRef.current.moveNext();
          }
        },
      },
    },
    {
      element: '#questions-helper',
      popover: {
        title: 'Questions Menu',
        description: "This is the question helper. This is the easiest way to get started with Journey. If a question doesn't resonate with you, feel free to skip it.",
        onPrevClick: () => {
          goToPreviousStep();
        },
      },
    },
    {
      element: '#questions-helper-button',
      popover: {
        title: 'Questions Toggle',
        description: "This is the questions toggle. You can open and close the question helper using this button at anytime.",
        side: 'top',
        align: 'center',

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
      element: '#question-helper-aspect-type-selector',
      popover: {
        title: 'Aspect Types',
        description: 'Each aspect has one or more types. These as subcategories of the zones. You can recognize them by their icons.',
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
        onNextClick: () => {
          goToStep("tutorial-done")
        }
      },
    },
    // {
    //   element: '#mid-screen-driverjs',
    //   popover: {
    //     title: 'Get familiar',
    //     description: "Those are the basics of Journey. Answer questions, move things around, make aspects larger or smaller as you wish. Now get familiar with some of these things and start putting down some aspects. We'll pick back up after you have at least 5 aspects down.",
    //     side: 'top',
    //     align: 'center',
    //   },
    // }
  ]

  useDriverJs(driverRef, steps, "introduce-questions-helper");

  

  return null;

}