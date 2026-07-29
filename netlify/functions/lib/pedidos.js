import { getStore } from '@netlify/blobs';
import crypto from 'node:crypto';

export const PRECOS = {
  mapa: 9.99,
  almanaque_desconto: 45.00,
  almanaque_cheio: 60.00
};

export const CUPOM_MINUTOS = 30;

export function store() {
  return getStore('pedidos');
}

/** Código de pedido curto e legível (aparece no e-mail e na conciliação). */
export function novoCodigo(prefixo) {
  const n = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefixo}-${n}`;
}

/** Token longo e imprevisível: é a chave que destrava o conteúdo. */
export function novoToken() {
  return crypto.randomBytes(24).toString('hex');
}

export async function salvar(token, dados) {
  await store().setJSON(token, dados);
}

export async function ler(token) {
  if (!token || typeof token !== 'string' || token.length < 16) return null;
  try {
    return await store().get(token, { type: 'json' });
  } catch {
    return null;
  }
}

/** Índice reverso: id de pagamento do Mercado Pago -> token do pedido. */
export async function indexarPagamento(externalReference, token) {
  await store().setJSON(`ref:${externalReference}`, { token });
}

export async function tokenPorReferencia(ref) {
  try {
    const r = await store().get(`ref:${ref}`, { type: 'json' });
    return r?.token || null;
  } catch {
    return null;
  }
}

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}

export function siteUrl() {
  return (process.env.SITE_URL || 'https://mapadalma.netlify.app').replace(/\/$/, '');
}

/* ============ Mercado Pago ============ */

export async function mpCriarPreferencia({ titulo, valor, referencia, email }) {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) throw new Error('MP_ACCESS_TOKEN não configurado');
  const site = siteUrl();

  const r = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: [{
        title: titulo,
        quantity: 1,
        currency_id: 'BRL',
        unit_price: Number(valor)
      }],
      payer: email ? { email } : undefined,
      external_reference: referencia,
      back_urls: {
        success: `${site}/?pedido=${referencia}`,
        pending: `${site}/?pedido=${referencia}`,
        failure: `${site}/?pedido=${referencia}&falhou=1`
      },
      auto_return: 'approved',
      notification_url: `${site}/.netlify/functions/webhook`,
      statement_descriptor: 'MAPADAALMA'
    })
  });

  const data = await r.json();
  if (!r.ok) throw new Error('Mercado Pago: ' + (data.message || r.status));
  return data.init_point || data.sandbox_init_point;
}

export async function mpConsultarPagamento(id) {
  const token = process.env.MP_ACCESS_TOKEN;
  const r = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!r.ok) return null;
  return r.json();
}

/* ============ E-mail (Resend) ============ */

export async function enviarEmail({ para, assunto, html }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, motivo: 'RESEND_API_KEY não configurada' };
  const remetente = process.env.EMAIL_REMETENTE || 'Mapa da Alma <onboarding@resend.dev>';
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: remetente, to: [para], subject: assunto, html })
    });
    const d = await r.json();
    return { ok: r.ok, resposta: d };
  } catch (e) {
    return { ok: false, motivo: e.message };
  }
}

export function emailMapaHtml({ primeiro, link }) {
  return `
  <div style="font-family:Georgia,serif;background:#f4ecd8;padding:28px;color:#2e2620">
    <div style="max-width:520px;margin:0 auto;background:#efe3c6;border:1px solid #cbb992;padding:28px">
      <p style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#8f2d2d;margin:0">Mapa da Alma</p>
      <h1 style="font-size:26px;margin:8px 0 4px">Seu mapa está pronto, ${primeiro}</h1>
      <p style="color:#5b4f42">Pagamento confirmado. Abra o link abaixo para ver o seu retrato completo e baixar o PDF.</p>
      <p style="margin:22px 0">
        <a href="${link}" style="background:#8f2d2d;color:#f4ecd8;text-decoration:none;padding:14px 22px;display:inline-block;letter-spacing:.1em">VER MEU MAPA COMPLETO</a>
      </p>
      <p style="font-size:13px;color:#5b4f42">Guarde este e-mail: o link continua funcionando se você fechar a página.</p>
    </div>
  </div>`;
}

export function emailAlmanaqueHtml(p) {
  const l = (k, v) => `<tr><td style="padding:4px 12px 4px 0;color:#5b4f42">${k}</td><td style="padding:4px 0"><b>${v || '—'}</b></td></tr>`;
  return `
  <div style="font-family:Georgia,serif;padding:24px;color:#2e2620">
    <h2 style="margin:0 0 4px">Novo pedido — Almanaque Minha História</h2>
    <p style="color:#5b4f42;margin:0 0 16px">Código <b>${p.codigo}</b> · pago em ${new Date().toLocaleString('pt-BR')} · <b>R$ ${p.valor.toFixed(2).replace('.', ',')}</b></p>
    <table style="border-collapse:collapse;font-size:15px">
      ${l('Nome completo', p.nome)}
      ${l('Nascimento', `${String(p.d).padStart(2, '0')}/${String(p.m).padStart(2, '0')}/${p.y}`)}
      ${l('Cidade/estado onde cresceu', p.cidade)}
      ${l('E-mail', p.email)}
      ${l('WhatsApp', p.whatsapp)}
      ${l('Observações', p.obs)}
    </table>
    <p style="color:#5b4f42;font-size:13px;margin-top:18px">Prazo prometido ao cliente: 3 dias úteis.</p>
  </div>`;
}
