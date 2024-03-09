import { BaseBoxShapeTool, TLClickEvent } from '@tldraw/tldraw'
export class AspectShapeTool extends BaseBoxShapeTool {
	static override id = 'aspect'
	static override initial = 'idle'
	override shapeType = 'aspect'

	override onDoubleClick: TLClickEvent = (_info) => {
		// you can handle events in handlers like this one;
		// check the BaseBoxShapeTool source as an example
	}
}