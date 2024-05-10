import { DefaultMainMenu, DefaultMainMenuContent, TldrawUiMenuGroup, TldrawUiMenuItem } from "@tldraw/tldraw"

export function CustomMainMenu() {
    return (
        <DefaultMainMenu>
            <div style={{ backgroundColor: 'thistle' }}>
                <TldrawUiMenuGroup id="example">
                    <TldrawUiMenuItem
                        id="like"
                        label="User Settings"
                        icon="external-link"
                        readonlyOk
                        onSelect={() => {
                            window.open('/user', '_blank')
                        }}
                    />
                </TldrawUiMenuGroup>
            </div>
            <DefaultMainMenuContent />
        </DefaultMainMenu>
    )
}