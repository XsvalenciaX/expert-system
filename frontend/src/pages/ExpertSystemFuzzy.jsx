import { useState } from "react";
import useExpertSystem from "../hooks/useExpertSystem";
import { Grid, TextField, Button, Typography, Paper } from "@mui/material";

export default function FuzzyForm() {
  const [inputs, setInputs] = useState({
    postura: "",
    carga: "",
    ambiente: "",
  });

  const { result, graphs, loading, consultExpertFuzzy } = useExpertSystem();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const postura = parseFloat(inputs.postura);
    const carga = parseFloat(inputs.carga);
    const ambiente = parseFloat(inputs.ambiente);

    // Validación manual
    if (
      isNaN(postura) ||
      postura < 1 ||
      postura > 10 ||
      isNaN(carga) ||
      carga < 1 ||
      carga > 10 ||
      isNaN(ambiente) ||
      ambiente < 1 ||
      ambiente > 10
    ) {
      alert("Todos los valores deben estar entre 1 y 10.");
      return;
    }

    const payload = { postura, carga, ambiente };
    consultExpertFuzzy(payload);
  };

  return (
    <>
      {/* ENCABEZADO */}
      <Grid container justifyContent="center" spacing={2} sx={{ width: "100%" }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Evaluación de Riesgo Laboral (Sistema experto difuso)
          </Typography>
          <Typography variant="h6" gutterBottom>
            Nota: La evaluación a cada ítem debe ser dada en un rango del 1 al
            10, considerando 1 como una muy mala postura, una carga laboral muy
            alta y un ambiente laboral inadecuado para las funciones (Ruido, iluminación, temperatura ...).
          </Typography>
        </Grid>
        <Grid item md={6} xs={12}>
          <Paper elevation={3} sx={{ p: 3, width: "100%" }}>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Postura observada"
                name="postura"
                type="number"
                fullWidth
                sx={{ mb: 2 }}
                value={inputs.postura}
                onChange={handleChange}
                inputProps={{ min: 0, max: 10, step: 0.1 }}
                required
              />
              <TextField
                label="Carga de trabajo"
                name="carga"
                type="number"
                fullWidth
                sx={{ mb: 2 }}
                value={inputs.carga}
                onChange={handleChange}
                inputProps={{ min: 0, max: 10, step: 0.1 }}
                required
              />
              <TextField
                label="Ambiente laboral"
                name="ambiente"
                type="number"
                fullWidth
                sx={{ mb: 2 }}
                value={inputs.ambiente}
                onChange={handleChange}
                inputProps={{ min: 0, max: 10, step: 0.1 }}
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? "Consultando..." : "Evaluar riesgo"}
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>

      {/* RESULTADOS */}
      <Grid container justifyContent="center" spacing={2} sx={{ width: "100%", mt: 2 }}>
        {result && (
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, width: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Resultado
              </Typography>

              <Typography variant="subtitle1">Detalle de entradas:</Typography>
              <ul>
                <li>Postura: {result.detalle.postura}</li>
                <li>Carga: {result.detalle.carga}</li>
                <li>Ambiente: {result.detalle.ambiente}</li>
              </ul>

              <Typography variant="subtitle1">Mensaje:</Typography>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "pre-line",
                  wordWrap: "break-word",
                  textAlign: "justify",
                  mb: 2,
                }}
              >
                {result.mensaje}
              </Typography>

              <Typography variant="subtitle1">Hechos iniciales:</Typography>
              <ul>
                {result.hechos_iniciales?.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>

              <Typography variant="subtitle1">Hechos derivados:</Typography>
              <ul>
                {result.hechos_derivados?.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>

              <Typography variant="subtitle1">Reglas disparadas:</Typography>
              <ul>
                {result.reglas_disparadas?.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>

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

      {/* GRÁFICAS */}
      {graphs && (
        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={{ mt: 2, width: "100%" }}
        >
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2, width: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Gráficas de funciones de membresía
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(graphs).map(([name, img], i) => (
                  <Grid item xs={12} md={6} key={i}>
                    <Typography variant="subtitle1" gutterBottom>
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Typography>
                    <img
                      src={`data:image/png;base64,${img}`}
                      alt={name}
                      style={{ width: "100%", borderRadius: 8 }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </>
  );
}
