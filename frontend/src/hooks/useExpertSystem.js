import { useState } from "react";
import { getExpertAdvice } from "../api/expertSystem";
import { getExpertAdviceFuzzy, getFuzzyGraphs } from "../api/expertSystemFuzzy";
import { getRunIntelligenceAgent } from "../api/intelligentAgents";

const useExpertSystem = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [graphs, setGraphs] = useState(null);

  const consultExpert = async (inputData) => {
    setLoading(true);
    try {
      const data = await getExpertAdvice(inputData);
      setResult(data);
    } catch (error) {
      setResult({ error: "Hubo un problema con la consulta." });
    } finally {
      setLoading(false);
    }
  };

  const consultExpertFuzzy = async (inputData) => {
    setLoading(true);
    try {
      const data = await getExpertAdviceFuzzy(inputData);
      setResult(data);

      // Cuando obtengamos resultado, pedimos las gráficas
      const g = await getFuzzyGraphs(inputData);
      setGraphs(g);
    } catch (error) {
      setResult({ error: "Hubo un problema con la consulta." });
    } finally {
      setLoading(false);
    }
  };

  const consultIntelligenceAgent = async (inputData) => {
    setLoading(true);
    try {
      const data = await getRunIntelligenceAgent(inputData);
      setResult(data);

      // Cuando obtengamos resultado, pedimos las gráficas
      //const g = await getFuzzyGraphs(inputData);
      //setGraphs(g);
    } catch (error) {
      setResult({ error: "Hubo un problema con la consulta." });
    } finally {
      setLoading(false);
    }
  };

  return {
    result,
    graphs,
    loading,
    consultExpert,
    consultExpertFuzzy,
    consultIntelligenceAgent,
  };
};

export default useExpertSystem;
