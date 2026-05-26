from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from pydantic import BaseModel
from typing import List, Optional
import os
import json
from langchain_openai import ChatOpenAI
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from datetime import datetime

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    document_ids: Optional[List[int]] = None

class ChatResponse(BaseModel):
    answer: str

class SummaryResponse(BaseModel):
    summary: str

class DocumentResponse(BaseModel):
    id: int
    filename: str
    upload_date: str
    chunk_count: int

# In-memory stores
VECTOR_STORES = {}
DOCUMENTS_STORE = {}
QUERY_HISTORY_STORE = {}
NOTES_STORE = {}
HIGHLIGHTS_STORE = {}
DOC_COUNTER = 0

def get_embeddings():
    return HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

def get_vector_store(user_id: int):
    if user_id not in VECTOR_STORES:
        user_dir = f"./chroma_db/user_{user_id}"
        if os.path.exists(user_dir):
            VECTOR_STORES[user_id] = Chroma(
                persist_directory=user_dir,
                embedding_function=get_embeddings()
            )
        else:
            VECTOR_STORES[user_id] = None
    return VECTOR_STORES[user_id]

@router.post("/upload")
async def upload_document(file: UploadFile = File(...), user_id: int = 1):
    global DOC_COUNTER
    DOC_COUNTER += 1
    doc_id = DOC_COUNTER
    
    os.makedirs(f"./uploads/user_{user_id}", exist_ok=True)
    os.makedirs(f"./chroma_db/user_{user_id}", exist_ok=True)
    
    file_path = f"./uploads/user_{user_id}/{file.filename}"
    contents = await file.read()
    
    with open(file_path, "wb") as f:
        f.write(contents)
    
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_documents(documents)
    
    vector_store = get_vector_store(user_id)
    if vector_store is not None:
        vector_store.add_documents(chunks)
    else:
        vector_store = Chroma.from_documents(
            documents=chunks,
            embedding=get_embeddings(),
            persist_directory=f"./chroma_db/user_{user_id}"
        )
    
    VECTOR_STORES[user_id] = vector_store
    
    DOCUMENTS_STORE[doc_id] = {
        "id": doc_id,
        "user_id": user_id,
        "filename": file.filename,
        "upload_date": datetime.utcnow().isoformat(),
        "chunk_count": len(chunks)
    }
    
    if user_id not in QUERY_HISTORY_STORE:
        QUERY_HISTORY_STORE[user_id] = []
    
    return {"id": doc_id, "filename": file.filename, "chunks": len(chunks), "status": "success"}

