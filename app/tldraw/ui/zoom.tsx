import { Editor } from '@tldraw/tldraw';
import { ikigaiCircleIds, zoneNameToId } from '../shapes/shapeIds';
import { ZoneName } from '@/lib/types';
import { TLShapeId } from '@tldraw/tldraw';


export function zoomToIkigaiCircles(editor: Editor) {
  // Select the Ikigai circles
  editor.select(...[ikigaiCircleIds["The Heart"], ikigaiCircleIds["The Craft"], ikigaiCircleIds["The Cause"], ikigaiCircleIds["The Path"]])

  // Zoom to the selection
  editor.zoomToSelection({duration: 300});

  editor.deselect(
    ...[ikigaiCircleIds["The Heart"], ikigaiCircleIds["The Craft"], ikigaiCircleIds["The Cause"], ikigaiCircleIds["The Path"]]
  );
}


export function zoomToZone(editor: Editor, zoneName: ZoneName) {

  const ikigaiCircleId = zoneNameToId[zoneName];
  editor.select(ikigaiCircleId);
  editor.zoomToSelection({duration: 300});
  editor.deselect(ikigaiCircleId);

}

export function zoomToAspects(editor: Editor, aspectIds: TLShapeId[]) {
  console.log("zoomin to aspects with ids: ", aspectIds)

  editor.select(...aspectIds);
  editor.zoomToSelection({duration: 300});
  editor.deselect(...aspectIds);

}
