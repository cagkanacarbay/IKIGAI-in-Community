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

export function addAspectActionToSelectedAspects(editor: Editor, aspectType: AspectType, zoneName: ZoneName) {

  return {
    id: `add-${aspectType}`,
    label: `${aspectType}`,
    // kbd: '$u',
    // icon: "chevron-right",
    readonlyOk: true,
    onSelect(source: any) {
      const { x, y } = editor.inputs.currentPagePoint; // last left click xy

      // const aspectId = createShapeId(`aspect-${ulid()}`);
      const selectedAspects = getShapeTypes(editor, ['aspect']);
      console.log(`ADDING ${aspectType} to selected aspects:`, selectedAspects);


      const updatedAspects = selectedAspects
        .filter(aspect => aspect.type === 'aspect')
        .map(aspect => {
          // Ensure that initialAspectTypes is an array of strings
          const initialAspectTypes = Array.isArray(aspect.meta.aspectTypes) && aspect.meta.aspectTypes.every(type => typeof type === 'string')
            ? aspect.meta.aspectTypes
            : [];
          
                      
          // TODO: Add toast to notify user that aspect type already exists
          // if (initialAspectTypes.includes(aspectType)) {
          //   console.log(`Aspect type ${aspectType} already exists in the selected aspect.`);
          //   return aspect;
          // }

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


// export function addAspectActionToSelectedAspects(editor: Editor, aspectType: AspectType, zoneName: ZoneName, addToast: (toast: Omit<TLUiToast, 'id'> & { id?: string }) => string) {

//   return {
//     id: `add-${aspectType}`,
//     label: `${aspectType}`,
//     readonlyOk: true,
//     onSelect(source: any) {
//       const selectedAspects = getShapeTypes(editor, ['aspect']);
//       console.log(`ADDING ${aspectType} to selected aspects:`, selectedAspects);

//       const updatedAspects = selectedAspects
//         .filter(aspect => aspect.type === 'aspect')
//         .map(aspect => {
//           // Ensure that initialAspectTypes is an array of strings
//           const initialAspectTypes = Array.isArray(aspect.meta.aspectTypes) && aspect.meta.aspectTypes.every(type => typeof type === 'string')
//             ? aspect.meta.aspectTypes
//             : [];

//           if (initialAspectTypes.includes(aspectType)) {
//             addToast({
//               id: `aspectType-${aspectType}-exists`,
//               title: 'Error',
//               description: `Aspect type ${aspectType} already exists in the selected aspect.`,
//             });
//             return aspect;
//           }

//           const newMeta = {
//             aspectTypes: [...initialAspectTypes, aspectType],
//           };

//           // Return a new aspect with the updated meta
//           return {...aspect, meta: newMeta};
//         });

//       editor.updateShapes(updatedAspects);
//     },
//   };
// }