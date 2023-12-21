"use client";
import React, { useEffect } from 'react';
import { Tldraw, useEditor, RecordId } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import IkigaiCircleShape from './ikigaiCircles';
import { useContainer, Vec2d } from '@tldraw/tldraw';
import { uiOverrides } from './customUi';

const CustomShapes = [IkigaiCircleShape]


export default function IkigaiBoardV2() {

  return (
    <div style={{ position: 'fixed', inset: 0 }}>

      <Tldraw 
	  	shapeUtils={CustomShapes} persistenceKey="my-persistence-key" overrides={uiOverrides}>
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

// function SaveButton() {
// 	const editor = useEditor()
// 	return (
// 		<button className='z-50'
// 			onClick={() => {
// 				const snapshot = editor.store.getSnapshot()
// 				const stringified = JSON.stringify(snapshot)
// 				localStorage.setItem('my-editor-snapshot', stringified)
// 			}}
// 		>
// 			Save
// 		</button>
// 	)
// }

function SaveButton() {
	const editor = useEditor();
	console.log(editor)
	return (
	  <button className='z-50'
		onClick={() => {
		  if (editor && editor.store) { // Check if editor and store are defined
			const snapshot = editor.store.getSnapshot();
			const stringified = JSON.stringify(snapshot);
			localStorage.setItem('my-editor-snapshot', stringified);
		  } else {
			console.log(editor)
			console.error('Editor or editor.store is undefined.');
		  }
		}}
	  >
		Save
	  </button>
	);
  }
  