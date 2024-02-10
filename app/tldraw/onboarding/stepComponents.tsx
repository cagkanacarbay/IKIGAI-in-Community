/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { AspectType } from '@/lib/types';
import { useEditor, createShapeId, TLUnknownShape, TLRecord } from '@tldraw/tldraw';
import { ulid } from 'ulid';
import AspectShapeUtil, {IAspectShape} from '../shapes/aspect';
import { getZoneColor } from '../ui/customUi';
import { useBoardContext } from '../boardContext';
import { zoomToIkigaiCircles, zoomToZone, zoomToAspects } from '../zoom';


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


interface InDepthZoneStepProps {
  intro: string;
  aspects: { icon: string, label: string, description: string, aspectType: AspectType }[];
  goToStep: (id: string) => void;
}

export const InDepthZoneStep: React.FC<InDepthZoneStepProps> = ({ intro, aspects, goToStep }) => {
  return (
    <>
      <AlertDescription className='text-black text-md'> 
        <span className='text-lg'>{intro}</span>
        <br /><br />
        {aspects.map((aspect, index) => (
          <div className="mb-3 flex items-center leading-relaxed" key={index}>
            <img src={aspect.icon} alt={aspect.label} className="mr-2 w-8 h-8" />
            <div>
              <strong>{aspect.label}</strong>: {aspect.description}
            </div>
          </div>
        ))}
        <div className='text-lg font-semibold mt-6'>Choose one to explore:</div>
        <div className=" flex flex-wrap justify-center items-start">
          {aspects.map((aspect, index) => (
            <div key={index} className="m-2 text-center flex flex-col items-center">
              <Button className="w-16 h-16 p-2 rounded-full shadow-inner bg-white flex items-center justify-center" onClick={() => goToStep(`aspect-${aspect.aspectType}`)}>                
                <img src={aspect.icon} alt={aspect.label} className="w-10 h-10 object-contain" />
              </Button>
              <div className="mt-2 w-20 text-center">
                <span className="block font-semibold">{aspect.label}</span>
              </div>
            </div>
          ))}
        </div>
      </AlertDescription>
    </>
  );
};


interface ZonesOverviewStepProps {
  zones: { 
    icon: string;
    description: string, 
    zoneType: string, 
    aspects: { icon: string, label: string, description: string, aspectType: AspectType }[]; 
  }[];
  goToStep: (id: string) => void;
}

export const ZonesOverviewStep: React.FC<ZonesOverviewStepProps> = ({ zones, goToStep }) => {
  return (
    <>
      <AlertDescription className='text-black text-md'> 
        <span className='text-lg'>The 4 zones make up the visual space of Journey</span>
        <br /><br />
        {zones.map((zone, index) => (
          <div key={index}>
            <img src={zone.icon} alt={zone.zoneType} className="inline-block mr-2 w-8 h-8" />
            <strong>{zone.zoneType}</strong>: {zone.description}
            <br />
          </div>
        ))}
        <div className='text-lg font-semibold mt-10'> Choose where you&apos;d like to start:</div>
        <div className="mt-2 flex flex-wrap justify-center items-center">
          {zones.map((zone, index) => (
            <div key={index} className="m-2">
              <Button className="w-16 h-16 p-2 rounded-full shadow-inner bg-white flex items-center justify-center" onClick={() => goToStep(`${zone.zoneType}-aspect-types`)}>                
                <img src={zone.icon} alt={zone.zoneType} className="w-10 h-10 object-contain" />
              </Button>
              <span className="mt-2 block font-semibold text-center">{zone.zoneType}</span>
            </div>
          ))}
        </div>
      </AlertDescription>
    </>
  );
};

interface AspectTypeWithQuestionsStepProps {
  aspectType: AspectType;  
  explanation: string;  
  questions: string[];  
  iconPath: string;
  goToStep: (id: string) => void;
}