@router.delete("/document/{doc_id}")
async def delete_document(doc_id: int, user_id: int = 1):
    if doc_id not in DOCUMENTS_STORE:
        raise HTTPException(status_code=404, detail="Document not found")
    doc = DOCUMENTS_STORE[doc_id]
    if doc["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    file_path = f"./uploads/user_{user_id}/{doc['filename']}"
    if os.path.exists(file_path):
        os.remove(file_path)
    
    del DOCUMENTS_STORE[doc_id]
    
    if user_id in VECTOR_STORES:
        VECTOR_STORES[user_id] = None
        user_dir = f"./chroma_db/user_{user_id}"
        if os.path.exists(user_dir):
            import shutil
            shutil.rmtree(user_dir)
    
    return {"message": "Document deleted"}

@router.get("/documents")
async def get_documents(user_id: int = 1):
    docs = [d for d in DOCUMENTS_STORE.values() if d["user_id"] == user_id]
    return {"documents": docs}

@router.get("/document/{doc_id}/file")
async def get_document_file(doc_id: int, user_id: int = 1):
    if doc_id not in DOCUMENTS_STORE:
        raise HTTPException(status_code=404, detail="Document not found")
    doc = DOCUMENTS_STORE[doc_id]
    if doc["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    file_path = f"./uploads/user_{user_id}/{doc['filename']}"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return {"file_url": f"/uploads/user_{user_id}/{doc['filename']}"}

@router.post("/chat", response_model=ChatResponse)
async def chat_with_documents(request: ChatRequest, user_id: int = 1):
    vector_store = get_vector_store(user_id)
    
    if vector_store is None:
        raise HTTPException(status_code=400, detail="No documents uploaded yet")
    
    llm = ChatOpenAI(
        api_key=os.getenv("OPENROUTER_API_KEY"),
        base_url="https://openrouter.ai/api/v1",
        model="google/gemini-2.0-flash-001",
        temperature=0.1
    )
    
    system_prompt = """You are a helpful AI assistant that answers questions about uploaded documents.
    Use the provided document context as the primary source.
    If the document lacks relevant info, use general knowledge while noting this.
    
    Context: {context}"""
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}")
    ])
    
    retriever = vector_store.as_retriever(search_kwargs={"k": 10})
    
    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)
    
    rag_chain = (
        {"context": retriever | format_docs, "input": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    
    answer = rag_chain.invoke(request.query)
    
    # Store query history
    query_entry = {
        "id": len(QUERY_HISTORY_STORE.get(user_id, [])) + 1,
        "query": request.query,
        "answer": answer,
        "timestamp": datetime.utcnow().isoformat()
    }
    if user_id not in QUERY_HISTORY_STORE:
        QUERY_HISTORY_STORE[user_id] = []
    QUERY_HISTORY_STORE[user_id].append(query_entry)
    
    return ChatResponse(answer=answer)

@router.get("/history")
async def get_history(user_id: int = 1):
    return {"history": QUERY_HISTORY_STORE.get(user_id, [])}

@router.post("/summarize", response_model=SummaryResponse)
async def summarize_document(user_id: int = 1):
    vector_store = get_vector_store(user_id)
    
    if vector_store is None:
        raise HTTPException(status_code=400, detail="No documents uploaded")
    
    llm = ChatOpenAI(
        api_key=os.getenv("OPENROUTER_API_KEY"),
        base_url="https://openrouter.ai/api/v1",
        model="google/gemini-2.0-flash-001",
        temperature=0.1,
        max_tokens=4096
    )
    
    docs = vector_store.as_retriever(search_kwargs={"k": 50}).invoke("summarize main points")
    context = "\n\n".join(doc.page_content for doc in docs)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "Summarize the following document content concisely.\n\n{context}"),
        ("human", "Provide a key point summary.")
    ])
    
    summary = (prompt | llm | StrOutputParser()).invoke({"context": context})
    return SummaryResponse(summary=summary)

@router.post("/summary/convert/pdf")
async def convert_summary_to_pdf(summary: str):
    try:
        from weasyprint import HTML
        html_content = f"""
        <html>
        <head><style>
            body {{ font-family: Arial, sans-serif; margin: 40px; }}
            h1 {{ color: #333; }}
            .summary {{ line-height: 1.6; }}
        </style></head>
        <body>
            <h1>Document Summary</h1>
            <div class="summary">{summary.replace('\n', '<br>')}</div>
        </body>
        </html>
        """
        pdf_bytes = HTML(string=html_content).write_pdf()
        import base64
        return {"pdf_base64": base64.b64encode(pdf_bytes).decode()}
    except ImportError:
        return {"error": "WeasyPrint not installed. Install with: pip install weasyprint"}

@router.post("/summary/convert/word")
async def convert_summary_to_word(summary: str):
    try:
        from docx import Document
        doc = Document()
        doc.add_heading('Document Summary', 0)
        doc.add_paragraph(summary)
        import io
        buffer = io.BytesIO()
        doc.save(buffer)
        import base64
        return {"word_base64": base64.b64encode(buffer.getvalue()).decode()}
    except ImportError:
        return {"error": "python-docx not installed. Install with: pip install python-docx"}

