import { Geometry2d, HTMLContainer, ShapeUtil, TLBaseShape, Rectangle2d } from '@tldraw/tldraw'

export declare type CardShape = TLBaseShape<'card', { w: number; h: number }>

export default class CardShapeUtil extends ShapeUtil<CardShape> {
	static override type = 'card' as const

	getDefaultProps(): CardShape['props'] {
		return {
			w: 100,
			h: 100,
		}
	}

	getGeometry(shape: CardShape): Geometry2d {
		return new Rectangle2d({
			width: shape.props.w,
			height: shape.props.h,
			isFilled: true,
		})
	}

	component(shape: CardShape) {
		return <HTMLContainer>Hello</HTMLContainer>
	}

	indicator(shape: CardShape) {
		return <rect width={shape.props.w} height={shape.props.h} />
	}
}