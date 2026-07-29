import { ler, json, CUPOM_MINUTOS } from './lib/pedidos.js';

/** O navegador pergunta "já liberou?". Só devolve o conteúdo se estiver pago. */
export default async (req) => {
  const url = new URL(req.url);
  const token = url.searchParams.get('pedido');
  const pedido = await ler(token);

  if (!pedido) return json({ status: 'inexistente' }, 404);

  if (pedido.status !== 'pago') {
    return json({ status: pedido.status, codigo: pedido.codigo });
  }

  const restaMs = Math.max(0, (pedido.cupomExpira || 0) - Date.now());
  return json({
    status: 'pago',
    codigo: pedido.codigo,
    perfil: pedido.perfil,
    cupom: {
      codigo: pedido.cupomCodigo || null,
      segundosRestantes: Math.floor(restaMs / 1000),
      minutos: CUPOM_MINUTOS
    }
  });
};
