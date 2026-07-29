# Mapa da Alma — pacote para o Netlify

Arraste a **pasta inteira** para o Netlify (não só o `index.html`, senão as imagens somem).

```
index.html
img/  ornamento-heroi.png · selo.png · carta-tarot.jpg · roda-zodiaco.jpg · og.jpg · favicon.png
```

---

## Antes de publicar — 4 coisas obrigatórias

**1. Sair do modo demonstração.**
No `index.html`, dentro de `CONFIG` (perto do início do `<script>`):

```js
DEMO_MODE: false,
PIX_URL:     "…",   // checkout Pix R$9,99
CARD_URL:    "…",   // checkout cartão R$9,99
PREMIUM_URL: "…",   // checkout Almanaque R$45 (recebe ?cupom=)
SITE_URL: "mapadaalma.com.br",   // aparece no card compartilhável
```

Enquanto `DEMO_MODE` for `true`, os botões de pagamento liberam o conteúdo de graça.
A linha "Modo demonstração" (id `demoNote`) some sozinha? **Não** — apague ela na mão.

**2. Decidir a urgência.**
`LAUNCH_URGENCY: true` mostra a tarja "Oferta de lançamento". Só deixe ligado se o
preço **realmente** vai subir depois. Se R$9,99 é definitivo, ponha `false`.

**3. Depoimentos.**
O bloco "O que as pessoas dizem" está com texto **inventado**, marcado com aviso
na tela e comentário no código. Troque pelos reais ou **apague o bloco inteiro**.
A linha de identificação logo abaixo ("Aquarianos, leoninos, cancerianos…")
segura sozinha até você ter cliente de verdade.

**4. OG image.**
Depois de publicar, troque `og:image` e `og:url` pelo endereço completo
(`https://seusite.netlify.app/img/og.jpg`). WhatsApp e Facebook ignoram
caminho relativo — sem isso o preview do link sai sem imagem.

---

## O que mudou nesta versão

**Arquétipo trancado.** A prévia grátis mostra signo, zodíaco chinês e Caminho de
Vida. O arquétipo e o lema viraram os dois primeiros itens censurados e só
aparecem depois de pagar, num bloco dourado com o selo de cera.

**Frase certeira.** Logo abaixo do teaser, antes do preço, entra uma afirmação
específica derivada do tag dominante do perfil (~45 tags × 2 variações). É o
arrepio que justifica o R$9,99.

**Menos fricção.** O estado de nascimento saiu do formulário de entrada e agora é
perguntado *depois* do desbloqueio, onde completa a seção regional. A data virou
três seletores (dia/mês/ano) em vez do `input date` nativo.

**Ancoragem tripla.** R$150 de consulta astrológica → R$9,99 → menos que um lanche.

**Garantia.** "Não se identificou? Devolvemos o dinheiro", no ponto de pagamento.

**Card compartilhável.** Botão depois do desbloqueio gera uma imagem 1080×1350 com
ornamento, arquétipo, lema, signo, selo e o convite "Faça o seu em …". Usa a API
nativa de compartilhamento no celular e cai para download no desktop.

**Camada gráfica.** Ornamento no topo, selo de cera real (substituiu o selo em CSS),
ilustração na seção do Tarô, roda do zodíaco como textura de fundo, favicon e OG.

**Título.** Agora vende benefício ("Descubra quem você realmente é"); a marca virou
subtítulo.

---

## Sobre as imagens

Os quatro PNGs do Gemini **não tinham transparência de verdade** — o xadrez cinza
estava desenhado como pixel (modo RGB, sem canal alfa). Ornamento e selo foram
recortados por saturação (o xadrez é acromático, a arte é vermelho-tijolo), com as
bordas descompostas para não ficarem lavadas. Na próxima leva, peça PNG com canal
alfa de verdade — ou conte com esse passo de recorte.

## Testes já rodados

- 60 combinações de nome/data passando por gerar → destravar → UF → recomeçar, sem erro
- Verificação automática de que o arquétipo e o lema **não vazam** no HTML da prévia
- Card renderizado pelo código real da página: 12 blocos visuais, folga mínima de
  18px, nenhuma sobreposição

Obs.: o card foi validado com fontes de fallback (o Google Fonts não carrega no
teste). No navegador, a Playfair é um pouco mais larga — o código encolhe o
arquétipo automaticamente até caber em duas linhas, então não quebra. Ainda assim,
vale gerar um card de teste no celular antes de divulgar.
