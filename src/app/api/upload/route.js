import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";


export async function POST(request){
    try{

        const formData = await request.formData()
        const file = formData.get("file")

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" }, 
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const tempFilePath = path.join("/tmp", file.name);
        await fs.writeFile(tempFilePath, buffer);

        const ext = path.extname(file.name).toLowerCase();
        let loader;

        if(ext === ".txt"){
            // txt loader
            const loader = new TextLoader(tempFilePath)
        } else if(ext === ".pdf"){
            // PDF loader
            const loader = new PDFLoader(tempFilePath)
        } else if(ext === ".docx"){
            // docx loader
            const loader = new DocxLoader(tempFilePath)
        } else if(ext === ".doc"){
            // doc loader
            const loader = new DocxLoader(tempFilePath,
                {
                    type : "doc",
                }
            )
        } else if(ext === ".csv"){
            // docx loader
            const loader = new CSVLoader(tempFilePath)
        } else {
            await fs.unlink(tempFilePath);
            return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
        }


        // load file 
        const docs = await loader.load()

        // Ready the client OpenAI Embedding Model
        const embeddings = new OpenAIEmbeddings({
            model : 'text-embedding-3-large'
        })


        // setup vector store 
        const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings, {
            url: 'http://localhost:6333',
            collectionName: 'ragify-chat-collection',
        });





        await fs.unlink(tempFilePath);
        return NextResponse.json({
            content: docs.map((d) => d.pageContent),
        });
    }
    catch(error){
        return NextResponse.json(
            { error: "Failed to process file" },
            { status: 500 }
        )
    }
}