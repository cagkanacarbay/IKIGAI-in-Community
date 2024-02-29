
import React, { useState, useEffect, use } from 'react';
import { useEditor, createShapeId, TLShapeId, stopEventPropagation } from '@tldraw/tldraw';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AspectType, zoneAspectTypes, ZoneName, getZoneName, zones, aspectTypes, zoneIconSrc } from '@/lib/types';
import AspectShapeUtil, { IAspectShape } from '../../shapes/aspect';
import { getZoneColor } from '../../ui/customUi';
import { ulid } from 'ulid';
import { QUESTIONS } from './questions';
import { ikigaiCircleIds, zoneNameToId } from '../../shapes/shapeIds';
import { IIkigaiCircleShape } from '../../shapes/ikigaiCircles';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CloseButton from '@/components/ui/closeButton';


interface Question {
  text: string;
  aspectType: AspectType;
  zone: ZoneName;
}

const zoneColors: Record<ZoneName, string> = {
  "The Heart": "bg-red-100",
  "The Craft": "bg-blue-100",
  "The Cause": "bg-green-100",
  "The Path": "bg-yellow-100",
};

const textColors = {
  'The Heart': 'text-red-700',
  'The Craft': 'text-blue-700',
  'The Path': 'text-yellow-700',
  'The Cause': 'text-green-700',
};


// Reshape the original questions into an array of Question objects with associated zones
const reshapeQuestions = (): Question[] => {
  let reshapedQuestions: Question[] = [];
  Object.entries(zoneAspectTypes).forEach(([zone, aspectTypes]) => {
    aspectTypes.forEach((aspectType: AspectType) => {
      const questionsForType = QUESTIONS[aspectType] || [];
      questionsForType.forEach(question => {
        reshapedQuestions.push({ text: question, aspectType, zone: zone as ZoneName });
      });
    });
  });
  return reshapedQuestions;
};


const defaultQuestion: Question = {
  text: 'loading...',
  aspectType: 'interest', 
  zone: 'The Heart',
};


