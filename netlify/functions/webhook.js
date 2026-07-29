import { ler, salvar, mpConsultarPagamento, enviarEmail, emailMapaHtml, emailAlmanaqueHtml, siteUrl, novoCodigo, PRECOS, CUPOM_MINUTOS } from './lib/pedidos.js';

/** O Mercado Pago chama esta função quando o status de um pagamento muda.
 *  Não depende do navegador do cliente — é isso que faz o PIX ser confiável. */
export default async (req) => {
  const url = new URL(req.url);
  let pagamentoId = url.searchParams.get('data.id') || url.searchParams.get('id');
  let tipo = url.searchParams.get('type') || url.searchParams.get('topic');

  try {
    const body = await req.json();
    if (body?.data?.id) pagamentoId = String(body.data.id);
    if (body?.type) tipo = body.type;
    if (body?.action?.startsWith('payment')) tipo = 'payment';
  } catch { /* pode vir só por query string */ }

  // Responder 200 sempre: se devolvermos erro, o MP fica reenviando.
  if (!pagamentoId || (tipo && !String(tipo).includes('payment'))) {
    return new Response('ignorado', { status: 200 });
  }

  const pag = await mpConsultarPagamento(pagamentoId);
  if (!pag) return new Response('pagamento não encontrado', { status: 200 });

  const token = pag.external_reference;
  const pedido = await ler(token);
  if (!pedido) return new Response('pedido não encontrado', { status: 200 });

  if (pag.status !== 'approved') {
    if (pedido.status === 'pendente') {
      pedido.statusPagamento = pag.status;
      await salvar(token, pedido);
    }
    return new Response('ok', { status: 200 });
  }

  // Confere o valor: nunca confiar no que veio do navegador.
  const esperado = Number(pedido.valor);
  const pago = Number(pag.transaction_amount);
  if (Math.abs(pago - esperado) > 0.01) {
    pedido.status = 'divergente';
    pedido.valorPago = pago;
    await salvar(token, pedido);
    return new Response('valor divergente', { status: 200 });
  }

  if (pedido.status === 'pago') return new Response('já processado', { status: 200 });

  pedido.status = 'pago';
  pedido.pagamentoId = String(pagamentoId);
  pedido.pagoEm = Date.now();

  if (pedido.tipo === 'mapa') {
    pedido.cupomCodigo = novoCodigo('ALMA15');
    pedido.cupomExpira = Date.now() + CUPOM_MINUTOS * 60 * 1000;
    await salvar(token, pedido);
    await enviarEmail({
      para: pedido.email,
      assunto: `Seu Mapa da Alma está pronto (${pedido.codigo})`,
      html: emailMapaHtml({ primeiro: pedido.perfil.base.primeiro, link: `${siteUrl()}/?pedido=${token}` })
    });
  } else {
    await salvar(token, pedido);
    const destino = process.env.EMAIL_PEDIDOS;
    if (destino) {
      await enviarEmail({
        para: destino,
        assunto: `NOVO PEDIDO Almanaque — ${pedido.codigo} — R$ ${pedido.valor.toFixed(2)}`,
        html: emailAlmanaqueHtml(pedido)
      });
    }
    await enviarEmail({
      para: pedido.email,
      assunto: `Pedido confirmado — Almanaque Minha História (${pedido.codigo})`,
      html: `<div style="font-family:Georgia,serif;padding:24px;color:#2e2620">
        <h2>Recebemos o seu pedido, ${String(pedido.nome).split(' ')[0]}</h2>
        <p>Código <b>${pedido.codigo}</b>. O seu Almanaque é pesquisado à mão e fica pronto em <b>3 dias úteis</b>.</p>
        <p>Se precisarmos de algum detalhe, falamos com você pelo WhatsApp que você informou.</p>
      </div>`
    });
  }

  return new Response('ok', { status: 200 });
};