export const AspectTypeWithQuestionsStep: React.FC<AspectTypeWithQuestionsStepProps> = ({ aspectType, explanation, questions, iconPath, goToStep }) => {
  const editor = useEditor();
  const [inputValue, setInputValue] = useState('');

  const handleCreateAspect = () => {
    const { x, y } = editor.inputs.currentPagePoint; // last left click xy

    const aspectId = createShapeId(`aspect-${ulid()}`);
    editor.createShape({
      id: aspectId,
      type: AspectShapeUtil.type,
      meta: {
        aspectTypes: [aspectType],
      },
      props: {
        w: 160, h: 40,
        text: inputValue,
        zone: "The Heart",
        color: getZoneColor("The Heart"),
      },
      x: x,
      y: y,
    });
    setInputValue('');

    // editor.select(aspectId);
    // editor.zoomToSelection();
    goToStep('aspect-demo');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleCreateAspect();
    }
  };

  return (
    <>
      <AlertDescription className='text-black'> 
        <p className="mb-4 py-2">{explanation}</p>
        <p>
          Questions below aim to get you thinking about your {aspectType}s.
          Type in anything that comes to mind. There are no wrong answers. 
        </p>
        <div className="mt-4 flex flex-col items-start">
          <ul className="ml-4 mr-4">
            {questions.map((question, index) => (
              <li key={index} className="flex items-center mb-2">
                <img src={iconPath} alt={aspectType} className="w-4 h-4 object-contain mr-2" />
                <span className="text-sm leading-relaxed">{question}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center mt-4">
          <input 
            type="text" 
            placeholder={`one of your ${aspectType}s`} 
            className="rounded-lg p-2 w-1/2 bg-white border border-gray-300"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleCreateAspect} className="ml-2 p-2 rounded-lg bg-blue-500 text-white">Create</button>
        </div>
      </AlertDescription>
    </>
  );
};


interface AspectDemoStepProps {
  goToStep: (id: string) => void;
  goToPreviousStep: () => void;
  updateWindowSize: (size: string) => void


}

export const AspectDemoStep: React.FC<AspectDemoStepProps> = ({ goToStep, goToPreviousStep, updateWindowSize }) => {
  const [stage, setStage] = useState(1);
  const [relevantAspects, setRelevantAspects] = useState<IAspectShape[]>([]);
  const { createdAspects } = useBoardContext();
  const editor = useEditor();

  useEffect(() => {
    const updateRelevantAspectsOnCreation = () => {
      if (createdAspects.length > 0 && relevantAspects.length === 0) {
        setRelevantAspects([createdAspects[createdAspects.length - 1]]);
      }
    };
    updateRelevantAspectsOnCreation();
  }, [createdAspects, relevantAspects]);
  
  useEffect(() => {
    const addNewlyCreatedAspectToRelevantAspects = () => {
      if (createdAspects.length > relevantAspects.length) {
        setRelevantAspects([...relevantAspects, createdAspects[createdAspects.length - 1]]);
      }
    };
    addNewlyCreatedAspectToRelevantAspects();
  }, [createdAspects, relevantAspects]);
  
  const [hasProgressedToStageTwo, setHasProgressedToStageTwo] = useState(false);

  useEffect(() => {
    const progressToStageTwoAfterAspectCreation = () => {
      if (stage === 1 && relevantAspects.length > 1 && !hasProgressedToStageTwo) {
        setStage(2);
        setHasProgressedToStageTwo(true);
      }
    };
    progressToStageTwoAfterAspectCreation();
  }, [relevantAspects, stage, hasProgressedToStageTwo]);
  
  useEffect(() => {
    const progressToStageSixIfAspectTypeAdded = () => {
      if (stage === 5) {
        const hasAddedAspectType = createdAspects.some(aspect => aspect.meta?.aspectTypes?.length > 1);
        if (hasAddedAspectType) {
          setStage(6);
        }
      }
    };
    progressToStageSixIfAspectTypeAdded();
  }, [createdAspects, stage]);
  
  useEffect(() => {
    const zoomToRelevantAspectsOnStageChange = () => {
      if (relevantAspects.length === 0) {
        return;
      }
  
      const stageToZoomFunction = {
        1: () => zoomToAspects(editor, [relevantAspects[0]?.id]), 
        2: () => zoomToAspects(editor, relevantAspects.map(aspect => aspect.id)),
        // Add more stages as needed
      };
      const zoomFunction = stageToZoomFunction[stage as keyof typeof stageToZoomFunction];
      if (zoomFunction) {
        zoomFunction();
      }
    };
    zoomToRelevantAspectsOnStageChange();
  }, [stage, relevantAspects, editor]);


  useEffect(() => {
    const stageToSize = {
      1: "w-[450px] h-[560px]",
      2: "w-[480px] h-[400px]",
      3: "w-[400px] h-[400px]",
      4: "w-[420px] h-[450px]",
      5: "w-[450px] h-[460px]",
      6: "w-[450px] h-[400px]",
      7: "w-[350px] h-[350px]",
      default: "w-[450px] h-[450px]",
    };

    const size = stageToSize[stage as keyof typeof stageToSize] || stageToSize['default'];
    if (size) {
      updateWindowSize(size);
    }
  }, [stage, updateWindowSize]);

  const nextStage = () => {
    if (stage < 7) {
      setStage(stage + 1);
    } else if (stage === 7) {
      goToStep('zones-overview');
    }
  };

  const prevStage = () => {
    if (stage > 1) {
      setStage(stage - 1);
    } else if (stage === 1) {
      goToPreviousStep();
    }
  }

  const stage1Text = relevantAspects[0]?.props.text === '...'
    ? "Congratulations. You've just created an aspect."
    : (
      <>
        Congratulations. You&apos;ve just created an aspect: <strong>{relevantAspects[0]?.props.text}</strong>.
      </>
    );

  return (
    <AlertDescription className='text-black text-lg'> 
      {stage === 1 && (
        <div>
          {stage1Text}
          <br/><br/>
          Aspects represent something about you. This one represents a <strong>{relevantAspects[0]?.meta?.aspectTypes?.[0]}</strong> of yours.
          <br/><br/>
          There are many different aspect types in Journey. Each represents something about you. 
          <br/><br/>
          Create another aspect and see the possibilities. Right click on the canvas and select <strong>Create an Aspect</strong>. Choose any type you&apos;d like.
        </div>
      )}
      {stage === 2 && (
        <div>
          Great! You&apos;ve created another aspect. This one represents a <strong>{relevantAspects[1]?.meta?.aspectTypes?.[0]}</strong>.
          <br /><br />
          You can do a lot of things with your aspects. Double click on the aspect to edit its text.
          <br /><br />
          Then try moving your new aspect to a different zone. Just drag and drop it to a new location.
        </div>
      )}
      {stage === 3 && (
        <div>
          You can select multiple aspects at once using your mouse. Try clicking an empty area and dragging to select many aspects.
          <br /><br />
          You can move all of the selected aspects at the same time, just click anywhere in your selection and drag them.
          <br /><br />
          
        </div>
      )}
      {stage === 4 && (
        <div>
          You might&apos;ve noticed when moving an aspect to a different zone, it&apos;s color changes.   
        
          <br /><br />
          Zones in Journey represent a different area of your life and experiences. 
          Each area and intersection of areas is represented by different colors.

          <br /><br />
          Feel free to experiment with moving aspects between zones. 
        </div>
      )}
      {stage === 5 && (
        <div>
          An aspect can have multiple types.
          <br /><br />
          An interest could also be a skill you&apos;ve cultivated. 
          Knowledge or expertise about a topic could also be a career to pursue. 
          <br /><br />
          This allows you to give depth and meaning to your aspects.
          <br /><br />
          Right-click on an aspect you created and select <strong>Add Aspect Type</strong>.
        </div>
      )}
      {stage === 6 && (
        <div>
          Finally, let&apos;s learn how to remove aspects. Right-click on an aspect you wish to remove and select <strong>Delete</strong>. 
          Or select the aspects you&apos;d like to delete with your mouse and press <strong>backspace</strong> on your keyboard.
          <br /><br />
          This action will remove the aspect from your Journey. It&apos;s useful for decluttering or reorganizing your aspects.
        </div>
      )}
      {stage === 7 && (
      <div>
        Congratulations! You&apos;ve finished the tutorial. 
        You can access the tutorial again from the <strong>Help</strong> menu.
        <br /><br />
        Or continue exploring other aspects of Journey by pressing next.
      </div>
    )}

      <div className="absolute bottom-2 right-2 flex justify-end">
        <Button className='rounded px-4 py-2' variant="secondary" onClick={prevStage}>Previous</Button>
        <Button 
          className='rounded px-4 py-2' 
          onClick={nextStage}
          disabled={
            (stage === 1 && relevantAspects.length === 1) || 
            (stage === 2 && relevantAspects.length < 2)} // TODO: check user has moved aspect to a different zone

        >
          Next
        </Button>      
        </div>
    </AlertDescription>
  );
};

export const WelcomeMessage: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-start px-4 text-left text-lg ">
      <p>
        In Journey you explore your life through the lens of <strong>Ikigai</strong>:
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
        Its simple, so let&apos;s get started.
      </p>

      {/* <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">Begin your Journey</button> */}
    </div>
  );
};
