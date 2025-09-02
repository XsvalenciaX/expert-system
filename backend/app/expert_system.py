import clips

def run_expert_system(respuestas: list[str]) -> dict:
    """
    Recibe respuestas y devuelve:
      - recomendaciones
      - hechos iniciales
      - hechos derivados
      - reglas disparadas
    """
    sistemaExperto = clips.Environment()
    sistemaExperto.clear()

    # -------------------------------
    # Definición de template
    # -------------------------------
    TEMPLATE = """
    (deftemplate respuesta
       (slot id)
       (slot valor))
    """
    sistemaExperto.build(TEMPLATE)

    # -------------------------------
    # Definición de reglas
    # -------------------------------
    reglas = [
        # Reglas principales
        """
        (defrule R1
           =>
           (bind ?nA (length$ (find-all-facts ((?f respuesta)) (eq ?f:valor A))))
           (if (>= ?nA 3) then
               (assert (VocacionCienciaIngenieria))))
        """,
        """
        (defrule R2
           =>
           (bind ?nB (length$ (find-all-facts ((?f respuesta)) (eq ?f:valor B))))
           (if (>= ?nB 3) then
               (assert (VocacionArteDiseno))))
        """,
        """
        (defrule R3
           =>
           (bind ?nC (length$ (find-all-facts ((?f respuesta)) (eq ?f:valor C))))
           (if (>= ?nC 3) then
               (assert (VocacionSaludSociales))))
        """,
        """
        (defrule R4
           =>
           (bind ?nD (length$ (find-all-facts ((?f respuesta)) (eq ?f:valor D))))
           (if (>= ?nD 3) then
               (assert (VocacionAdministracionNegocios))))
        """,
        """
        (defrule R5
           =>
           (bind ?nE (length$ (find-all-facts ((?f respuesta)) (eq ?f:valor E))))
           (if (>= ?nE 3) then
               (assert (VocacionNaturalesAmbiente))))
        """,

        # Reglas mixtas
        """
        (defrule R6
           =>
           (bind ?nA (length$ (find-all-facts ((?f respuesta)) (eq ?f:valor A))))
           (bind ?nD (length$ (find-all-facts ((?f respuesta)) (eq ?f:valor D))))
           (if (and (>= ?nA 2) (>= ?nD 2)) then
               (assert (VocacionIngenieriaAdmin))))
        """,
        """
        (defrule R7
           =>
           (bind ?nA (length$ (find-all-facts ((?f respuesta)) (eq ?f:valor A))))
           (bind ?nB (length$ (find-all-facts ((?f respuesta)) (eq ?f:valor B))))
           (if (and (>= ?nA 2) (>= ?nB 2)) then
               (assert (VocacionIngenieriaArte))))
        """,
        """
        (defrule R8
           =>
           (bind ?nA (length$ (find-all-facts ((?f respuesta)) (eq ?f:valor A))))
           (bind ?nE (length$ (find-all-facts ((?f respuesta)) (eq ?f:valor E))))
           (if (and (>= ?nA 2) (>= ?nE 2)) then
               (assert (VocacionIngenieriaAmbiente))))
        """,
        """
        (defrule R9
           =>
           (bind ?nC (length$ (find-all-facts ((?f respuesta)) (eq ?f:valor C))))
           (bind ?nD (length$ (find-all-facts ((?f respuesta)) (eq ?f:valor D))))
           (if (and (>= ?nC 2) (>= ?nD 2)) then
               (assert (VocacionAdminSalud))))
        """,
        """
        (defrule R10
           =>
           (bind ?nC (length$ (find-all-facts ((?f respuesta)) (eq ?f:valor C))))
           (bind ?nE (length$ (find-all-facts ((?f respuesta)) (eq ?f:valor E))))
           (if (and (>= ?nC 2) (>= ?nE 2)) then
               (assert (VocacionSaludNaturales))))
        """,

        # Regla de fallback
        """
        (defrule R0
           (declare (salience -10)) ; prioridad baja, se dispara solo después de las demás
           (not (VocacionCienciaIngenieria))
           (not (VocacionArteDiseno))
           (not (VocacionSaludSociales))
           (not (VocacionAdministracionNegocios))
           (not (VocacionNaturalesAmbiente))
           (not (VocacionIngenieriaAdmin))
           (not (VocacionIngenieriaArte))
           (not (VocacionIngenieriaAmbiente))
           (not (VocacionAdminSalud))
           (not (VocacionSaludNaturales))
           =>
           (assert (VocacionIndefinida)))
        """
    ]

    for regla in reglas:
        sistemaExperto.build(regla)

    # -------------------------------
    # Insertar hechos iniciales
    # -------------------------------
    hechos_iniciales = []
    for idx, r in enumerate(respuestas, start=1):
        if r is not None:
            sistemaExperto.assert_string(f"(respuesta (id {idx}) (valor {r}))")
            hechos_iniciales.append(r)

    # Ejecutar motor de inferencia
    sistemaExperto.run()

    # -------------------------------
    # Verificar hechos y reglas disparadas
    # -------------------------------
    hechos_derivados = []
    reglas_disparadas = []
    recomendaciones = []

    for fact in sistemaExperto.facts():
        fact_str = str(fact)

        if "VocacionCienciaIngenieria" in fact_str:
            reglas_disparadas.append("R1")
            hechos_derivados.append("VocacionCienciaIngenieria")
            recomendaciones.append("Matemáticas puras, Física, Estadística, Ingeniería Civil o Informática")

        elif "VocacionArteDiseno" in fact_str:
            reglas_disparadas.append("R2")
            hechos_derivados.append("VocacionArteDiseno")
            recomendaciones.append("Literatura, Música, Comunicación social o Cine y producción audiovisual")

        elif "VocacionSaludSociales" in fact_str:
            reglas_disparadas.append("R3")
            hechos_derivados.append("VocacionSaludSociales")
            recomendaciones.append("Medicina, Psicología, Enfermería, Fisioterapia o Pedagogía")

        elif "VocacionAdministracionNegocios" in fact_str:
            reglas_disparadas.append("R4")
            hechos_derivados.append("VocacionAdministracionNegocios")
            recomendaciones.append("Administración de empresas, Economía, Contaduría o Derecho")

        elif "VocacionNaturalesAmbiente" in fact_str:
            reglas_disparadas.append("R5")
            hechos_derivados.append("VocacionNaturalesAmbiente")
            recomendaciones.append("Biología, Geología o Química")

        elif "VocacionIngenieriaAdmin" in fact_str:
            reglas_disparadas.append("R6")
            hechos_derivados.append("VocacionIngenieriaAdmin")
            recomendaciones.append("Ingeniería industrial, Ingeniería administrativa o Ingeniería informática con énfasis en gestión de proyectos")

        elif "VocacionIngenieriaArte" in fact_str:
            reglas_disparadas.append("R7")
            hechos_derivados.append("VocacionIngenieriaArte")
            recomendaciones.append("Arquitectura, Diseño industrial, Animación digital o multimedia")

        elif "VocacionIngenieriaAmbiente" in fact_str:
            reglas_disparadas.append("R8")
            hechos_derivados.append("VocacionIngenieriaAmbiente")
            recomendaciones.append("Ingeniería Ambiental")

        elif "VocacionAdminSalud" in fact_str:
            reglas_disparadas.append("R9")
            hechos_derivados.append("VocacionAdminSalud")
            recomendaciones.append("Gestión de recursos humanos o Gerencia hospitalaria")

        elif "VocacionSaludNaturales" in fact_str:
            reglas_disparadas.append("R10")
            hechos_derivados.append("VocacionSaludNaturales")
            recomendaciones.append("Veterinaria")

        elif "VocacionIndefinida" in fact_str:
            reglas_disparadas.append("R0")
            hechos_derivados.append("VocacionIndefinida")
            recomendaciones.append("Tus intereses son muy variados y no puedo hacerte una sugerencia clara.")

    # -------------------------------
    # Construir respuesta estructurada
    # -------------------------------
    return {
        "hechos_iniciales": hechos_iniciales,
        "hechos_derivados": hechos_derivados,
        "reglas_disparadas": list(set(reglas_disparadas)),
        "recomendaciones": recomendaciones if recomendaciones else ["No se pudo generar una recomendación clara."]
    }
