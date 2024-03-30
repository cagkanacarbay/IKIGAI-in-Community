"use client"
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useEditor, track, stopEventPropagation, TLRecord } from '@tldraw/tldraw';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from '@/components/ui/button';
import { tutorialSteps } from './welcomeSteps';
import CloseButton from '@/components/ui/closeButton';
import Image from 'next/image';
import { useBoardContext } from '../../boardContext';


const DEFAULT_GUIDE_PANEL_SIZE = "w-96 h-64";


export const Tutorial = track(() => { 
  const { tutorialVisible, toggleTutorialVisibility, step, setStep, setCurrentStepAsCompleted: setCurrentStepAsCompleted } = useBoardContext();

  // const [step, setStep] = useState(0);
  const [currentSize, setCurrentSize] = useState(DEFAULT_GUIDE_PANEL_SIZE);
  const editor = useEditor();

  useEffect(() => {
    // Run tutorial automatically on first load
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      toggleTutorialVisibility();
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, [toggleTutorialVisibility]);

  const updateSize = (size: string) => {
    // console.log("Updating size of window to: ", size)
    setCurrentSize(size);
  };

  useEffect(() => {
    const newSize = tutorialSteps[step].props.size || DEFAULT_GUIDE_PANEL_SIZE;
    setCurrentSize(newSize);

  }, [step]);

  useEffect(() => {
    const selectAndZoom = () => {

      const zoomInfo = tutorialSteps[step].zoom;
      if (zoomInfo) {
        editor.select(...zoomInfo.ids);
  
        // Check if the shape is rendered
        const selectedShapes = editor.getSelectedShapes();
        // console.log("zooming to selectedShapes:", selectedShapes)
  
        // If the shape is rendered, proceed with zoom to the selection
        if (selectedShapes.length > 0) {
          editor.zoomToSelection({ duration: 300 });
          editor.deselect(...zoomInfo.ids);

          // if (zoomInfo.targetZoom) {
          //   const ikigaiCircleLeft = new Vec2d(selectedShapes[0].props.x - 200, selectedShapes[0].props.y - 200, 1)              

          //   console.log(ikigaiCircleLeft)
          
          //   new Promise(resolve => setTimeout(resolve, 300))
          //   .then(() => {
          //     if (zoomInfo.targetZoom) {
          //       editor.zoomIn(ikigaiCircleLeft, { duration: 300 });
          //       // editor.zoomIn(editor.getViewportScreenCenter(), { duration: 300 });
          //     }
          //   });

          // }
            
          // } else {

            // const shapeCenter = new Vec2d(selectedShapes[0].props.x, selectedShapes[0].props.y, 1)              
            // console.log("shape center", shapeCenter)
            // console.log("shape position", selectedShapes[0])

            // console.log(shapeCenter)
            // editor.zoomIn(shapeCenter, { duration: 300 })

            
            // setTimeout(() => {
            //   editor.zoomIn(editor.getViewportScreenCenter(), { duration: 120 })
            // }, 500); 

          // }
  
        } else if (step === 0) {
          // If the shape is not rendered and it's the first step, try again after a delay
          setTimeout(selectAndZoom, 100);
        }
      };
    }
    selectAndZoom();

  }, [editor, step]);

  const goToNextStep = () => {
    setCurrentStepAsCompleted();
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
    } else if (step === tutorialSteps.length - 1) {
      closeTour();
    }
  };

  const goToPreviousStep = () => {
    if (step > 0) {
      setStep(step - 1);
    } 
  };

  const goToStep = (id: string) => {
    setCurrentStepAsCompleted();
    const nextStep = tutorialSteps.find(step => step.id === id);
    if (nextStep) {
      setStep(tutorialSteps.indexOf(nextStep));
    }
  };

  const closeTour = () => {
    toggleTutorialVisibility();
    // setStep(0);
  };

  // console.log("tutorial steps: ", tutorialSteps)
  // console.log("step: ", step)
  // console.log("Current step: ", step, tutorialSteps[step].component)
  const CurrentStepComponent = tutorialSteps[step].component;

  
  return (
    <>
      {
        tutorialVisible && (
          tutorialSteps[step]?.noView ? (
            <CurrentStepComponent {...tutorialSteps[step].props} goToStep={goToStep} updateWindowSize={updateSize} goToPreviousStep={goToPreviousStep} goToNextStep={goToNextStep}/>        
          ) : (
          <Alert 
            className={`z-50 shadow-inner rounded-lg p-4 pointer-events-auto 
              ${tutorialSteps[step].props.position || 'inset-0 m-auto fixed'} 
              ${currentSize} 
              ${tutorialSteps[step].props.bgColor || 'bg-purple-100'} bg-opacity-90`}
            onPointerMove={stopEventPropagation} onPointerDown={stopEventPropagation}
          >
            <CloseButton onClick={closeTour} />
            <div className="ml-4 flex justify-between items-center mb-2">
              <div className="flex items-center space-x-4">
                {tutorialSteps[step].props.iconPath && (
                  <img src={tutorialSteps[step].props.iconPath} alt={tutorialSteps[step].props.title} className="w-10 h-10" />
                )}
                <div>
                  <AlertTitle className='text-black text-xl font-bold'>{tutorialSteps[step].props.title}</AlertTitle>
                  <p className={`${tutorialSteps[step].props.subTitleColor || 'text-slate-800'} text-md`}>{tutorialSteps[step].props.subtitle}</p>
                </div>
              </div>
            </div>
            <CurrentStepComponent {...tutorialSteps[step].props} goToStep={goToStep} goToPreviousStep={goToPreviousStep} goToNextStep={goToNextStep} updateWindowSize={updateSize} />
            {!(tutorialSteps[step].skipNavButtons) && (
              <div className="absolute bottom-2 right-2 flex justify-end space-x-2">
                {step > 0 && (
                  <Button className='rounded-lg px-4 py-2 mr-2 bg-purple-100 hover:bg-purple-400' variant="secondary" onClick={goToPreviousStep}>
                    <Image src="/icons/previous.svg" alt="Previous" width={20} height={20} />
                  </Button>
                )}
                <Button className='rounded-lg px-4 py-2 bg-purple-100 hover:bg-purple-400' onClick={goToNextStep}>
                  <Image src="/icons/next.svg" alt="Next" width={20} height={20} />
                </Button>
              </div>
            )}
          </Alert>
          )
        )
      }
    </>
  );
})