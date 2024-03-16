import {
	DefaultQuickActions,
	DefaultQuickActionsContent,
	TLComponents,
	Tldraw,
	TldrawUiMenuItem,
} from 'tldraw'
import 'tldraw/tldraw.css'

export default function CustomQuickActions() {
	return (
		<DefaultQuickActions>
			<DefaultQuickActionsContent />
			<TldrawUiMenuItem id="save" icon="save" onSelect={() => window.alert('savinggg')} />
		</DefaultQuickActions>
	)
}
