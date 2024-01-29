/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useEditor, track, stopEventPropagation, TLShapeId, Box2d } from '@tldraw/tldraw';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from '@/components/ui/button';
import { steps } from './stepProps';


const DEFAULT_GUIDE_PANEL_SIZE = "w-96 h-64";


export const GuidedTour = track(() => {
  const [step, setStep] = useState(0);
  const [isTourVisible, setIsTourVisible] = useState(true);
  const [visitedSteps, setVisitedSteps] = useState<number[]>([]);
  const editor = useEditor();

  useEffect(() => {
    const selectAndZoom = () => {
      // Select the shape for the current step
      const zoomInfo = steps[step].zoom;
      if (zoomInfo) {
        editor.select(zoomInfo.id);
  
        // Check if the shape is rendered
        const selectedShapes = editor.getSelectedShapes();
  
        // If the shape is rendered, proceed with zoom to the selection
        if (selectedShapes.length > 0) {
          if (zoomInfo.targetZoom) {
            const shapeBounds = editor.getShapePageBounds(selectedShapes[0])
  
            if (shapeBounds) {
              editor.zoomToBounds(shapeBounds, zoomInfo.targetZoom, {duration: 300});
            }
            
          } else{
            editor.zoomToSelection({duration: 300});
          }
  
        } else if (step === 0) {
          // If the shape is not rendered and it's the first step, try again after a delay
          setTimeout(selectAndZoom, 100);
        }
      };
  
    // Start the selection and zooming process
      selectAndZoom();
    }

  }, [editor, step]);

  const goToNextStep = () => {
    if (step < steps.length - 1) {
      setVisitedSteps([...visitedSteps, step]);
      setStep(step + 1);
    }
  };

  const goToPreviousStep = () => {
    if (visitedSteps.length > 0) {
      const previousStep = visitedSteps.pop() as number;
      setVisitedSteps([...visitedSteps]);
      setStep(previousStep);
    }
  };

  const goToStep = (id: string) => {
    const nextStep = steps.find(step => step.id === id);
    if (nextStep) {
      setVisitedSteps([...visitedSteps, step]);
      setStep(steps.indexOf(nextStep));
    }
  };

  const closeTour = () => {
    setIsTourVisible(false);
    setStep(0);
  };

  const CurrentStepComponent = steps[step].component;

  return (
    isTourVisible && (
      <Alert className={`
          z-50 shadow-inner rounded-lg p-4 pointer-events-auto fixed inset-0 m-auto   
          ${steps[step].props.size || DEFAULT_GUIDE_PANEL_SIZE} 
          ${steps[step].props.bgColor || 'bg-purple-100'} bg-opacity-90`
        } 
        onPointerMove={stopEventPropagation} onPointerDown={stopEventPropagation}
      > 
        <Button className='text-black absolute top-0 right-0' variant="secondary" onClick={closeTour}>✕</Button>
        <div className="flex justify-start ml-4 mt-2">
          <div className="flex items-center space-y-1">
            {steps[step].props.iconPath && (
              <img src={steps[step].props.iconPath} alt={steps[step].props.title} className="mr-2 w-10 h-10" />
            )}
            <div className="space-y-0 ml-4 mr-4">
              <AlertTitle className='text-black text-xl font-bold mb-[-2px]'>{steps[step].props.title}</AlertTitle>
              <p className={`${steps[step].props.subTitleColor || 'text-slate-800'} text-md font-semibold mt-[-2px]`}>{steps[step].props.subtitle}</p>
            </div>
          </div>
        </div>
        <div className='ml-4 mr-4 mt-4'>
          <CurrentStepComponent {...steps[step].props} goToStep={goToStep}/>
        </div>
        {!(steps[step].skipNavButtons) && (
          <div className="absolute bottom-2 right-2 flex justify-end">
            <Button className='rounded px-4 py-2 mr-2' variant="secondary" onClick={goToPreviousStep}>Previous</Button>
            <Button className='rounded px-4 py-2' onClick={goToNextStep}>Next</Button>
          </div>
        )}
      </Alert>
    )
  );
})