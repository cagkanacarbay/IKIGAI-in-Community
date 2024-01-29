/* eslint-disable @next/next/no-img-element */
import React, {useState} from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { AspectType } from '@/lib/types';
import { useEditor, createShapeId } from '@tldraw/tldraw';
import { ulid } from 'ulid';
import AspectShapeUtil from '../shapes/aspect';
import { getZoneColor } from '../ui/customUi';


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
  aspects: { icon: string, label: string, description: string, aspectType: AspectType }[];
  goToStep: (id: string) => void;
}

export const InDepthZoneStep: React.FC<InDepthZoneStepProps> = ({ aspects, goToStep }) => {
  return (
    <>
      <AlertDescription className='text-black text-md'> 
        <span className='text-lg'> The Heart is made up of these 4 aspects of who you are:</span>
        <br /><br />
        {aspects.map((aspect, index) => (
          <div key={index}>
            <img src={aspect.icon} alt={aspect.label} className="inline-block mr-2 w-8 h-8" />
            <strong>{aspect.label}</strong>: {aspect.description}
            <br />
          </div>
        ))}
        <div className='text-lg font-semibold mt-10'> Choose where you&apos;d like to start:</div>
        <div className="mt-2 flex flex-wrap justify-center items-center">
          {aspects.map((aspect, index) => (
            <div key={index} className="m-2">
              <Button className="w-16 h-16 p-2 rounded-full shadow-inner bg-white flex items-center justify-center" onClick={() => goToStep(`aspect-${aspect.aspectType}`)}>                
                <img src={aspect.icon} alt={aspect.label} className="w-10 h-10 object-contain" />
              </Button>
              <span className="mt-2 block font-semibold text-center">{aspect.label}</span>
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

    editor.select(aspectId);
    editor.zoomToSelection();
    goToStep('aspect-demo');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleCreateAspect();
    }
  };

  return (
    <>
      <AlertDescription className='text-black border border-black'> 
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
}


export const AspectDemoStep: React.FC<AspectDemoStepProps> = ({ goToStep }) => {
  const [stage, setStage] = useState(1);

  const nextStage = () => {
    if (stage < 6) {
      setStage(stage + 1);
    }
  };

  const prevStage = () => {
    if (stage > 1) {
      setStage(stage - 1);
    }
  }

  return (
    <AlertDescription className='text-black text-lg'> 
      {stage === 1 && (
        <div>
          You&apos;ve created your first aspect. This is your first step in Journey.
          <br/><br/>
          You can now move it around by clicking on it and dragging it to a new place.
          <br/><br/>
          Go ahead and try that now. When you&apos;re done, click &apos;Next&apos;.
        </div>
      )}
      {stage === 2 && (
        <div>
          Aspects represent parts of who you are and play a crucial role in your Journey. 
          <br /><br />
          Try creating a new aspect now. Right-click on the canvas and select &apos;Create New Aspect&apos;. Choose a type that resonates with you. 
          <br /><br />
          When you&apos;ve created your new aspect, click &apos;Next&apos; to continue.
        </div>
      )}
      {stage === 3 && (
        <div>
          Great! You&apos;ve created an aspect of type &apos;{/* dynamically insert aspect type here */}&apos;.
          <br /><br />
          Each aspect belongs to a specific zone. Try moving your new aspect to a different zone to see how it fits.
          <br /><br />
          Once you&apos;ve moved the aspect, click &apos;Next&apos; to proceed.
        </div>
      )}
      {stage === 4 && (
        <div>
          Zones in Journey represent different areas of your life and experiences.
          <br /><br />
          Moving aspects between zones can help you visualize and understand the dynamic nature of your personal growth and goals.
          <br /><br />
          Feel free to experiment with moving aspects between zones. 
        </div>
      )}
      {stage === 5 && (
        <div>
          You can add different aspect types to your aspects. Maybe your interest is also a skill you&apos;ve cultivated. 
          Or maybe your knowledge is also a career to pursue. 
          
          This allows you to give depth and meaning to your aspects.
          <br /><br />
          Right-click on the aspect you created and select <strong>Add Aspect Type</strong>.
          <br /><br />
          Choose any type for now. 
        </div>
      )}
      {stage === 6 && (
        <div>
          Finally, let&apos;s learn how to remove aspects. Right-click on the aspect you wish to remove and select &apos;Delete Aspect&apos;.
          <br /><br />
          This action will remove the aspect from your Journey. It&apos;s useful for decluttering or reorganizing your aspects.
          <br /><br />
          Once you have deleted the aspect, click &apos;Next&apos; to finish.
        </div>
      )}

      <div className="absolute bottom-2 right-2 flex justify-end">
        {stage > 1 && (
            <Button className='rounded px-4 py-2' variant="secondary" onClick={prevStage}>Previous</Button>
        )}
        <Button className='rounded px-4 py-2' onClick={nextStage}>Next</Button>
      </div>
    </AlertDescription>
  );
};