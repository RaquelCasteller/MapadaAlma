import { ler, salvar, novoToken, novoCodigo, mpCriarPreferencia, json, PRECOS } from './lib/pedidos.js';

export default async (req) => {
  if (req.method !== 'POST') return json({ erro: 'método inválido' }, 405);
  let b;
  try { b = await req.json(); } catch { return json({ erro: 'json inválido' }, 400); }

  const nome = String(b.nome || '').trim();
  const email = String(b.email || '').trim().toLowerCase();
  const whatsapp = String(b.whatsapp || '').trim();
  const cidade = String(b.cidade || '').trim();
  const obs = String(b.obs || '').trim().slice(0, 500);
  const y = Number(b.ano), m = Number(b.mes), d = Number(b.dia);

  if (nome.length < 3) return json({ erro: 'Digite o nome completo.' }, 400);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ erro: 'Digite um e-mail válido.' }, 400);
  if (whatsapp.replace(/\D/g, '').length < 10) return json({ erro: 'Digite um WhatsApp com DDD.' }, 400);
  if (cidade.length < 2) return json({ erro: 'Diga a cidade onde você cresceu.' }, 400);
  if (!y || !m || !d) return json({ erro: 'Data de nascimento incompleta.' }, 400);

  // O PREÇO É DECIDIDO AQUI. O cronômetro do navegador é só enfeite:
  // quem manda é o prazo gravado no servidor quando o mapa foi pago.
  let valor = PRECOS.almanaque_cheio;
  let cupomAplicado = null;
  const origem = await ler(String(b.tokenMapa || ''));
  if (origem && origem.status === 'pago' && origem.cupomExpira && Date.now() < origem.cupomExpira) {
    valor = PRECOS.almanaque_desconto;
    cupomAplicado = origem.cupomCodigo;
  }

  const token = novoToken();
  const codigo = novoCodigo('AL');
  const pedido = {
    tipo: 'almanaque',
    token, codigo, nome, email, whatsapp, cidade, obs, y, m, d,
    valor, cupomAplicado,
    tokenMapa: b.tokenMapa || null,
    status: 'pendente',
    criadoEm: Date.now()
  };

  try {
    await salvar(token, pedido);
    const link = await mpCriarPreferencia({
      titulo: cupomAplicado
        ? 'Almanaque Minha História (com desconto)'
        : 'Almanaque Minha História',
      valor,
      referencia: token,
      email
    });
    return json({ token, codigo, valor, cupomAplicado, link });
  } catch (e) {
    return json({ erro: 'Não conseguimos abrir o pagamento agora. Tente de novo.', detalhe: e.message }, 502);
  }
};
