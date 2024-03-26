
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
  
  const { userGuideVisible, toggleUserGuideVisibility, questionHelperVisible, toggleQuestionHelperVisibility } = useBoardContext();
  const editor = useEditor();
  const driverRef = useRef<Driver | null>(null);

  useEffect(() => {
    if (questionHelperVisible) {
      toggleQuestionHelperVisibility();
    }
  }, []);

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
        description: "For each zone, there are four types of aspects. The highlighted guide shows how to use each of these types. You can come back to the guide at anytime to freshen up on zones and aspect types as you use Journey.",
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


export const IntroduceAspects: React.FC<GenericStepProps> = ({goToNextStep, goToPreviousStep}) => {

  const editor = useEditor();
  const { userGuideVisible, toggleUserGuideVisibility } = useBoardContext();
  const driverRef = useRef<Driver | null>(null);

  useEffect(() => {
    // Do some magic to move the camera to Heart Aspects Guide
    const pageBounds = editor.getCurrentPageBounds()
    if (pageBounds) {
      editor.zoomToBounds(pageBounds, { targetZoom: 0.15, duration: 200 });
      // console.log("User guide destroyed, zoomin to content"	)
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
          goToNextStep();
        }
      },
    },
  ]

  useDriverJs(driverRef, steps, "introduce-aspects");

  return null;
}


export const IntroduceQuestionsHelper: React.FC<GenericStepProps> = ({ goToStep, goToPreviousStep }) => {

  
  const { setQuestionAspectType, questionHelperVisible, toggleQuestionHelperVisibility, setTutorialToCVisible, setCurrentStepAsCompleted } = useBoardContext();
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
        title: 'Question Menu',
        description: "Journey comes packaged with a bunch of predetermined questions to get you started. If a question doesn't resonate with you, feel free to skip it.",
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
        title: 'Question Menu',
        description: "Journey comes packaged with a bunch of predetermined questions to get you started exploring your Ikigai. If a question doesn't resonate with you, feel free to skip it.",
        onPrevClick: () => {
          goToPreviousStep();
        },
      },
    },
    {
      element: '.aspect',
      popover: {
        title: 'Aspects - parts of you',
        description: 'You answer questions by writing an answer in these little boxes we call <strong>Aspects</strong>. Aspects are simply things about you. You have complete freedom in what you write here: answer in a word, share a story, be as eloquent as you wish.',      
      },
    },
    {
      element: '#tutorial-button',
      popover: {
        title: 'Tutorial Button',
        description: "This is the tutorial button. You can continue this tutorial at anytime using it. <br/><br/>When you're ready, close this box, and get started by answering a few questions. ",      
        onPopoverRender: () => {
          setCurrentStepAsCompleted();
          setTutorialToCVisible(true)
        }
      },
      
    },

  ]

  useDriverJs(driverRef, steps, "introduce-questions-helper");

  

  return null;

}


