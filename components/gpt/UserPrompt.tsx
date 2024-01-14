"use client"
import {
	DefaultSpinner,
	stopEventPropagation,
	useEditor,
	useLocalStorageState,
} from '@tldraw/tldraw'
import { useCallback, useEffect, useState } from 'react'
import { Assistant, Thread } from './Assistant'
import { assert } from '@/lib/utils'
import { Spinner } from '@/components/Spinner'

function useAssistant<T>(assistant: Assistant<T>, setGptResponse: (response: string) => void) {
	const editor = useEditor()
	const [thread, setThread] = useState<Thread<T> | null>(null)
	const [isReady, setIsReady] = useState(false)

	useEffect(() => {
		setIsReady(false)
		let isCancelled = false
		;(async () => {
			const systemPrompt = await assistant.getDefaultSystemPrompt()
			if (isCancelled) return

			await assistant.setSystemPrompt(systemPrompt)
			if (isCancelled) return

			setIsReady(true)
		})()

		return () => {
			isCancelled = true
		}
	}, [assistant])

	useEffect(() => {
		if (!isReady) {
			setThread(null)
			return
		}

		let isCancelled = false
		;(async () => {
			const thread = await assistant.createThread(editor)
			if (isCancelled) return
			setThread(thread)
		})()
		return () => {
			isCancelled = true
		}
	}, [assistant, editor, isReady])

	useEffect(() => {
		if (!thread) return
		return () => {
			thread.cancel()
		}
	}, [thread])

	const start = useCallback(
		async (input: string) => {
			assert(thread)
			const userMessage = thread.getUserMessage(input)
			const result = await thread.sendMessage(userMessage)
			
			if (Array.isArray(result)) {
				setGptResponse(result.join('\n\n'));
			}
			
			await thread.handleAssistantResponse(result)
			
		},
		[thread, setGptResponse]
	)

	const restart = useCallback(async () => {
		const newThread = await assistant.createThread(editor)
		setThread(newThread)
	}, [assistant, editor])

	const cancel = useCallback(async () => {
		assert(thread)
		await thread.cancel()
	}, [thread])

	if (!thread || !isReady) return null
	return { start, restart, cancel }
}

const guideStartMessage = `Welcome, I'm IKIGuide, your personal IKIGAI assistant. Here to assist you in a journey of self-discovery in search for meaning. To begin, please choose one of the following options:

1. **Describe Yourself**: Share about your skills, hobbies, and values. This will help me understand you better.
2. **Explore Careers**: Tell me about your professional interests or experiences, and I'll suggest potential career paths.
3. **World Problems**: Discuss global issues you're passionate about, and I'll help you see how your talents can make a difference.
4. **Find Your Passion**: Share what excites and motivates you, and we'll explore how these can be integrated into your life and career.
5. **Strengths and Talents**: Let's talk about what you're naturally good at, and explore how these can shape your life's journey.`;

export function UserPrompt<T>({ assistant }: { assistant: Assistant<T> }) {
	const editor = useEditor()
	const [gptResponse, setGptResponse] = useState(guideStartMessage); 
	const controls = useAssistant(assistant, setGptResponse)

	const [state, setState] = useState<'ready' | 'waiting'>('ready')
	const [text, setText] = useLocalStorageState(
		'prompt-input',
		'Create a box at the center of the viewport.'
	)

	const handleClearButtonClick = useCallback(() => {
		const ids = Array.from(editor.getCurrentPageShapeIds().values())
		editor.deleteShapes(ids)
	}, [editor])

	return (
		<>
			{state === 'waiting' && (
				<div
					className="user-prompt__overlay"
					onPointerMove={stopEventPropagation}
					onPointerDown={stopEventPropagation}
				>
					<DefaultSpinner />
				</div>
			)}
			<div className="user-prompt__container" onPointerDown={stopEventPropagation}>
				<textarea className="text-sm" value={text} onChange={(e) => setText(e.currentTarget.value)} />
				<textarea className="text-xs h-24" value={gptResponse} readOnly />
				<div className="user-prompt__buttons">
					<div className="user-prompt__buttons__group">
						<button className="tlui-button" onClick={handleClearButtonClick}>
							Clear Canvas
						</button>
					</div>
					<div className="user-prompt__buttons__group items-center">
						{controls ? (
							<UserPromptActions
								controls={controls}
								input={text}
								state={state}
								onChangeState={setState}
							/>
						) : (
							<div className="pr-3">
								<Spinner />
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

function UserPromptActions({
	controls,
	input,
	state,
	onChangeState,
}: {
	controls: NonNullable<ReturnType<typeof useAssistant>>
	input: string
	state: 'ready' | 'waiting'
	onChangeState: (state: 'ready' | 'waiting') => void
}) {
	const { start, restart, cancel } = controls

	const handleSendButtonClick = useCallback(async () => {
		if (state === 'waiting') {
			await cancel()
			onChangeState('ready')
			return
		}

		if (state === 'ready') {
			if (!input) return
			onChangeState('waiting')

			// Send the user message to the thread
			await start(input)
			onChangeState('ready')
		}
	}, [cancel, input, onChangeState, start, state])

	const [isRestarting, setIsRestarting] = useState(false)
	const handleRestartButtonClick = useCallback(async () => {
		setIsRestarting(true)
		await restart()
		setIsRestarting(false)
	}, [restart])

	return (
		<>
			<button className="tlui-button" onClick={isRestarting ? undefined : handleRestartButtonClick}>
				{isRestarting ? <Spinner /> : 'New Thread'}
			</button>
			<button
				className="tlui-button tlui-button__primary"
				onClick={handleSendButtonClick}
				style={{ width: 64 }}
			>
				{state === 'ready' ? 'Send' : 'Cancel'}
			</button>
		</>
	)
}
