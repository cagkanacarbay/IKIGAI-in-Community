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
  Editor
} from '@tldraw/tldraw';
import { useEffect } from 'react';
import Image from 'next/image';
import { TextLabel, TEXT_PROPS, FONT_FAMILIES, LABEL_FONT_SIZES } from '../helpers/textLabel';
import { ShapePropsType } from '../helpers/deepTldraw';


const ASPECT_BASE_HEIGHT = 40

export declare const aspectShapeProps: {
  color: EnumStyleProp<"black" | "blue" | "green" | "grey" | "light-blue" | "light-green" | "light-red" | "light-violet" | "orange" | "red" | "violet" | "yellow">;
  size: EnumStyleProp<"l" | "m" | "s" | "xl">;
  font: EnumStyleProp<"draw" | "mono" | "sans" | "serif">;
  align: EnumStyleProp<"end-legacy" | "end" | "middle-legacy" | "middle" | "start-legacy" | "start">;
  verticalAlign: EnumStyleProp<"end" | "middle" | "start">;
  growY: T.Validator<number>;
  // url: T.Validator<string>;
  text: T.Validator<string>;
  w: T.Validator<number>;
  h: T.Validator<number>;
};


declare type IAspectShape = TLBaseShape<'aspect', AspectShapeProps>;

declare type AspectShapeProps = ShapePropsType<typeof aspectShapeProps>;


// export type IAspectShape = TLBaseShape<
//   'aspect',
//   {
//     text: string;
//     color: TLDefaultColorStyle;
//     w: number;
//     h: number;
//     growY: number;
//     size: EnumStyleProp<"l" | "m" | "s" | "xl">;
//     font: EnumStyleProp<"draw" | "mono" | "sans" | "serif">;
//     align: EnumStyleProp<"end-legacy" | "end" | "middle-legacy" | "middle" | "start-legacy" | "start">;
//     verticalAlign: EnumStyleProp<"end" | "middle" | "start">;
//   }
// >;




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
      w: 80,
      h: ASPECT_BASE_HEIGHT,
    };
  }

  getHeight(shape: IAspectShape) {
		return ASPECT_BASE_HEIGHT + shape.props.growY
	}

  getGeometry(shape: IAspectShape) {
    console.log("heres the geometry: ", shape)
    const height = this.getHeight(shape)

    // This method should return a Rectangle2d instance with the shape's geometry
    return new Rectangle2d({
      width: shape.props.w,
      height: height,
      isFilled: true,
    });
  }

  

  component(shape: IAspectShape) {
    // const bounds = this.editor.getShapeGeometry(shape).bounds

    const {
      id, type, props: { w, h, color, text } 
    }= shape;
    const { x, y } = shape;
    // const theme = getDefaultColorTheme({ isDarkMode: this.editor.user.getIsDarkMode() });
    // const fillColor = theme[color].semi;     
  
    return (

      <HTMLContainer className='border border-black'	
        style={{
          position: 'absolute',
          width: 164,
          height: this.getHeight(shape),
        }} 
      >
        <div
          className={
            `grid grid-cols-[auto,1fr,auto] items-center
            text-xs font-bold
            bg-red-100 bg-opacity-60 
            rounded-lg shadow-inner shadow-md`
          }
        >
          <div className="flex flex-col justify-center items-center ml-1 mb-1">
            <img src='/icons/aspects/belief.png' alt="belief icon" className="w-5 h-5 mt-1"/>
            <img src='/icons/aspects/career-options.png' alt="belief icon" className="w-5 h-5 mt-1"/> 
            <img src='/icons/aspects/open-book.png' alt="belief icon" className="w-5 h-5 mt-1"/>
          </div>
          <div className="flex justify-center items-center p-2 overflow-auto  ">
            {/* <span className="whitespace-normal">{text}</span> */}
            <TextLabel
							id={id}
							type="geo"
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
            <img src='/icons/zones/craft.png' alt="craft icon" className="w-5 h-5 mt-1"/>
          </div>
        </div>
      </HTMLContainer>
    );
  }

  indicator(shape: IAspectShape) {
    // return <rect width={shape.props.w} height={shape.props.h}  x={shape.x} y={shape.y} />

    return null
  }


  override onBeforeCreate = (next: IAspectShape) => {
		return getGrowY(this.editor, next, next.props.growY)
	}

	override onBeforeUpdate = (prev: IAspectShape, next: IAspectShape) => {
		if (
			prev.props.text === next.props.text &&
			prev.props.font === next.props.font &&
			prev.props.size === next.props.size
		) {
			return
		}

		return getGrowY(this.editor, next, prev.props.growY)
	}



}


function getGrowY(editor: Editor, shape: IAspectShape, prevGrowY = 0) {
	const PADDING = 17

	const nextTextSize = editor.textMeasure.measureText(shape.props.text, {
		...TEXT_PROPS,
		fontFamily: FONT_FAMILIES[shape.props.font],
		fontSize: LABEL_FONT_SIZES[shape.props.size],
		maxWidth: ASPECT_BASE_HEIGHT - PADDING * 2,
	})

	const nextHeight = nextTextSize.h + PADDING * 2

	let growY: number | null = null

	if (nextHeight > ASPECT_BASE_HEIGHT) {
		growY = nextHeight - ASPECT_BASE_HEIGHT
	} else {
		if (prevGrowY) {
			growY = 0
		}
	}

	if (growY !== null) {
		return {
			...shape,
			props: {
				...shape.props,
				growY,
			},
		}
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