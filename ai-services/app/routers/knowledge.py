from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from pydantic import BaseModel
from typing import List, Optional
import os
from langchain_openai import ChatOpenAI
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    document_ids: Optional[List[int]] = None

class ChatResponse(BaseModel):
    answer: str

class SummaryResponse(BaseModel):
    summary: str

VECTOR_STORES = {}

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
    return ChatResponse(answer=answer)

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

@router.post("/upload")
async def upload_document(file: UploadFile = File(...), user_id: int = 1):
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
    
    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=get_embeddings(),
        persist_directory=f"./chroma_db/user_{user_id}"
    )
    
    VECTOR_STORES[user_id] = vector_store
    
    return {"filename": file.filename, "chunks": len(chunks), "status": "success"}

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
    
    Format JSON array: [{{question, options["A","B","C","D"], correct, explanation}}]
    """)
    
    result = (prompt | llm | StrOutputParser()).invoke({"topic": topic, "num_questions": num_questions, "context": context})
    
    import json
    try:
        return json.loads(result)
    except:
        return []