@router.post("/quiz")
async def generate_quiz(topic: str, user_id: int = 1, num_questions: int = 10):
    vector_store = get_vector_store(user_id)
    
    if vector_store is None:
        raise HTTPException(status_code=400, detail="No documents uploaded")
    
    llm = ChatOpenAI(
        api_key=os.getenv("OPENROUTER_API_KEY"),
        base_url="https://openrouter.ai/api/v1",
        model="google/gemini-2.0-flash-001",
        temperature=0.5
    )
    
    docs = vector_store.as_retriever(search_kwargs={"k": 20}).invoke(topic)
    context = "\n\n".join(doc.page_content for doc in docs)
    
    prompt = ChatPromptTemplate.from_template("""
    Generate {num_questions} multiple choice questions about: {topic}
    Based on content: {context}
    
    Format JSON array: [{{"question", "options":["A","B","C","D"], "correct", "explanation"}}]
    """)
    
    result = (prompt | llm | StrOutputParser()).invoke({"topic": topic, "num_questions": num_questions, "context": context})
    
    try:
        parsed = json.loads(result)
        return parsed
    except:
        return []

class NoteCreate(BaseModel):
    document_id: int = 1
    content: str
    page_number: int = 1

class NoteResponse(BaseModel):
    id: int
    document_id: int
    content: str
    page_number: int
    created_at: str

@router.post("/notes", response_model=NoteResponse)
async def create_note(note: NoteCreate, user_id: int = 1):
    new_note = {
        "id": len(NOTES_STORE.get(user_id, [])) + 1,
        "user_id": user_id,
        "document_id": note.document_id,
        "content": note.content,
        "page_number": note.page_number,
        "created_at": datetime.utcnow().isoformat()
    }
    if user_id not in NOTES_STORE:
        NOTES_STORE[user_id] = []
    NOTES_STORE[user_id].append(new_note)
    return new_note

@router.get("/notes")
async def get_notes(user_id: int = 1):
    notes = NOTES_STORE.get(user_id, [])
    return {"notes": notes}

@router.delete("/notes/{note_id}")
async def delete_note(note_id: int, user_id: int = 1):
    if user_id in NOTES_STORE:
        NOTES_STORE[user_id] = [n for n in NOTES_STORE[user_id] if n["id"] != note_id]
    return {"message": "Note deleted"}

class HighlightCreate(BaseModel):
    document_id: int = 1
    page_number: int = 1
    text: str
    x: float = 0
    y: float = 0

class HighlightResponse(BaseModel):
    id: int
    document_id: int
    page_number: int
    text: str
    x: float
    y: float

@router.post("/highlights", response_model=HighlightResponse)
async def create_highlight(highlight: HighlightCreate, user_id: int = 1):
    new_highlight = {
        "id": len(HIGHLIGHTS_STORE.get(user_id, [])) + 1,
        "user_id": user_id,
        "document_id": highlight.document_id,
        "page_number": highlight.page_number,
        "text": highlight.text,
        "x": highlight.x,
        "y": highlight.y
    }
    if user_id not in HIGHLIGHTS_STORE:
        HIGHLIGHTS_STORE[user_id] = []
    HIGHLIGHTS_STORE[user_id].append(new_highlight)
    return new_highlight

@router.get("/highlights")
async def get_highlights(user_id: int = 1):
    highlights = HIGHLIGHTS_STORE.get(user_id, [])
    return {"highlights": highlights}

@router.delete("/highlights/{highlight_id}")
async def delete_highlight(highlight_id: int, user_id: int = 1):
    if user_id in HIGHLIGHTS_STORE:
        HIGHLIGHTS_STORE[user_id] = [h for h in HIGHLIGHTS_STORE[user_id] if h["id"] != highlight_id]
    return {"message": "Highlight deleted"}

@router.post("/chat/quote")
async def chat_with_quote(request: ChatRequest, user_id: int = 1):
    return await chat_with_documents(request, user_id)