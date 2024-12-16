from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os
from dotenv import load_dotenv
import openai
import mysql.connector
from fastapi.responses import JSONResponse

load_dotenv()

app = FastAPI()

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuração MySQL
db_config = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME")
}

# Configuração OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.post("/upload-document")
async def upload_document(files: List[UploadFile] = File(...)):
    try:
        for file in files:
            content = await file.read()
            # Aqui você implementará a lógica para processar e armazenar o documento
            # Por exemplo, salvar no banco de dados e processar para embeddings
            
        return {"message": f"{len(files)} documento(s) processado(s) com sucesso"}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"message": f"Erro ao processar documentos: {str(e)}"}
        )

@app.post("/api/chat")
async def chat(message: dict):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": message["content"]}
            ]
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 