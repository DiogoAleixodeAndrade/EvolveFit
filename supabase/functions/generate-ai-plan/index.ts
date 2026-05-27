declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};
type AIPlanType = "nutrition" | "training" | "running";

type AIPlanRequest = {
  type: AIPlanType;
  name: string;
  age: number;
  heightCm: number;
  weightKg: number;
  goal: string;
  trainingLevel: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function buildPrompt(request: AIPlanRequest) {
  return `
Você é o assistente fitness do app EvolveFit.

Crie um plano seguro e personalizado para:

Nome: ${request.name}
Idade: ${request.age}
Altura: ${request.heightCm} cm
Peso: ${request.weightKg} kg
Objetivo: ${request.goal}
Nível: ${request.trainingLevel}
Tipo de plano: ${request.type}

Responda SOMENTE em JSON válido:
{
  "title": "",
  "summary": "",
  "recommendations": [],
  "warnings": []
}

Regras:
- Não prometa resultado garantido.
- Não recomende dieta extrema.
- Não recomende treino perigoso.
- Se necessário, recomende acompanhamento profissional.
`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY não configurada.");
    }

    const request = await req.json() as AIPlanRequest;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5.5-mini",
        input: buildPrompt(request),
      }),
    });

    const data = await response.json();

    const rawText =
      data.output_text ??
      data.output?.[0]?.content?.[0]?.text ??
      "";

    const plan = JSON.parse(rawText);

    return new Response(JSON.stringify(plan), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Erro inesperado.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});