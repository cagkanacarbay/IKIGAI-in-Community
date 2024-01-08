import { Editor } from '@tldraw/tldraw'
import { Assistant, Thread } from './Assistant'
import OpenAI from 'openai'
import { fetchText } from '@/lib/fetchText'
// import ikigaiAssistantPrompt from './prompts/ikigai-assistant-prompt.md'
// import { updateUserMessageWithTldrawDescriptions } from './getUserMessage'
import { delayMs } from '@/lib/utils'
import { parseSequence } from './parseSequence'

// TODO: CHANGE THIS BEFORE PRODDDD. its DANGEROUS. NEXT_PUBLIC means its available on client too. 
// we need to figure out whether we want clients to user our keys or no
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? null
const assistantId = process.env.NEXT_PUBLIC_OPENAI_ASSISTANT_ID ?? null


if (!apiKey) {
	throw Error(
		`Error: OpenAI API key not found, please create an API Key in the OpenAI platform and add it as .env.OPENAI_API_KEY`
	)
}

if (!assistantId) {
	throw Error(
		`Error: Assistant ID not found, please create an assistant in the OpenAI platform playground and add its id to .env.OPENAI_ASSISTANT_ID`
	)
}


const openai = new OpenAI({
	apiKey: apiKey,
	dangerouslyAllowBrowser: true, // TODO: CHANGE THIS BEFORE PRODDDD. its DANGEROUS
})


export class IkigaiAssistant implements Assistant<string[]> {
	constructor() {}

	// getDefaultSystemPrompt(): Promise<string> {
	// 	return fetchText(ikigaiAssistantPrompt)
	// }

	getDefaultSystemPrompt(): Promise<string> {
		const markdownUrl = '/prompts/ikigai-assistant-prompt.md'; 
		return fetchText(markdownUrl);
	}
	

	async setSystemPrompt(prompt: string): Promise<void> {
		await openai.beta.assistants.update(assistantId!, {
			instructions: prompt,
			model: 'gpt-3.5-turbo-16k',
		})
	}

	async createThread(editor: Editor) {
		const thread = await openai.beta.threads.create()
		return new OpenAiIkigaiAssistantThread(thread, editor)
	}
}


export class OpenAiIkigaiAssistantThread implements Thread<string[]> {
	constructor(
		readonly thread: OpenAI.Beta.Threads.Thread,
		readonly editor: Editor
	) {}

	current: { run: OpenAI.Beta.Threads.Run | null } | null = null

	getUserMessage(input: string) {
		return input
	}

	async sendMessage(userMessage: string) {
		if (this.current) {
			throw new Error('Cannot send message while another message is being sent.')
		}
		this.current = { run: null }

		await openai.beta.threads.messages.create(this.thread.id, {
			role: 'user',
			content: userMessage,
		})

		const run = await openai.beta.threads.runs.create(this.thread.id, {
			assistant_id: assistantId!,
		})
		const runId = run.id
		this.current.run = run

		// eslint-disable-next-line no-constant-condition
		while (true) {
			await delayMs(500)
			const run = await openai.beta.threads.runs.retrieve(this.thread.id, runId)

			switch (run.status) {
				case 'in_progress':
				case 'queued':
					continue
				case 'completed': {
					const messages = await openai.beta.threads.messages.list(this.thread.id)
					const mostRecent = messages.data[0]
					const results = []
					for (const content of mostRecent.content) {
						if (content.type === 'text') {
							results.push(content.text.value)
						}
					}
					
					console.log("yoyoyyoo")
					console.log(results.join('\n\n'))

					this.current = null
					return results
				}
				default:
					this.current = null
					throw Error(`Error: run failed with status ${run.status}`)
			}
		}
	}

	async cancel() {
		if (this.current?.run) {
			await openai.beta.threads.runs.cancel(this.thread.id, this.current.run.id)
		}
		this.current = null
	}

	async handleAssistantResponse(results: string[]) {
		for (const text of results) {
			await parseSequence(this.editor, text)
		}
	}
}