export const QuestionsMenuDetails: React.FC<GenericStepProps> = ({ goToNextStep, goToPreviousStep }) => {
  
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
      element: '#questions-helper-button',
      popover: {
        title: 'Questions Toggle',
        description: "This is the questions toggle. You can open and close the question menu using this button at anytime.",
        onPopoverRender: () => {
          if (driverRef.current){
            driverRef.current.moveNext();
          }
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
        onPrevClick: () => {goToPreviousStep()}
      },
    },
    {
      element: '#question-helper-aspect-type-selector',
      popover: {
        title: 'Aspect Types',
        description: 'Each aspect has one or more types. These are subcategories of each zone. You can recognize them by their icons.',
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
        title: 'Answering questions',
        description: "Now that you're familiar with aspects, let's answer a question. Change the question using the prev/random/next buttons if you wish. Double click on the aspect to write.",
        side: 'top',
        align: 'center',
        onNextClick: () => {
          goToNextStep();
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

  useDriverJs(driverRef, steps, "questions-detail");

  

  return null;

}


export const IntroduceCreateAspectsMenu: React.FC<GenericStepProps> = ({ goToNextStep, goToPreviousStep }) => {
  const { setCurrentStepAsCompleted, setTutorialToCVisible } = useBoardContext();
  const driverRef = useRef<Driver | null>(null);

  useEffect(() => {
    const button = document.getElementById('create-the-heart-button');
    if (button) button.click();
  }, []);

  const steps: DriveStep[] = [
    {
      // this step is a dummy. it goes to next one immediately, 
      // so in the next one, the user can press the 
      // otherwise disabled Previous button to go to the previous tutorial step
      element: '#create-aspect-toolbar',
      popover: {
        title: 'Create New Aspects',
        description: "This is the aspect toolbar. Click on a zone icon to see the aspects for that zone.",
        onPopoverRender: () => {
          if (driverRef.current){
            driverRef.current.moveNext();
          }
        },
      },
    },
    {
      element: '#create-aspect-toolbar',
      popover: {
        title: 'Create New Aspects',
        description: "This is the aspect toolbar. Click on a zone icon to see the aspect types you can create for that zone.",
        side: 'left',
        align: 'center',
        onPopoverRender: () => {
          setTimeout(() => {
            const button = document.getElementById('create-the-heart-button');
            if (button) button.click();
          }, 100); // Adjust the timeout as necessary
        },
        onPrevClick: () => {goToPreviousStep()}
      },
    },
    {
      element: '#create-the-heart-aspects',
      popover: {
        title: 'Select an Aspect Type',
        description: "Now you can select a type and click anywhere on the canvas to create it. <br/><br/>You might need to close this menu to do so.",
        side: 'top',
        align: 'center',
        onPopoverRender: () => {
          setCurrentStepAsCompleted();
          setTutorialToCVisible(true)  
                
        }
      },
    },
  
  ]
  useDriverJs(driverRef, steps, "creating-aspects");

  return null;
}


export const IntroduceTldrawTools: React.FC<GenericStepProps> = ({ goToNextStep, goToPreviousStep }) => {
  const driverRef = useRef<Driver | null>(null);

  const steps: DriveStep[] = [
    {
      // this step is a dummy. it goes to next one immediately, 
      // so in the next one, the user can press the 
      // otherwise disabled Previous button to go to the previous tutorial step
      element: '.tlui-toolbar',
      popover: {
        title: 'Tldraw Tools',
        description: "Journey is built on top of Tldraw, an open source tool for creating diagrams. This toolbar allows you to use the built-in tools.",
        onPopoverRender: () => {
          if (driverRef.current){
            driverRef.current.moveNext();
          }
        },
      },
    },
    {
      element: '.tlui-toolbar',
      popover: {
        title: 'Tldraw Tools',
        description: "Journey is built on top of Tldraw, an open source tool for creating diagrams. This toolbar allows you to use the built-in tools. <br/><br/>Let's take a look at those tools.",
        side: 'left',
        align: 'center',
        onPrevClick: () => {goToPreviousStep()}
      },
    },
    {
      element: 'button[data-testid="tools.select"]',
      popover: {
        title: 'Select Tool - Shortcut V',
        description: "Select tool allows you to select and move shapes around. Click and drag to select multiple shapes. It is the default tool.",
        side: 'top',
        align: 'center',
      },
    },
    {
      element: 'button[data-testid="tools.hand"]',
      popover: {
        title: 'Hand Tool - Shortcut H',
        description: "With the hand tool you can move around the canvas. Click anywhere then drag.",
        side: 'top',
        align: 'center',
      },
    },
    {
      element: 'button[data-testid="tools.arrow"]',
      popover: {
        title: 'Arrow Tool - Shortcut A',
        description: "You can draw arrows to make connections and show relationships between aspects.",
        side: 'top',
        align: 'center',
      },
    },
    {
      element: 'button[data-testid="tools.asset"]',
      popover: {
        title: 'Asset Tool - Shortcut CTRL/CMD + U',
        description: "You can upload images or other files to bring more detail into your board. Put photos related to your aspects, add a PDF, a soundbite, it's all up to you.",
        side: 'top',
        align: 'center',
      },
    },
    {
      element: 'button[data-testid="tools.embed"]',
      popover: {
        title: 'Embed Tool',
        description: "You can use this tool to embed content from the web. Youtube vides, google slides, spotify, figma, and more...",
        side: 'top',
        align: 'center',
        onNextClick: () => {goToNextStep()}
      },
    },
  
  ]
  useDriverJs(driverRef, steps, "tldraw-tools");

  return null;
}



