import { 
  TLBaseShape, TLDefaultColorStyle, 
  ShapeProps, T, DefaultColorStyle, TLOnDragHandler,
  ShapeUtil, HTMLContainer, Circle2d, getDefaultColorTheme, createShapeId, useEditor
} from '@tldraw/tldraw';
import { useEffect } from 'react';
import { ZoneName } from '@/lib/types';
import { ikigaiCircleIds } from './shapeIds';
import { motion } from 'framer-motion';


export const RADIUS = 800;

export interface IkigaiCircleShapeMeta {
  zone: ZoneName;
}

export type IIkigaiCircleShape = TLBaseShape<
  'ikigaiCircle',
  {
    x: number;
    y: number;
    radius: number;
    color: TLDefaultColorStyle;
  }
> & { meta: IkigaiCircleShapeMeta };;

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

  getInitialMetaForShape(): IIkigaiCircleShape['meta'] {
    return { zone: "The Craft" };
  };

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
    console.log("the meta: ", shape.meta.zone)
  
    return (
      <HTMLContainer>
        {/* <motion.div> */}
        <svg id={shape.meta.zone} width={radius * 2} height={radius * 2} style={{ overflow: 'visible', position: 'absolute', left: x , top: y }}>
          <circle cx={radius} cy={radius} r={radius} fill={fillColor} fillOpacity={fillOpacity}/>
        </svg>
        {/* </motion.div> */}
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

  
    const existingShapes = editor.getCurrentPageShapesSorted();
    const existingShapeIds = existingShapes.map(shape => shape.id);
  
    const shapesToCreate = [];
  
    for (let key in ikigaiCircleIds) {
      if (!existingShapeIds.includes(ikigaiCircleIds[key as keyof typeof ikigaiCircleIds])) {
        let x, y, color;
  
        switch (key) {
          case 'heart':
            x = (RADIUS / 5) * 4;
            y = 0;
            color = 'light-red';
            break;
          case 'path':
            x = (RADIUS / 5) * 4;
            y = (RADIUS / 5) * 4 * 2;
            color = 'yellow';
            break;
          case 'craft':
            x = 0;
            y = (RADIUS / 5) * 4;
            color = 'light-blue';
            break;
          case 'cause':
            x = (RADIUS / 5) * 4 * 2;
            y = (RADIUS / 5) * 4;
            color = 'light-green';
            break;
          default:
            break;
        }
  
        shapesToCreate.push({
          id: ikigaiCircleIds[key as keyof typeof ikigaiCircleIds],
          type: IkigaiCircleShapeUtil.type,
          meta: { zone: key as ZoneName},
          props: { x, y, radius: RADIUS, color }
        });
      }
    }

    console.log("ikigai circles to be created: ", shapesToCreate)
  
    if (shapesToCreate.length > 0) {
      editor.createShapes(shapesToCreate);
      const circles = editor.getCurrentPageShapesSorted();
      editor.toggleLock(circles);
      editor.zoomToFit({ duration: 500 });
    }
  }, [editor]);

  return null;
}

// This is used in setting up the minimzable Help Board.
// It doesn't have anything to do with the size of the circles, 
// but if that is changed this should change.
//
// I calculated this by drawing a square around the circles and
// playing with the size so that it one to one contained the circles 
// with the edges of the circles perflecly matching the square at 
// the top left right and bottom mid points of the square.
// This would have to change if ikigai circles were changed.
export const ikigaiCirclesBoxSize = { width: 2880, height: 2880 }; 