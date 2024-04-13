import { method } from "lodash";
import { headers } from "next/headers";

export type Answer = {
    user_id: number;
    question: string;
    event: string;
    answer: string;
};

export async function uploadAnswer(answer: Answer) {
    // upload answer to server in batches
    const batchSize = 10
    const key = "answers"
    let savedString = localStorage.getItem(key)
    if (savedString == null) {
        let value = JSON.stringify([answer])
        localStorage.setItem(key, value)
        return
    }

    let saved: Answer[] = JSON.parse(savedString)
    if (saved.length < batchSize) {
        saved.push(answer)
        localStorage.setItem(key, JSON.stringify(saved))
        return
    }

    const url = `/api/storage/question`

    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: savedString,
    }
    )

    if (!resp.ok) {
        throw new Error(`Err. while saving question`)
    }

    localStorage.removeItem(key)
    return await resp.json()
}