import { gerarPerfil } from './lib/motor.js';
import { novoToken, novoCodigo, salvar, indexarPagamento, mpCriarPreferencia, json, PRECOS } from './lib/pedidos.js';

export default async (req) => {
  if (req.method !== 'POST') return json({ erro: 'método inválido' }, 405);

  let body;
  try { body = await req.json(); } catch { return json({ erro: 'json inválido' }, 400); }

  const nome = String(body.nome || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const y = Number(body.ano), m = Number(body.mes), d = Number(body.dia);

  if (nome.length < 2) return json({ erro: 'Digite seu nome completo.' }, 400);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ erro: 'Digite um e-mail válido.' }, 400);
  if (!y || !m || !d) return json({ erro: 'Data de nascimento incompleta.' }, 400);
  const teste = new Date(y, m - 1, d);
  if (teste.getDate() !== d || teste.getMonth() !== m - 1) return json({ erro: 'Essa data não existe.' }, 400);
  if (y < 1940 || y > 2012) return json({ erro: 'Aceitamos nascimentos entre 1940 e 2012.' }, 400);

  // O perfil é gerado AQUI, no servidor, e guardado. O navegador só recebe
  // depois que o webhook confirmar o pagamento.
  const perfil = gerarPerfil(nome, y, m, d, '');
  const token = novoToken();
  const codigo = novoCodigo('MA');

  const pedido = {
    tipo: 'mapa',
    token, codigo, email, nome, y, m, d,
    valor: PRECOS.mapa,
    status: 'pendente',
    perfil,
    criadoEm: Date.now()
  };

  try {
    await salvar(token, pedido);
    await indexarPagamento(token, token);
    const link = await mpCriarPreferencia({
      titulo: 'Mapa da Alma — retrato completo',
      valor: PRECOS.mapa,
      referencia: token,
      email
    });
    return json({ token, codigo, link });
  } catch (e) {
    return json({ erro: 'Não conseguimos abrir o pagamento agora. Tente de novo em instantes.', detalhe: e.message }, 502);
  }
};
