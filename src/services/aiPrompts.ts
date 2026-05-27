import { AIPlanRequest } from "../types/ai";

export function buildAIPlanPrompt(request: AIPlanRequest): string {
  return `
Você é um assistente fitness do app EvolveFit.

Crie um plano seguro e personalizado para o usuário abaixo:

Nome: ${request.name}
Idade: ${request.age}
Altura: ${request.heightCm} cm
Peso: ${request.weightKg} kg
Objetivo: ${request.goal}
Nível: ${request.trainingLevel}
Tipo de plano: ${request.type}

Regras:
- Não prometa cura, resultado garantido ou milagre.
- Não indique dieta extrema.
- Não indique treino perigoso.
- Sempre recomende acompanhamento profissional quando necessário.
- Responda em JSON com:
{
  "title": "",
  "summary": "",
  "recommendations": [],
  "warnings": []
}
`;
}