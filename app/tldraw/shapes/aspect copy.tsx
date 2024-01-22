import {
  TLBaseShape, TLDefaultShape, TLShapeUtil, TLShapeProps, TLBounds, TLComponentProps, 
  TLDR, vec, HTMLContainer, useTLTheme, ShapeUtils, TLCircleShape, TLShape, TLApp,
} from '@tldraw/tldraw';
import * as React from 'react';
import { SVGContainer } from '@tldraw/core';
import { uniqueId } from '@tldraw/core';
import { styled } from '@stitches/react';

// Create a unique ID for the aspect shape
function createAspectId() {
  return uniqueId() as string;
}

export type AspectShapeProps = {
  x: number;
  y: number;
  tag: string;
  icons: string[];
}

export type AspectShape = TLBaseShape & AspectShapeProps;

export class AspectShapeUtil extends TLShapeUtil<AspectShape, TLBounds> {
  static id = 'aspect';
  static defaultProps: AspectShapeProps = {
    x: 0,
    y: 0,
    tag: 'aspect',
    icons: []
  };

  getBounds(shape: AspectShape): TLBounds {
    // Calculate bounds based on tag text width and icons
    const { x, y, tag, icons } = shape;
    // This will need to be calculated based on actual width of text and icons
    const width = 200; // Placeholder width
    const height = 100; // Placeholder height
    return { minX: x, minY: y, maxX: x + width, maxY: y + height, width, height };
  }

  Component = TLDR<AspectShape, TLComponentProps<AspectShape>, 'svg'>(
    ({ shape, events }, ref) => {
      const { x, y, tag, icons } = shape;
      const theme = useTLTheme();
      const IconComponent = (icon: string) => {
        // This function should return the SVG path or component for the icon
        // You would have to implement this based on how you want to render icons
        return <path d={icon} fill={theme.colors.iconFill} />;
      }

      return (
        <SVGContainer ref={ref} {...events}>
          {icons.map((icon, i) => (
            <g key={i} transform={`translate(${x + i * 30},${y})`}>
              {IconComponent(icon)}
            </g>
          ))}
          <text x={x} y={y + 50} fill={theme.colors.textFill}>
            {tag}
          </text>
        </SVGContainer>
      );
    }
  );

  Indicator = TLDR<AspectShape, TLBounds, 'rect'>(({ shape }) => {
    const bounds = this.getBounds(shape);
    return (
      <rect
        x={bounds.minX}
        y={bounds.minY}
        width={bounds.width}
        height={bounds.height}
        fill="none"
        stroke="blue"
      />
    );
  });
}

// Define your custom shapes
const MyCustomShapes = [new AspectShapeUtil()];

// Your TLDraw component
export default function TLDrawApp() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <TLApp shapeUtils={ShapeUtils} />
    </div>
  );
}

// Usage of the custom shape in the application
// You can create a custom hook or a component to handle the creation of shapes
export function useCreateAspects(editor: any) {
  React.useEffect(() => {
    if (editor.shapes.length === 0) {
      const newShapes: AspectShape[] = [
        // Define your shapes here
        { id: createAspectId(), type: AspectShapeUtil.id, ...AspectShapeUtil.defaultProps, tag: 'Tag 1', icons: ['icon1'] },
        // Add more shapes as needed
      ];
      editor.createShapes(newShapes);
    }
  }, [editor]);
}
