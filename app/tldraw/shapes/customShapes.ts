import AspectShapeUtil from '../shapes/aspect';
import { defaultShapeUtils } from '@tldraw/tldraw';
import IkigaiCircleShapeUtil from './ikigaiCircles';

export const customShapeUtils = [...defaultShapeUtils, AspectShapeUtil, IkigaiCircleShapeUtil]