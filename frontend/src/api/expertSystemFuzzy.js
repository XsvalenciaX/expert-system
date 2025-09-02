import apiClient from "./apiClient";

export const getExpertAdviceFuzzy = async (answers) => {
  try {
    const respuestas = Object.values(answers);

    const response = await apiClient.post("/fuzzy-inference", { respuestas });
    return response.data;
  } catch (error) {
    console.error("Error al consumir API del sistema experto:", error);
    throw error;
  }
};

export const getFuzzyGraphs = async (answers) => {
  try {
    const respuestas = Object.values(answers);

    const response = await apiClient.post("/fuzzy-graphs", { respuestas });
    return response.data;
  } catch (error) {
    console.error("Error al obtener gráficas difusas:", error);
    throw error;
  }
};
