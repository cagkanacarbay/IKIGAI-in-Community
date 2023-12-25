import { TLUiOverrides, findMenuItem, menuItem, toolbarItem, TLUiMenuGroup, TLUiActionItem } from '@tldraw/tldraw';
import { saveImageAssetsAsBlobsAndUpdateMetadata } from './boardStorage';
import { saveAsJSON } from './boardStorage';

interface AssetSrc {
  id: string;
  src: string;
}

const toolsToRemove: string[] = []

/**
* Override the UI elements, add new things, remove any calls, do whatever. 
* See how it all works here: https://tldraw.dev/docs/user-interface#Overrides
*/
export const uiOverrides: TLUiOverrides = {
  actions(editor, actions) {

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
        if (editor && editor.store) {
          const snapshot = editor.store.getSnapshot();
          await saveImageAssetsAsBlobsAndUpdateMetadata(snapshot.store, editor);
          const updatedSnapshot = editor.store.getSnapshot();

          saveAsJSON(updatedSnapshot, 'ikigai.json');
          console.log("Saved Ikigai snapshot with updated asset URLs.");
        } else {
          console.error('Editor or editor.store is undefined.');
        }
      },
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
                delete asset.props.src;
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
    return actions;
  },
  
  tools(editor, tools) {

    const filteredTools: Record<string, any> = {};

    Object.keys(tools).forEach(key => {
      if (!toolsToRemove.includes(key)) {
        filteredTools[key] = tools[key];
      }
    });

    // console.log(filteredTools)

    // ADD new tools like below
    
		// tools.ikigaiCircle = {
		// 	id: 'ikigaiCircle',
		// 	icon: 'color',
		// 	label: 'Ikigai' as any,
		// 	kbd: 'c',
		// 	readonlyOk: false,
		// 	onSelect: () => {
		// 		editor.setCurrentTool('ikigaiCircle')
		// 	},
		// }

    return tools

	},


	toolbar(_app, toolbar, { tools }) {
    // console.log("toolbar")
    // console.log(toolbar)

    const filteredToolbar = toolbar.filter(item => !toolsToRemove.includes(item.id));
    // console.log(filteredToolbar)

    // add to toolbar like below
		// toolbar.splice(4, 0, toolbarItem(tools.ikigaiCircle))
    
    return filteredToolbar
	},

  keyboardShortcutsMenu(_app, keyboardShortcutsMenu, { tools }) {

    keyboardShortcutsMenu.forEach(group => {
      if ('children' in group) {
        group.children = group.children.filter(
          item => item && !toolsToRemove.includes(item.id)
        );
      }
    });

    return keyboardShortcutsMenu;
},

  menu(editor, menu, { actions }) {

		// using the findMenuItem helper
		const fileMenu = findMenuItem(menu, ['menu', 'file'])
		if (fileMenu.type === 'submenu') {
			// add the new item to the file menu's children
			const saveMenuItem = menuItem(actions['save'])
      const saveLocalMenuItem = menuItem(actions['save-local'])
			fileMenu.children.unshift(saveMenuItem)
      fileMenu.children.unshift(saveLocalMenuItem)
		}
		return menu;
	},
};


