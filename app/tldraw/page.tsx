"use client";
import React, { useEffect, useRef } from 'react';
import { Tldraw, useEditor, createShapeId } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import IkigaiCircleShape from './ikigaiCircles';
import { uiOverrides } from './customUi';
import { useSession } from 'next-auth/react';
import { loadSnapshot } from './boardStorage';

const CustomShapes = [IkigaiCircleShape]


export default function IkigaiBoardV2() {
	const { data: session } = useSession();
  const isLoggedIn = Boolean(session);
	const editor = useEditor()
	const customUiOverrides = uiOverrides(isLoggedIn, editor);


	useEffect(() => {
		async function fetchSnapshot() {
			const snapshot = await loadSnapshot("6");
			console.log(snapshot);
		}
	
		fetchSnapshot();
	}, []);
		
	return (

		<div style={{ position: 'fixed', inset: 0 }}>
				<Tldraw 
					shapeUtils={CustomShapes} persistenceKey="persistence-key" overrides={customUiOverrides}>
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
			
			
			const ikigaiCircleIds = {
				love: createShapeId('ikigaiCircle-love'),
				goodAt: createShapeId('ikigaiCircle-goodAt'),
				need: createShapeId('ikigaiCircle-need'),
				worldNeeds: createShapeId('ikigaiCircle-worldNeeds')
			  };
			  
			localStorage.setItem('ikigaiCircleIds', JSON.stringify(ikigaiCircleIds));
			
			editor.createShapes([
				{ id: ikigaiCircleIds.love, type: IkigaiCircleShape.type, props: { x: xMid, y: yTop, radius: radius, color: 'light-red' }},
				{ id: ikigaiCircleIds.goodAt, type: IkigaiCircleShape.type, props: { x: xMid, y: yBottom, radius: radius, color: 'yellow' }},
				{ id: ikigaiCircleIds.need, type: IkigaiCircleShape.type, props: { x: xLeft, y: yMid, radius: radius, color: 'light-blue' }},
				{ id: ikigaiCircleIds.worldNeeds, type: IkigaiCircleShape.type, props: { x: xRight, y: yMid, radius: radius, color: 'light-green' }},
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
