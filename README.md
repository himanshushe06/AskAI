# 🤖 AskAI — AI-Powered RAG Assistant

AskAI is a full-stack AI assistant that combines **general AI conversation, PDF question answering, semantic document retrieval, and real-time web search** in a single application.

The project uses **Retrieval-Augmented Generation (RAG)** to allow users to upload PDF documents and ask questions based on their content. Relevant document chunks are retrieved using **MongoDB Vector Search** and provided as context to **Mistral AI** for response generation.

The application also integrates **Tavily Search API** for real-time web search when external information is required.

---

# 📌 Project Overview

AskAI provides two major AI interaction modes:

### 💬 General AI Chat

Users can have a normal conversation with the AI assistant using Mistral AI.

### 📄 PDF Question Answering

Users can upload a PDF and ask questions about its content.

The PDF processing pipeline is:

```text
PDF Upload
    ↓
Text Extraction
    ↓
Text Chunking
    ↓
Embedding Generation
    ↓
MongoDB Vector Storage
    ↓
Semantic Vector Search
    ↓
Relevant Context
    ↓
Mistral AI
    ↓
Generated Answer
```

### 🌐 Web Search

AskAI can use the Tavily Search API to retrieve information from the web when web-based information is required.

---

# ✨ Key Features

## 🤖 AI Chat

* General-purpose AI conversation
* Mistral AI integration
* Streaming AI responses
* Persistent conversation history
* Context-aware conversations

## 📄 PDF Question Answering

* PDF upload
* PDF text extraction
* Automatic document processing
* Custom text chunking
* Embedding generation
* Vector storage
* Semantic retrieval
* Context-based answer generation

## 🔎 Semantic Search

AskAI converts document chunks into numerical vector representations called **embeddings**.

When a user asks a question:

```text
User Question
      ↓
Question Embedding
      ↓
MongoDB Vector Search
      ↓
Relevant Document Chunks
      ↓
Retrieved Context
```

The retrieved context is then provided to the LLM for answer generation.

## 🌐 Real-Time Web Search

Tavily Search API is integrated to provide web search capabilities when information from the uploaded documents or existing conversation context is insufficient.

## 💾 Conversation History

Conversations are persisted so users can continue previous interactions instead of losing the chat after a session ends.

## ⚡ Streaming Responses

AI responses can be streamed to the frontend instead of waiting for the complete response before displaying anything.

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │    React Frontend   │
                         └──────────┬──────────┘
                                    │
                                    │ HTTP / Streaming
                                    ▼
                         ┌─────────────────────┐
                         │   Node.js + Express │
                         │      Backend       │
                         └──────────┬──────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
           ┌────────────┐   ┌──────────────┐  ┌──────────────┐
           │  MongoDB   │   │  Mistral AI  │  │    Tavily    │
           │            │   │     LLM      │  │ Web Search   │
           └─────┬──────┘   └──────────────┘  └──────────────┘
                 │
                 ▼
         ┌─────────────────┐
         │ MongoDB Vector  │
         │     Search      │
         └─────────────────┘
```

---

# 🧠 RAG Architecture

The core feature of AskAI is its Retrieval-Augmented Generation pipeline.

Instead of directly asking the LLM to answer questions about an uploaded PDF, the application first retrieves relevant information from the document.

## RAG Pipeline

```text
                DOCUMENT INGESTION
                       │
                       ▼
                 PDF Upload
                       │
                       ▼
                Text Extraction
                       │
                       ▼
                  Chunking
                       │
                       ▼
               Embedding Model
                       │
                       ▼
              Vector Representation
                       │
                       ▼
              MongoDB Vector Search
                       │
                       │
                       ▼
               Stored Embeddings


                 USER QUERY
                       │
                       ▼
                User Question
                       │
                       ▼
                Query Embedding
                       │
                       ▼
             Semantic Vector Search
                       │
                       ▼
             Relevant PDF Chunks
                       │
                       ▼
             Context Construction
                       │
                       ▼
                 Mistral AI
                       │
                       ▼
                Final Response
```

---

# 📄 PDF Processing Flow

When a user uploads a PDF, AskAI processes the document before it can be queried.

```text
PDF
 │
 ▼
PDF Text Extraction
 │
 ▼
Raw Text
 │
 ▼
Recursive Text Splitting
 │
 ▼
Document Chunks
 │
 ▼
Embeddings
 │
 ▼
MongoDB Vector Storage
```

The project uses text splitting to divide large documents into smaller chunks suitable for semantic retrieval.

---

# ✂️ Text Chunking

Large documents are divided into smaller pieces before generating embeddings.

AskAI uses a recursive text splitting approach with configurable:

* Chunk size
* Chunk overlap

Chunk overlap helps preserve contextual continuity between neighboring chunks.

Conceptually:

```text
Document
────────────────────────────────────────

