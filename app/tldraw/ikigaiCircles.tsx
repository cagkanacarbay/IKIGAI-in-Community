import { 
  TLBaseShape, TLDefaultColorStyle, 
  ShapeProps, T, DefaultColorStyle,
  ShapeUtil, HTMLContainer, Circle2d, getDefaultColorTheme
} from '@tldraw/tldraw';

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


export default class IkigaiCircleShape extends ShapeUtil<IIkigaiCircleShape> {
  static override type = 'ikigaiCircle' as const;

  override hideResizeHandles = () => {
    return true;
  }
  override hideRotateHandle = () => {
    return true;
  }
  override hideSelectionBoundsFg = () => {
    return true;
  }
  override canScroll = () => {
    return false;
  }

  isLocked  = () => {
    return true;
  }

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
