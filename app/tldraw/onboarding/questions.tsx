import { AspectType } from '@/lib/types';

export const QUESTIONS: Record<AspectType, string[]> = {
  skill: [
    "What software, tools, technologies or technical methodologies are you proficient in?",
    "What skills do you have that set you apart from others?",
    "What social skills or soft skills do you consider your strongest?",
    "What leadership or management skills do you bring to a project or team?",
    "Which communication skills do you consider your strongest—public speaking, writing, or another?"
  ],
  knowledge: [
    "What unique insights have you gained from your current or past job roles?",
    "What languages do you know?",
    "Do you any mental models or frameworks that you find particularly useful?",
    "What specialized knowledge do you have that you believe is rare in your industry or area of study?",
    "What's a concept or idea you've come to understand that you wish more people knew about?",
    "What's an unconventional source of wisdom or knowledge in your life?",
    "What's a lesson you've learned from a failure or mistake that you feel is beneficial?",
  ],
  tools: [
    "From software applications to hardware gadgets, what are your must-have tools for enhancing productivity, creativity, and well-being?",
    "Can you name an AI tool or resource that significantly improves your workflow or creative process?",
    "Are there any niche or unconventional tools that you have expertise in using?",
    "Can you name the tools that significantly enhance your creative projects?",
    "Are there any tools you use regularly in a hobby or craft?",
    "What's an underappreciated asset in your toolbox that you believe more people should know about?",
  ],
  strength: [
    "What is something you find easy to do that others might struggle with?",
    "What unique personal quality do you believe has contributed most to your successes?",
    "How do others benefit from your strengths?",
    "What strength do you wish to cultivate or enhance?",
    "What innate talent do you have that you're most proud of?",
    "What strength do you possess that people often commend you for?",
    "What aspect of your personality sets you apart in team environments or collaborative projects?",
  ],
  interest: [
    "Are there any ideas you like to think about?",
    "What topics or subjects are you curious about?",
    "What subject could you read about or study for hours on end?",
    "How do you like to express yourself creatively or artistically?",
    "What do you like to talk about?",
    "What captures your attention and sparks your imagination?",
    "What are some things that you find yourself researching or learning about?",
    "What are your favorite activities, hobbies?",
  ],
  value: [
    "What values are most important to you?",
    "How do these values influence your daily actions?",
    "Can you share a time when your values guided a significant decision?",
    "How do you feel when you are able to live according to your values?",
    "Are there any values you wish to cultivate more deeply?",
  ],
  dream: [
    "What dreams do you have for your future?",
    "In a decade, what would you like to have accomplished?",
    "Describe your dream project. What would it look like? What would it achieve?",
    "At the end of your life, what would you like to be remembered for?",
    "What innovation or invention do you dream of creating?",
    "If you could instantly transform one aspect of the world, what would it be?",
  ],
  influence: [
    "Who do you consider your biggest role model?",
    "What ideas or philosophies that have influenced you?",
    "Name a book or movie that changed or formed your perspective.",
    "Who inspires you the most?",
    "What's a piece of advice that has stayed with you?",
    "Who in your life has had the biggest impact on your way of thinking?",
    "What have documentaries or books introduced to you that has changed the way you think?"
  ],
  global: [
    "What's a global issue you believe is critical for the future?",
    "How can individual efforts contribute to global solutions?",
    "What's a global issue you feel is not getting enough attention?",
    "If you could advocate for one global cause, what would it be?",
    "What do we need to solve the biggest challenges of today?",
  ],
  societal: [
    "What do you perceive as the most pressing social or cultural problems in your society today?",
    "What do we need more of to combat social challenges?",
    "In what ways can people make a positive impact on societal issues?",
    "What societal change would you like to see in your lifetime?",
    "Are there any initiatives or movements you know of that are addressing important social problems?",
  ],
  communal: [
    "What's one local issue you're actively involved in or care about?",
    "How can communities come together to address local problems?",
    "What local initiative or project do you admire for its impact?",
    "Can you share a success story from a communal effort you know of or participated in?",
    "What's an area in your community where you see an opportunity for positive change?",
  ],
  personal: [
    "What personal challenge has shaped you significantly?",
    "How can personal struggles inspire or lead to broader societal change?",
    "What personal success are you hoping to achieve that might inspire others?",
    "Do you have a story of personal triumph that could motivate people facing similar issues?",
    "What's a lesson you've learned from personal experiences that you'd like to share with others?",
  ],
  "business-idea": [
    "What's a business idea you've had that you believe could be successful?",
    "If you could become a solo entrepreneur, what would you do?",
  ],
  career: [
    "What is your current role at work and what are the most fulfilling aspects of it?",
    "What tasks or projects do you find most rewarding in your current job?",
    "If you were to start a new career tomorrow, what field would you choose?",
    
    // THIS IS IMPORTANT FIND THE WAY WITH QS LIKE THIS
    "If you had to do a phd starting tomorrow based entirely on what you find intellectually interesting what would you do it on?",
  ],
  freelance: [
    "Who are your ideal clients? Startups, SMEs, corporations, ...?",
    "Are you open to ",
    "What's a freelance project you'd like to work on in the future?",
  ],
  industry: [
    "What industry are you in, or you know well?"

  ],
};