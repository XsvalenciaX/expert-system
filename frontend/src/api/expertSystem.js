import apiClient from "./apiClient";

export const getExpertAdvice = async (answers) => {
  try {
    const respuestas = Object.values(answers);

    const response = await apiClient.post("/inference", { respuestas });
    return response.data;
  } catch (error) {
    console.error("Error al consumir API del sistema experto:", error);
    throw error;
  }
};
