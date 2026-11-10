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
      <td style="padding:12px;border:1px solid #e0e0e0;text-align:right;">${formatBRL(item.price)}</td>
    </tr>
  `).join("");

  const itemsList = data.items.map(item => `&bull; <strong>${item.title}</strong> (${item.certCode})`).join("<br/>");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">
  <div style="background:#030903;padding:24px;border-radius:12px 12px 0 0;">
    <h1 style="color:#46a239;margin:0;font-size:1.4rem;">Genesis Consulting Academy</h1>
    <p style="color:#8f9c8f;margin:4px 0 0;font-size:0.85rem;">Bem-vindo(a) à sua jornada de certificação SAFe&reg;</p>
  </div>
  <div style="border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;padding:24px;">
    <h2 style="color:#333;font-size:1.2rem;">Olá, ${data.customerName}! Seja muito bem-vindo(a).</h2>
    <p style="line-height:1.6;color:#555;">
      Que alegria receber sua inscrição! Sua jornada para se tornar certificado(a) SAFe&reg; começa agora, e estamos aqui para apoiá-lo(a) em cada etapa.
    </p>
    <p style="line-height:1.6;color:#555;">
      Confirmamos o recebimento da sua inscrição nos seguintes treinamentos:<br/>
      ${itemsList}
    </p>

    <h3 style="color:#46a239;font-size:1rem;margin-top:24px;">Resumo da inscrição</h3>
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

    <h3 style="color:#46a239;font-size:1rem;margin-top:24px;">O que acontece agora?</h3>
    <div style="line-height:1.7;color:#555;font-size:0.9rem;">
      <p><strong>1. Confirmação e pagamento</strong><br/>
      Nossa equipe entrará em contato em at&eacute; <strong>1 dia &uacute;til</strong> com os detalhes para pagamento (Pix, boleto ou cart&atilde;o em at&eacute; 12x) e a nota fiscal.</p>
      <p><strong>2. Datas e hor&aacute;rios das sess&otilde;es</strong><br/>
      Ap&oacute;s a confirma&ccedil;&atilde;o do pagamento, voc&ecirc; receber&aacute; o cronograma completo com todas as datas, hor&aacute;rios e o link de acesso &agrave;s sess&otilde;es.</p>
      <p><strong>3. Materiais de estudo</strong><br/>
      Voc&ecirc; receber&aacute; os materiais oficiais Scaled Agile&reg; em formato digital, com acesso antes, durante e ap&oacute;s o treinamento.</p>
      <p><strong>4. Certifica&ccedil;&atilde;o</strong><br/>
      O exame oficial SAFe&reg; est&aacute; inclu&iacute;do e deve ser realizado em at&eacute; 30 dias ap&oacute;s o t&eacute;rmino do curso. Voc&ecirc; ter&aacute; todo o suporte necess&aacute;rio para se preparar.</p>
    </div>

    <div style="margin-top:20px;padding:16px;background:#f0f5f0;border:1px solid #d0e0d0;border-radius:8px;">
      <p style="margin:0;font-size:0.88rem;color:#444;line-height:1.6;">
        <strong>Sobre o formato Live Virtual</strong><br/>
        Todas as sess&otilde;es s&atilde;o ao vivo, em portugu&ecirc;s, ministradas por instrutores certificados SAFe Practice Consultants (SPCs). As aulas s&atilde;o altamente interativas, com exerc&iacute;cios pr&aacute;ticos, simula&ccedil;&otilde;es e estudos de caso reais. Por respeito &agrave; LGPD e &agrave; confidencialidade, as sess&otilde;es n&atilde;o s&atilde;o gravadas.
      </p>
    </div>

    <div style="margin-top:20px;padding:16px;background:#f5f5f5;border-radius:8px;">
      <p style="margin:0;font-size:0.88rem;color:#666;line-height:1.6;">
        <strong>Diferencial Genesis: Treinamento AI-Empowered</strong><br/>
        Como consultoria AI-empowered, enriquecemos cada treinamento com pr&aacute;ticas de intelig&ecirc;ncia artificial aplicadas ao dia a dia do SAFe&reg; &mdash; um diferencial exclusivo que voc&ecirc; n&atilde;o encontra em outras escolas.
      </p>
    </div>

    <div style="margin-top:24px;padding:16px;background:#f5f5f5;border-radius:8px;">
      <p style="margin:0;font-size:0.85rem;color:#666;">
        <strong>Precisa de ajuda?</strong><br/>
        Responda a este e-mail ou entre em contato pelo WhatsApp: (11) 95502-5464
      </p>
    </div>

    <p style="margin-top:24px;font-size:0.8rem;color:#999;">
      Genesis Consulting &mdash; Scaled Agile&reg; Silver Partner<br/>
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
      subject: "Bem-vindo(a) à Genesis Academy — Sua inscrição foi recebida!",
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
