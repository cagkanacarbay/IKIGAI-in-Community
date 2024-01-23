import { TLUiOverrides, findMenuItem, menuItem, Editor, toolbarItem, TLUiMenuGroup, TLUiActionItem, createShapeId, menuGroup, menuSubmenu } from '@tldraw/tldraw';
import { saveImageAssetsAsBlobsAndUpdateMetadata, saveAsJSON, uploadSnapshot } from './boardStorage';
import { ulid } from 'ulid';
import AspectShape from './shapes/aspect';
import { AspectType, ZoneName, aspectTypes, getZoneName } from '@/lib/types';

interface AssetSrc {
  id: string;
  src: string;
}

const toolsToRemove: string[] = []

function getZoneColor(zoneName: ZoneName) {
  switch (zoneName) {
    case 'The Heart':
      return 'red';
    case 'The Craft':
      return 'blue';
    case 'The Mission':
      return 'green';
    case 'The Path':
      return 'yellow';
    default:
      return 'black';
  }
}

function createAspectAction(editor: Editor, aspectType: AspectType, zoneName: ZoneName) {

  return {
    id: `add-${aspectType}`,
    label: `${aspectType}`,
    // kbd: '$u',
    icon: "chevron-right",
    readonlyOk: true,
    onSelect(source: any) {
      const {x, y} = editor.inputs.currentPagePoint // last left click xy
      const aspectId = createShapeId(`aspect-${ulid()}`);

      editor.createShape({
        id: aspectId,
        type: AspectShape.type,
        props: {
          w: 160, h: 40, 
          text: "...", 
          zone: zoneName,
          aspectTypes: [aspectType],
          color: getZoneColor(zoneName),
        },
        x: x,
        y: y,
      });
    },
  };
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
            console.log(snapshot)
            saveAsJSON(assetSrcs, 'asset-srcs.json');
            console.log(assetSrcs)
          } else {
            console.error('Editor or editor.store is undefined.');
          }
        },
      };

      // Create a new action for each type of aspect. 
      aspectTypes.forEach((aspectType) => {
        const zoneName = getZoneName(aspectType);
        if (zoneName) {
          actions[`add-${aspectType}`] = createAspectAction(editor, aspectType, zoneName);
        }
      });
      
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
      // const newMenuItem = menuItem(actions['create-aspect'])
      
      const createAspectMenu: TLUiMenuGroup = menuGroup(
        'create-aspect-group',
        menuSubmenu(
          'create-aspect',
          'Create an Aspect',
          menuGroup(
            'heart-aspects',
            menuItem(actions['add-interest']),
            menuItem(actions['add-value']),
            menuItem(actions['add-dream']),
            menuItem(actions['add-influence']),
          ),
          menuGroup(
            'craft-aspects',
            menuItem(actions['add-skill']),
            menuItem(actions['add-knowledge']),
            menuItem(actions['add-expertise']),
            menuItem(actions['add-strength']),
          ),
          menuGroup(
            'mission-aspects',
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
        )
      ) as TLUiMenuGroup; 


      // console.log("context menu: ", contextMenu)
      contextMenu.unshift(createAspectMenu)
      return contextMenu
    },

  };
};