Chunk 1
████████████████████

             Chunk 2
             ████████████████████

                          Chunk 3
                          ████████████████████
```

The overlap allows related information near chunk boundaries to remain available during retrieval.

---

# 🔢 Embeddings

Embeddings convert text into numerical vector representations.

For example:

```text
Text
 ↓
Embedding Model
 ↓
[0.12, -0.34, 0.87, ...]
```

Documents and user queries can then be compared in vector space.

This allows AskAI to perform **semantic retrieval** rather than relying only on exact keyword matching.

---

# 🔎 MongoDB Vector Search

AskAI uses **MongoDB Vector Search** to retrieve document chunks that are semantically similar to the user's question.

The high-level process is:

```text
User Question
      ↓
Question Embedding
      ↓
MongoDB Vector Search
      ↓
Similarity Matching
      ↓
Top Relevant Chunks
```

The retrieved chunks are then used as context for the LLM.

---

# 🧠 Context-Augmented Generation

After retrieving relevant document chunks, AskAI constructs context for the LLM.

```text
User Question
       +
Retrieved Document Context
       │
       ▼
    Mistral AI
       │
       ▼
Generated Answer
```

This approach allows the response to be grounded in information retrieved from the uploaded document.

---

# 🤖 Mistral AI

Mistral AI is used as the language model responsible for generating responses.

The model receives:

* User query
* Relevant retrieved context
* Conversation information when applicable

and generates the final response.

The project integrates Mistral through the LangChain ecosystem.

---

# 🔗 LangChain

LangChain is used to organize and connect different components of the AI workflow.

In AskAI, the application uses LangChain-related components for tasks such as:

* LLM integration
* Document processing
* Text splitting
* Embedding-related workflows
* Retrieval
* Tool integration

The backend keeps these responsibilities separated into modular services.

---

# 🌐 Tavily Web Search

AskAI integrates Tavily Search API to provide web search capabilities.

The high-level flow is:

```text
User Question
      │
      ▼
Determine whether web information is required
      │
      ▼
Tavily Search API
      │
      ▼
Search Results
      │
      ▼
AI Response
```

This allows the application to retrieve information from the web in addition to information contained in uploaded documents.

---

# 💬 Conversation Flow

A typical AI chat request follows this process:

```text
User
 │
 ▼
React Frontend
 │
 ▼
Express API
 │
 ▼
Chat Service
 │
 ├── Conversation History
 │
 ├── Optional Web Search
 │
 └── LLM Request
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

Conversation information is persisted so that previous interactions can be retrieved when required.

---

# ⚡ Streaming Responses

Instead of waiting for the complete AI response, AskAI supports streaming.

Conceptually:

```text
LLM
 │
 ├── Token 1 ──→ Frontend
 ├── Token 2 ──→ Frontend
 ├── Token 3 ──→ Frontend
 ├── Token 4 ──→ Frontend
 │
 ▼
Complete Response
```

This provides a more responsive user experience.

---

# 🗂️ Project Structure

```text
AskAI/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   │   ├── chatService.js
│   │   ├── retrievalService.js
│   │   └── ...
│   │
│   ├── utils/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   └── package.json
│
├── Dockerfile
├── .github/
│   └── workflows/
│
└── README.md
```

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* HTML5
* CSS3
* JavaScript

## Backend

* Node.js
* Express.js
* REST APIs

## AI / GenAI

* Mistral AI
* LangChain
* Retrieval-Augmented Generation (RAG)
* Embeddings
* Semantic Search
* Vector Search

## Document Processing

* PDF parsing
* Recursive text splitting
* Document chunking

## Database

* MongoDB
* MongoDB Vector Search
* Mongoose

## Web Search

* Tavily Search API

## DevOps / Development

* Docker
* Git
* GitHub
* GitHub Actions
* Postman

---

# 🗄️ Data Storage

MongoDB is used for persistent application data and vector search.

The application stores information related to:

* Conversations
* Messages
* Documents
* Document chunks
* Embedding/vector information

MongoDB Vector Search is used to retrieve semantically relevant document chunks.

---

# 🔌 Backend Services

The backend is organized into modular services so that different responsibilities remain separated.

Examples include:

### Chat Service

Responsible for handling AI conversation-related operations.

### Retrieval Service

Responsible for retrieving relevant document information for RAG-based responses.

### PDF Processing

Responsible for processing uploaded PDF documents and preparing their text for retrieval.

### Document / Vector Processing

Responsible for preparing document chunks and storing their vector representations.

This separation makes the backend easier to maintain and extend.

---

# 🔐 Environment Variables

Create a `.env` file in the backend directory and provide the required credentials.

Example:

```env
PORT=5001

MONGODB_URI=your_mongodb
```
