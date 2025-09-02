from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.expert_system import run_expert_system
from app.expert_system_fuzzy import run_fuzzy_system, postura, carga, ambiente
from app.graphs import plot_membership


app = FastAPI(title="Sistema Experto Vocacional")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InputData(BaseModel):
    respuestas: list[str]

@app.post("/inference")
def inference(data: InputData):
    result = run_expert_system(data.respuestas)
    return result
    
    # Input para sistema difuso
class FuzzyInput(BaseModel):
    respuestas: list[float]  # ahora mandamos un array de 3 valores
    
@app.post("/fuzzy-inference")
def fuzzy_inference(data: FuzzyInput):
    result = run_fuzzy_system(data.respuestas)
    return result

@app.post("/fuzzy-graphs")
def fuzzy_graphs(data: FuzzyInput):
    print("data", data)
    # Extraer valores
    postura_val = data.respuestas[0]
    carga_val = data.respuestas[1]
    ambiente_val = data.respuestas[2]

    # Generar gráficas de cada variable difusa
    graphs = {
        "postura": plot_membership(postura, "Postura", postura_val),
        "carga": plot_membership(carga, "Carga", carga_val),
        "ambiente": plot_membership(ambiente, "Ambiente", ambiente_val)
    }

    return graphs