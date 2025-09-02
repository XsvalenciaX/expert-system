import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Card, CardContent, Grid } from "@mui/material";

const Dashboard = () => {
  const [facts, setFacts] = useState([]);
  const [rules, setRules] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const factsRes = await axios.get("http://localhost:8000/facts");
        const rulesRes = await axios.get("http://localhost:8000/rules");
        setFacts(factsRes.data);
        setRules(rulesRes.data);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        📊 Dashboard
      </Typography>

      {/* Sección de hechos */}
      <Typography variant="h5">Hechos creados</Typography>
      <Grid container spacing={2}>
        {facts.map((fact, idx) => (
          <Grid item xs={12} md={6} key={idx}>
            <Card>
              <CardContent>
                <Typography variant="body1">{JSON.stringify(fact)}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Sección de reglas */}
      <Typography variant="h5" sx={{ marginTop: 4 }}>
        ✅ Reglas cumplidas
      </Typography>
      <Grid container spacing={2}>
        {rules.map((rule, idx) => (
          <Grid item xs={12} md={6} key={idx}>
            <Card sx={{ backgroundColor: "#e3f2fd" }}>
              <CardContent>
                <Typography variant="body1">
                  {rule.description || JSON.stringify(rule)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;
