import { TLUiOverrides, findMenuItem, menuItem, toolbarItem, TLUiMenuGroup, TLUiActionItem, createShapeId } from '@tldraw/tldraw';
import { saveImageAssetsAsBlobsAndUpdateMetadata, saveAsJSON, uploadSnapshot } from './boardStorage';
import { ulid } from 'ulid';
import AspectShape from './shapes/aspect';

interface AssetSrc {
  id: string;
  src: string;
}

const toolsToRemove: string[] = []

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
              console.log("Saved Ikigai snapshot with updated asset URLs.");
              console.log(uploadResult)

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
        icon: 'save',
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
            console.log(snapshot)
            saveAsJSON(assetSrcs, 'asset-srcs.json');
            console.log(assetSrcs)
          } else {
            console.error('Editor or editor.store is undefined.');
          }
        },
      };

      actions['create-aspect'] = {
        id: 'create-aspect',
        label: 'Create an aspect',
        readonlyOk: true,
        // kbd: '$u',
        onSelect(source: any) {
          const {x, y} = editor.inputs.currentPagePoint // last left click xy
          const aspectId = createShapeId(`aspect-${ulid()}`);

          editor.createShape({
            id: aspectId,
            type: AspectShape.type,
            props: {
              w: 160, h: 40, 
              text: "...", 
              zone: "craft",
              aspectTypes: ['knowledge', 'skill', 'career']
            },
            x: x,
            y: y,
          });
        },
      };

      return actions;
    },



    tools: (editor, tools) => {
      const filteredTools: Record<string, any> = {};

      Object.keys(tools).forEach(key => {
        if (!toolsToRemove.includes(key)) {
          filteredTools[key] = tools[key];
        }
      });

      // ... additional tool configuration ...

      return tools;
    },

    toolbar: (_app, toolbar, { tools }) => {
      const filteredToolbar = toolbar.filter(item => !toolsToRemove.includes(item.id));
      // ... additional toolbar configuration ...
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
      const newMenuItem = menuItem(actions['create-aspect'])
      contextMenu.unshift(newMenuItem)
      return contextMenu
    },

  };
};
