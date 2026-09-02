# 🤖 AskAI

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Vector%20Database-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Mistral%20AI-LLM-orange" />
  <img src="https://img.shields.io/badge/LangChain-RAG-blue" />
  <img src="https://img.shields.io/badge/Tavily-Web%20Search-purple" />
  <img src="https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" />
</p>

A **full-stack AI assistant and Retrieval-Augmented Generation (RAG) application** built using **React, Node.js, Express, MongoDB Vector Search, LangChain, and Mistral AI**.

AskAI provides two major capabilities:

- 💬 **General AI Chat** with optional real-time web search
- 📄 **PDF Chat** that allows users to upload documents and ask questions based on their content

The application combines **LLM-based generation, vector embeddings, semantic retrieval, and web search** to provide contextual and up-to-date answers.

---

# ✨ Features

## 💬 General AI Chat

- Ask general questions using natural language
- Powered by Mistral AI
- Streaming AI responses
- Conversation history
- Persistent chat storage
- Automatic chat creation
- Delete conversations
- Context-aware responses

---

## 🌐 AI Web Search

AskAI can automatically decide when web search is required.

For questions involving:

- Current information
- Latest news
- Today's information
- Current political office holders
- Current prices
- Current technology versions
- Recent events
- Sports results
- Other time-sensitive information

the AI can call the **Tavily Web Search API** and use the returned information to generate the final response.

### Web Search Flow

```text
User Question
      │
      ▼
Mistral AI
      │
      ├── Stable Question ──► Generate Answer
      │
      └── Current Information
                    │
                    ▼
               Tavily Search
                    │
                    ▼
             Search Results
                    │
                    ▼
                Mistral AI
                    │
                    ▼
              Final Answer
```

---

# 📄 PDF Chat

AskAI allows users to upload PDF documents and ask questions based on their contents.

The PDF processing pipeline performs:

1. PDF upload
2. Text extraction
3. Text chunking
4. Embedding generation
5. Vector storage
6. Semantic retrieval
7. Context construction
8. LLM answer generation

---

# 🧠 RAG Architecture

The core PDF question-answering system follows a **Retrieval-Augmented Generation (RAG)** architecture.

```text
                    PDF
                     │
                     ▼
              PDF Text Extraction
                     │
                     ▼
                Text Chunking
                     │
                     ▼
             Embedding Generation
                     │
                     ▼
             MongoDB Vector Store
                     │
                     │
User Question ──────┘
      │
      ▼
Question Embedding
      │
      ▼
Vector Similarity Search
      │
      ▼
Relevant PDF Chunks
      │
      ▼
Context + Question
      │
      ▼
   Mistral AI
      │
      ▼
   Final Answer
```

---

# 🔍 How RAG Works

## 1️⃣ Upload PDF

The frontend sends the PDF to:

```http
POST /api/pdfs/upload
```

The backend receives the file using **Multer**.

---

## 2️⃣ Extract PDF Text

The application uses `pdf-parse` to extract text from the uploaded PDF.

```javascript
const result = await parser.getText();
```

The extracted text contains the content of the document.

---

## 3️⃣ Split Text Into Chunks

The extracted document text is divided into smaller chunks.

```javascript
const chunks = chunkText(result.text);
```

Chunking makes semantic retrieval more effective because the system can retrieve only the relevant sections instead of sending the entire PDF to the LLM.

---

## 4️⃣ Generate Embeddings

Each chunk is converted into a numerical vector representation.

```text
Text Chunk
    │
    ▼
Embedding Model
    │
    ▼
[0.012, -0.431, 0.228, ...]
```

These vectors represent the semantic meaning of the text.

---

## 5️⃣ Store Vectors in MongoDB

The generated embeddings and their associated text are stored in MongoDB.

Each chunk contains metadata such as:

```javascript
{
    text: "...",

    embedding: [...],

    metadata: {
        documentId,
        fileName,
        chunkIndex
    }
}
```

The `documentId` connects all chunks belonging to the same PDF.

---

## 6️⃣ Semantic Retrieval

When a user asks a question, the question is converted into an embedding.

The system then performs vector similarity search against the stored document chunks.

The most semantically relevant chunks are retrieved.

---

## 7️⃣ Generate Answer

The retrieved chunks are provided to the LLM as context.

The LLM then generates an answer based on the relevant document information.

```text
Question
   +
Retrieved Context
   │
   ▼
Mistral AI
   │
   ▼
Answer
```

---

# 🧩 General AI Architecture

```text
                React Frontend
                       │
                       │ HTTP
                       ▼
                Express Backend
                       │
                       ▼
                 Chat Controller
                       │
                       ▼
                Chat Service
                       │
                       ▼
                  Mistral AI
                       │
              ┌────────┴────────┐
              │                 │
         No Web Search      Web Search
              │                 │
              ▼                 ▼
        Direct Answer       Tavily API
                                │
                                ▼
                          Search Results
                                │
                                ▼
                           Mistral AI
                                │
                                ▼
                           Final Answer
```

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Axios
- Tailwind CSS
- React Context API
- Lucide React

