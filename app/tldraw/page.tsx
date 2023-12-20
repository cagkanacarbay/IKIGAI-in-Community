// IkigaiBoardV2.tsx
"use client";
import React, { useEffect } from 'react';
import { Tldraw, useEditor, RecordId } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import IkigaiCircleShape from './ikigaiCircles';

const CustomShapes = [IkigaiCircleShape]


export default function IkigaiBoardV2() {

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw shapeUtils={CustomShapes}>
		<IkigaiCircles/>
      </Tldraw>
    </div>
  );
}


function IkigaiCircles() {
	const editor = useEditor()

	useEffect(() => {
		
		const shapes = editor.getCurrentPageShapesSorted();
		if (shapes.length === 0) {
			
			const radius = 800;

			const xLeft = 0
			const xMid = (radius/5) * 4;
			const xRight = xMid * 2;

			const yTop = 0
			const yMid = xMid;
			const yBottom = yMid * 2;


			editor.createShapes([
				{ type: IkigaiCircleShape.type, props: { x: xMid, y: yTop, radius: radius, color: 'light-red' }},
				{ type: IkigaiCircleShape.type, props: { x: xMid, y: yBottom, radius: radius, color: 'yellow' }},
				{ type: IkigaiCircleShape.type, props: { x: xLeft, y: yMid, radius: radius, color: 'light-blue' }},
				{ type: IkigaiCircleShape.type, props: { x: xRight, y: yMid, radius: radius, color: 'light-green' }},
			]);
			const circles = editor.getCurrentPageShapesSorted();
			editor.toggleLock(circles)
			editor.zoomToFit({ duration: 200 })
			console.log(circles)

			// editor.zoomIn()

		}
	  }, [editor]); 
	
	return null;
}


// function IkigaiCircles() {
// 	const editor = useEditor()

// 	useEffect(() => {
		
// 		const shapes = editor.getCurrentPageShapesSorted();
// 		if (shapes.length === 0) {
// 			editor.createShapes([
// 				{ type: IkigaiCircleShape.type, props: { x: 200, y: 0, radius: 250, color: 'light-red' }},
// 				{ type: IkigaiCircleShape.type, props: { x: 200, y: 400, radius: 250, color: 'yellow' }},
// 				{ type: IkigaiCircleShape.type, props: { x: 0, y: 200, radius: 250, color: 'light-blue' }},
// 				{ type: IkigaiCircleShape.type, props: { x: 400, y: 200, radius: 250, color: 'light-green' }},
// 			]);
// 			const circles = editor.getCurrentPageShapesSorted();
// 			editor.toggleLock(circles)
// 			editor.zoomToFit()

// 		}
// 	  }, [editor]); 
	
// 	return null;
// }