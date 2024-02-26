import { ikigaiCircleIds } from '../../shapes/shapeIds';
import React from 'react';
import { TLShapeId } from '@tldraw/tldraw';
import { 
  IntroduceZoneStep, 
  InDepthZoneStep, 
  AspectTypeWithQuestionsStep,
  AspectDemoStep,
  ZonesOverviewStep,
  WelcomeMessage
} from './stepComponents';


export interface OnboardingStep {
  id: string;
  component: React.FC<any>;
  zoom?: { ids: TLShapeId[], targetZoom?: number };
  props: any;
  skipNavButtons?: boolean;
}

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
    // skipNavButtons: true,
  },
  {
    id: "zones-overview",
    component: ZonesOverviewStep,
    zoom: {
      ids: [ikigaiCircleIds.heart, ikigaiCircleIds.craft, ikigaiCircleIds.cause, ikigaiCircleIds.path]
    },
    // skipNavButtons: true,
    props: {
      title: "The 4 Zones",
      bgColor: 'bg-purple-50',
      iconPath: '/icons/zones/heart.png',
      size: 'w-[550px] h-[600px]',
      zones: [
        {
          icon: "/icons/zones/heart.png",
          zoneType: "heart",
          description: "What activities captivate you? Reading, history, art, travel, learning new skills?",
          aspects: [
            // Add aspects related to the heart zone here
          ]
        },
        {
          icon: "/icons/zones/craft.png",
          zoneType: "craft",
          description: "What principles guide your life? Honesty, creativity, freedom, respect, innovation?",
          aspects: [
            // Add aspects related to the craft zone here
          ]
        },
        {
          icon: "/icons/zones/path.png",
          zoneType: "path",
          description: "Who or what has shaped your thinking? Inspirational figures, pivotal events, significant books or art?",
          aspects: [
            // Add aspects related to the path zone here
          ]
        },
        {
          icon: "/icons/zones/cause.png",
          zoneType: "cause",
          description: "What are your deepest aspirations? Starting a business, writing a book, traveling the world, making a difference?",
          aspects: [
            // Add aspects related to the cause zone here
          ]
        },
      ],
    }
  }
]

