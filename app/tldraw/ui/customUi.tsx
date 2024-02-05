import { 
  TLUiOverrides, findMenuItem, menuItem, 
  Editor, toolbarItem, TLUiMenuGroup, 
  TLUiActionItem, menuGroup, 
  menuSubmenu, JsonObject
} from '@tldraw/tldraw';
import { saveImageAssetsAsBlobsAndUpdateMetadata, saveAsJSON, uploadSnapshot } from '../boardStorage';
import { ZoneName, aspectTypes, getZoneName } from '@/lib/types';
import { createAspectAction, addAspectTypeAction, removeAspectTypeAction } from './actions';

interface AssetSrc {
  id: string;
  src: string;
}

const toolsToRemove: string[] = []

export function getZoneColor(zoneName: ZoneName) {
  switch (zoneName) {
    case 'The Heart':
      return 'red';
    case 'The Craft':
      return 'blue';
    case 'The Cause':
      return 'green';
    case 'The Path':
      return 'yellow';
    default:
      return 'black';
  }
}

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
      actions['save'] = {
        id: 'save',
        label: 'Save',
        menuLabel: "Save Ikigai",
        icon: 'save',
        readonlyOk: true,
        /**
         * Save processes each asset in the store, uploads them as blobs, 
         * updates the store with blob_urls, and saves the snapshot to the databse.
         * @param source The source of the onSelect event.
         */
        onSelect: async (source: any) => {
          if (!isLoggedIn) {
            if (window.confirm("You need to be signed in to save your IKIGAI. Sign up now?")) {
              window.location.href = '/signup';
            }
            return;
          }

          if (editor && editor.store) {
            const snapshot = editor.store.getSnapshot();
            await saveImageAssetsAsBlobsAndUpdateMetadata(snapshot.store, editor);
            const updatedSnapshot = editor.store.getSnapshot();
                  
            try {
              const uploadResult = await uploadSnapshot(updatedSnapshot);
              // console.log("Saved Ikigai snapshot with updated asset URLs.");
              // console.log(uploadResult)

            } catch (error) {
              alert("Failed to save the snapshot to the database. Please try again.");
            }
          }
        }
      },

      actions['save-local'] = {
        id: 'save-local',
        label: 'Save',
        menuLabel: "Save Ikigai Locally",
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
            saveAsJSON(assetSrcs, 'asset-srcs.json');
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
      const filteredTools: Record<string, any> = {};

      Object.keys(tools).forEach(key => {
        if (!toolsToRemove.includes(key)) {
          filteredTools[key] = tools[key];
        }
      });

      // ... additional tool configuration ...

      filteredTools.card = {
        id: 'card',
        icon: 'color',
        label: 'Card',
        kbd: 'c',
        readonlyOk: false,
        onSelect: () => {
          editor.setCurrentTool('card')
        },
      }

      // console.log(filteredTools)

      return filteredTools;
    },

    toolbar: (_app, toolbar, { tools }) => {
      const filteredToolbar = toolbar.filter(item => !toolsToRemove.includes(item.id));
      // ... additional toolbar configuration ...
      // console.log(tools)
      // console.log("logging tools card:", tools.card)
      filteredToolbar.splice(3, 0, toolbarItem(tools.card))

      return filteredToolbar;
    },

    keyboardShortcutsMenu: (_app, keyboardShortcutsMenu, { tools }) => {
      keyboardShortcutsMenu.forEach(group => {
        if ('children' in group) {
          group.children = group.children.filter(
            item => item && !toolsToRemove.includes(item.id)
          );
        }
      });

      return keyboardShortcutsMenu;
    },

    menu: (editor, menu, { actions }) => {
      const fileMenu = findMenuItem(menu, ['menu', 'file']);
      if (fileMenu.type === 'submenu') {
        const saveMenuItem = menuItem(actions['save']);
        const saveLocalMenuItem = menuItem(actions['save-local']);
        fileMenu.children.unshift(saveMenuItem);
        fileMenu.children.unshift(saveLocalMenuItem);
      }
      return menu;
    },

    contextMenu(editor, contextMenu, { actions }) {
      // const newMenuItem = menuItem(actions['add-aspect'])

      const REMOVED_CONTEXT_MENU_OPTIONS = [
        // 'selection',          // Duplicate and Toggle Locked.         TODO: add Toggle Locked back 
        'modify',             // Reorder and Move to page.            TODO: add reorder back
        // 'clipboard-group', // Cut copy paste
        // 'conversions',        // Copy as SVG, PNG, JSON, Export as SVG, PNG, JSON
        // 'delete-group',    // Delete
        'set-selection-group' // Select all, select none
      ];

      contextMenu = contextMenu.filter(group => {
        return !REMOVED_CONTEXT_MENU_OPTIONS.includes(group.id);
      });
      
      // console.log(contextMenu);

      const CUSTOM_TYPES = ['aspect'];

      const selectedShapes = editor.getSelectedShapes()
      const selectedAspects = selectedShapes.filter(shape => CUSTOM_TYPES.includes(shape.type));
      const aspectSelected = selectedShapes.some(shape => CUSTOM_TYPES.includes(shape.type));

      // console.log("Selected Aspects: ", selectedAspects)
      // console.log("Has aspect: ", aspectSelected);
      // console.log("selected shapes are: ", selectedShapes)

      const createAspectMenu: TLUiMenuGroup = menuGroup(
        'create-aspect-group',
        !aspectSelected && menuSubmenu(
          'create-aspect',
          'Create an Aspect',
          menuGroup(
            'heart-aspects',
            menuItem(actions['create-interest']),
            menuItem(actions['create-value']),
            menuItem(actions['create-dream']),
            menuItem(actions['create-influence']),
          ),
          menuGroup(
            'craft-aspects',
            menuItem(actions['create-skill']),
            menuItem(actions['create-knowledge']),
            menuItem(actions['create-tools']),
            menuItem(actions['create-strength']),
          ),
          menuGroup(
            'cause-aspects',
            menuItem(actions['create-global']),
            menuItem(actions['create-communal']),
            menuItem(actions['create-societal']),
            menuItem(actions['create-personal']),
          ),
          menuGroup(
            'path-aspects',
            menuItem(actions['create-business-idea']),
            menuItem(actions['create-career']),
            menuItem(actions['create-freelance']),
            menuItem(actions['create-industry']),
          ),
        )
      ) as TLUiMenuGroup; 
      

      const selectedAspectTypes = selectedAspects.flatMap(shape => shape.meta.aspectTypes);

      const addAspectTypeMenu: TLUiMenuGroup = menuGroup(
        'edit-aspect-type-group',
        aspectSelected && menuSubmenu(
          'add-aspect-type',
          'Add an Aspect Type',
          menuGroup(
            'heart-aspects',
            menuItem(actions['add-interest'],),
            menuItem(actions['add-value']),
            menuItem(actions['add-dream']),
            menuItem(actions['add-influence']),
          ),
          menuGroup(
            'craft-aspects',
            menuItem(actions['add-skill']),
            menuItem(actions['add-knowledge']),
            menuItem(actions['add-tools']),
            menuItem(actions['add-strength']),
          ),
          menuGroup(
            'cause-aspects',
            menuItem(actions['add-global']),
            menuItem(actions['add-communal']),
            menuItem(actions['add-societal']),
            menuItem(actions['add-personal']),
          ),
          menuGroup(
            'path-aspects',
            menuItem(actions['add-business-idea']),
            menuItem(actions['add-career']),
            menuItem(actions['add-freelance']),
            menuItem(actions['add-industry']),
          ),
        ),
        aspectSelected && menuSubmenu(
          'remove-aspect-type',
          'Remove Aspect Type',
          menuGroup(
            'heart-aspects',
            ...removeAspectTypeMenuItems(selectedAspectTypes, 
              ['interest', 'value', 'dream', 'influence'], 
              actions
            ),
          ),
          menuGroup(
            'craft-aspects',
            ...removeAspectTypeMenuItems(selectedAspectTypes, 
              ['skill', 'knowledge', 'tools', 'strength'], 
              actions
            ),

          ),
          menuGroup(
            'cause-aspects',
            ...removeAspectTypeMenuItems(selectedAspectTypes, 
              ['global', 'communal', 'societal', 'personal'], 
              actions
            ),
          ),
          menuGroup(
            'path-aspects',
            ...removeAspectTypeMenuItems(selectedAspectTypes, 
              ['business-idea', 'career', 'freelance', 'industry'], 
              actions
            ),

          ),
        )
      ) as TLUiMenuGroup; 


      contextMenu.unshift(createAspectMenu, addAspectTypeMenu)
      return contextMenu
    },

  };
};


const removeAspectTypeMenuItems = (selectedAspectTypes: any, aspectTypes: string[], actions: any) => {
  return aspectTypes
    .map(type => {
      // Only create a menu item if the aspectType exists in the selectedAspectTypes
      if (selectedAspectTypes.includes(type)) {
        return menuItem(actions[`remove-${type}`]);
      }
      return false; // Return false instead of undefined
    })
    .filter(item => item !== false); // Filter out false items
}