export const QuestionHelper: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(defaultQuestion);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(1);
  const [aspectId, setAspectId] = useState<TLShapeId>();
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    setCurrentQuestion(questions[currentQuestionIndex]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex]);  

  const toggleVisibility = (): void => setIsVisible(!isVisible);
  const editor = useEditor();

  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined | null = null;

    const createAspect = () => {
      const newAspectId = createShapeId(`aspect-${ulid()}`);
      setAspectId(newAspectId);

      const ikigaiCircle = editor.getShape(zoneNameToId[zone]) as IIkigaiCircleShape;
      const { x, y, radius } = ikigaiCircle.props;

      let adjustedX = x + radius;
      let adjustedY = y + radius;

      switch (zone) {
        case 'The Path':
          adjustedY += 200;
          break;
        case 'The Heart':
          adjustedY -= 200;
          break;
        case 'The Craft':
          adjustedX -= 200;
          break;
        case 'The Cause':
          adjustedX += 200;
          break;
        default:
          break;
      }

      editor.createShape({
        id: newAspectId,
        type: AspectShapeUtil.type,
        meta: {
          aspectTypes: [currentQuestion.aspectType],
        },
        props: {
          text: "...",
          zone: zone,
          color: getZoneColor(zone),
        },
        x: adjustedX,
        y: adjustedY,
      });

      editor.select(newAspectId);
      editor.zoomToSelection({ duration: 400});

    };

    const deleteAspect = () => {
      if (aspectId) {
        editor.deleteShape(aspectId);
        setAspectId(undefined);
      }
    };

    const handleNextQuestion = () => {
      if (aspectId) {
        const aspect = editor.getShape(aspectId) as IAspectShape
        if (aspect && aspect.props.text !== '...') {
          createAspect();
        } else {
          // If the user hasn't written anything, delete the previous aspect and create a new one
          deleteAspect();
          createAspect();
        }
      } else {
        createAspect();
      }
    };

    editor.select(zoneNameToId[zone]);
    editor.zoomToSelection({duration: 300});

    if (isVisible) {
      timeoutId = setTimeout(handleNextQuestion, 300);
    } else {
      deleteAspect();
    };

    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, currentQuestion]);

  // Handlers to get the next, previous, or random question
  const setNextQuestion = () => {
    setCurrentQuestionIndex((currentQuestionIndex + 1) % questions.length); // loop back to 0th index
  };

  const setPreviousQuestion = () => {
    const newIndex = currentQuestionIndex - 1;
    setCurrentQuestionIndex(newIndex >= 0 ? newIndex : questions.length - 1); // loop to the other edge
  };

  const setRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    setCurrentQuestionIndex(randomIndex);
  };

  const setAspectTypeQuestion = (aspectType: AspectType) => {
    const questionsOfType = questions.filter(question => question.aspectType === aspectType);
    const randomQuestion = questionsOfType[Math.floor(Math.random() * questionsOfType.length)];
    setCurrentQuestion(randomQuestion);
  };


  useEffect(() => {
    // will run once at mount to set the questions
    setQuestions(reshapeQuestions());
  }, []);

  useEffect(() => {
    // will run once after mount has set the questions
    setRandomQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  const zone = currentQuestion ? getZoneName(currentQuestion.aspectType) : "The Heart";
  
  const bgColor = zoneColors[zone];

  const buttonBgColor = isVisible ? 'bg-purple-300 hover:bg-purple-600' : 'bg-purple-100 hover:bg-purple-600';

  // const textColor = textColors[zone];


  return (
    <>
      <div className="fixed top-16 left-4 z-50 pointer-events-auto"
        onPointerMove={stopEventPropagation} onPointerDown={stopEventPropagation}
      >
        <Button
          className={`${buttonBgColor} transition-colors duration-300 shadow-lg text-white rounded-full w-16 h-16 flex items-center justify-center cursor-pointer`}
          onClick={toggleVisibility}
        >
          <Image src="/icons/question.png" alt="?" width={40} height={40} priority/>
        </Button>
      </div>
      {isVisible && (
        <div>
          <motion.div
            // initial={{ backgroundColor: 'rgba(0, 0, 0, 0)' }} // Initial state (transparent)
            // animate={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }} // Final state (bg-black with opacity-30)
            // transition={{ duration: 1 }} // Duration of the transition in seconds
            // className="fixed inset-0 z-10"
          />
          {/* <div className="fixed inset-0 bg-black opacity-30 z-10 transtion-opacity duration-3000"></div> */}
          <motion.div
              // initial={{ opacity: 0 }}
              // animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              onPointerMove={stopEventPropagation} onPointerDown={stopEventPropagation}
              className=''
            >
              <Alert className={`
                fixed m-auto ${bgColor} pointer-events-auto 
                rounded-lg rounded-lg p-4 shadow-xl 
                w-[450px] h-[200px] opacity-100 z-50
                top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2` 
              }>
                <AlertTitle className="flex justify-center items-center">
                  <Select onValueChange={setAspectTypeQuestion}>
                    <SelectTrigger className="inline-flex items-center w-60 ml-12 mr-16 pl-4 pr-6 py-1 rounded-full shadow-inner hover:bg-purple-300 bg-purple-100">
                      <Image 
                        width={36} height={36}
                        src={`/icons/aspects/${currentQuestion.aspectType}.png`} alt={currentQuestion.aspectType} 
                      />
                      <span className="text-xl font-semibold">{currentQuestion.aspectType}</span>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(zoneAspectTypes).map(([zone, aspects]) => (
                        <SelectGroup key={zone}>
                          <SelectLabel className="flex items-center space-x-2 p-2">
                            <Image 
                              src={`/icons/zones/${zoneIconSrc[zone as keyof typeof zoneIconSrc]}`} 
                              alt={`${zone} icon`} 
                              height={24} 
                              width={24} 
                            />
                            <span>{zone}</span>
                          </SelectLabel>
                          {aspects.map((aspectType) => (
                            <SelectItem key={aspectType} value={aspectType} className='hover:bg-purple-100'>
                              <Image 
                                src={`/icons/aspects/${aspectType}.png`} 
                                alt={`${zone} icon`} 
                                height={24} 
                                width={24} 
                                className='ml-6 mr-4 inline-block'
                              />
                              <span className=''>{aspectType}</span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                </AlertTitle>
                <AlertDescription>
                  <div className={`flex items-center justify-center h-full text-center text-xl mt-5 mx-4 font-normal `}>
                    {currentQuestion.text}
                  </div>
                </AlertDescription>
                <CloseButton onClick={toggleVisibility} />
                <div className="absolute bottom-2 right-2 flex space-x-2">
                  <Button onClick={setPreviousQuestion} className="bg-purple-100 hover:bg-purple-400 rounded-full p-2">
                    <Image src="/icons/previous.svg" alt="Previous" width={20} height={20} />
                  </Button>
                  <Button onClick={setRandomQuestion} className="bg-purple-100 hover:bg-purple-400 rounded-full p-2">
                    <Image src="/icons/random.svg" alt="Random" width={20} height={20} />
                  </Button>
                  <Button onClick={setNextQuestion} className="bg-purple-100 hover:bg-purple-400 rounded-full p-2">
                    <Image src="/icons/next.svg" alt="Next" width={20} height={20} />
                  </Button>
                </div>
              </Alert>
            </motion.div>
          </div>

      )}

    </>
  );
};         