# Fase 5 pronta — o que subir e o que configurar

## 1. Subir no GitHub

Suba **todos** os arquivos desta pasta, mantendo a estrutura. O `index.html` continua na raiz.

```
index.html            ← substitui o atual
netlify.toml          ← novo (diz ao Netlify onde estão as funções)
package.json          ← novo (dependência @netlify/blobs)
.gitignore            ← novo
img/                  ← igual ao que já está lá
netlify/
  functions/
    criar-pagamento.js
    status.js
    webhook.js
    pedido-almanaque.js
    lib/
      motor.js        ← o conteúdo pago vive aqui, no servidor
      pedidos.js
```

Pelo site do GitHub: **Add file → Upload files**, arraste o conteúdo da pasta,
**Commit changes**. A subpasta `netlify/functions/lib` é preservada no arrasto.

## 2. Variáveis de ambiente no Netlify

**Site configuration → Environment variables → Add a variable.** Cinco no total:

| Nome | Valor | Onde pegar |
|---|---|---|
| `MP_ACCESS_TOKEN` | o token de **teste** (`TEST-...`) | painel MP → sua aplicação → Credenciais |
| `SITE_URL` | `https://mapadalma.netlify.app` | — |
| `RESEND_API_KEY` | a chave do Resend | resend.com → API Keys |
| `EMAIL_PEDIDOS` | o seu e-mail | onde você quer receber os pedidos do Almanaque |
| `EMAIL_REMETENTE` | `Mapa da Alma <onboarding@resend.dev>` | trocar quando tiver domínio verificado |

Nenhuma dessas some no código. Se alguma faltar, a função devolve erro e o site avisa
que não conseguiu abrir o pagamento.

## 3. Cadastrar o webhook no Mercado Pago

Painel → sua aplicação → **Webhooks**. URL:

```
https://mapadalma.netlify.app/.netlify/functions/webhook
```

Marque o evento de **Pagamentos**. Salve no ambiente de **teste** por enquanto.

> ⚠️ Na Fase 7 você precisa cadastrar **de novo** em produção. Sandbox e produção
> são cadastros separados. Esquecer isso é o erro nº 1: o pagamento entra e o
> conteúdo não libera.

## 4. Testar (Fase 6)

Faça uma compra com a conta **Buyer Test User**. Os quatro cenários:

| Cenário | O que tem que acontecer |
|---|---|
| Aprovado | A tela destrava sozinha, sem recarregar. E-mail chega. |
| Pendente (Pix) | Tela "Confirmando o seu pagamento…" com o código do pedido; destrava quando confirmar. |
| Recusado | Volta ao site sem liberar nada. |
| **Fechei a aba depois de pagar** | O e-mail chega mesmo assim, com link que reabre o mapa. |

O quarto é o que importa. É o problema que te queimou no projeto da Raquel, e é
por causa dele que existe webhook aqui.

Teste também o Almanaque: preencher o formulário, pagar, e conferir se o pedido
completo cai no `EMAIL_PEDIDOS` com nome, nascimento, cidade, e-mail e WhatsApp.

---

## O que mudou por dentro

**O paywall virou real.** Antes, o mapa inteiro era calculado no navegador e escondido
com CSS — quem abrisse o console lia tudo de graça. Agora o navegador só tem os dados
da prévia (12 KB). Arquétipo, personagem, mídias, profissões, tarô, época, sorte e
sobrenome são gerados no servidor e só descem depois que o webhook confirma o pagamento.
Não há o que burlar pelo console, porque o conteúdo não está lá.

**O preço é decidido no servidor.** O navegador nunca informa quanto cobrar. O webhook
ainda confere se o valor pago bate com o do pedido; se não bater, marca como divergente
e não entrega.

**O cronômetro do cupom ficou honesto.** O prazo de 30 minutos é gravado no servidor no
instante em que o mapa é pago. Dar F5 não reinicia mais. Se expirar, a função cria a
cobrança de **R$60** — o preço cheio que você criou. A promessa agora se cumpre.

**Os links `mpago.la` não são mais usados.** As cobranças são criadas na hora, com código
de pedido próprio. Guarde os links antigos como plano B.

## Testes já rodados

- 11 grupos no servidor: validação, criação de pedido, bloqueio antes do pagamento,
  webhook, pagamento de valor divergente, cupom válido, cupom expirado, pedido sem
  cupom, e-mail para você e para o cliente, webhook repetido, webhook com lixo
- 8 grupos no navegador, com a página real ligada nas funções reais: prévia, ausência
  de conteúdo pago no DOM, fluxo de pagamento, volta com Pix pendente, destravamento
  automático quando o webhook aprova, link de recuperação no e-mail, formulário do
  Almanaque cobrando R$45 com cupom, token inválido
- 600 combinações de nome e data no motor: zero erros, 104 arquétipos distintos

## Pendências conhecidas

**O Resend só entrega para o seu próprio e-mail** enquanto você não verificar um domínio.
Para testar está ótimo. Antes de vender de verdade, precisa de domínio verificado, senão
o e-mail não chega no cliente — e o e-mail é a rede de segurança do Pix.

**Os depoimentos continuam inventados.** O bloco segue marcado no código. Troque pelos
reais ou apague antes de anunciar.
