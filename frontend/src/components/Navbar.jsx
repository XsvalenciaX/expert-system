import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ background: "#1976d2" }}>
      <Toolbar>
        {/* Título o Logo */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Iteligencia Artifical
        </Typography>

        {/* Botones del menú (usan react-router-dom Link) */}
        <Box>
          <Button color="inherit" component={Link} to="/">
            Inicio
          </Button>
          <Button color="inherit" component={Link} to="/expert">
            Sistema Experto
          </Button>
           <Button color="inherit" component={Link} to="/expert-fuzzy">
            Sistema Experto Difuso
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
