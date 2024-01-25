import { getZoneColor } from './customUi';
import { AspectType, ZoneName } from '@/lib/types';
import { Editor, createShapeId, TLUiToast } from '@tldraw/tldraw';
import { ulid } from 'ulid';
import AspectShape from '../shapes/aspect';
import { getShapeTypes } from './customUi';


export function createAspectAction(editor: Editor, aspectType: AspectType, zoneName: ZoneName) {

  return {
    id: `create-${aspectType}`,
    label: `${aspectType}`,
    // kbd: '$u',
    // icon: "chevron-right",
    readonlyOk: true,
    onSelect(source: any) {
      const { x, y } = editor.inputs.currentPagePoint; // last left click xy
      const aspectId = createShapeId(`aspect-${ulid()}`);

      editor.createShape({
        id: aspectId,
        type: AspectShape.type,
        meta: {
          aspectTypes: [aspectType],
        },
        props: {
          w: 160, h: 40,
          text: "...",
          zone: zoneName,
          color: getZoneColor(zoneName),
        },
        x: x,
        y: y,
      });
    },
  };
}

export function addAspectTypeAction(editor: Editor, aspectType: AspectType, zoneName: ZoneName) {

  return {
    id: `add-${aspectType}`,
    label: `${aspectType}`,
    readonlyOk: true,
    onSelect(source: any) {

      const selectedAspects = getShapeTypes(editor, ['aspect']);
      console.log(`ADDING ${aspectType} to selected aspects:`, selectedAspects);

      const updatedAspects = selectedAspects
        .filter(aspect => aspect.type === 'aspect')
        .map(aspect => {
          // Ensure that initialAspectTypes is an array of strings
          const initialAspectTypes = Array.isArray(aspect.meta.aspectTypes) && aspect.meta.aspectTypes.every(type => typeof type === 'string')
            ? aspect.meta.aspectTypes
            : [];
          
                      
          // TODO: Turn this into a nice toast
          if (initialAspectTypes.includes(aspectType)) {
            alert("Aspect type already exists in the selected aspect.");
          }

          const newMeta = {
            aspectTypes: initialAspectTypes.includes(aspectType) ? initialAspectTypes : [...initialAspectTypes, aspectType],
          };

          // Return a new aspect with the updated meta
          return {...aspect, meta: newMeta};
        });
    
    editor.updateShapes(updatedAspects);

    },
  };
}


export function removeAspectTypeAction(editor: Editor, aspectType: AspectType, zoneName: ZoneName) {
  return {
    id: `remove-${aspectType}`,
    label: `Remove ${aspectType}`,
    readonlyOk: true,
    onSelect(source: any) {
      const selectedAspects = getShapeTypes(editor, ['aspect']);
      console.log(`REMOVING ${aspectType} from selected aspects:`, selectedAspects);

      const updatedAspects = selectedAspects
        .filter(aspect => aspect.type === 'aspect')
        .map(aspect => {
          // Ensure that initialAspectTypes is an array of strings
          const initialAspectTypes = Array.isArray(aspect.meta.aspectTypes) && aspect.meta.aspectTypes.every(type => typeof type === 'string')
            ? aspect.meta.aspectTypes
            : [];

          // TODO: Turn this into a nice toast
          if (!initialAspectTypes.includes(aspectType)) {
            alert("Aspect type does not exist in the selected aspect.");
            return aspect; // Return the aspect without any changes
          }

          const newMeta = {
            aspectTypes: initialAspectTypes.filter(type => type !== aspectType), // Remove the aspectType
          };

          // Return a new aspect with the updated meta
          return {...aspect, meta: newMeta};
        });

      editor.updateShapes(updatedAspects);
    },
  };
}