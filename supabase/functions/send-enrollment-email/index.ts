import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const GENESIS_EMAIL = "academy@genesisconsulting.com";

interface EnrollmentData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCpf?: string;
  company?: string;
  items: { title: string; certCode: string; price: number; duration: string; sessions: string }[];
  total: number;
}

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function buildCustomerEmail(data: EnrollmentData): string {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding:12px;border:1px solid #e0e0e0;">
        <strong>${item.title}</strong><br/>
        <span style="font-size:0.85em;color:#666;">${item.certCode} · ${item.duration} · ${item.sessions}</span>
      </td>
      <td style="padding:12px;border:1px solid #e0e0;text-align:right;">${formatBRL(item.price)}</td>
    </tr>
  `).join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">
  <div style="background:#030903;padding:24px;border-radius:12px 12px 0 0;">
    <h1 style="color:#46a239;margin:0;font-size:1.4rem;">Genesis Consulting Academy</h1>
    <p style="color:#8f9c8f;margin:4px 0 0;font-size:0.85rem;">Confirmação de Inscrição</p>
  </div>
  <div style="border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;padding:24px;">
    <h2 style="color:#333;font-size:1.2rem;">Olá, ${data.customerName}!</h2>
    <p style="line-height:1.6;color:#555;">
      Recebemos sua inscrição nos treinamentos abaixo. Nossa equipe entrará em contato em até 1 dia útil com as próximas etapas e detalhes de pagamento (Pix, boleto ou cartão em até 12x).
    </p>

    <h3 style="color:#46a239;font-size:1rem;margin-top:24px;">Treinamentos selecionados</h3>
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:0.9rem;">
      <thead>
        <tr style="background:#f5f5f5;">
          <th style="padding:12px;border:1px solid #e0e0e0;text-align:left;">Curso</th>
          <th style="padding:12px;border:1px solid #e0e0e0;text-align:right;">Valor</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
        <tr style="background:#f0f5f0;">
          <td style="padding:12px;border:1px solid #e0e0e0;font-weight:bold;">Total</td>
          <td style="padding:12px;border:1px solid #e0e0e0;text-align:right;font-weight:bold;color:#46a239;font-size:1.1rem;">${formatBRL(data.total)}</td>
        </tr>
      </tbody>
    </table>

    <h3 style="color:#46a239;font-size:1rem;margin-top:24px;">Dados da turma</h3>
    <p style="line-height:1.6;color:#555;font-size:0.9rem;">
      As datas e horários das sessões serão confirmados pela nossa equipe após o processamento do pagamento. Todos os treinamentos são ministrados em <strong>Live Virtual</strong>, em português, por instrutores certificados.
    </p>

    <div style="margin-top:24px;padding:16px;background:#f5f5f5;border-radius:8px;">
      <p style="margin:0;font-size:0.85rem;color:#666;">
        <strong>Precisa de ajuda?</strong><br/>
        Responda a este e-mail ou entre em contato pelo WhatsApp: (11) 95502-5464
      </p>
    </div>

    <p style="margin-top:24px;font-size:0.8rem;color:#999;">
      Genesis Consulting — Scaled Agile® Silver Partner<br/>
      https://br.genesisconsulting.com
    </p>
  </div>
</body>
</html>
  `.trim();
}

function buildGenesisEmail(data: EnrollmentData): string {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding:12px;border:1px solid #e0e0e0;">
        <strong>${item.title}</strong> (${item.certCode})<br/>
        <span style="font-size:0.85em;color:#666;">${item.duration} · ${item.sessions}</span>
      </td>
      <td style="padding:12px;border:1px solid #e0e0e0;text-align:right;">${formatBRL(item.price)}</td>
    </tr>
  `).join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">
  <div style="background:#030903;padding:24px;border-radius:12px 12px 0 0;">
    <h1 style="color:#46a239;margin:0;font-size:1.4rem;">Nova Inscrição — Genesis Academy</h1>
  </div>
  <div style="border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;padding:24px;">
    <h2 style="color:#333;font-size:1.2rem;">Dados do cliente</h2>
    <table style="width:100%;font-size:0.9rem;margin-bottom:16px;">
      <tr><td style="padding:6px 0;color:#666;width:120px;"><strong>Nome:</strong></td><td style="padding:6px 0;">${data.customerName}</td></tr>
      <tr><td style="padding:6px 0;color:#666;"><strong>E-mail:</strong></td><td style="padding:6px 0;">${data.customerEmail}</td></tr>
      <tr><td style="padding:6px 0;color:#666;"><strong>Telefone:</strong></td><td style="padding:6px 0;">${data.customerPhone || "—"}</td></tr>
      <tr><td style="padding:6px 0;color:#666;"><strong>CPF:</strong></td><td style="padding:6px 0;">${data.customerCpf || "—"}</td></tr>
      <tr><td style="padding:6px 0;color:#666;"><strong>Empresa:</strong></td><td style="padding:6px 0;">${data.company || "—"}</td></tr>
    </table>

    <h3 style="color:#46a239;font-size:1rem;margin-top:20px;">Treinamentos</h3>
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:0.9rem;">
      <thead>
        <tr style="background:#f5f5f5;">
          <th style="padding:12px;border:1px solid #e0e0e0;text-align:left;">Curso</th>
          <th style="padding:12px;border:1px solid #e0e0e0;text-align:right;">Valor</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
        <tr style="background:#f0f5f0;">
          <td style="padding:12px;border:1px solid #e0e0e0;font-weight:bold;">Total</td>
          <td style="padding:12px;border:1px solid #e0e0e0;text-align:right;font-weight:bold;color:#46a239;font-size:1.1rem;">${formatBRL(data.total)}</td>
        </tr>
      </tbody>
    </table>

    <p style="margin-top:16px;font-size:0.85rem;color:#999;">
      Entre em contato com o cliente em até 1 dia útil para confirmar a inscrição e processar o pagamento.
    </p>
  </div>
</body>
</html>
  `.trim();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const data: EnrollmentData = await req.json();

    if (!data.customerEmail || !data.customerName || !data.items || data.items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Dados de inscrição incompletos" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const customerHtml = buildCustomerEmail(data);
    const genesisHtml = buildGenesisEmail(data);

    const { error: customerError } = await supabase.from("emails_queue").insert({
      to: data.customerEmail,
      subject: "Confirmação de Inscrição — Genesis Consulting Academy",
      html: customerHtml,
    });

    const { error: genesisError } = await supabase.from("emails_queue").insert({
      to: GENESIS_EMAIL,
      subject: `Nova Inscrição — ${data.customerName}`,
      html: genesisHtml,
    });

    if (customerError || genesisError) {
      console.error("Email queue error:", customerError, genesisError);
      return new Response(
        JSON.stringify({ error: "Erro ao enfileirar e-mails" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
