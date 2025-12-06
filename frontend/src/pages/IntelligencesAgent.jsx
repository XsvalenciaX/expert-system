import { useState } from "react";
import useExpertSystem from "../hooks/useExpertSystem";
import { Grid, TextField, Button, Typography, Paper } from "@mui/material";

export default function WeeklyAgentForm() {
  const [days, setDays] = useState(["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]);
  const [dailyCapacity, setDailyCapacity] = useState([8, 8, 6, 4, 0]);
  const [tasks, setTasks] = useState([
    { id: 1, name: "", duration: "", priority: "", deadline: "" },
  ]);

  const { result, loading, consultIntelligenceAgent } = useExpertSystem();

  const handleTaskChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...tasks];
    updated[index][name] = value;
    setTasks(updated);
  };

  const addTask = () => {
    setTasks([
      ...tasks,
      { id: tasks.length + 1, name: "", duration: "", priority: "", deadline: "" },
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsedTasks = tasks.map((t) => ({
      id: Number(t.id),
      name: t.name,
      duration: Number(t.duration),
      priority: Number(t.priority),
      deadline: t.deadline === "" ? null : Number(t.deadline),
    }));

    const payload = {
      days,
      daily_capacity: dailyCapacity.map(Number),
      tasks: parsedTasks,
    };

    consultIntelligenceAgent(payload);
  };

  return (
    <>
      <Grid container justifyContent="center" spacing={2} sx={{ width: "100%" }}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            Agente Inteligente – Planeación Semanal
          </Typography>
        </Grid>

        <Grid item md={8} xs={12}>
          <Paper elevation={3} sx={{ p: 3, width: "100%" }}>
            <form onSubmit={handleSubmit}>

              {/* CAPACIDADES */}
              <Typography variant="h6">Capacidad diaria</Typography>
              {dailyCapacity.map((cap, i) => (
                <TextField
                  key={i}
                  label={`Capacidad ${days[i]}`}
                  type="number"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={dailyCapacity[i]}
                  onChange={(e) => {
                    const updated = [...dailyCapacity];
                    updated[i] = e.target.value;
                    setDailyCapacity(updated);
                  }}
                />
              ))}

              {/* TAREAS */}
              <Typography variant="h6" sx={{ mt: 3 }}>
                Tareas
              </Typography>

              {tasks.map((t, i) => (
                <Paper key={i} sx={{ p: 2, mb: 2, background: "#f8f8f8" }}>
                  <TextField
                    label="Nombre"
                    name="name"
                    fullWidth
                    value={t.name}
                    onChange={(e) => handleTaskChange(i, e)}
                    sx={{ mb: 1 }}
                  />

                  <TextField
                    label="Duración (horas)"
                    name="duration"
                    type="number"
                    fullWidth
                    value={t.duration}
                    onChange={(e) => handleTaskChange(i, e)}
                    sx={{ mb: 1 }}
                  />

                  <TextField
                    label="Prioridad"
                    name="priority"
                    type="number"
                    fullWidth
                    value={t.priority}
                    onChange={(e) => handleTaskChange(i, e)}
                    sx={{ mb: 1 }}
                  />

                  <TextField
                    label="Deadline (día) — opcional"
                    name="deadline"
                    type="number"
                    fullWidth
                    value={t.deadline}
                    onChange={(e) => handleTaskChange(i, e)}
                    sx={{ mb: 1 }}
                  />
                </Paper>
              ))}

              <Button variant="outlined" onClick={addTask} sx={{ mb: 2 }}>
                Añadir otra tarea
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? "Generando..." : "Generar plan semanal"}
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>

      {/* RESULTADOS */}
      <Grid container justifyContent="center" spacing={2} sx={{ width: "100%", mt: 2 }}>
        {result && (
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6">Plan Generado</Typography>

              <pre style={{ whiteSpace: "pre-wrap" }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </Paper>
          </Grid>
        )}
      </Grid>
    </>
  );
}
