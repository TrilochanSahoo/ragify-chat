import OpenAI from "openai"
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';
import { personaPrompts } from "@/prompts";

const client  = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request){
    try {
        const {message, persona} = await request.json()

        // Ready the client OpenAI Embedding Model
        const embeddings = new OpenAIEmbeddings({
            model: 'text-embedding-3-large',
        });

        const vectorStore = await QdrantVectorStore.fromExistingCollection(
            embeddings,
            {
            url: 'http://localhost:6333',
            collectionName: 'ragify-chat-collection',
            }
        );

        const vectorSearcher = vectorStore.asRetriever({
            k: 3,
        });

        const relevantChunk = await vectorSearcher.invoke(message)

        const SYSTEM_PROMPT = `
            You are an AI assistant who helps resolving user query based on the context available to you. It might be txt file, pdf file, csv file, doc file , plain text, website url or youtube url.

            Only answer based on the available context to you only and give some reference that similar thing present in this txt file or pdf file, csv file, doc file , plain text, website url or youtube url.

            Context:
            ${JSON.stringify(relevantChunk)}
        `;

        const systemPrompt = personaPrompts[persona?.toLowerCase()];
        if (!systemPrompt) {
            return new Response(
                JSON.stringify({ error: "Invalid persona" }),
                { status: 400 }
            );
        }

        const stream = await client.chat.completions.create({
            model : "gpt-4o-mini",
            messages : [
                { role: "system", content: SYSTEM_PROMPT },
                {role: "user", content : message}
            ],
            stream : true
        })

        const encoder = new TextEncoder()

        const readable = new ReadableStream({
            async start(controller){
                for await(const chunk of stream){
                    const content = chunk.choices[0]?.delta?.content || ""
                    if(content){
                        controller.enqueue(encoder.encode(`data : ${JSON.stringify({content})}\n\n`))
                    }
                    
                }
                controller.close()
            }
        }) 

        return new Response(readable,{
            headers : {
                'Content-Type' : "text/event-stream",
                'Cache-Control' : "no-cache",
                'Connection' : "keep-alive"
            }
        })

    } catch (error) {
        return Response.json({
            error : "Failed to process the request"
        },{status : 500})
    }
}