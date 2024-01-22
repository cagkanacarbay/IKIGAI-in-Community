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
  TextShapeUtil,
  EnumStyleProp, 
} from '@tldraw/tldraw';
import { useEffect } from 'react';
import { TextLabel } from '../helpers/textLabel';
import { ShapePropsType } from '../helpers/deepTldraw';
import { AspectIcon, ZoneIcon} from './aspectIcons';


const BASE_ASPECT_HEIGHT = 32
const MIN_ASPECT_WIDTH = 120

export declare const aspectShapeProps: {
  color: EnumStyleProp<"black" | "blue" | "green" | "grey" | "light-blue" | "light-green" | "light-red" | "light-violet" | "orange" | "red" | "violet" | "yellow">;
  size: EnumStyleProp<"l" | "m" | "s" | "xl">;
  font: EnumStyleProp<"draw" | "mono" | "sans" | "serif">;
  align: EnumStyleProp<"end-legacy" | "end" | "middle-legacy" | "middle" | "start-legacy" | "start">;
  verticalAlign: EnumStyleProp<"end" | "middle" | "start">;
  growY: T.Validator<number>;
  text: T.Validator<string>;
  w: T.Validator<number>;
  h: T.Validator<number>;
  aspectTypes: T.ArrayOfValidator<"skill" | "knowledge" | "expertise" | "strength" | "interest" | "value" | "dream" | "influence" | "global" | "societal" | "communal" | "personal" | "business idea" | "career" | "freelance" | "industry">;
  zone: EnumStyleProp<"heart" | "craft" | "path" | "cause">;
};

declare type IAspectShape = TLBaseShape<'aspect', AspectShapeProps>;

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

  onDoubleClick = (shape: IAspectShape) => {
    console.log("double click: ", shape)
  }

  getDefaultProps(): IAspectShape['props'] {
    return {
      text: "...",
      color: 'black', 
      size: 'm',
      font: 'mono',
      align: 'middle',
      verticalAlign: 'middle',
      growY: 0,
      w: MIN_ASPECT_WIDTH,
      h: BASE_ASPECT_HEIGHT,
      aspectTypes: ['skill'],
      zone: "heart"
    };
  }

  getGeometry(shape: IAspectShape) {
    console.log("heres the geometry: ", shape)
    // This method should return a Rectangle2d instance with the shape's geometry
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  getMinHeight(shape: IAspectShape) {
    const {props: {aspectTypes}} = shape;
    const minHeight = BASE_ASPECT_HEIGHT * aspectTypes.length;
    return minHeight;
  }

  component(shape: IAspectShape) {
    // const bounds = this.editor.getShapeGeometry(shape).bounds

    const {
      id, props: { w, h, color, text, aspectTypes, zone }
    } = shape;
    const { x, y } = shape;
    console.log(shape)
    console.log("here are the aspect types", aspectTypes)
    // const theme = getDefaultColorTheme({ isDarkMode: this.editor.user.getIsDarkMode() });
    // const fillColor = theme[color].semi;     

    // minHeight is BASE_ASPECT_HEIGHT times the number of aspect types in px    
    const minHeight = `${this.getMinHeight(shape)}px`;
    console.log('here is minheight: ', minHeight)
  
    return (
      <HTMLContainer 
        style={{width: w, height: h, minHeight}} 
        className={`grid grid-cols-[auto,1fr,auto] items-center
          text-xs font-bold
          bg-red-100 bg-opacity-60 
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
							size="m"
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


// export interface AspectProps {
//   aspectId: TLShapeId;
//   x: number;
//   y: number;
//   tag: string;
//   color: string; 
// }

// export const Aspect: React.FC<AspectProps> = ({ aspectId, x, y, tag, color }) => {
//   const editor = useEditor();

//   useEffect(() => {
//     // Run only once to create the shape
//     editor.createShape({
//       id: aspectId,
//       type: AspectShape.type,
//       props: { x, y, color, tag, width: 400, height: 400 },
//     });

//     // Cleanup function to remove the shape if the component is unmounted
//     return () => {
//       editor.deleteShape(aspectId);
//     };
//   }, [editor, aspectId, x, y, tag, color]); // Re-run this effect if the props change

//   return null; // This component does not render anything itself
// };