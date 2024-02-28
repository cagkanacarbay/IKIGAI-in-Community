import {
  TLBaseShape,
  TLDefaultColorStyle,
  ShapeProps,
  T,
  DefaultColorStyle,
  ShapeUtil,
  BaseBoxShapeUtil,
  HTMLContainer,
  Rectangle2d,
  getDefaultColorTheme,
  TLShapeId,
  useEditor, 
  resizeBox,
  TLOnResizeHandler,
  TLEventHandlers,
  // EnumStyleProp, 
  TLOnTranslateEndHandler,
  DefaultSizeStyle,
  DefaultVerticalAlignStyle,
  DefaultHorizontalAlignStyle,
  TLDefaultHorizontalAlignStyle,
  TLDefaultVerticalAlignStyle,
  EnumStyleProp,
  DefaultFontStyle,
  Editor
  
} from '@tldraw/tldraw';
import { ShapePropsType } from '../tldrawHelpers/deepTldraw';
import { AspectIcon, ZoneIcon} from './aspectIcons';
import { AspectType } from '@/lib/types';
import { TextLabel, TEXT_PROPS, FONT_FAMILIES, LABEL_FONT_SIZES } from '../tldrawHelpers/textLabel';
import { motion } from 'framer-motion';


const BASE_ASPECT_HEIGHT = 32
const MIN_ASPECT_WIDTH = 120
const bgColors = {
  "blue": "bg-blue-100",
  "green": "bg-green-100",
  "red": "bg-red-100",
  "yellow": "bg-yellow-100",
  "teal": "bg-teal-100",
  "purple": "bg-purple-50",
  "lime": "bg-lime-100",
  "amber": "bg-amber-100",
  "purple-strong": "bg-purple-200",
  "orange": "bg-orange-200",
  "yellow-strong": "bg-yellow-200",
  "emerald": "bg-emerald-200",
  "amber-strong": "bg-amber-400",
  "default": "bg-gray-100"
}

export const aspectShapeProps = {
  color: T.setEnum(new Set(["blue", "green", "red", "yellow", "teal", "purple", "lime", "amber", "purple-strong", "orange", "yellow-strong", "emerald", "amber-strong", "default"])),
  size: DefaultSizeStyle,
  font: DefaultFontStyle,
  align: DefaultHorizontalAlignStyle,
  verticalAlign: DefaultVerticalAlignStyle,
  growY: T.positiveNumber,
  text: T.string,
  w: T.nonZeroNumber,
  h: T.nonZeroNumber,
  zone: T.setEnum(new Set(["The Heart", "The Craft", "The Path", "The Cause"])), 
};


export interface AspectShapeMeta {
  aspectTypes: AspectType[];
}

declare type AspectShapeProps = ShapePropsType<typeof aspectShapeProps>;
export declare type IAspectShape = TLBaseShape<'aspect', AspectShapeProps> & { meta: AspectShapeMeta };



export default class AspectShape extends ShapeUtil<IAspectShape> {
  static override type = 'aspect' as const;
  static override props = aspectShapeProps;

  override isAspectRatioLocked = (_shape: IAspectShape) => false
	override canResize = (_shape: IAspectShape) => true
  override canEdit = () => true

  override hideSelectionBoundsFg = (_shape: IAspectShape) => true
  // override hideResizeHandles = () => true
  
  override onResize: TLOnResizeHandler<IAspectShape> = (shape, info) => {
		return resizeBox(shape, info)
	}

  override onTranslateEnd: TLOnTranslateEndHandler<IAspectShape> = (initial: IAspectShape, current: IAspectShape) => {
    // todo: create a test for onTranslateEnd
    const shapes = this.editor.getCurrentPageShapes()
    const ikigaiCircles = shapes.filter(shape => shape.type === 'ikigaiCircle');

    const ikigaiCircleMap = ikigaiCircles.reduce((acc, shape) => {
      const key = shape.id.split('-')[1]; // get the last part of the id
      acc[key] = shape; // add the shape to the object with the key
      return acc;
    }, {} as Record<string, typeof ikigaiCircles[0]>);
    
    const inTheHeart = this.editor.isPointInShape(ikigaiCircleMap['theHeart'], { x: current.x, y: current.y })
    const inTheCraft = this.editor.isPointInShape(ikigaiCircleMap['theCraft'], { x: current.x, y: current.y })
    const inTheCause = this.editor.isPointInShape(ikigaiCircleMap['theCause'], { x: current.x, y: current.y })
    const inThePath = this.editor.isPointInShape(ikigaiCircleMap['thePath'], { x: current.x, y: current.y })
  
    const color = 
      inTheHeart && inTheCraft && inTheCause && inThePath ? "amber-strong" : 
      inTheHeart && inTheCraft && inTheCause ? "orange" :
      inTheHeart && inTheCraft && inThePath ? "purple-strong" :
      inTheHeart && inTheCause && inThePath ? "emerald" :
      inTheCraft && inTheCause && inThePath ? "yellow-strong" :
      inTheHeart && inTheCraft ? "purple" : 
      inTheHeart && inTheCause ? "amber" : 
      inThePath && inTheCause ? "lime" : 
      inThePath && inTheCraft ? "teal" : 
      inTheHeart ? "red" : 
      inTheCraft ? "blue" :
      inTheCause ? "green" : 
      inThePath ? "yellow" : 
      "default"; 

    this.editor.updateShape({
      id: current.id, type: current.type, 
      props: {...current.props, color: color}
    })

  };

  onDoubleClick = (shape: IAspectShape) => {
    console.log("double click: ", shape)
  }