---

## Backend

- Node.js
- Express.js
- MongoDB
- MongoDB Vector Search
- Multer
- pdf-parse
- dotenv
- CORS

---

## AI / RAG

- Mistral AI
- LangChain
- LangChain Mistral Integration
- Embedding Models
- Vector Similarity Search
- Retrieval-Augmented Generation

---

## Web Search

- Tavily Search API

---

## Development Tools

- Git
- GitHub
- VS Code
- Postman
- Docker
- npm

---

# 🏗 Project Architecture

```text
AskAI
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── context
│   │   ├── assets
│   │   └── App.jsx
│   │
│   ├── public
│   ├── vite.config.js
│   └── package.json
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# 📂 Backend Structure

```text
backend
│
├── config
│   ├── db.js
│   └── vectorStore.js
│
├── controllers
│   ├── chatController.js
│   ├── pdfController.js
│   └── ...
│
├── middleware
│   ├── errorMiddleware.js
│   └── uploadMiddleware.js
│
├── models
│   └── ...
│
├── routes
│   ├── chatRoutes.js
│   ├── pdfRoutes.js
│   ├── ragRoutes.js
│   ├── retrievalRoutes.js
│   └── healthRoutes.js
│
├── services
│   ├── chatService.js
│   ├── embeddingService.js
│   ├── pdfService.js
│   ├── documentService.js
│   └── vectorIndexService.js
│
├── utils
│   └── chunkText.js
│
├── app.js
├── server.js
└── package.json
```

---

# 📡 API Overview

## Health Check

```http
GET /api/health
```

---

## PDF Upload

```http
POST /api/pdfs/upload
```

Upload a PDF using multipart form data.

Field:

```text
pdf
```

Example response:

```json
{
    "success": true,
    "documentId": "...",
    "file": {
        "name": "document.pdf",
        "size": 123456,
        "pages": 10,
        "textLength": 25000,
        "chunkCount": 40,
        "embeddingDimension": 768
    }
}
```

---

## General Chat

```http
GET /api/chat
```

Retrieve all general conversations.

---

```http
POST /api/chat
```

Send a message to the AI assistant.

Example request:

```json
{
    "chatId": "optional-chat-id",
    "message": "Explain Docker in simple terms"
}
```

The backend streams the generated AI response to the client.

---

# 🔄 General Chat Request Flow

```text
User
 │
 ▼
React Chat UI
 │
 ▼
Axios / Fetch
 │
 ▼
POST /api/chat
 │
 ▼
Chat Controller
 │
 ▼
Chat Service
 │
 ▼
Mistral AI
 │
 ├── Direct Answer
 │
 └── Tool Call
        │
        ▼
      Tavily
        │
        ▼
   Search Results
        │
        ▼
    Mistral AI
        │
        ▼
 Streaming Response
        │
        ▼
 React UI
```

---

# 📄 PDF Processing Flow

```text
Upload PDF
    │
    ▼
Multer
    │
    ▼
Read PDF
    │
    ▼
pdf-parse
    │
    ▼
Extract Text
    │
    ▼
Chunk Text
    │
    ▼
Generate Embeddings
    │
    ▼
MongoDB
    │
    ├── Document Metadata
    │
    └── Vector Chunks
```

---

# 🗄 MongoDB Data Model

## Documents Collection

Stores metadata for uploaded PDFs.

```javascript
{
    documentId: "...",
    fileName: "example.pdf",
    pages: 10,
    textLength: 25000,
    chunkCount: 40,
    embeddingDimension: 768,
    createdAt: "..."
}
```

---

## Vector Documents

Each PDF chunk is stored with its embedding.

```javascript
{
    text: "Relevant document text...",

    embedding: [
        0.012,
        -0.431,
        0.228
    ],

    metadata: {
        documentId: "...",
        fileName: "example.pdf",
        chunkIndex: 0
    },

    createdAt: "..."
}
```

---

# 🔢 Vector Similarity

The system represents text as vectors and compares their semantic similarity.

A simplified cosine similarity calculation can be represented as:

```text
                 A · B
Similarity = ─────────────
             |A| × |B|
```

A higher similarity score means the two vectors are semantically closer.

This allows the application to retrieve relevant document chunks even when the user's question does not contain the exact words used in the PDF.

---

# ⚡ Streaming Responses

General AI responses are streamed from the backend instead of waiting for the complete response.

```text
Mistral AI
    │
    │ chunk 1
    ▼
Backend
    │
    │ chunk 2
    ▼
Backend
    │
    │ chunk 3
    ▼
Frontend
    │
    ▼
Live AI Response
```

This provides a more responsive ChatGPT-style user experience.

---

# 🔐 Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5001

CLIENT_URL=http://localhost:5173

MONGO_URI=your_mongodb_connection_string

MISTRAL_API_KEY=your_mistral_api_key

TAVILY_API_KEY=your_tavily_api_key
```

