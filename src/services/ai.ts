import { AIPlanRequest, AIPlanResponse } from "../types/ai";
import { buildAIPlanPrompt } from "./aiPrompts";

export async function generateAIPlan(
  request: AIPlanRequest
): Promise<AIPlanResponse> {
  const prompt = buildAIPlanPrompt(request);

  console.log("Prompt enviado para IA:", prompt);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (request.type === "nutrition") {
    return {
      title: "Plano Alimentar Inicial",
      summary:
        "Plano focado em melhorar consistência alimentar, proteína diária e energia para treinos.",
      recommendations: [
        "Priorize proteína em todas as refeições.",
        "Mantenha boa ingestão de água durante o dia.",
        "Inclua carboidratos próximos ao treino.",
        "Evite longos períodos sem comer se isso prejudicar sua rotina.",
      ],
      warnings: [
        "Este plano não substitui nutricionista.",
        "Ajustes são necessários em caso de doença, alergia ou restrição alimentar.",
      ],
    };
  }

  if (request.type === "training") {
    return {
      title: "Plano de Treino Inicial",
      summary:
        "Treino voltado para evolução progressiva, técnica e ganho de força.",
      recommendations: [
        "Treine musculação de 3 a 5 vezes por semana.",
        "Priorize execução correta antes de aumentar carga.",
        "Registre cargas para acompanhar evolução.",
        "Descanse entre 60 e 120 segundos conforme o exercício.",
      ],
      warnings: [
        "Pare em caso de dor fora do normal.",
        "Procure orientação presencial em caso de lesão.",
      ],
    };
  }

  return {
    title: "Plano de Corrida Inicial",
    summary:
      "Plano voltado para criar resistência cardiovascular com evolução gradual.",
    recommendations: [
      "Comece com corridas leves e caminhadas alternadas.",
      "Aumente a distância semanal aos poucos.",
      "Mantenha um ritmo confortável na maior parte dos treinos.",
      "Separe dias de descanso entre treinos intensos.",
    ],
    warnings: [
      "Não aumente volume e intensidade ao mesmo tempo.",
      "Pare se sentir dor forte ou tontura.",
    ],
  };
}