  getDefaultProps(): IAspectShape['props'] {
    return {
      text: "...",
      color: 'red', 
      size: 'm',
      font: 'mono',
      align: 'middle',
      verticalAlign: 'middle',
      growY: 6,
      w: MIN_ASPECT_WIDTH,
      h: BASE_ASPECT_HEIGHT,
      // aspectTypes: ['skill'],
      zone: "heart"
    };
  }

  getInitialMetaForShape(): IAspectShape['meta'] {
    return { aspectTypes: [] };
  };

  getGeometry(shape: IAspectShape) {
    // This method should return a Rectangle2d instance with the shape's geometry
    const height = this.getHeight(shape)
    return new Rectangle2d({
      width: shape.props.w,
      // height: shape.props.h,
      height: height,
      isFilled: true,
    });
  }

  getHeight(shape: IAspectShape) {
    console.log("shape height: ", BASE_ASPECT_HEIGHT + shape.props.growY)
		return Math.max(BASE_ASPECT_HEIGHT + shape.props.growY, this.getMinHeight(shape))
	}

  getMinHeight(shape: IAspectShape) {
    // return this.getHeight(shape);
    const {meta: {aspectTypes}} = shape;
    const minHeight = BASE_ASPECT_HEIGHT * aspectTypes.length;
    return minHeight;
  }

  component(shape: IAspectShape) {

    const {
      id, props: { w, h, color, text, zone, verticalAlign, align, font, size}, meta: { aspectTypes }
    } = shape;

    const minHeight = `${this.getMinHeight(shape)}px`;
    const colorClass = bgColors[color as keyof typeof bgColors]; 
    const minWidth = `${MIN_ASPECT_WIDTH}px`

    return (
        <motion.div 
          whileTap={{ scale: 0.8, transition:{ duration: 0.275}}}
          style={{width: w, height: h, minHeight}} 
          className={`grid grid-cols-[auto,1fr,auto] items-center
            text-xs font-bold
            ${colorClass} bg-opacity-60 
            rounded-lg shadow-inner shadow-md
            min-w-[${minWidth}]
          `}
        >
            <div className="flex flex-col justify-center items-center ml-1 mr-2 mb-1">
              {aspectTypes && aspectTypes.map((type) => (
                <AspectIcon key={type} type={type} />
              ))}
            </div>
            <div className="flex justify-center items-center p-2">
              <TextLabel 
                id={id}
                type="text"
                font={font}
                size={size}
                align={align}
                verticalAlign={verticalAlign}
                text={text}
                labelColor="black"
                wrap
              />
            </div>
            <div className="flex justify-center items-center mr-1 mb-1">
              <ZoneIcon zone={zone}/>
            </div>
        </motion.div>
    );
  }

  indicator(shape: IAspectShape) {
    return null
    // const width = Math.max(shape.props.w, MIN_ASPECT_WIDTH);
    // const height = Math.max(shape.props.h, this.getHeight(shape));
    // return <rect width={width} height={height}/>
  }

  override onBeforeCreate = (next: IAspectShape) => {
		return updateGrowYProp(this.editor, next, next.props.growY)
	}

	override onBeforeUpdate = (prev: IAspectShape, next: IAspectShape) => {
		if (
			prev.props.text === next.props.text &&
			prev.props.font === next.props.font &&
			prev.props.size === next.props.size &&
      prev.props.w == next.props.w &&
      prev.props.h == next.props.h
		) {
			return
		} 

    // Width is never allowed to be below MIN_ASPECT_WIDTH
    if (next.props.w < MIN_ASPECT_WIDTH) {
      next.props.w = MIN_ASPECT_WIDTH;
    }

    
    const minHeight = BASE_ASPECT_HEIGHT * next.meta.aspectTypes.length;
    console.log("min height according ti icon number: ", minHeight)
    if (next.props.h < minHeight) {
      next.props.h = minHeight;
    }

		return updateGrowYProp(this.editor, next, prev.props.growY)

	}
}

/**
 * Updates the `growY` property of a shape based on its text content and dimensions.
 *
 * The `growY` property determines how much extra vertical space is needed for the shape
 * to accommodate its text content. It's calculated based on the height of the text and
 * the current height of the shape.
 *
 * If the shape's height is greater than the height of the text, `growY` is set to the
 * difference between the shape's height and the base height.
 *
 * If the height of the text is greater than the base height, `growY` is set to the
 * difference between the text height and the base height.
 *
 * If neither of these conditions are met, `growY` is set to 0.
 *
 * @param {Editor} editor - The editor instance.
 * @param {IAspectShape} shape - The shape to update.
 * @param {number} prevGrowY - The previous `growY` value.
 * @returns {IAspectShape} - The updated shape.
 */
function updateGrowYProp(editor: Editor, shape: IAspectShape, prevGrowY = 0) {
  const PADDING = 80  // Calculated this with trial and error

  const nextTextSize = editor.textMeasure.measureText(shape.props.text, {
    ...TEXT_PROPS,
    fontFamily: FONT_FAMILIES[shape.props.font],
    fontSize: LABEL_FONT_SIZES[shape.props.size],
    maxWidth: shape.props.w - PADDING,
  })
  
  const textHeight = nextTextSize.h 

  let growY: number | null = null

  if (shape.props.h > textHeight) {
    growY = shape.props.h - BASE_ASPECT_HEIGHT
  } else if (textHeight > BASE_ASPECT_HEIGHT) {
    // TODO: fix min height as calculated here. IKI-62
    growY = textHeight - BASE_ASPECT_HEIGHT

  } else {
    growY = 0
  }

  if (growY < 0) {
    growY = 0;
  } 

  return {
    ...shape,
    props: {
      ...shape.props,
      growY,
    },
  }
  
}