> ⚠️ Never commit your `.env` file or API keys to GitHub.

Add the following to `.gitignore`:

```text
.env
node_modules
uploads
```

---

# 🚀 Installation

## 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

cd YOUR_REPOSITORY_NAME
```

---

# Backend Setup

```bash
cd backend

npm install
```

Create the `.env` file:

```env
PORT=5001
CLIENT_URL=http://localhost:5173

MONGO_URI=your_mongodb_connection_string

MISTRAL_API_KEY=your_mistral_api_key

TAVILY_API_KEY=your_tavily_api_key
```

Start the backend:

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5001
```

---

# Frontend Setup

Open another terminal:

```bash
cd frontend

npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend will normally run on:

```text
http://localhost:5173
```

---

# 🧪 Testing the Application

## Test General AI

Try questions such as:

```text
Explain Docker in simple terms.
```

```text
What is REST API?
```

---

## Test Web Search

Try a time-sensitive question:

```text
Who is the current Chief Minister of Bihar?
```

The model can recognize that the information may have changed and use Tavily web search before generating the answer.

---

## Test PDF RAG

1. Open PDF Chat.
2. Upload a PDF.
3. Wait for processing.
4. Ask a question related to the document.
5. The system retrieves relevant chunks.
6. The LLM generates an answer using the retrieved context.

---

# 🧠 Key Concepts Demonstrated

This project demonstrates practical implementation of:

- Large Language Models (LLMs)
- Prompt Engineering
- Retrieval-Augmented Generation (RAG)
- Text Chunking
- Embeddings
- Vector Databases
- Semantic Search
- Vector Similarity
- Tool Calling
- Web Search Integration
- Streaming AI Responses
- REST APIs
- MongoDB
- React
- Node.js
- Express.js
- API Integration
- Error Handling
- File Upload Processing

---

# 🔄 RAG vs General AI

| Feature | General AI | PDF Chat / RAG |
|---|---|---|
| LLM | Mistral AI | Mistral AI |
| User Question | ✅ | ✅ |
| Conversation History | ✅ | Depends on implementation |
| Web Search | ✅ | Not necessarily |
| PDF Context | ❌ | ✅ |
| Embeddings | ❌ | ✅ |
| Vector Search | ❌ | ✅ |
| MongoDB Vector Store | ❌ | ✅ |
| Document Retrieval | ❌ | ✅ |

---

# 📈 Future Improvements

- 🔎 Better hybrid search
- 📚 Multi-document conversations
- 📑 Page-level citations
- 🔗 Source references in answers
- 🧠 Improved reranking
- 💾 Conversation memory improvements
- 📊 RAG evaluation metrics
- 🧪 Automated RAG testing
- 🔄 CI/CD pipeline
- 🐳 Docker deployment
- ☁️ Cloud deployment
- 🔐 Authentication and user-specific documents
- 📱 Mobile responsive improvements
- 🤖 Multiple LLM provider support

---

# 🐳 Docker

The project can be containerized using Docker for consistent development and deployment environments.

Example architecture:

```text
              Docker
                │
        ┌───────┴───────┐
        │               │
   Frontend          Backend
   Container         Container
        │               │
        └───────┬───────┘
                │
             MongoDB
```

---

# 🔄 CI/CD Roadmap

A future CI/CD pipeline can automatically:

```text
Git Push
   │
   ▼
GitHub
   │
   ▼
CI Pipeline
   │
   ├── Install Dependencies
   │
   ├── Run Tests
   │
   ├── Build Frontend
   │
   ├── Build Backend
   │
   └── Check Application
           │
           ▼
       Deployment
```

---

# 🎯 Project Goals

The main goal of AskAI is to demonstrate how modern AI applications can combine:

```text
LLM
 +
Embeddings
 +
Vector Database
 +
Semantic Retrieval
 +
Web Search
 +
REST APIs
 +
React
```

to build a practical AI assistant rather than a simple chatbot interface.

---

# 📸 Screenshots

## General AI

![General AI](screenshots/general-ai.png)

---

## PDF Chat

![PDF Chat](screenshots/pdf-chat.png)

---

## PDF Upload

![PDF Upload](screenshots/pdf-upload.png)

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/new-feature
```

3. Make your changes.
4. Commit your changes.

```bash
git commit -m "Add new feature"
```

5. Push the branch.

```bash
git push origin feature/new-feature
```

6. Open a Pull Request.

---

# 👨‍💻 Author

**Himanshu Shekhar**

📧 Email: harsh06022005@gmail.com

💻 GitHub:  
https://github.com/himanshushe06

🔗 LinkedIn:  
https://www.linkedin.com/in/himanshu0602/

---

# ⭐ Support

If you found this project useful, consider giving the repository a ⭐ on GitHub.

It helps support the project and makes it easier for others to discover it.

---

# 📜 License

This project is licensed under the MIT License.

See the `LICENSE` file for more information.
