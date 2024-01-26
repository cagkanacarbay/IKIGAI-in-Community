import { 
  TLBaseShape, TLDefaultColorStyle, 
  ShapeProps, T, DefaultColorStyle, TLOnDragHandler,
  ShapeUtil, HTMLContainer, Circle2d, getDefaultColorTheme, createShapeId, useEditor
} from '@tldraw/tldraw';
import { useEffect } from 'react';

export type IIkigaiCircleShape = TLBaseShape<
  'ikigaiCircle',
  {
    x: number;
    y: number;
    radius: number;
    color: TLDefaultColorStyle;
  }
>;

export const ikigaiCircleShapeProps: ShapeProps<IIkigaiCircleShape> = {
  x: T.number,
  y: T.number,
  radius: T.number, 
  color: DefaultColorStyle, 
};


export default class IkigaiCircleShapeUtil extends ShapeUtil<IIkigaiCircleShape> {
  static override type = 'ikigaiCircle' as const;

  override hideResizeHandles = () => true
  override hideRotateHandle = () => true
  override hideSelectionBoundsFg = () => true
  override canScroll = () => false
  isLocked = () => true

  // override onDropShapesOver: TLOnDragHandler<IIkigaiCircleShape> = (shape, shapes) => {
  //   // DOESNT FIRE for some reason

  //   console.log("we got new shapess: ", shapes)

  //   shapes.forEach(droppedShape => {
  //     if (droppedShape.type === 'aspect') {
  //       // Implement logic to notify AspectShape of the drop event
  //       // This could involve updating a shared state, emitting an event, or directly invoking a method on AspectShape
        
  //       console.log("I got a new aspect woop: ", droppedShape)
  //     }
  //   });
  // };

  getDefaultProps(): IIkigaiCircleShape['props'] {
    return {
      x: 100,
      y: 100,
      radius: 250,
      color: 'light-red', 
    };
  }

  getGeometry(shape: IIkigaiCircleShape) {
    return new Circle2d({
      x: shape.props.x,
      y: shape.props.y,
			radius: shape.props.radius,
			isFilled: true,
		})
  }

  component(shape: IIkigaiCircleShape) {
    const { x, y, radius } = shape.props;
    const theme = getDefaultColorTheme({ isDarkMode: this.editor.user.getIsDarkMode() });
    const fillColor = theme[shape.props.color].semi; 
    
    const fillOpacity = 0.60;
  
    return (
      <HTMLContainer>
        <svg width={radius * 2} height={radius * 2} style={{ overflow: 'visible', position: 'absolute', left: x , top: y }}>
          <circle cx={radius} cy={radius} r={radius} fill={fillColor} fillOpacity={fillOpacity}/>
        </svg>
      </HTMLContainer>
    );
  }


  indicator(shape: IIkigaiCircleShape) {
		return <circle radius={shape.props.radius}/>
  }
}

export function IkigaiCircles() {
  const editor = useEditor();

  useEffect(() => {

    const shapes = editor.getCurrentPageShapesSorted();
    if (shapes.length === 0) {

      const radius = 800;

      const xLeft = 0;
      const xMid = (radius / 5) * 4;
      const xRight = xMid * 2;

      const yTop = 0;
      const yMid = xMid;
      const yBottom = yMid * 2;


      const ikigaiCircleIds = {
        heart: createShapeId('ikigaiCircle-theHeart'),
        craft: createShapeId('ikigaiCircle-theCraft'),
        mission: createShapeId('ikigaiCircle-theMission'),
        path: createShapeId('ikigaiCircle-thePath')
      };

      localStorage.setItem('ikigaiCircleIds', JSON.stringify(ikigaiCircleIds));

      editor.createShapes([
        { id: ikigaiCircleIds.heart, type: IkigaiCircleShapeUtil.type, props: { x: xMid, y: yTop, radius: radius, color: 'light-red' } },
        { id: ikigaiCircleIds.path, type: IkigaiCircleShapeUtil.type, props: { x: xMid, y: yBottom, radius: radius, color: 'yellow' } },
        { id: ikigaiCircleIds.craft, type: IkigaiCircleShapeUtil.type, props: { x: xLeft, y: yMid, radius: radius, color: 'light-blue' } },
        { id: ikigaiCircleIds.mission, type: IkigaiCircleShapeUtil.type, props: { x: xRight, y: yMid, radius: radius, color: 'light-green' } },
      ]);

      const circles = editor.getCurrentPageShapesSorted();
      editor.toggleLock(circles);
      editor.zoomToFit({ duration: 500 });

      // editor.zoomIn()
    }
  }, [editor]);

  return null;
}
