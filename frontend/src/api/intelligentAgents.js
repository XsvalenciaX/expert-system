import apiClient from "./apiClient";

export const getRunIntelligenceAgent = async (payload) => {
  try {
    // Enviar el payload exactamente como lo necesita FastAPI
    const response = await apiClient.post("/run-agent", payload);
    return response.data;
  } catch (error) {
    console.error("Error al consumir API del agente inteligente:", error);
    throw error;
  }
};