const OLD_STEPS: OnboardingStep[] = [
  {
    id: 'introduce-heart',
    component: IntroduceZoneStep,
    zoom: {
      ids: [ikigaiCircleIds.heart],
    },
    props: {
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
      ids: [ikigaiCircleIds.craft],
    },
    component: IntroduceZoneStep,
    props: {
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
      ids: [ikigaiCircleIds.cause],
    },
    component: IntroduceZoneStep,
    props: {
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
      iconPath: '/icons/zones/cause.png',
      bgColor: 'bg-green-100'
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
      ids: [ikigaiCircleIds.heart],
      targetZoom: 1
    },
    component: InDepthZoneStep,
    props: {
      intro: "The Heart is made up of these 4 aspects of who you are:",
      title: "What's in The Heart",
      bgColor: 'bg-red-100',
      iconPath: '/icons/zones/heart.png',
      size: 'w-[550px] h-[580px]',
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
    },
  },
  {
    id: 'craft-aspect-types',
    zoom: {
      ids: [ikigaiCircleIds.craft],
      targetZoom: 1
    },
    component: InDepthZoneStep,
    props: {
      intro: "The Craft is built on these foundational aspects:",
      title: "Exploring The Craft",
      bgColor: 'bg-blue-100',
      iconPath: '/icons/zones/craft.png',
      size: 'w-[550px] h-[580px]',
      aspects: [
        {
          icon: "/icons/aspects/skill.png",
          aspectType: "skill",
          label: "Skills",
          description: "What competencies do you excel at? Coding, writing, analytical thinking, or perhaps public speaking?"
        },
        {
          icon: "/icons/aspects/knowledge.png",
          aspectType: "knowledge",
          label: "Knowledge",
          description: "What areas do you possess deep understanding in? This could range from professional expertise to personal interests."
        },
        {
          icon: "/icons/aspects/expertise.png",
          aspectType: "expertise",
          label: "Expertise",
          description: "In what areas do you possess specialized knowledge or capabilities? Consider fields where you're seen as an authority."
        },
        {
          icon: "/icons/aspects/strength.png",
          aspectType: "strength",
          label: "Strengths",
          description: "What are your innate strengths? This includes natural talents or abilities that you’ve always found to be your strong suits."
        },
      ],
    },
  },  
  {
    id: 'cause-aspect-types',
    zoom: {
      ids: [ikigaiCircleIds.cause],
      targetZoom: 1
    },
    component: InDepthZoneStep,
    props: {
      intro: "The Cause is centered around these types of issues:",
      title: "Defining The Cause",
      bgColor: 'bg-green-100',
      iconPath: '/icons/zones/cause.png',
      size: 'w-[550px] h-[580px]',
      aspects: [
        {
          icon: "/icons/aspects/global.png",
          aspectType: "global",
          label: "Global Issues",
          description: "What global challenges inspire you to seek solutions or advocate for change?"
        },
        {
          icon: "/icons/aspects/societal.png",
          aspectType: "societal",
          label: "Societal Issues",
          description: "Which societal problems do you feel most driven to address through your actions or advocacy?"
        },
        {
          icon: "/icons/aspects/communal.png",
          aspectType: "communal",
          label: "Communal Issues",
          description: "How do you envision contributing to solving issues within your local community?"
        },
        {
          icon: "/icons/aspects/personal.png",
          aspectType: "personal",
          label: "Personal Issues",
          description: "Are there personal challenges or issues you're passionate about that resonate on a wider scale?"
        },
      ],
    },
  },
  {
    id: 'path-aspect-types',
    zoom: {
      ids: [ikigaiCircleIds.path],
      targetZoom: 1
    },
    component: InDepthZoneStep,
    props: {
      intro: "The Path includes these critical aspects:",
      title: "Navigating The Path",
      bgColor: 'bg-yellow-100',
      iconPath: '/icons/zones/path.png',
      size: 'w-[550px] h-[580px]',
      aspects: [
        {
          icon: "/icons/aspects/business-idea.png",
          aspectType: "business-idea",
          label: "Business Ideas",
          description: "What innovative business ideas do you believe could meet a need in the market?"
        },
        {
          icon: "/icons/aspects/career.png",
          aspectType: "career",
          label: "Career",
          description: "Considering your skills and interests, what career paths are you drawn to?"
        },
        {
          icon: "/icons/aspects/freelance.png",
          aspectType: "freelance",
          label: "Freelance",
          description: "Are there freelance opportunities that align with your expertise and passion?"
        },
        {
          icon: "/icons/aspects/industry.png",
          aspectType: "industry",
          label: "Industry",
          description: "Which industries do you see as ripe for innovation or contribution from your unique skill set?"
        },
      ],
    },
  },
  {
    id: 'aspect-interest',
    zoom: {
      ids: [ikigaiCircleIds.heart],
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
      size: 'w-[550px] h-[620px]',

      aspectType: "interest",
      explanation: (
        <>
          <strong>interests</strong>: topics, ideas, activities, or subjects that interest and fascinate you.
        </>
      ),
      questions: [
        "Are there any ideas you like to think about?",
        "What topics or subjects are you curious about?",
        "What subject could you read about or study for hours on end?",
        "How do you like to express yourself creatively or artistically?",
        "What do you like to talk about?",
        "What captures your attention and sparks your imagination?",
        "What are some things that you find yourself researching or learning about?",
        "What are your favorite activities, hobbies?",
      ],
    },
  },
  {
    id: 'aspect-value',
    zoom: {
      ids: [ikigaiCircleIds.heart],
      targetZoom: 3
    },
    component: AspectTypeWithQuestionsStep,
    props: {
      title: "Values",
      subtitle: "What guides your decisions",
      subTitleColor: 'text-red-300',
      bgColor: 'bg-red-100',
      iconPath: '/icons/aspects/value.png',
      icon: "/icons/zones/heart.png",
      size: 'w-[550px] h-[600px]',
  
      aspectType: "value",
      explanation: (
        <>
          <strong>Values</strong>: the principles that you hold dear and that influence how you live your life.
        </>
      ),
      questions: [
        "What values are most important to you?",
        "How do these values influence your daily actions?",
        "Can you share a time when your values guided a significant decision?",
        "How do you feel when you are able to live according to your values?",
        "Are there any values you wish to cultivate more deeply?",
      ],
    },
  },
  {
    id: 'aspect-influence',
    zoom: {
      ids: [ikigaiCircleIds.heart],
      targetZoom: 3
    },
    component: AspectTypeWithQuestionsStep,
    props: {
      title: "Influences",
      subtitle: "Who and what shapes you",
      subTitleColor: 'text-red-300',
      bgColor: 'bg-red-100',
      iconPath: '/icons/aspects/influence.png',
      icon: "/icons/zones/heart.png",
      size: 'w-[550px] h-[620px]',
  
      aspectType: "influence",
      explanation: (
        <>
          <strong>Influences</strong>: People, books, experiences, or events that have shaped your perspectives and life path.
        </>
      ),
      questions: [
        "Who do you consider your biggest role model?",
        "What ideas or philosophies that have influenced you?",
        "Name a book or movie that changed or formed your perspective.",
        "Who inspires you the most?",
        "What's a piece of advice that has stayed with you?",
        "Who in your life has had the biggest impact on your way of thinking?",
        "What have documentaries or books introduced to you that has changed the way you think?"
      ],
    },
  },
  {
    id: 'aspect-dream',
    zoom: {
      ids: [ikigaiCircleIds.heart],
      targetZoom: 3,
    },
    component: AspectTypeWithQuestionsStep,
    props: {
      title: "Dreams",
      subtitle: "Your aspirations and goals",
      subTitleColor: 'text-red-300',
      bgColor: 'bg-red-100',
      iconPath: '/icons/aspects/dream.png',
      icon: "/icons/zones/heart.png",
      size: 'w-[550px] h-[600px]',
  
      aspectType: "dream",
      explanation: (
        <>
          <strong>Dreams</strong>: The aspirations, goals, and ambitions you have for your life.
        </>
      ),
      questions: [
        "What dreams do you have for your future?",
        "In a decade, what would you like to have accomplished?",
        "Describe your dream project. What would it look like? What would it achieve?",
        "At the end of your life, what would you like to be remembered for?",
        "What innovation or invention do you dream of creating?",
        "If you could instantly transform one aspect of the world, what would it be?",    
      ],
    },
  },
  {
    id: 'aspect-skill',
    zoom: {
      ids: [ikigaiCircleIds.craft],
      targetZoom: 3
    },
    component: AspectTypeWithQuestionsStep,
    props: {
      title: "Skills",
      subtitle: "Your ability to do things well",
      subTitleColor: 'text-blue-300',
      bgColor: 'bg-blue-100',
      iconPath: '/icons/aspects/skill.png',
      icon: "/icons/zones/craft.png",
      size: 'w-[550px] h-[600px]',
      aspectType: "skill",
      explanation: (
        <>
          <strong>Skills</strong>: Your abilities and competencies that you&apos;ve developed through practice and experience.
        </>
      ),
      questions: [
        "What software, tools, technologies or technical methodologies are you proficient in?",
        "What skills do you have that set you apart from others?",
        "What social skills or soft skills do you consider your strongest?",
        "What leadership or management skills do you bring to a project or team?",
        "Which communication skills do you consider your strongest—public speaking, writing, or another?"
      ],
    },
  },
  {
    id: 'aspect-knowledge',
    zoom: {
      ids: [ikigaiCircleIds.craft],
      targetZoom: 3
    },
    component: AspectTypeWithQuestionsStep,
    props: {
      title: "Knowledge",
      subtitle: "What you know",
      subTitleColor: 'text-blue-300',
      bgColor: 'bg-blue-100',
      iconPath: '/icons/aspects/knowledge.png',
      size: 'w-[550px] h-[700px]',
      aspectType: "knowledge",
      explanation: (
        <>
          <strong>Knowledge</strong>: The information, understanding, and wisdom you&apos;ve accumulated.
        </>
      ),
      questions: [
        "What unique insights have you gained from your current or past job roles?",
        "What languages do you know?",
        "Do you any mental models or frameworks that you find particularly useful?",
        "What specialized knowledge do you have that you believe is rare in your industry or area of study?",
        "What's a concept or idea you've come to understand that you wish more people knew about?",
        "What's an unconventional source of wisdom or knowledge in your life?",
        "What's a lesson you've learned from a failure or mistake that you feel is beneficial?",
      ],
    },
  },
  {
    id: 'aspect-tools',
    zoom: {
      ids: [ikigaiCircleIds.craft],
      targetZoom: 3
    },
    component: AspectTypeWithQuestionsStep,
    props: {
      title: "Tools",
      subtitle: "What's in your toolbox?",
      subTitleColor: 'text-blue-300',
      bgColor: 'bg-blue-100',
      iconPath: '/icons/aspects/tools.png',
      size: 'w-[550px] h-[680px]',
      aspectType: "tool",
      explanation: (
        <>
          <strong>Tools</strong>: The comprehensive suite of tools, languages, apps, platforms, and equipment that you leverage in your life.
        </>
      ),
      questions: [
        "From software applications to hardware gadgets, what are your must-have tools for enhancing productivity, creativity, and well-being?",
        "Can you name an AI tool or resource that significantly improves your workflow or creative process?",
        "Are there any niche or unconventional tools that you have expertise in using?",
        "Can you name the tools that significantly enhance your creative projects?",
        "Are there any tools you use regularly in a hobby or craft?",
        "What's an underappreciated asset in your toolbox that you believe more people should know about?",
      ],
    },
  },
  // {
  //   id: 'aspect-expertise',
  //   zoom: {
  //     ids: [ikigaiCircleIds.craft],
  //     targetZoom: 3
  //   },
  //   component: AspectTypeWithQuestionsStep,
  //   props: {
  //     title: "Expertise",
  //     subtitle: "Your specialization",
  //     subTitleColor: 'text-blue-300',
  //     bgColor: 'bg-blue-100',
  //     iconPath: '/icons/aspects/expertise.png',
  //     size: 'w-[550px] h-[600px]',
  //     aspectType: "expertise",
  //     explanation: (
  //       <>
  //         <strong>Expertise</strong>: Areas where you have a depth of experience or specialized training.
  //       </>
  //     ),
  //     questions: [
  //       "What's an area of expertise that you're known for?",
  //       "How do you apply your unique expertise to solve complex problems in your field?",
  //       "What's an area within your expertise that you're currently exploring or expanding into?",
  //       "What area of expertise are you developing not for work, but purely for personal satisfaction?",



  //       "How did you come to develop this expertise?",
  //       "What does having this expertise allow you to do?",
  //       "In what ways do you share or utilize your expertise?",
  //       "What's the next level of expertise you're aiming for?",
  //     ],
  //   },
  // },
  {
    id: 'aspect-strength',
    zoom: {
      ids: [ikigaiCircleIds.craft],
      targetZoom: 3
    },
    component: AspectTypeWithQuestionsStep,    
    props: {
      title: "Strengths",
      subtitle: "Your innate abilities",
      subTitleColor: 'text-blue-300',
      bgColor: 'bg-blue-100',
      iconPath: '/icons/aspects/strength.png',
      size: 'w-[550px] h-[660px]',
      aspectType: "strength",
      explanation: (
        <>
          <strong>Strengths</strong>: Natural talents, abilities, or qualities that give you an edge over others.
        </>
      ),
      questions: [
        "What is something you find easy to do that others might struggle with?",
        "What unique personal quality do you believe has contributed most to your successes?",
        "How do others benefit from your strengths?",
        "What strength do you wish to cultivate or enhance?",
        "What innate talent do you have that you're most proud of?",
        "What strength do you possess that people often commend you for?",
        "What aspect of your personality sets you apart in team environments or collaborative projects?",
      ],
    },
  },
  {
    id: 'aspect-global',
    zoom: {
      ids: [ikigaiCircleIds.cause],
      targetZoom: 3
    },
    component: AspectTypeWithQuestionsStep,
    props: {
      title: "Global Challenges",
      subtitle: "Issues that affect us all",
      subTitleColor: 'text-green-300',
      bgColor: 'bg-green-100',
      iconPath: '/icons/aspects/global.png',
      icon: "/icons/zones/cause.png",
      size: 'w-[550px] h-[600px]',
      aspectType: "global",
      explanation: (
        <>
          <strong>Global Challenges</strong>: Challenges facing the entire planet that you feel has to be addressed.
        </>
      ),
      questions: [
        "What's a global issue you believe is critical for the future?",
        "How can individual efforts contribute to global solutions?",
        "What's a global issue you feel is not getting enough attention?",
        "If you could advocate for one global cause, what would it be?",
        "What do we need to solve the biggest challenges of today?",
      ],
    },
  },
  {
    id: 'aspect-societal',
    zoom: {
      ids: [ikigaiCircleIds.cause],
      targetZoom: 3
    },
    component: AspectTypeWithQuestionsStep,
    props: {
      title: "Societal Challenges",
      subtitle: "Where impact is needed in our societies",
      subTitleColor: 'text-green-300',
      bgColor: 'bg-green-100',
      iconPath: '/icons/aspects/societal.png',
      icon: "/icons/zones/cause.png",
      size: 'w-[550px] h-[600px]',
      aspectType: "societal",
      explanation: (
        <>
          <strong>Societal Challenges</strong>: Social, cultural, technological, ecological problems you think are important for your society.
        </>
      ),
      questions: [
        "What do you perceive as the most pressing social or cultural problems in your society today?",
        "What do we need more of to combat social challenges?",
        "In what ways can people make a positive impact on societal issues?",
        "What societal change would you like to see in your lifetime?",
        "Are there any initiatives or movements you know of that are addressing important social problems?",
      ],
    },
  },
  {
    id: 'aspect-communal',
    zoom: {
      ids: [ikigaiCircleIds.cause],
      targetZoom: 3
    },
    component: AspectTypeWithQuestionsStep,
    props: {
      title: "Communal Issues",
      subtitle: "What needs to be done in our communities",
      subTitleColor: 'text-green-300',
      bgColor: 'bg-green-100',
      iconPath: '/icons/aspects/communal.png',
      icon: "/icons/zones/cause.png",
      size: 'w-[550px] h-[600px]',
      aspectType: "communal",
      explanation: (
        <>
          <strong>Communal Challenges</strong>: The challenges unique to any of the communities you are a part of: 
          your online group, your city, your neighborhood, ...
        </>
      ),
      questions: [
        "What's one local issue you're actively involved in or care about?",
        "How can communities come together to address local problems?",
        "What local initiative or project do you admire for its impact?",
        "Can you share a success story from a communal effort you know of or participated in?",
        "What's an area in your community where you see an opportunity for positive change?",
      ],
    },
  },
  {
    id: 'aspect-personal',
    zoom: {
      ids: [ikigaiCircleIds.cause],
      targetZoom: 3
    },
    component: AspectTypeWithQuestionsStep,
    props: {
      title: "Personal Issues",
      subtitle: "Individual passions and challenges",
      subTitleColor: 'text-green-300',
      bgColor: 'bg-green-100',
      iconPath: '/icons/aspects/personal.png',
      icon: "/icons/zones/cause.png",
      size: 'w-[550px] h-[600px]',
      aspectType: "personal",
      explanation: (
        <>
          <strong>Personal Issues</strong>: Individual challenges that you feel a strong drive to overcome or address.
        </>
      ),
      questions: [
        "What personal challenge has shaped you significantly?",
        "How can personal struggles inspire or lead to broader societal change?",
        "What personal success are you hoping to achieve that might inspire others?",
        "Do you have a story of personal triumph that could motivate people facing similar issues?",
        "What's a lesson you've learned from personal experiences that you'd like to share with others?",
      ],
    },
  },
  {
    id: 'aspect-business-idea',
    zoom: {
      ids: [ikigaiCircleIds.path],
      targetZoom: 3
    },
    component: AspectTypeWithQuestionsStep,
    props: {
      title: "Business Ideas",
      subtitle: "Innovative ventures",
      subTitleColor: 'text-yellow-700',
      bgColor: 'bg-yellow-100',
      iconPath: '/icons/aspects/business-idea.png',
      icon: "/icons/zones/path.png",
      size: 'w-[550px] h-[600px]',
      aspectType: "business-idea",
      explanation: (
        <>
          <strong>Business Ideas</strong>: Entrepreneurial concepts and innovations you&apos;d love to bring to life.
        </>
      ),
      questions: [
        "What's a business idea you've been pondering?",
        "How does your business idea solve a problem or fill a gap in the market?",
        "Have you taken any steps towards realizing this business idea?",
        "What excites you the most about your business idea?",
        "Who would be your dream customer or client for your business idea?",
      ],
    },
  },
  {
    id: 'aspect-career',
    zoom: {
      ids: [ikigaiCircleIds.path],
      targetZoom: 3
    },
    component: AspectTypeWithQuestionsStep,
    props: {
      title: "Career",
      subtitle: "Professional development",
      subTitleColor: 'text-yellow-700',
      bgColor: 'bg-yellow-100',
      iconPath: '/icons/aspects/career.png',
      icon: "/icons/zones/path.png",
      size: 'w-[550px] h-[600px]',
      aspectType: "career",
      explanation: (
        <>
          <strong>Career</strong>: Professional paths and growth opportunities you&apos;re aiming to pursue.
        </>
      ),
      questions: [
        "What does your ideal career path look like?",
        "Which professional achievements are you working towards?",
        "What skills or experiences are you seeking to advance your career?",
        "Is there a field or industry where you aspire to make your mark?",
        "How do you want to evolve in your professional life in the next five years?",
      ],
    },
  },
  {
    id: 'aspect-freelance',
    zoom: {
      ids: [ikigaiCircleIds.path],
      targetZoom: 3
    },
    component: AspectTypeWithQuestionsStep,
    props: {
      title: "Freelance",
      subtitle: "Independent work",
      subTitleColor: 'text-yellow-700',
      bgColor: 'bg-yellow-100',
      iconPath: '/icons/aspects/freelance.png',
      icon: "/icons/zones/path.png",
      size: 'w-[550px] h-[600px]',
      aspectType: "freelance",
      explanation: (
        <>
          <strong>Freelance</strong>: Opportunities for self-employment and project-based work.
        </>
      ),
      questions: [
        "What kind of freelance work interests you the most?",
        "How could freelancing complement your personal and professional goals?",
        "What's unique about the service or skills you offer as a freelancer?",
        "Have you identified a niche for your freelance work?",
        "What's your strategy for finding freelance opportunities?",
      ],
    },
  },
  {
    id: 'aspect-industry',
    zoom: {
      ids: [ikigaiCircleIds.path],
      targetZoom: 3
    },
    component: AspectTypeWithQuestionsStep,
    props: {
      title: "Industry",
      subtitle: "Sector specialization",
      subTitleColor: 'text-yellow-700',
      bgColor: 'bg-yellow-100',
      iconPath: '/icons/aspects/industry.png',
      icon: "/icons/zones/path.png",
      size: 'w-[550px] h-[600px]',
      aspectType: "industry",
      explanation: (
        <>
          <strong>Industry</strong>: Economic sectors where you see potential for growth or innovation.
        </>
      ),
      questions: [
        "Which industry do you see yourself thriving in?",
        "Are there emerging sectors where you’d like to apply your expertise?",
        "What industry trends are you most excited about?",
        "How could you contribute to innovation within your chosen industry?",
        "What steps are you taking to break into or advance in this industry?"
      ],
    },
  },
  {
    id: "aspect-demo",
    // zoom is handled by the previous step in this case
    component: AspectDemoStep,
    skipNavButtons: true,
    props: {
      title: "Your first aspect",
      bgColor: 'bg-purple-100',
      iconPath: '/icons/zones/heart.png',
      subtitle: 'interacting with aspects',
      subTitleColor: 'text-purple-300',
      size: 'w-[450px] h-[550px]',
      position: 'inset-y-0 left-20 top-20', // Position the Alert box on the left side of the screen on medium screens and up

    }
  },
  {
    id: "zones-overview",
    component: ZonesOverviewStep,
    zoom: {
      ids: [ikigaiCircleIds.heart, ikigaiCircleIds.craft, ikigaiCircleIds.cause, ikigaiCircleIds.path]
    },
    skipNavButtons: true,
    props: {
      title: "The 4 Zones",
      bgColor: 'bg-blue-100',
      iconPath: '/icons/zones/heart.png',
      size: 'w-[550px] h-[600px]',
      zones: [
        {
          icon: "/icons/zones/heart.png",
          zoneType: "heart",
          description: "What activities captivate you? Reading, history, art, travel, learning new skills?",
          aspects: [
            // Add aspects related to the heart zone here
          ]
        },
        {
          icon: "/icons/zones/craft.png",
          zoneType: "craft",
          description: "What principles guide your life? Honesty, creativity, freedom, respect, innovation?",
          aspects: [
            // Add aspects related to the craft zone here
          ]
        },
        {
          icon: "/icons/zones/path.png",
          zoneType: "path",
          description: "Who or what has shaped your thinking? Inspirational figures, pivotal events, significant books or art?",
          aspects: [
            // Add aspects related to the path zone here
          ]
        },
        {
          icon: "/icons/zones/cause.png",
          zoneType: "cause",
          description: "What are your deepest aspirations? Starting a business, writing a book, traveling the world, making a difference?",
          aspects: [
            // Add aspects related to the cause zone here
          ]
        },
      ],
    }
  }
];
