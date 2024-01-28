import { ikigaiCircleIds } from './shapes/shapeIds';
import { useEffect, useState } from 'react';
import { useEditor, track, stopEventPropagation } from '@tldraw/tldraw';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from '@/components/ui/button';


const DEFAULT_GUIDE_PANEL_SIZE = "w-96 h-64";

const steps = [
  { 
    id: ikigaiCircleIds.heart, 
    title: 'The Heart', 
    subtitle: 'the core of who you are',
    subTitleColor: 'text-red-300',
    description: (
      <>
        The Heart is your <strong>guide</strong> in Journey.
        <br /><br />
        What motivates and drives you? What interests you and makes you passionate? Who or what inspires and guides you? 
      </>
    ), 
    iconPath: '/icons/zones/heart.png', 
    bgColor: 'bg-red-100',
  },
  { 
    id: ikigaiCircleIds.craft, 
    title: 'The Craft', 
    subtitle: 'your practice, effort, and work',
    subTitleColor: 'text-blue-400',
    description: (
      <>
        The Craft is how you <strong>shape the world</strong>.
        <br /><br />
        It&apos;s what you&apos;re good at and what you can offer. What skills have you cultivated, what knowledge have you gained, what can you do?
      </>
    ), 
    iconPath: '/icons/zones/craft.png', 
    bgColor: 'bg-blue-100'  
  },
  { 
    id: ikigaiCircleIds.mission, 
    title: 'The Cause', 
    subtitle: 'problems that need to be solved',
    subTitleColor: 'text-green-400',
    description: (
      <>
        The Cause is your <strong>call to action</strong>.
        <br /><br />
        The world is rife with problems waiting to be solved ranging from your local community to the entire planet.
        Which of them will you claim?
      </>
    ), 
    iconPath: '/icons/zones/mission.png', 
    bgColor: 'bg-green-100'  
  },
  { 
    id: ikigaiCircleIds.path, 
    title: 'The Path', 
    subtitle: 'where you achieve and earn',
    subTitleColor: 'text-yellow-700',
    description: (
      <>
        The Path is the <strong>world of opportunities</strong>.
        <br /><br />
        What careers align with your skills? What industries offer the right rewards? Where should you go to find purpose?
      </>
    ), 
    iconPath: '/icons/zones/path.png', 
    bgColor: 'bg-yellow-100'  
  },
  {
    id: ikigaiCircleIds.heart, 
    title: "What is in The Heart", 
    subTitleColor: 'text-red-300',
    description: (
      <>
        <span className='text-lg'> The Heart is made up of these 4 aspects of who you are:</span>
        <br /><br />
        <img src="/icons/aspects/interest.png" alt="Interests" className="inline-block mr-2 w-8 h-8" />
        <strong>Interests</strong>: What activities captivate you? Reading, history, art, travel, learning new skills?
        <br />
        <img src="/icons/aspects/value.png" alt="Values" className="inline-block mr-2 w-8 h-8" />
        <strong>Values</strong>: What principles guide your life? Honesty, creativity, freedom, respect, innovation?
        <br />
        <img src="/icons/aspects/influence.png" alt="Influences" className="inline-block mr-2 w-8 h-8" />
        <strong>Influences</strong>: Who or what has shaped your thinking? Inspirational figures, pivotal events, significant books or art?
        <br />
        <img src="/icons/aspects/dream.png" alt="Dreams" className="inline-block mr-2 w-8 h-8" />
        <strong>Dreams</strong>: What are your deepest aspirations? Starting a business, writing a book, traveling the world, making a difference?

        <div className='text-lg font-semibold mt-14'> Choose where you&apos;d like to start:</div>
          <div className="mt-2 flex flex-wrap justify-center items-center">
            {[
              { icon: "/icons/aspects/interest.png", label: "Interests" },
              { icon: "/icons/aspects/value.png", label: "Values" },
              { icon: "/icons/aspects/influence.png", label: "Influences" },
              { icon: "/icons/aspects/dream.png", label: "Dreams" },
            ].map((aspect, index) => (
              <div key={index} className="m-2">
                <Button className="w-16 h-16 p-2 rounded-full shadow-inner bg-white flex items-center justify-center">
                  <img src={aspect.icon} alt={aspect.label} className="w-10 h-10 object-contain" />
                </Button>
                <span className="mt-2 block text-center">{aspect.label}</span>
              </div>
            ))}
          </div>
        
        
      </>
    ), 
    iconPath: '/icons/zones/heart.png', 
    bgColor: 'bg-red-100',
    size: 'w-1/2 h-1/2',
  },
  
];
export const GuidedTour = track(() => {
  const [step, setStep] = useState(0);
  const [isTourVisible, setIsTourVisible] = useState(true);
  const editor = useEditor();

  useEffect(() => {
    const selectAndZoom = () => {
      // Select the shape for the current step
      editor.select(steps[step].id);
  
      // Check if the shape is rendered
      const selectedShapes = editor.getSelectedShapes();
      if (selectedShapes.length > 0) {
        // If the shape is rendered, zoom to the selection
        editor.zoomToSelection({duration: 300});
      } else if (step === 0) {
        // If the shape is not rendered and it's the first step, try again after a delay
        setTimeout(selectAndZoom, 100);
      }
    };
  
    // Start the selection and zooming process
    selectAndZoom();
  }, [editor, step]);

  const goToNextStep = () => {

    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const goToPreviousStep = () => {

    if (step > 0) {
      setStep(step - 1);
    }
  };

  const closeTour = () => {
    setIsTourVisible(false);
    setStep(0);
  };

  return (
    isTourVisible && (
      <Alert className={`
      z-50 shadow-inner rounded-lg p-4 pointer-events-auto fixed inset-0 m-auto   
      ${steps[step].size || DEFAULT_GUIDE_PANEL_SIZE} 
      ${steps[step].bgColor || 'bg-purple-100'} bg-opacity-90`
    }
        onPointerMove={stopEventPropagation} onPointerDown={stopEventPropagation}
      >
        <Button className='text-black absolute top-0 right-0' variant="secondary" onClick={closeTour}>✕</Button>
        <div className="flex justify-start ml-4 mt-2">
          <div className="flex items-center space-y-1"> 
            {steps[step].iconPath && (
              <img src={steps[step].iconPath} alt={steps[step].title} className="mr-2 w-10 h-10" />
            )}
            <div className="space-y-0 ml-4">
              <AlertTitle className='text-black text-xl font-bold mb-[-2px]'>{steps[step].title}</AlertTitle>
              <p className={`${steps[step].subTitleColor || 'text-slate-800'} text-md font-semibold mt-[-2px]`}>{steps[step].subtitle}</p>            </div>
          </div>
        </div>
        <AlertDescription className='text-black text-md mt-4 ml-4'>
          {steps[step].description}
        </AlertDescription>
        <div className="absolute bottom-2 right-2 flex justify-end">
          <Button className='rounded px-4 py-2 mr-2' variant="secondary" onClick={goToPreviousStep}>Previous</Button>
          <Button className='rounded px-4 py-2' onClick={goToNextStep}>Next</Button>
        </div>
      </Alert>
    )

  );
})

// export const GuidedTourInFront = track(GuidedTour);
