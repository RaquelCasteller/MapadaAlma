import { gerarPerfil, nomesAlmas } from './lib/motor.js';
import { json } from './lib/pedidos.js';

/** Devolve 5 nomes de almas para o gancho da prévia — nunca o da pessoa.
 *  O cálculo real fica no servidor: o navegador não sabe qual é o resultado. */
export default async (req) => {
  const u = new URL(req.url);
  const nome = String(u.searchParams.get('nome') || '').trim();
  const y = Number(u.searchParams.get('ano')), m = Number(u.searchParams.get('mes')), d = Number(u.searchParams.get('dia'));
  if (nome.length < 2 || !y || !m || !d) return json({ erro: 'dados incompletos' }, 400);

  let real = null;
  try { real = gerarPerfil(nome, y, m, d, '').almaBrasileira.nome; } catch { /* segue sem excluir */ }

  const todos = nomesAlmas().filter(n => n !== real);
  // embaralha de forma estável pela própria data, para não mudar a cada F5
  let s = (y * 372 + m * 31 + d) % 9973;
  const fora = [];
  const pool = todos.slice();
  while (fora.length < 5 && pool.length) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    fora.push(pool.splice(s % pool.length, 1)[0]);
  }
  return json({ nomes: fora });
};
