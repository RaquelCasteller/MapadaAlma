// netlify/functions/nome.js
// Frequência do primeiro nome no Censo 2010 (IBGE). Público, gratuito, sem chave.
// Regras: sempre responde 200 com JSON; se o IBGE falhar, devolve {} e o site não mostra nada.

const { getStore } = require('@netlify/blobs');

const DECADAS = {
  '1930[': 'antes de 1930',
  '[1930,1940[': 'anos 30',
  '[1940,1950[': 'anos 40',
  '[1950,1960[': 'anos 50',
  '[1960,1970[': 'anos 60',
  '[1970,1980[': 'anos 70',
  '[1980,1990[': 'anos 80',
  '[1990,2000[': 'anos 90',
  '[2000,2010[': 'anos 2000'
};

function normalizar(nome) {
  return String(nome || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/ç/gi, 'c')
    .toUpperCase().replace(/[^A-Z]/g, '')
    .slice(0, 40);
}

function milhar(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function montarFrase(nome, res) {
  const bonito = nome.charAt(0) + nome.slice(1).toLowerCase();

  // O Censo só publica nomes com 20 ocorrências ou mais no país.
  // Não achar é o resultado mais interessante que existe — não é erro.
  if (!res || !res.length) {
    return `Procuramos <b>${bonito}</b> no Censo do IBGE e não encontramos: ` +
           `o seu nome é raro demais para entrar na estatística. ` +
           `Menos de 20 pessoas no Brasil inteiro se chamam assim.`;
  }

  const total = res.reduce((a, r) => a + (r.frequencia || 0), 0);
  // O Censo conta cada GRAFIA separadamente: Susana e Suzana, Luis e Luiz,
  // Ana e Anna são nomes distintos na base. Por isso a frase diz "escrito
  // exatamente assim" — sem isso o número parece baixo e a pessoa desconfia.
  const pico = res.reduce((a, r) => (r.frequencia > a.frequencia ? r : a), res[0]);
  const decada = DECADAS[pico.periodo] || pico.periodo;
  const ultima = res[res.length - 1];
  const penultima = res[res.length - 2];

  let tendencia = '';
  if (penultima && ultima && ultima.frequencia < penultima.frequencia * 0.8) {
    tendencia = ' e vem saindo de moda desde então';
  } else if (penultima && ultima && ultima.frequencia > penultima.frequencia * 1.2) {
    tendencia = ' e continua em alta';
  }

  return `Existem cerca de <b>${milhar(total)}</b> pessoas chamadas <b>${bonito}</b> no Brasil — ` +
         `escrito exatamente assim. O nome teve o auge nos <b>${decada}</b>${tendencia}.`;
}

exports.handler = async (event) => {
  const vazio = { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: '{}' };
  const nome = normalizar(event.queryStringParameters && event.queryStringParameters.nome);
  if (nome.length < 2) return vazio;

  let store = null;
  try { store = getStore('nomes-ibge'); } catch (e) { /* segue sem cache */ }

  // cache: o Censo 2010 não muda. Uma consulta por nome, para sempre.
  if (store) {
    try {
      const cache = await store.get(nome, { type: 'json' });
      if (cache && cache.frase) {
        return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cache) };
      }
    } catch (e) { /* cache frio */ }
  }

  let res = null;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3500); // IBGE lento não pode travar a prévia
    const r = await fetch(
      'https://servicodados.ibge.gov.br/api/v2/censos/nomes/' + encodeURIComponent(nome),
      { signal: ctrl.signal }
    );
    clearTimeout(timer);
    if (!r.ok) return vazio;
    const d = await r.json();
    res = Array.isArray(d) && d[0] && Array.isArray(d[0].res) ? d[0].res : [];
  } catch (e) {
    return vazio; // rede fora, timeout, JSON quebrado: o site simplesmente não mostra o bloco
  }

  const payload = { nome, frase: montarFrase(nome, res) };
  if (store) { try { await store.setJSON(nome, payload); } catch (e) {} }

  return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) };
};

// exportado só para os testes
exports.__montarFrase = montarFrase;
exports.__normalizar = normalizar;
