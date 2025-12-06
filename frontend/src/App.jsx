import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, Container, Box } from "@mui/material";
import Home from "./pages/Home";
import ExpertSystem from "./pages/ExpertSystem";
import Navbar from "./components/Navbar";
import ExpertSystemFuzzy from "./pages/ExpertSystemFuzzy";
import IntelligencesAgent from "./pages/IntelligencesAgent";

function App() {
  return (
    <Router>
      <CssBaseline />
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          minHeight: "100vh",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: 3,
            p: 3,
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/expert" element={<ExpertSystem />} />
            <Route path="/expert-fuzzy" element={<ExpertSystemFuzzy />} />
            <Route path="/intelligence-agent" element={<IntelligencesAgent />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
