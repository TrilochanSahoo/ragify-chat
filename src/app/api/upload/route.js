import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import 'dotenv/config'


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

         // Convert to Buffer
        const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads dir
    const uploadDir = path.join(process.cwd(), "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // ✅ Build full file path (directory + original filename)
    const filePath = path.join(uploadDir, file.name);

    // Save file
    await fs.writeFile(filePath, buffer);

        const ext = path.extname(file.name).toLowerCase();
        let loader;

        if(ext === ".txt"){
            // txt loader
            loader = new TextLoader(filePath)
        } else if(ext === ".pdf"){
            // PDF loader
            loader = new PDFLoader(filePath)
        } else if(ext === ".docx"){
            // docx loader
            loader = new DocxLoader(filePath)
        } else if(ext === ".doc"){
            // doc loader
            loader = new DocxLoader(filePath,
                {
                    type : "doc",
                }
            )
        } else if(ext === ".csv"){
            // docx loader
            loader = new CSVLoader(filePath)
        } else {
            await fs.unlink(filePath);
            return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
        }


        // load file 
        const docs = await loader.load()


        // Ready the client OpenAI Embedding Model
        const embeddings = new OpenAIEmbeddings({
            model : 'text-embedding-3-large'
        })
        // console.log(embeddings)


        // setup vector store 
        const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings, {
            url: 'http://localhost:6333',
            collectionName: 'ragify-chat-collection',
        });

        console.log("completed")



        // await fs.unlink(uploadDir);
        return NextResponse.json({
            content: docs.map((d) => d.pageContent),
        });
    }
    catch(error){
        return NextResponse.json(
            { error: error },
            { status: 500 }
        )
    }
}