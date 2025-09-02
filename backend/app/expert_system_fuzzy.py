import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl

# --- Definición de variables difusas ---
postura = ctrl.Antecedent(np.arange(1, 11, 1), "postura")
carga = ctrl.Antecedent(np.arange(1, 11, 1), "carga")
ambiente = ctrl.Antecedent(np.arange(1, 11, 1), "ambiente")

riesgo = ctrl.Consequent(np.arange(0, 11, 1), "riesgo")

# --- Funciones de pertenencia ---
# Postura (1 = mala, 10 = muy buena)
postura["inadecuada"] = fuzz.trimf(postura.universe, [1, 1, 4])       
postura["regular"] = fuzz.trimf(postura.universe, [3, 5, 7])         
postura["buena"] = fuzz.trimf(postura.universe, [6, 10, 10])         

# Carga (1 = alta, 10 = baja)
carga["alta"] = fuzz.trimf(carga.universe, [1, 1, 4])                 
carga["moderada"] = fuzz.trimf(carga.universe, [3, 5, 7])            
carga["baja"] = fuzz.trimf(carga.universe, [6, 10, 10])               

# Ambiente (1 = inadecuado, 10 = adecuado)
ambiente["inadecuado"] = fuzz.trimf(ambiente.universe, [1, 1, 4])    
ambiente["tolerable"] = fuzz.trimf(ambiente.universe, [3, 5.5, 7])   
ambiente["adecuado"] = fuzz.trimf(ambiente.universe, [6, 10, 10])   

# Riesgo (0 = bajo, 10 = alto)
riesgo["bajo"] = fuzz.trimf(riesgo.universe, [0, 0, 3.5])
riesgo["medio"] = fuzz.trimf(riesgo.universe, [3, 5, 7])
riesgo["alto"] = fuzz.trimf(riesgo.universe, [6.5, 10, 10])

# --- Reglas ---
rule1 = ctrl.Rule(postura["inadecuada"] & carga["alta"] & ambiente["inadecuado"], riesgo["alto"])
rule2 = ctrl.Rule(postura["buena"] & carga["baja"] & ambiente["adecuado"], riesgo["bajo"])
rule3 = ctrl.Rule(postura["regular"] | carga["moderada"] | ambiente["tolerable"], riesgo["medio"])
rule4 = ctrl.Rule(postura["inadecuada"] | carga["baja"] | ambiente["adecuado"], riesgo["medio"])
rule5 = ctrl.Rule(postura["buena"] | carga["alta"] | ambiente["tolerable"], riesgo["medio"])

# Sistema difuso
riesgo_ctrl = ctrl.ControlSystem([rule1, rule2, rule3, rule4, rule5])
riesgo_eval = ctrl.ControlSystemSimulation(riesgo_ctrl)

# --- Función principal ---
def run_fuzzy_system(respuestas: list):
    try:
        # Convertir la lista a floats
        p, c, a = map(float, respuestas)

        # Entradas
        riesgo_eval.input["postura"] = p
        riesgo_eval.input["carga"] = c
        riesgo_eval.input["ambiente"] = a

        # Calcular
        riesgo_eval.compute()
        resultado = riesgo_eval.output["riesgo"]

        # Clasificación y mensaje
        if resultado <= 3.5:
            clasificacion = "BAJO"
            mensaje = "✅ El riesgo es BAJO. Mantén las buenas prácticas y sigue en vigilancia."
        elif resultado < 7:
            clasificacion = "MEDIO"
            mensaje = "⚠️ El riesgo es MEDIO. Precaución: asegúrate de seguir buenas prácticas y monitorea continuamente."
        else:
            clasificacion = "ALTO"
            mensaje = "🚨 El riesgo es ALTO. Recomendación: revisa urgentemente las condiciones de trabajo."

        # --- Explicación ---
        hechos_iniciales = [f"Postura observada: {p}", f"Carga de trabajo: {c}", f"Ambiente laboral: {a}"]
        hechos_derivados = [f"Nivel de riesgo calculado: {resultado:.2f}"]

        reglas_disparadas = []
        if p <= 3 and c <= 3 and a <= 3:
            reglas_disparadas.append("Regla 1: Condiciones críticas → Riesgo ALTO")
        if p >= 7 and c >= 7 and a >= 7:
            reglas_disparadas.append("Regla 2: Condiciones óptimas → Riesgo BAJO")
        if 3 <= p <= 7 or 3 <= c <= 7 or 3 <= a <= 7:
            reglas_disparadas.append("Regla 3: Situación intermedia → Riesgo MEDIO")
        if p <= 3 or c >= 7 or a >= 7:
            reglas_disparadas.append("Regla 4: Algún factor combinado → Riesgo MEDIO")
        if p >= 7 or c <= 3 or 3 <= a <= 7:
            reglas_disparadas.append("Regla 5: Combinación mixta → Riesgo MEDIO")

        # Recomendaciones
        recomendaciones = []
        if clasificacion == "ALTO":
            recomendaciones.extend([
                "Revisar de inmediato ergonomía y carga laboral.",
                "Mejorar ventilación, iluminación y ambiente físico."
            ])
        elif clasificacion == "MEDIO":
            recomendaciones.extend([
                "Realizar pausas activas y rotación de tareas.",
                "Monitorear constantemente posturas y carga."
            ])
        else:
            recomendaciones.extend([
                "Mantener las condiciones actuales.",
                "Reforzar la cultura preventiva."
            ])

        # Respuesta estructurada
        return {
            "resultado": round(resultado, 2),
            "clasificacion": clasificacion,
            "mensaje": mensaje,
            "detalle": {"postura": p, "carga": c, "ambiente": a},
            "hechos_iniciales": hechos_iniciales,
            "hechos_derivados": hechos_derivados,
            "reglas_disparadas": list(set(reglas_disparadas)),
            "recomendaciones": recomendaciones
        }

    except Exception as e:
        return {"error": f"No se pudo calcular el riesgo: {str(e)}"}
