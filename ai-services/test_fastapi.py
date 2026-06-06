import os
from dotenv import load_dotenv
load_dotenv()

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

try:
    print("API KEY:", os.getenv("OPENROUTER_API_KEY")[:10] + "...")
    llm = ChatOpenAI(
        api_key=os.getenv("OPENROUTER_API_KEY"),
        base_url="https://openrouter.ai/api/v1",
        model="google/gemini-3.5-flash",
        temperature=0.7
    )
    prompt = ChatPromptTemplate.from_template("Generate 2 interview questions for a Software Engineer.")
    chain = prompt | llm | StrOutputParser()
    result = chain.invoke({})
    print(result)
except Exception as e:
    import traceback
    traceback.print_exc()
