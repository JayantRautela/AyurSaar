import { tav } from "../config/ai.js";

export async function webSearch({ query }: { query: string}) {
    console.log('Calling web search...');

    const response = await tav.search(query);

    const finalResult = response.results.map((result) => result.content).join('\n\n');

    return finalResult;
}