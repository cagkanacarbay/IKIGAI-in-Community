import { ikigaiCircleIds } from '../shapes/shapeIds';
import React from 'react';
import { TLShapeId } from '@tldraw/tldraw';
import { 
  IntroduceZoneStep, 
  InDepthZoneStep, 
  AspectTypeWithQuestionsStep,
  AspectDemoStep,
} from './stepComponents';


export interface OnboardingStep {
  id: string;
  component: React.FC<any>;
  zoom?: { id: TLShapeId, targetZoom?: number };
  props: any;
  skipNavButtons?: boolean;
}


export const steps: OnboardingStep[] = [
  {
    id: 'introduce-heart',
    component: IntroduceZoneStep,
    zoom: {
      id: ikigaiCircleIds.heart
    },
    props: {
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
    }
  },
  {
    id: 'introduce-craft',
    zoom: {
      id: ikigaiCircleIds.craft
    },
    component: IntroduceZoneStep,
    props: {
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
    }
  },
  {
    id: 'introduce-cause',
    zoom: {
      id: ikigaiCircleIds.mission
    },
    component: IntroduceZoneStep,
    props: {
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
    }
  },
  {
    id: 'introduce-path',
    zoom: {
      id: ikigaiCircleIds.path
    },
    component: IntroduceZoneStep,
    props: {
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
    }
  },
  {
    id: 'heart-aspect-types',
    zoom: {
      id: ikigaiCircleIds.heart,
      targetZoom: 1
    },
    component: InDepthZoneStep,
    props: {
      title: "What's in The Heart",
      aspects: [
        {
          icon: "/icons/aspects/interest.png",
          aspectType: "interest",
          label: "Interests",
          description: "What activities captivate you? Reading, history, art, travel, learning new skills?"
        },
        {
          icon: "/icons/aspects/value.png",
          aspectType: "value",
          label: "Values",
          description: "What principles guide your life? Honesty, creativity, freedom, respect, innovation?"
        },
        {
          icon: "/icons/aspects/influence.png",
          aspectType: "influence",
          label: "Influences",
          description: "Who or what has shaped your thinking? Inspirational figures, pivotal events, significant books or art?"
        },
        {
          icon: "/icons/aspects/dream.png",
          aspectType: "dream",
          label: "Dreams",
          description: "What are your deepest aspirations? Starting a business, writing a book, traveling the world, making a difference?"
        },
      ],
      bgColor: 'bg-red-100',
      iconPath: '/icons/zones/heart.png',
      size: 'w-[550px] h-[600px]',
    },
  },
  {
    id: 'aspect-interest',
    zoom: {
      id: ikigaiCircleIds.heart,
      targetZoom: 3
    },
    component: AspectTypeWithQuestionsStep,
    props: {
      title: "Interests",
      subtitle: "How you spend your time",
      subTitleColor: 'text-red-300',
      bgColor: 'bg-red-100',
      iconPath: '/icons/aspects/interest.png',
      icon: "/icons/zones/heart.png",
      size: 'w-[550px] h-[600px]',

      aspectType: "interest",
      explanation: (
        <>
          <strong>interests</strong>: topics, ideas, or subjects that interest and fascinate you.
        </>
      ),
      questions: [
        "Are there any ideas you like to think about?",
        "What topics or subjects are you curious about?",
        "How do you like to express yourself creatively or artistically?",
        "What do you like to talk about?",
        "What captures your attention and sparks your imagination?",
        "What are some things that you find yourself researching or learning about?",
        "What are your favorite activities, hobbies?",
      ],
    },
  },
  {
    id: 'aspect-dream',
    zoom: {
      id: ikigaiCircleIds.heart,
      targetZoom: 3
    },
    component: AspectTypeWithQuestionsStep,
    props: {
      title: "Dreams",
      subtitle: "Your deepest aspirations",
      subTitleColor: 'text-red-300',
      bgColor: 'bg-red-100',
      iconPath: '/icons/aspects/dream.png',
      size: 'w-[550px] h-[600px]',

      aspectType: "dream",
      explanation: "Your dreams are your deepest aspirations. They are the things you want to achieve and the things you want to experience.",
      questions: ["What are your deepest aspirations?", "Starting a business, writing a book, traveling the world, making a difference?"],
    }
  },
  {
    id: "aspect-demo",
    // zoom is handled by the previous step in this case
    component: AspectDemoStep,
    skipNavButtons: true,
    props: {
      title: "Your first aspect",
      bgColor: 'bg-red-100',
      iconPath: '/icons/zones/heart.png',
      subtitle: 'interacting with aspects',
      subTitleColor: 'text-red-300',
      size: 'w-[450px] h-[450px]',
    }

  }
];
