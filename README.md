AskAI — AI Assistant & PDF RAG Application

AskAI is a full-stack AI assistant that supports general AI conversations and question answering over uploaded PDF documents.

It combines a React/Vite frontend with a Node.js/Express backend, MongoDB, Mistral AI, LangChain, PDF text extraction, embeddings, vector search, and Tavily web search.

Features

General AI chat with conversation history

Streaming AI responses

Current-information web search through Tavily

PDF upload and text extraction

Text chunking and embedding generation

MongoDB vector storage/retrieval

Retrieval-Augmented Generation (RAG)

Chat creation, loading, and deletion

Centralized Express error handling

Health-check API

Environment-based configuration

Architecture

React / Vite Frontend
        |
        | REST / Streaming API
        v
Node.js + Express Backend
        |
        +-------------------+-------------------+
        |                   |                   |
        v                   v                   v
   General Chat          PDF / RAG          MongoDB
        |                   |                   |
        v                   v                   |
   Mistral AI        PDF extraction            |
        |                   |                   |
        v                   v                   |
     Tavily       Chunking + Embeddings        |
                            |                   |
                            +------ Vector -----+
                                   Search

How General AI Works

User Question
      |
      v
POST /api/chat
      |
      v
chatController
      |
      v
generateGeneralAnswer()
      |
      v
Mistral AI
   /       \
  /         \
No tool    Web search required
  |               |
  |               v
  |            Tavily
  |               |
  +-------+-------+
          |
          v
    Final Mistral Response
          |
          v
     Stream to UI

Mistral decides whether the question needs current web information. If required, the backend executes the web_search tool through Tavily and provides the results to Mistral before generating the final response.

How PDF RAG Works

Document ingestion

Upload PDF
   |
   v
Multer
   |
   v
PDF text extraction
   |
   v
Chunk text
   |
   v
Generate embeddings
   |
   v
Generate documentId
   |
   +--------------------+
   |                    |
   v                    v
documents collection   vector/chunk collection
(metadata)             (text + embedding)

For each PDF:

The file is uploaded through POST /api/pdfs/upload.

PDF text is extracted using pdf-parse.

The text is split into chunks.

Embeddings are generated for the chunks.

One documentId is generated for the complete PDF.

PDF metadata is saved in MongoDB.

Each chunk is saved with its embedding and document metadata.

The temporary uploaded file is deleted.

Question answering

User Question
      |
      v
Question Embedding
      |
      v
MongoDB Vector Search
      |
      v
Relevant PDF Chunks
      |
      v
Context + Question
      |
      v
Mistral AI
      |
      v
Answer

The important RAG concept is that relevant information is retrieved from the uploaded document and supplied to the language model as context.

Project Structure

AskAI/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── vectorStore.js
│   ├── controllers/
│   │   ├── chatController.js
│   │   ├── pdfController.js
│   │   └── ...
│   ├── middleware/
│   │   ├── errorMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── chatModel.js
│   │   └── ...
│   ├── routes/
│   │   ├── chatRoutes.js
│   │   ├── pdfRoutes.js
│   │   ├── ragRoutes.js
│   │   ├── retrievalRoutes.js
│   │   └── healthRoutes.js
│   ├── services/
│   │   ├── chatService.js
│   │   ├── pdfService.js
│   │   ├── embeddingService.js
│   │   ├── documentService.js
│   │   ├── vectorIndexService.js
│   │   └── ...
│   ├── utils/
│   │   └── chunkText.js
│   ├── app.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md

Main API Routes

Route

Purpose

GET /api/health

Backend health check

/api/pdfs

PDF/document operations

/api/retrieval

Retrieval/vector-search operations

/api/chat

General AI chat

/api/rag

RAG operations

PDF upload

POST /api/pdfs/upload

Send the PDF as multipart form data using the field:

pdf

General chat

POST /api/chat

Example request:

{
  "chatId": "optional-chat-id",
  "message": "Explain Docker in simple terms"
}

The streaming response also provides the active chat ID through:

X-Chat-Id

Environment Variables

Create backend/.env:

PORT=5001
CLIENT_URL=http://localhost:5173

MONGODB_URI=your_mongodb_connection_string

MISTRAL_API_KEY=your_mistral_api_key
TAVILY_API_KEY=your_tavily_api_key

Never commit API keys or .env files to Git.

CORS

CLIENT_URL must exactly match the frontend origin.

For example:

CLIENT_URL=http://localhost:5173

when the frontend is running at:

http://localhost:5173

If Vite runs on port 5174, use:

CLIENT_URL=http://localhost:5174

Restart the backend after changing .env.

Installation

Backend

cd backend
npm install
npm run dev

The backend runs on:

http://localhost:5001

Frontend

In another terminal:

cd frontend
npm install
npm run dev

Use the URL printed by Vite, commonly:

http://localhost:5173

Backend Startup

The backend:

Loads environment variables.

Connects to MongoDB.

Creates/checks the vector index.

Starts the Express server.

await connectDB();
await createVectorIndex();

app.listen(PORT, () => {
    console.log(`AskAI server running on port ${PORT}`);
});

MongoDB Document Model

Document metadata

{
    documentId,
    fileName,
    pages,
    textLength,
    chunkCount,
    embeddingDimension,
    createdAt
}

PDF chunks

{
    text,
    embedding,
    metadata: {
        documentId,
        fileName,
        chunkIndex
    },
    createdAt
}

A single documentId links all chunks belonging to the same PDF.

Technologies

Frontend

React

Vite

Axios

Backend

Node.js

Express.js

CORS

Multer

AI

Mistral AI

LangChain

Mistral tool calling

RAG

PDF text extraction

Text chunking

Embeddings

Vector similarity search

MongoDB vector search

Web Search

Tavily

Database

MongoDB

Error Handling

The backend uses centralized error handling:

app.use(notFound);
app.use(errorHandler);

Controllers pass errors to the middleware with:

next(error);

Health Check

GET /api/health

This endpoint can be used to verify that the backend is running and can later be used by deployment or CI/CD health checks.

Security Considerations

Before deploying publicly:

Keep API keys on the backend.

Do not commit .env.

Configure CORS for the production frontend domain.

Validate PDF file types and file sizes.

Add authentication and authorization for multi-user use.

Add rate limiting to public APIs.

Secure MongoDB credentials and network access.

Validate and sanitize user input.

Add logging and monitoring for production.

Possible Future Improvements

User authentication

Per-user document isolation

Document deletion

PDF preview

Source citations for RAG answers

Improved chunking strategies

Conversation renaming

Conversation export

Automated tests

Docker deployment

CI/CD pipeline

Production monitoring

Project Goal

AskAI demonstrates how a modern AI-powered full-stack application can combine:

Frontend
+ Backend APIs
+ LLM
+ Tool Calling
+ Web Search
+ PDF Processing
+ Embeddings
+ Vector Search
+ RAG
+ Database

into one practical application.

License

This project is intended for educational and portfolio purposes.
