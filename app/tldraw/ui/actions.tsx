import { getZoneColor } from './customUi';
import { AspectType, ZoneName } from '@/lib/types';
import { Editor, createShapeId, TLUiToast } from '@tldraw/tldraw';
import { ulid } from 'ulid';
import AspectShapeUtil from '../shapes/aspect';
import { getShapeTypes } from './customUi';
import { toast } from "sonner"


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
        type: AspectShapeUtil.type,
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
            toast("Aspect type already exists in the selected aspect.")
            // alert("Aspect type already exists in the selected aspect.");
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
    label: `${aspectType}`,
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

          // If the aspectType being removed is the only one, show a toast and return the aspect without any changes
          if (initialAspectTypes.length === 1 && initialAspectTypes.includes(aspectType)) {
            toast("The last aspect type can't be removed.");
            return aspect;
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