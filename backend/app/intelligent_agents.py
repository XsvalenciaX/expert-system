import random
import statistics
import pandas as pd
from fpdf import FPDF
import matplotlib.pyplot as plt


# ================================
#   EVALUACIÓN DEL INDIVIDUO
# ================================
def evaluate(individual, tasks, daily_capacity, DAYS):
    num_days = len(DAYS)

    day_load = {i: 0 for i in range(num_days)}
    unassigned_penalty = 0.0
    priority_score = 0.0
    deadline_penalty = 0.0
    overload_penalty = 0.0

    for gene, task in zip(individual, tasks):
        if gene == -1:
            unassigned_penalty += (task["priority"] * task["duration"]) * 2.0
        else:
            day_load[gene] += task["duration"]
            priority_score += task["priority"] * 1.0

            if task.get("deadline") is not None and gene > task["deadline"]:
                days_late = gene - task["deadline"]
                deadline_penalty += days_late * task["priority"] * 3.0

    for i in range(num_days):
        cap = daily_capacity[DAYS[i]]
        if day_load[i] > cap:
            overload_hours = day_load[i] - cap
            overload_penalty += (overload_hours ** 2) * 50.0

    loads = [day_load[i] for i in range(num_days)]
    loads_for_variance = [
        loads[i] for i in range(num_days) if daily_capacity[DAYS[i]] > 0
    ]

    var_load = statistics.pvariance(loads_for_variance) if len(loads_for_variance) > 1 else 0
    balance_penalty = var_load * 5.0

    fitness = 1000.0 + priority_score * 10.0
    fitness -= unassigned_penalty
    fitness -= deadline_penalty
    fitness -= overload_penalty
    fitness -= balance_penalty

    return fitness


# ================================
#   GENERAR INDIVIDUO ALEATORIO
# ================================
def random_individual(num_tasks, DAYS):
    return [random.choice(list(range(-1, len(DAYS)))) for _ in range(num_tasks)]


# ================================
#   SELECCIÓN POR TORNEO
# ================================
def selection(pop, scores, k=3):
    selected = random.sample(list(zip(pop, scores)), k)
    return max(selected, key=lambda x: x[1])[0]


# ================================
#   CRUCE:
# ================================
def crossover(p1, p2):
    # Si son demasiado cortos, devolverlos sin cruzar
    if len(p1) < 3 or len(p2) < 3:
        return p1[:], p2[:]

    cut = random.randint(1, len(p1) - 2)
    c1 = p1[:cut] + p2[cut:]
    c2 = p2[:cut] + p1[cut:]
    return c1, c2


# ================================
#   MUTACIÓN
# ================================
def mutate(individual, DAYS, rate=0.1):
    for i in range(len(individual)):
        if random.random() < rate:
            individual[i] = random.choice(list(range(-1, len(DAYS))))
    return individual


# ================================
#   GA COMPLETO
# ================================
def run_ga(tasks, daily_capacity, DAYS, pop_size=40, generations=80):
    num_tasks = len(tasks)

    population = [random_individual(num_tasks, DAYS) for _ in range(pop_size)]

    for _ in range(generations):
        scores = [evaluate(ind, tasks, daily_capacity, DAYS) for ind in population]

        new_pop = []

        while len(new_pop) < pop_size:
            p1 = selection(population, scores)
            p2 = selection(population, scores)

            c1, c2 = crossover(p1, p2)
            c1 = mutate(c1, DAYS)
            c2 = mutate(c2, DAYS)

            new_pop.extend([c1, c2])

        population = new_pop[:pop_size]

    scores = [evaluate(ind, tasks, daily_capacity, DAYS) for ind in population]
    best_idx = scores.index(max(scores))
    return population[best_idx], scores[best_idx]


# ================================
#   CONVERTIR CROMOSOMA A PLAN
# ================================
def chromosome_to_plan(chrom, tasks):
    plan = {}
    unassigned = []
    day_durations = {}

    for i, gene in enumerate(chrom):
        if gene == -1:
            unassigned.append(tasks[i])
        else:
            plan.setdefault(gene, []).append(tasks[i])
            day_durations[gene] = day_durations.get(gene, 0) + tasks[i]["duration"]

    return plan, unassigned, day_durations


# ================================
#   EXPORTAR A EXCEL
# ================================
def export_excel(plan, day_durations, unassigned, DAYS, filename="plan.xlsx"):
    rows = []
    for day_idx, tasks in plan.items():
        for t in tasks:
            rows.append({
                "Día": DAYS[day_idx],
                "Tarea": t["name"],
                "Horas": t["duration"]
            })

    for t in unassigned:
        rows.append({
            "Día": "No asignado",
            "Tarea": t["name"],
            "Horas": t["duration"]
        })

    df = pd.DataFrame(rows)
    df.to_excel(filename, index=False)


# ================================
#   EXPORTAR A PDF (SIMPLE)
# ================================
def export_pdf(plan, day_durations, unassigned, DAYS, filename="plan.pdf"):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    pdf.cell(0, 10, "PLAN SEMANAL", ln=1)

    for day_idx, tasks in plan.items():
        pdf.set_font("Arial", "B", 12)
        pdf.cell(0, 10, f"{DAYS[day_idx]}:", ln=1)
        pdf.set_font("Arial", size=11)

        for t in tasks:
            pdf.cell(0, 8, f"- {t['name']} ({t['duration']} h)", ln=1)

        pdf.ln(4)

    pdf.ln(5)
    pdf.set_font("Arial", "B", 12)
    pdf.cell(0, 10, "No asignadas:", ln=1)

    pdf.set_font("Arial", size=11)
    for t in unassigned:
        pdf.cell(0, 8, f"- {t['name']} ({t['duration']} h)", ln=1)

    pdf.output(filename)


# ================================
#   FUNCIÓN PRINCIPAL PARA FASTAPI
# ================================
def run_weekly_agent(data):
    DAYS = data.days
    daily_capacity = {day: cap for day, cap in zip(data.days, data.daily_capacity)}
    tasks = [t.model_dump() for t in data.tasks]

    best_chrom, score = run_ga(tasks, daily_capacity, DAYS)
    plan, unassigned, day_durations = chromosome_to_plan(best_chrom, tasks)

    export_excel(plan, day_durations, unassigned, DAYS, filename="plan.xlsx")
    export_pdf(plan, day_durations, unassigned, DAYS, filename="plan.pdf")

    readable_plan = {}
    for d_idx, t_list in plan.items():
        readable_plan[DAYS[d_idx]] = [t["name"] for t in t_list]

    return {
        "message": "Plan generado correctamente",
        "best_score": score,
        "plan": readable_plan,
        "unassigned": [t["name"] for t in unassigned],
        "day_hours": {
            DAYS[i]: day_durations.get(i, 0) for i in range(len(DAYS))
        }
    }
