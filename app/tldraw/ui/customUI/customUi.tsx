import { 
  TLUiOverrides, 
  Editor, toolbarItem, 
  TLUiActionItem, 
} from '@tldraw/tldraw';
import { saveImageAssetsAsBlobsAndUpdateMetadata, saveAsJSON, uploadSnapshot } from '../../boardStorage';
import { aspectTypes, getZoneName } from '@/lib/types';
import { createAspectAction, addAspectTypeAction, removeAspectTypeAction } from './aspectActions';

interface AssetSrc {
  id: string;
  src: string;
}

const toolsToRemove: string[] = [
  "note",
  "draw",
  "eraser",
  "ellipse",
  "diamond",
  "rectangle",
  "triangle",
  "trapezoid",
  "text",
  "rhombus",
  "rhombus-2",
  "pentagon",
  "octagon",
  "hexagon",
  "x-box",
  "check-box",
  "oval",
  "star",
  "cloud",
  "arrow-left",
  "arrow-up",
  "arrow-right",
  "arrow-down",
  "line",
  "highlight",
  "frame",
  "laser"
]

export function getShapeTypes(editor: Editor, shapeTypes: string[]) {
  const selectedShapes = editor.getSelectedShapes();
  const matchedShapes = selectedShapes.filter(shape => shapeTypes.includes(shape.type));
  return matchedShapes;
}

/**
* Override the UI elements, add new things, remove any calls, do whatever. 
* See how it all works here: https://tldraw.dev/docs/user-interface#Overrides
*/
export const uiOverrides = (isLoggedIn: boolean, editor: any): TLUiOverrides => {
  return {
    actions: (editor, actions) => {

      actions['save-local'] = {
        id: 'save-local',
        label: 'Save Ikigai Locally',
        icon: 'check',
        readonlyOk: true,
        onSelect: (source: any) => {
          if (editor && editor.store) {
            const snapshot = editor.store.getSnapshot();
            const store = snapshot.store as Record<string, any>;
            
            const assetSrcs: AssetSrc[] = [];
    
            // Extract src from assets 
            for (const key in store) {
              if (key.startsWith('asset:')) {
                const asset = store[key];
                if (asset.props?.src) {
                  assetSrcs.push({ id: key, src: asset.props.src });
                  // delete asset.props.src;
                }
              }
            }
    
            // Save the modified snapshot and asset SRCs
            saveAsJSON(snapshot, 'editor-snapshot.json');
            // console.log(snapshot)
            // saveAsJSON(assetSrcs, 'asset-srcs.json');
            // console.log(assetSrcs)
          } else {
            console.error('Editor or editor.store is undefined.');
          }
        },
      };

      // "create-aspectType": Creates a new aspect with a type of aspectType
      aspectTypes.forEach((aspectType) => {
        const zoneName = getZoneName(aspectType);
        if (zoneName) {
          actions[`create-${aspectType}`] = createAspectAction(editor, aspectType, zoneName);
        }
      });

      // "add-aspectType": Adds a new aspectType to an existing aspect
      aspectTypes.forEach((aspectType) => {
        const zoneName = getZoneName(aspectType);
        if (zoneName) {
          actions[`add-${aspectType}`] = addAspectTypeAction(editor, aspectType, zoneName);
        }
      });

      // "add-aspectType": Adds a new aspectType to an existing aspect
      aspectTypes.forEach((aspectType) => {
        const zoneName = getZoneName(aspectType);
        if (zoneName) {
          actions[`remove-${aspectType}`] = removeAspectTypeAction(editor, aspectType, zoneName);
        }
      });
      
      return actions;
    },


    tools: (editor, tools) => {
      // console.log("here are the tools: ", tools)

      // FILTERING OUT TOOLS results in an error. we need to investigate. but for now we can just remove them from the toolbar.
      // A user may use the shortcuts tho. 

      // const filteredTools: Record<string, any> = {};

      // Object.keys(tools).forEach(key => {
      //   if (!toolsToRemove.includes(key)) {
      //     filteredTools[key] = tools[key];
      //   }
      // });

      aspectTypes.forEach((aspectType) => {
        const zoneName = getZoneName(aspectType);
        if (zoneName) {
          tools[aspectType] = {
            id: aspectType, 
            icon: aspectType, 
            label: `tool.${aspectType}`,
            // kbd: undefined, 
            onSelect: () => {
              console.log("setting current tool to", aspectType)
              editor.setCurrentTool(aspectType);
            },
          }
        }
      });
      

      // ... additional tool configuration ...
      // console.log("filteredTools", filteredTools)

      // console.log("tools:", tools)

      return tools;
    },

    toolbar: (_app, toolbar, { tools }) => {
      // console.log(" YOYOYOYOYO here are the toolbar pre filter: ", toolbar)
      const filteredToolbar = toolbar.filter(item => !toolsToRemove.includes(item.id));
      // ... additional toolbar configuration ...
      // console.log(tools)
      // console.log("logging tools card:", tools.card)
      // console.log("filteredToolbar", filteredToolbar	)
      filteredToolbar.splice(4, 0, toolbarItem(tools.embed))


      return filteredToolbar;
    },

  };
};

