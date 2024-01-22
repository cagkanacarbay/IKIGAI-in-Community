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
  TextShapeUtil
} from '@tldraw/tldraw';
import { useEffect } from 'react';
import Image from 'next/image';
import { TextLabel } from '../helpers/textLabel';


export type IAspectShape = TLBaseShape<
  'aspect',
  {
    text: string;
    color: TLDefaultColorStyle;
    w: number;
    h: number;
  }
>;

export const aspectShapeProps: ShapeProps<IAspectShape> = {
  text: T.string,
  color: DefaultColorStyle,
  w: T.number,
  h: T.number
};

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
      w: 160,
      h: 40
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

  

  component(shape: IAspectShape) {
    // const bounds = this.editor.getShapeGeometry(shape).bounds

    const {
      id, type, props: { w, h, color, text } 
    }= shape;
    const { x, y } = shape;
    // const theme = getDefaultColorTheme({ isDarkMode: this.editor.user.getIsDarkMode() });
    // const fillColor = theme[color].semi;     
  
    return (

      <HTMLContainer  >
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
							type="note"
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