import React from "react";
import { Grid, Typography } from "@mui/material";

const Home = () => {
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "70vh" }}
    >
      <Grid item>
        <Typography variant="h3" fontWeight="bold" align="center">
          Inteligencia Artificial Sistemas Expertos
        </Typography>
        <hr></hr>
        <Typography variant="h6" fontWeight="bold" align="center">
          Angie Carolina Orlas <br />
          Santiago Valencia Guzmán
        </Typography>
        <br />
        <Typography variant="h6" fontWeight="bold" align="center">
          2025 - 2
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Home;
