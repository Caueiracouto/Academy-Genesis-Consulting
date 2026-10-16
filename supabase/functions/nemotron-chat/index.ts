const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const defaultModel = "nvidia/llama-3.1-nemotron-ultra-253b-v1";
const maxMessages = 20;
const maxMessageLength = 4000;

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Método não permitido." }, 405);
  }

  try {
    const apiKey = Deno.env.get("NVIDIA_API_KEY");
    if (!apiKey) {
      return jsonResponse({ error: "A conexão com o assistente ainda não foi configurada." }, 503);
    }

    const payload = await req.json();
    const messages = payload?.messages;

    if (!Array.isArray(messages) || messages.length === 0 || messages.length > maxMessages) {
      return jsonResponse({ error: "A conversa enviada é inválida." }, 400);
    }

    const validMessages: ChatMessage[] = messages.filter((message: unknown): message is ChatMessage => {
      if (!message || typeof message !== "object") return false;
      const candidate = message as Partial<ChatMessage>;
      return (
        (candidate.role === "user" || candidate.role === "assistant" || candidate.role === "system") &&
        typeof candidate.content === "string" &&
        candidate.content.trim().length > 0 &&
        candidate.content.length <= maxMessageLength
      );
    });

    if (validMessages.length !== messages.length) {
      return jsonResponse({ error: "Uma das mensagens não é válida." }, 400);
    }

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: Deno.env.get("NVIDIA_NEMOTRON_MODEL") || defaultModel,
        messages: validMessages,
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 1024,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      return jsonResponse({ error: "A NVIDIA não conseguiu responder agora." }, response.status >= 500 ? 502 : response.status);
    }

    const content = result?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || content.trim().length === 0) {
      return jsonResponse({ error: "A NVIDIA retornou uma resposta vazia." }, 502);
    }

    return jsonResponse({ message: content });
  } catch {
    return jsonResponse({ error: "Não foi possível conectar ao assistente agora." }, 500);
  }
});
