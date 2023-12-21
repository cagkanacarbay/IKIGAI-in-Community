import { TLUiOverrides, findMenuItem, menuItem, toolbarItem, TLUiMenuGroup } from '@tldraw/tldraw';


const toolsToRemove: string[] = []

/**
* Override the UI elements, add new things, remove any calls, do whatever. 
* See how it all works here: https://tldraw.dev/docs/user-interface#Overrides
*/
export const uiOverrides: TLUiOverrides = {
  
  actions(editor, actions) {
    // Delete actions we don't want from the UI
    // delete actions['note']
    // delete actions['insert-embed']


    actions['save'] = {
      id: 'save',
      label: 'Save',
      menuLabel: "Save Ikigai",
      contextMenuLabel: "Save Ikigai",
      icon: 'save',
      readonlyOk: true,
      onSelect(source: any) {
        if (editor && editor.store) {
          
          const snapshot = editor.store.getSnapshot();
          const stringified = JSON.stringify(snapshot);
          localStorage.setItem('editor-snapshot', stringified);
          console.log("saved editor-snapshot local storage")
          
        } else {
          console.error('Editor or editor.store is undefined.');
        }
      },
    };
    return actions;
  },
	tools(editor, tools) {
    console.log("tools")
    console.log(tools)

    const filteredTools: Record<string, any> = {};

    Object.keys(tools).forEach(key => {
      if (!toolsToRemove.includes(key)) {
        filteredTools[key] = tools[key];
      }
    });

    console.log(filteredTools)


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
    console.log("toolbar")
    console.log(toolbar)
    const filteredToolbar = toolbar.filter(item => !toolsToRemove.includes(item.id));
    console.log(filteredToolbar)

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
			const newMenuItem = menuItem(actions['save'])
			fileMenu.children.unshift(newMenuItem)
		}
		return menu;
	},
};


