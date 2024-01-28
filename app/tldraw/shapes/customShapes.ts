import AspectShapeUtil from '../shapes/aspect';
import { defaultShapeUtils } from '@tldraw/tldraw';
import IkigaiCircleShapeUtil from './ikigaiCircles';
import { CardShapeUtil } from './card';

export const customShapeUtils = [...defaultShapeUtils, AspectShapeUtil, IkigaiCircleShapeUtil, CardShapeUtil]