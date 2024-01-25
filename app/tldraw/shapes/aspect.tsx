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
  EnumStyleProp, 
  TLOnTranslateEndHandler,
  
} from '@tldraw/tldraw';
import { TextLabel } from '../helpers/textLabel';
import { ShapePropsType } from '../helpers/deepTldraw';
import { AspectIcon, ZoneIcon} from './aspectIcons';
import { AspectType } from '@/lib/types';


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

}

export declare const aspectShapeProps: {
  color: EnumStyleProp<"blue" | "green" | "red" | "yellow" | "teal" | "purple" | "lime" | "amber" | "purple-strong" | "orange" | "yellow-strong" | "emerald" | "amber-strong">;
  size: EnumStyleProp<"l" | "m" | "s" | "xl">;
  font: EnumStyleProp<"draw" | "mono" | "sans" | "serif">;
  align: EnumStyleProp<"end-legacy" | "end" | "middle-legacy" | "middle" | "start-legacy" | "start">;
  verticalAlign: EnumStyleProp<"end" | "middle" | "start">;
  growY: T.Validator<number>;
  text: T.Validator<string>;
  w: T.Validator<number>;
  h: T.Validator<number>;
  // aspectTypes: T.ArrayOfValidator<AspectType>;
  zone: EnumStyleProp<"heart" | "craft" | "path" | "cause">;
};

export interface AspectShapeMeta {
  aspectTypes: AspectType[];
}

export declare type IAspectShape = TLBaseShape<'aspect', AspectShapeProps> & { meta: AspectShapeMeta };
// declare type IAspectShape = TLBaseShape<'aspect', AspectShapeProps>;

declare type AspectShapeProps = ShapePropsType<typeof aspectShapeProps>;


export default class AspectShape extends ShapeUtil<IAspectShape> {
  static override type = 'aspect' as const;

  override isAspectRatioLocked = (_shape: IAspectShape) => false
	override canResize = (_shape: IAspectShape) => true
	override hideSelectionBoundsFg = (_shape: IAspectShape) => true
  override canEdit = () => true
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
    const inTheMission = this.editor.isPointInShape(ikigaiCircleMap['theMission'], { x: current.x, y: current.y })
    const inThePath = this.editor.isPointInShape(ikigaiCircleMap['thePath'], { x: current.x, y: current.y })
  
    const color = 
      inTheHeart && inTheCraft && inTheMission && inThePath ? "amber-strong" : 
      inTheHeart && inTheCraft && inTheMission ? "orange" :
      inTheHeart && inTheCraft && inThePath ? "purple-strong" :
      inTheHeart && inTheMission && inThePath ? "emerald" :
      inTheCraft && inTheMission && inThePath ? "yellow-strong" :
      inTheHeart && inTheCraft ? "purple" : 
      inTheHeart && inTheMission ? "amber" : 
      inThePath && inTheMission ? "lime" : 
      inThePath && inTheCraft ? "teal" : 
      inTheHeart ? "red" : 
      inTheCraft ? "blue" :
      inTheMission ? "green" : 
      inThePath ? "yellow" : 
      "default"; // default color

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
      growY: 0,
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
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  getMinHeight(shape: IAspectShape) {
    const {meta: {aspectTypes}} = shape;
    const minHeight = BASE_ASPECT_HEIGHT * aspectTypes.length;
    return minHeight;
  }

  component(shape: IAspectShape) {

    const {
      id, props: { w, h, color, text, zone }, meta: { aspectTypes }
    } = shape;

    const minHeight = `${this.getMinHeight(shape)}px`;

    return (
      <HTMLContainer 
        style={{width: w, height: h, minHeight}} 
        className={`grid grid-cols-[auto,1fr,auto] items-center
          text-xs font-bold
          ${bgColors[color]} bg-opacity-60 
          rounded-lg shadow-inner shadow-md
          min-w-[120px]
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
							font="mono"
							size="s"
							align="middle"
							verticalAlign="middle"
							text={text}
							labelColor="black"
							wrap
						/>
          </div>
          <div className="flex justify-center items-center mr-1 mb-1">
            <ZoneIcon zone={zone}/>
          </div>
      </HTMLContainer>
    );
  }

  indicator(shape: IAspectShape) {
    const width = Math.max(shape.props.w, MIN_ASPECT_WIDTH);
    const height = Math.max(shape.props.h, this.getMinHeight(shape));
    return <rect width={width} height={height} />
  }
}
