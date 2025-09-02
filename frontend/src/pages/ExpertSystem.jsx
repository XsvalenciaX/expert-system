import { useState } from "react";
import useExpertSystem from "../hooks/useExpertSystem";
import {
  Grid,
  Select,
  MenuItem,
  Button,
  Typography,
  Paper,
  FormControl,
  InputLabel,
} from "@mui/material";

export default function ExpertSystem() {
  // Estados para cada pregunta
  const [answers, setAnswers] = useState({
    P1: "",
    P2: "",
    P3: "",
    P4: "",
    P5: "",
  });

  const { result, loading, consultExpert } = useExpertSystem();

  // Manejar cambios en selects
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Enviar respuestas al backend
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("answers", answers);
    consultExpert(answers); // enviamos todas las respuestas como JSON
  };

  return (
    <>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md>
          <Typography variant="h4" gutterBottom>
            Sistema Experto
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8}>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>¿Qué tipo de actividades disfrutas más?</InputLabel>
              <Select
                name="P1"
                value={answers.P1}
                onChange={handleChange}
                label="¿Qué tipo de actividades disfrutas más?"
                required
              >
                <MenuItem value="A">
                  Realizar juegos de lógica o matemáticas
                </MenuItem>
                <MenuItem value="B">Dibujar o crear cosas nuevas</MenuItem>
                <MenuItem value="C">
                  Ayudar a otras personas o cuidar de ellas
                </MenuItem>
                <MenuItem value="D">
                  Organizar tareas o administrar actividades
                </MenuItem>
                <MenuItem value="E">
                  Estar en contacto con la naturaleza
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>¿Qué asignaturas te gusta estudiar?</InputLabel>
              <Select
                name="P2"
                value={answers.P2}
                onChange={handleChange}
                required
              >
                <MenuItem value="A">Matemáticas, física o informática</MenuItem>
                <MenuItem value="B">Arte, literatura, música</MenuItem>
                <MenuItem value="C">Biología, Psicología, Ciencias</MenuItem>
                <MenuItem value="D">Economía o historia</MenuItem>
                <MenuItem value="E">Geografía o química</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>¿Cómo prefieres trabajar?</InputLabel>
              <Select
                name="P3"
                value={answers.P3}
                onChange={handleChange}
                required
              >
                <MenuItem value="A">En silencio, de forma analítica</MenuItem>
                <MenuItem value="B">
                  Con creatividad y expresando ideas
                </MenuItem>
                <MenuItem value="C">
                  En equipo o contacto con los demás
                </MenuItem>
                <MenuItem value="D">
                  Liderando grupos, tomando decisiones
                </MenuItem>
                <MenuItem value="E">Al aire libre, investigando</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>¿Qué valoras más en un trabajo?</InputLabel>
              <Select
                name="P4"
                value={answers.P4}
                onChange={handleChange}
                required
              >
                <MenuItem value="A">Retos intelectuales</MenuItem>
                <MenuItem value="B">Libertad creativa</MenuItem>
                <MenuItem value="C">Contribuir al bienestar de otros</MenuItem>
                <MenuItem value="D">
                  Liderar y conocer el estado financiero
                </MenuItem>
                <MenuItem value="E">
                  Proteger el planeta o trabajar con la naturaleza
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>¿Qué entorno laboral prefieres?</InputLabel>
              <Select
                name="P5"
                value={answers.P5}
                onChange={handleChange}
                required
              >
                <MenuItem value="A">Oficinas o laboratorios</MenuItem>
                <MenuItem value="B">Escenarios, estudios de arte</MenuItem>
                <MenuItem value="C">
                  Hospitales, colegios o fundaciones
                </MenuItem>
                <MenuItem value="D">Oficinas o empresas</MenuItem>
                <MenuItem value="E">
                  Reservas naturales, trabajos al aire libre
                </MenuItem>
              </Select>
            </FormControl>

            {/* Botón de envío */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? "Consultando..." : "Enviar"}
            </Button>
          </form>
        </Grid>

        {/* Mostrar resultado */}
        {/* Mostrar resultado */}
        {result && (
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Resultados del sistema experto
              </Typography>

              {/* Hechos iniciales */}
              <Typography variant="subtitle1">Hechos iniciales:</Typography>
              <ul>
                {result.hechos_iniciales?.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>

              {/* Hechos derivados */}
              <Typography variant="subtitle1">Hechos derivados:</Typography>
              <ul>
                {result.hechos_derivados?.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>

              {/* Reglas disparadas */}
              <Typography variant="subtitle1">Reglas disparadas:</Typography>
              <ul>
                {result.reglas_disparadas?.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>

              {/* Recomendaciones */}
              <Typography variant="subtitle1">Recomendaciones:</Typography>
              <ul>
                {result.recomendaciones?.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </Paper>
          </Grid>
        )}
      </Grid>
    </>
  );
}
