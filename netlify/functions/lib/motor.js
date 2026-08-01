/* ==================================================================
   MOTOR DE PERFIL — Mapa da Alma
   Roda NO SERVIDOR. Este arquivo contém o conteúdo pago e nunca é
   enviado ao navegador antes da confirmação do pagamento.
   ================================================================== */

/* ============================ MOTOR ============================ */
function stripAccents(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ç/gi,'c');}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1).toLowerCase();}

const ZODIAC=[['Capricórnio',1,1,1,19],['Aquário',1,20,2,18],['Peixes',2,19,3,20],['Áries',3,21,4,19],['Touro',4,20,5,20],['Gêmeos',5,21,6,20],['Câncer',6,21,7,22],['Leão',7,23,8,22],['Virgem',8,23,9,22],['Libra',9,23,10,22],['Escorpião',10,23,11,21],['Sagitário',11,22,12,21],['Capricórnio',12,22,12,31]];
function zodiac(m,d){for(const[n,m1,d1,m2,d2]of ZODIAC){if((m===m1&&d>=d1)||(m===m2&&d<=d2))return n;}return'—';}
const CNY={1940:'02-08',1941:'01-27',1942:'02-15',1943:'02-05',1944:'01-25',1945:'02-13',1946:'02-02',1947:'01-22',1948:'02-10',1949:'01-29',1950:'02-17',1951:'02-06',1952:'01-27',1953:'02-14',1954:'02-03',1955:'01-24',1956:'02-12',1957:'01-31',1958:'02-18',1959:'02-08',1960:'01-28',1961:'02-15',1962:'02-05',1963:'01-25',1964:'02-13',1965:'02-02',1966:'01-21',1967:'02-09',1968:'01-30',1969:'02-17',1970:'02-06',1971:'01-27',1972:'02-15',1973:'02-03',1974:'01-23',1975:'02-11',1976:'01-31',1977:'02-18',1978:'02-07',1979:'01-28',1980:'02-16',1981:'02-05',1982:'01-25',1983:'02-13',1984:'02-02',1985:'02-20',1986:'02-09',1987:'01-29',1988:'02-17',1989:'02-06',1990:'01-27',1991:'02-15',1992:'02-04',1993:'01-23',1994:'02-10',1995:'01-31',1996:'02-19',1997:'02-07',1998:'01-28',1999:'02-16',2000:'02-05',2001:'01-24',2002:'02-12',2003:'02-01',2004:'01-22',2005:'02-09',2006:'01-29',2007:'02-18',2008:'02-07',2009:'01-26',2010:'02-14',2011:'02-03',2012:'01-23'};
const ANIMAL_BASE=['Cão','Porco','Rato','Boi','Tigre','Coelho','Dragão','Serpente','Cavalo','Cabra','Macaco','Galo'];
function chineseYear(y,m,d){const c=CNY[y];if(c){const[cm,cd]=c.split('-').map(Number);if(m<cm||(m===cm&&d<cd))return y-1;}return y;}
function chineseAnimal(y,m,d){return ANIMAL_BASE[((chineseYear(y,m,d)-1970)%12+12)%12];}
function chineseElement(y,m,d){const l=((chineseYear(y,m,d)%10)+10)%10;return l<=1?'Metal':l<=3?'Água':l<=5?'Madeira':l<=7?'Fogo':'Terra';}
function reduce(n){while(n>9&&n!==11&&n!==22&&n!==33){n=String(n).split('').reduce((a,b)=>a+ +b,0);}return n;}
function lifePath(y,m,d){return reduce(reduce(m)+reduce(d)+reduce(String(y).split('').reduce((a,b)=>a+ +b,0)));}
const PYTH={A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8};
function expression(nm){const c=stripAccents(nm).toUpperCase().replace(/[^A-Z]/g,'');let s=0;for(const ch of c)s+=PYTH[ch]||0;return reduce(s);}
/* Alma = vogais (o que a pessoa quer). Personalidade = consoantes (o que os outros veem).
   Usam o nome COMPLETO — é o que finalmente faz o sobrenome pesar no cálculo. */
const VOGAIS='AEIOU';
function somaLetras(nm,f){const c=stripAccents(nm).toUpperCase().replace(/[^A-Z]/g,'');let s=0;for(const ch of c)if(f(ch))s+=PYTH[ch]||0;return reduce(s);}
function almaNum(nm){return somaLetras(nm,ch=>VOGAIS.includes(ch));}
function personaNum(nm){return somaLetras(nm,ch=>!VOGAIS.includes(ch));}
function ageAt(y,m,d){const t=new Date();let a=t.getFullYear()-y;if(t.getMonth()+1<m||(t.getMonth()+1===m&&t.getDate()<d))a--;return a;}
/* A semente precisa ser IMUNE a variação de digitação: acento, caixa e espaço
   duplo não podem mudar o filme da vida de ninguém. Sem isso, "José" e "Jose"
   eram duas pessoas diferentes para o sorteio. */
function chaveSemente(c){return stripAccents(String(c.nome)).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()+'|'+c.y+'|'+c.m+'|'+c.d;}
function seedNum(c){let h=2166136261>>>0;const s=chaveSemente(c);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}return h>>>0;}
function shuffleSeeded(arr,seed){const a=arr.slice();let s=(seed>>>0)||1;for(let i=a.length-1;i>0;i--){s=(Math.imul(s,1103515245)+12345)>>>0;const j=s%(i+1);const t=a[i];a[i]=a[j];a[j]=t;}return a;}
/* ===================== DADOS ===================== */
const SIGNO={
 'Áries':{tags:['coragem','lideranca','acao','impeto'],cor:'Vermelho',dia:'Terça',pedra:'Rubi',desc:'pioneiro de sangue quente: você abre caminho onde outros hesitam, movido por um fogo que não sabe recuar.'},
 'Touro':{tags:['disciplina','tradicao','sensualidade','resiliencia'],cor:'Verde',dia:'Sexta',pedra:'Esmeralda',desc:'raiz firme e sentidos abertos: constrói devagar, gosta do que é bom e não larga o osso quando decide.'},
 'Gêmeos':{tags:['palavra','curiosidade','versatilidade','carisma'],cor:'Amarelo',dia:'Quarta',pedra:'Ágata',desc:'mente de mil janelas: curioso, falante, capaz de ser dois em um só — eterno tradutor do mundo.'},
 'Câncer':{tags:['cuidado','sensibilidade','intuicao','familia'],cor:'Prata',dia:'Segunda',pedra:'Pérola',desc:'coração de casa: sua força mora no afeto, na memória e na lealdade a quem você abraça como seu.'},
 'Leão':{tags:['palco','lideranca','carisma','poder'],cor:'Dourado',dia:'Domingo',pedra:'Âmbar',desc:'brilho de palco: nasceu para ser visto e para aquecer os outros com sua generosidade de sol.'},
 'Virgem':{tags:['analise','disciplina','servico','precisao'],cor:'Bege',dia:'Quarta',pedra:'Safira',desc:'artesão do detalhe: enxerga o que passa despercebido e transforma cuidado em forma de amor.'},
 'Libra':{tags:['harmonia','arte','justica','carisma'],cor:'Rosa',dia:'Sexta',pedra:'Quartzo rosa',desc:'fiel da balança: busca a beleza e o acordo, e desarma tempestades só pela presença elegante.'},
 'Escorpião':{tags:['intensidade','misterio','estrategia','poder'],cor:'Vinho',dia:'Terça',pedra:'Topázio',desc:'águas fundas: intenso, magnético, sente tudo em dobro e renasce das próprias cinzas.'},
 'Sagitário':{tags:['aventura','liberdade','filosofia','otimismo'],cor:'Roxo',dia:'Quinta',pedra:'Turquesa',desc:'flecha lançada ao horizonte: aventureiro e filósofo, sua casa é a estrada e sua fé é o novo.'},
 'Capricórnio':{tags:['disciplina','poder','ambicao','resiliencia'],cor:'Marrom',dia:'Sábado',pedra:'Ônix',desc:'montanha paciente: ambição de aço e pés no chão, chega ao topo pelo trabalho, não pela sorte.'},
 'Aquário':{tags:['inovacao','liberdade','visao','rebeldia'],cor:'Azul-turquesa',dia:'Sábado',pedra:'Ametista',desc:'mente à frente do relógio: original e livre, enxerga o amanhã enquanto os outros discutem o ontem.'},
 'Peixes':{tags:['sensibilidade','arte','intuicao','sonho'],cor:'Verde-mar',dia:'Quinta',pedra:'Água-marinha',desc:'sonhador de olhos molhados: sensível como poucos, traduz o invisível em arte, fé e compaixão.'}
};
const NUM={
 1:{tags:['lideranca','independencia','acao'],desc:'O 1 é a força da liderança e do começo — você veio para abrir portas por conta própria.'},
 2:{tags:['diplomacia','sensibilidade','harmonia'],desc:'O 2 é a delicadeza que une — você é a ponte, quem sente o clima antes de todos e costura a paz.'},
 3:{tags:['palavra','arte','carisma'],desc:'O 3 é a alegria que se expressa — comunicação, criatividade e um charme que ilumina qualquer roda.'},
 4:{tags:['disciplina','tradicao','resiliencia'],desc:'O 4 é o alicerce — disciplina, honestidade e trabalho; a pessoa em quem todos apoiam a casa.'},
 5:{tags:['liberdade','aventura','versatilidade'],desc:'O 5 é o vento da liberdade — mudança, viagem e aventura; prender você é prender o horizonte.'},
 6:{tags:['cuidado','familia','servico'],desc:'O 6 é o amor que cuida — responsável e caloroso, você faz do lar um reino.'},
 7:{tags:['analise','misterio','filosofia'],desc:'O 7 é o buscador — introspecção, sabedoria e sede de entender o que há por trás das coisas.'},
 8:{tags:['poder','ambicao','justica'],desc:'O 8 é o poder que realiza — ambição, justiça e faro para o material; nasceu para construir e reger.'},
 9:{tags:['generosidade','arte','sensibilidade'],desc:'O 9 é o coração do mundo — generosidade, arte e uma alma que ama a humanidade inteira.'},
 11:{tags:['visao','intuicao','inspiracao'],desc:'O 11 é o número mestre da inspiração — intuição fora do comum e a missão de iluminar.'},
 22:{tags:['visao','poder','disciplina'],desc:'O 22 é o mestre construtor — sonha grande e tem mãos para erguer o que sonhou.'},
 33:{tags:['cuidado','servico','inspiracao'],desc:'O 33 é o mestre do amor incondicional — cura, ensino e entrega; uma das vibrações mais raras.'}
};
const ANIMAL={
 'Rato':{tags:['esperteza','estrategia','sobrevivencia'],adj:'esperto e sobrevivente'},'Boi':{tags:['disciplina','resiliencia','tradicao'],adj:'firme e trabalhador'},'Tigre':{tags:['coragem','impeto','lideranca'],adj:'corajoso e magnético'},'Coelho':{tags:['diplomacia','sensibilidade','arte'],adj:'gentil e diplomático'},'Dragão':{tags:['poder','carisma','visao'],adj:'poderoso e visionário'},'Serpente':{tags:['misterio','estrategia','intuicao'],adj:'sábio e enigmático'},'Cavalo':{tags:['liberdade','acao','impeto'],adj:'livre e apaixonado'},'Cabra':{tags:['arte','sensibilidade','sonho'],adj:'sensível e criativo'},'Macaco':{tags:['curiosidade','versatilidade','palavra'],adj:'engenhoso e brincalhão'},'Galo':{tags:['precisao','franqueza','palco'],adj:'orgulhoso e franco'},'Cão':{tags:['justica','lealdade','servico'],adj:'leal e justo'},'Porco':{tags:['cuidado','generosidade','sinceridade'],adj:'generoso e sincero'}
};
const ELEM={'Metal':['disciplina','ambicao','resiliencia'],'Água':['intuicao','sensibilidade','versatilidade'],'Madeira':['crescimento','etica','cuidado'],'Fogo':['paixao','carisma','acao'],'Terra':['estabilidade','cuidado','tradicao']};
const ARQ=[['O Soberano',['poder','lideranca','ambicao'],'Sonhar grande é o mínimo.'],['O Visionário',['visao','inovacao','rebeldia'],'O futuro chega mais rápido perto de você.'],['O Guerreiro',['coragem','acao','impeto'],'Recuar não está no vocabulário.'],['O Sábio',['analise','filosofia','misterio'],'Entender é a sua forma de vencer.'],['O Artista',['arte','sensibilidade','sonho'],'Você transforma sentimento em beleza.'],['O Comunicador',['palavra','carisma','palco'],'Quando você fala, a sala para.'],['O Guardião',['cuidado','familia','servico'],'Ao seu lado, o mundo parece mais seguro.'],['O Aventureiro',['aventura','liberdade','versatilidade'],'A estrada é o seu endereço.'],['O Estrategista',['estrategia','disciplina','misterio'],'Você ganha o jogo três lances antes.'],['O Diplomata',['diplomacia','harmonia','justica'],'Você desarma tempestades só de chegar.'],['O Construtor',['disciplina','resiliencia','tradicao'],'O que você levanta, fica de pé.'],['O Místico',['intuicao','inspiracao','sonho'],'Você sente a verdade antes de ela ser dita.']];
const TAROT={1:['O Mago','o poder de transformar vontade em realidade'],2:['A Sacerdotisa','a sabedoria silenciosa que sabe sem precisar provar'],3:['A Imperatriz','a criação fértil, a beleza e a abundância'],4:['O Imperador','a autoridade que estrutura e comanda'],5:['O Hierofante','a busca por sentido e por tradição'],6:['Os Enamorados','as escolhas do coração e as grandes alianças'],7:['O Carro','a vitória pela vontade e pelo movimento'],8:['A Força','a coragem serena que domina pela mansidão, não pela violência'],9:['O Eremita','a luz interior de quem busca a verdade sozinho'],11:['A Justiça','o equilíbrio, a verdade e o peso justo das coisas'],22:['O Louco','a liberdade absoluta de quem começa sempre de novo, sem medo do salto']};
const PROF=[['Empreendedor(a) / fundador(a)',['ambicao','coragem','visao','lideranca']],['Advogado(a) / promotor(a)',['justica','palavra','estrategia','poder']],['Executivo(a) / CEO',['poder','lideranca','disciplina','ambicao']],['Publicidade / marketing',['palavra','carisma','inovacao','arte']],['Político(a) / líder de causa',['lideranca','visao','palavra','poder']],['Palestrante / criador(a) de conteúdo',['palco','palavra','carisma','visao']],['Médico(a) / enfermeiro(a)',['cuidado','servico','resiliencia','analise']],['Professor(a) / educador(a)',['servico','palavra','cuidado','filosofia']],['Psicólogo(a) / terapeuta',['intuicao','sensibilidade','analise','cuidado']],['Artista / músico(a)',['arte','sensibilidade','palco','sonho']],['Escritor(a) / roteirista',['palavra','arte','sonho','analise']],['Designer / arquiteto(a)',['arte','precisao','disciplina','visao']],['Cientista / pesquisador(a)',['analise','filosofia','precisao','curiosidade']],['Engenheiro(a)',['disciplina','precisao','analise','resiliencia']],['Militar / segurança',['coragem','disciplina','justica','lealdade']],['Chef / gastronomia',['arte','sensualidade','disciplina','cuidado']],['Diplomata / mediador(a) / RH',['diplomacia','harmonia','justica','palavra']],['Explorador(a) / guia de turismo',['aventura','liberdade','coragem','versatilidade']],['Investidor(a) / mercado financeiro',['ambicao','estrategia','analise','poder']],['Jornalista',['palavra','curiosidade','justica','coragem']],['Ator / atriz',['palco','carisma','arte','sensibilidade']],['Vendedor(a) / negociador(a)',['palavra','carisma','estrategia','resiliencia']],['Líder espiritual / coach',['inspiracao','intuicao','servico','palavra']],['Administrador(a) / contador(a)',['disciplina','precisao','tradicao','analise']]];
const EVITA={liberdade:'funções de rotina rígida e horário travado — te prendem onde você precisa de espaço',aventura:'trabalhos parados, sem movimento nem novidade — o tédio te cansa antes do esforço',palco:'o bastidor anônimo, sem reconhecimento — você rende quando é visto',carisma:'papéis de isolamento, longe de gente — sua energia vem do contato',inovacao:'a burocracia do "sempre foi assim" — pedir que você não invente é pedir que não respire',rebeldia:'hierarquias engessadas que sufocam sua voz',poder:'a subordinação sem autonomia — mandar em nada te adoece',lideranca:'ficar eternamente executando ordens dos outros',arte:'ambientes frios e mecânicos, sem espaço para beleza',sensibilidade:'rotinas duras e impessoais que ignoram o lado humano',acao:'processos lentos e intermináveis — você quer resolver, não arrastar',impeto:'trabalhos que exigem esperar meses por um resultado',disciplina:'ambientes caóticos, sem regra nem previsibilidade',analise:'decisões no chute, sem tempo de pensar',intuicao:'funções puramente mecânicas que ignoram o seu faro'};
const MIDIA={
 filme:[['O Poderoso Chefão',['poder','estrategia','lealdade','ambicao']],['Cidadão Kane',['ambicao','poder','visao','misterio']],['O Senhor dos Anéis',['aventura','coragem','lealdade','sonho']],['Clube da Luta',['rebeldia','inovacao','intensidade']],['A Vida é Bela',['sensibilidade','otimismo','familia','resiliencia']],['Gladiador',['coragem','justica','poder','resiliencia']],['O Fabuloso Destino de Amélie Poulain',['arte','sonho','sensibilidade','intuicao']],['O Lobo de Wall Street',['ambicao','carisma','poder']],['Forrest Gump',['sinceridade','resiliencia','sonho','servico']],['Matrix',['visao','rebeldia','filosofia','inovacao']],['Coringa',['intensidade','rebeldia','arte','misterio']],['O Rei Leão',['lideranca','coragem','familia','poder']],['Comer Rezar Amar',['aventura','liberdade','sensibilidade','sonho']],['Rocky, Um Lutador',['resiliencia','coragem','disciplina']],['Interestelar',['visao','filosofia','coragem','sonho']],['O Discurso do Rei',['resiliencia','disciplina','palavra','servico']],['Uma Mente Brilhante',['analise','filosofia','resiliencia','misterio']],['Central do Brasil',['cuidado','sensibilidade','servico','resiliencia']]],
 livro:[['O Conde de Monte Cristo',['estrategia','justica','resiliencia','poder']],['Dom Casmurro',['misterio','arte','intensidade']],['Cem Anos de Solidão',['sonho','arte','familia','misterio']],['Grande Sertão: Veredas',['aventura','filosofia','coragem']],['O Pequeno Príncipe',['sensibilidade','sonho','filosofia','arte']],['1984',['visao','rebeldia','justica','intensidade']],['O Alquimista',['aventura','sonho','liberdade','inspiracao']],['A Arte da Guerra',['estrategia','disciplina','poder','analise']],['Orgulho e Preconceito',['palavra','carisma','harmonia','arte']],['Capitães da Areia',['coragem','lideranca','justica','resiliencia']],['Vidas Secas',['resiliencia','servico','disciplina']],['O Nome da Rosa',['analise','misterio','filosofia']],['A Hora da Estrela',['sensibilidade','sonho','arte']],['O Cortiço',['sensualidade','resiliencia','tradicao']],['Ensaio Sobre a Cegueira',['filosofia','resiliencia','justica','intensidade']],['O Diário de Anne Frank',['resiliencia','sensibilidade','coragem','sonho']],['Torto Arado',['tradicao','justica','familia','resiliencia']],['A Moreninha',['harmonia','arte','carisma','sonho']]],
 serie:[['Mad Men',['carisma','ambicao','palco','misterio']],['Breaking Bad',['poder','estrategia','ambicao','intensidade']],['The Crown',['poder','disciplina','tradicao','servico']],['Sherlock',['analise','misterio','filosofia','inovacao']],['Friends',['carisma','palavra','familia','harmonia']],['La Casa de Papel',['estrategia','rebeldia','coragem','carisma']],['Stranger Things',['aventura','coragem','sonho','lealdade']],['The Office',['palavra','carisma','servico','harmonia']],['Peaky Blinders',['poder','estrategia','coragem','ambicao']],['Anne with an E',['arte','sonho','sensibilidade','palavra']],['Vikings',['coragem','aventura','poder','lideranca']],['Dark',['misterio','filosofia','analise','intensidade']],['Grey\'s Anatomy',['cuidado','servico','intensidade','resiliencia']],['Ted Lasso',['otimismo','servico','carisma','harmonia']],['Cobra Kai',['disciplina','coragem','resiliencia','tradicao']],['Fleabag',['arte','intensidade','palavra','rebeldia']],['The Last of Us',['cuidado','resiliencia','coragem','lealdade']],['Round 6',['estrategia','resiliencia','intensidade','justica']]],
 novela:[['Renascer',['poder','resiliencia','familia','tradicao','lideranca']],['Avenida Brasil',['estrategia','justica','resiliencia','intensidade']],['Vale Tudo',['ambicao','justica','poder','intensidade']],['Tieta',['carisma','palco','liberdade','sensualidade']],['O Clone',['sonho','paixao','arte','intuicao']],['Gabriela',['sensualidade','liberdade','arte','tradicao']],['Rei do Gado',['poder','tradicao','familia','justica']],['Roque Santeiro',['carisma','palavra','rebeldia']],['Senhora do Destino',['familia','resiliencia','cuidado','justica']],['Terra Nostra',['paixao','tradicao','familia','sonho']],['A Favorita',['misterio','estrategia','intensidade']],['Império',['poder','ambicao','familia','justica']],['Cheias de Charme',['carisma','palco','arte','resiliencia']],['Caras e Bocas',['arte','sensibilidade','harmonia','sonho']],['Pantanal',['tradicao','familia','sensualidade','sonho']],['A Viagem',['misterio','intuicao','sensibilidade','justica']],['Laços de Família',['familia','cuidado','intensidade','resiliencia']],['O Bem-Amado',['carisma','palavra','estrategia','rebeldia']]],
 musica:[['Raul Seixas',['rebeldia','visao','filosofia','palco']],['Chico Buarque',['palavra','arte','justica','sensibilidade']],['Cartola',['arte','sensibilidade','resiliencia','sonho']],['Elis Regina',['palco','intensidade','arte','carisma']],['Tim Maia',['carisma','paixao','palco','liberdade']],['Cazuza',['rebeldia','paixao','palavra','intensidade']],['Legião Urbana',['rebeldia','filosofia','sensibilidade','justica']],['Roberto Carlos',['carisma','tradicao','paixao','palco']],['Gilberto Gil',['visao','arte','filosofia','liberdade']],['Marisa Monte',['arte','sensibilidade','intuicao','harmonia']],["Racionais MC's",['justica','coragem','rebeldia','palavra']],['Beethoven',['poder','visao','intensidade','disciplina']],['Rita Lee',['rebeldia','liberdade','carisma','arte']],['Djavan',['arte','sensibilidade','sonho','harmonia']],['Adoniran Barbosa',['tradicao','palavra','resiliencia','sensibilidade']],['Clara Nunes',['tradicao','paixao','palco','sensibilidade']],['Belchior',['filosofia','palavra','rebeldia','sonho']],['Ivete Sangalo',['carisma','palco','otimismo','liberdade']]]
};
const EPOCA=[['a Florença renascentista dos Médici',['visao','arte','poder','ambicao','inovacao'],'onde ideias novas, arte e engenharia explodiam ao mesmo tempo — e você seria mecenas e visionário, não figurante'],['a Grécia Antiga dos filósofos',['filosofia','analise','palavra','justica'],'discutindo a verdade na ágora, onde a palavra e o pensamento moviam o mundo'],['a Roma Imperial',['poder','ambicao','disciplina','lideranca'],'comandando legiões e erguendo impérios que atravessam séculos'],['a Belle Époque de Paris',['arte','carisma','palco','sensualidade'],'entre cafés, cabarés e salões, onde o charme e a arte eram moeda corrente'],['os anos 1960 da contracultura',['rebeldia','liberdade','visao','arte'],'no olho do furacão que reinventou a música, os costumes e o futuro'],['a Era das Grandes Navegações',['aventura','coragem','liberdade','resiliencia'],'cruzando oceanos rumo ao desconhecido, movido pela sede do horizonte'],['o Velho Oeste americano',['coragem','liberdade','justica','acao'],'onde a lei era a coragem e cada dia pedia uma decisão de peito aberto'],['a Era Vitoriana',['tradicao','disciplina','misterio','analise'],'entre salões, invenções e mistérios, onde a razão e a etiqueta reinavam'],['o Egito dos faraós',['misterio','poder','intuicao','tradicao'],'onde o sagrado e o poder se confundiam e os grandes nomes viravam eternos']];
const PAR={'Áries':['Leão','Sagitário','Câncer'],'Leão':['Áries','Sagitário','Touro'],'Sagitário':['Áries','Leão','Virgem'],'Touro':['Virgem','Capricórnio','Leão'],'Virgem':['Touro','Capricórnio','Sagitário'],'Capricórnio':['Touro','Virgem','Áries'],'Gêmeos':['Libra','Aquário','Peixes'],'Libra':['Gêmeos','Aquário','Capricórnio'],'Aquário':['Gêmeos','Libra','Touro'],'Câncer':['Escorpião','Peixes','Áries'],'Escorpião':['Câncer','Peixes','Leão'],'Peixes':['Câncer','Escorpião','Gêmeos']};
const CHAR={'Áries':['Capitão Rodrigo','o guerreiro galante de "O Tempo e o Vento" — coragem, honra e um sorriso desafiador.'],'Touro':['Gabriela','a de cravo e canela — sensual, livre e enraizada na terra, dona do próprio compasso.'],'Gêmeos':['Macunaíma','o herói de mil caras — malandro, curioso e impossível de rotular.'],'Câncer':['Dona Flor','que ama com o corpo e a alma, equilibrando ternura e paixão entre dois mundos.'],'Leão':['Tieta','magnética e triunfal, ela volta para casa e faz a cidade inteira girar ao seu redor.'],'Virgem':['Policarpo Quaresma','o idealista meticuloso, que ama o Brasil com o rigor de quem cuida de cada detalhe.'],'Libra':['Bentinho','de "Dom Casmurro" — encantador, elegante e eternamente às voltas com as duas mãos da balança.'],'Escorpião':['Capitu','dos olhos de ressaca — enigmática, intensa e inesquecível.'],'Sagitário':['Riobaldo','o jagunço-filósofo de "Grande Sertão" — sempre a caminho, sempre buscando o sentido.'],'Capricórnio':['Pedro Bala','o líder dos "Capitães da Areia" — nascido para comandar e sobreviver a qualquer maré.'],'Aquário':['Capitão Nascimento','indomável e à frente do seu tempo, fiel apenas ao próprio código.'],'Peixes':['Macabéa','a sonhadora de "A Hora da Estrela" — frágil, poética e cheia de um mundo secreto.']};
const SOBRENOME={'silva':'do latim para "floresta, mata" — a família da selva, das raízes fincadas na terra. É o sobrenome mais comum do país: você faz parte da espinha dorsal do Brasil.','santos':'de devoção religiosa, "dos santos" — nome de quem se colocava sob a proteção do sagrado. Carrega fé e tradição.','oliveira':'toponímico, da oliveira — a árvore da paz e da abundância. Sinal de raízes serenas e frutíferas.','souza':'toponímico, ligado às margens de um rio em Portugal. Fala de origem, terra e pertencimento.','sousa':'toponímico, ligado às margens de um rio em Portugal. Fala de origem, terra e pertencimento.','ferreira':'do "ferreiro" ou da terra rica em ferro — a família do trabalho duro e do metal que se dobra pela força.','pereira':'toponímico, da pereira — árvore que dá fruto. Nome de quem vem de terra fértil.','costa':'toponímico, de quem vivia junto à costa ou à encosta. Gente de fronteira entre a terra e o mar.','rodrigues':'patronímico, "filho de Rodrigo" — do germânico "senhor glorioso, poderoso". Linhagem de comando.','almeida':'toponímico de origem árabe ("a mesa", planalto) — nome nobre, de quem vem de terras altas.','nascimento':'de devoção, ligado ao Natal e ao nascer — nome de recomeço, de vida que chega.','lima':'toponímico, do rio Lima em Portugal — "o rio do esquecimento" dos antigos. Um nome com lenda.','araujo':'toponímico, de uma antiga região portuguesa. Nome de linhagem e de terra.','gomes':'patronímico medieval, ligado a "homem" — do germânico "guma". Nome antigo de linhagem.','ribeiro':'toponímico, de quem morava junto ao ribeiro, ao pequeno rio. Gente das águas correntes.','carvalho':'toponímico, do carvalho — a árvore da força e da longevidade. Símbolo de solidez.','gonçalves':'patronímico, "filho de Gonçalo" — do germânico "salvo em combate". Sangue de guerreiro.','martins':'patronímico, "filho de Martim" — ligado a Marte, o deus da guerra. Nome de coragem.','jorgetto':'de origem italiana, diminutivo ligado a "Giorgio" (Jorge), do grego para "aquele que trabalha a terra". O sufixo -etto é o carinho do "pequeno Jorge", o herdeiro que leva o nome adiante.','casteller':'de raiz ligada a "castelo, castelão" — o nome de quem guardava ou habitava a fortaleza. Fala de proteção e de posição.'};
const UFS=[['AC','Acre'],['AL','Alagoas'],['AP','Amapá'],['AM','Amazonas'],['BA','Bahia'],['CE','Ceará'],['DF','Distrito Federal'],['ES','Espírito Santo'],['GO','Goiás'],['MA','Maranhão'],['MT','Mato Grosso'],['MS','Mato Grosso do Sul'],['MG','Minas Gerais'],['PA','Pará'],['PB','Paraíba'],['PR','Paraná'],['PE','Pernambuco'],['PI','Piauí'],['RJ','Rio de Janeiro'],['RN','Rio Grande do Norte'],['RS','Rio Grande do Sul'],['RO','Rondônia'],['RR','Roraima'],['SC','Santa Catarina'],['SP','São Paulo'],['SE','Sergipe'],['TO','Tocantins']];
const REGIAO={'SP':'Terra do "mano", do "da hora" e do "mó". A Galeria do Rock, a Rua Augusta e as tardes no Playcenter fazem parte do seu DNA paulistano.','MG':'Terra do "uai", do "trem bom" e do "sô". Pão de queijo quentinho, tutu de feijão e a fé no Galo ou na Raposa correm no seu sangue mineiro.','SC':'Terra do "bah", do "tchê" e do "tri legal". Chimarrão na roda, o mar de Morro dos Conventos e o vento frio do Sul temperam o seu jeito catarinense.','RS':'Terra do "bah tchê" e do mate amargo. Churrasco, chimarrão e o orgulho gaúcho moldam o seu jeito.','BA':'Terra do axé, do dendê e do "meu rei". O tempero baiano, o acarajé e o ritmo no corpo são a sua marca.','PE':'Terra do frevo, do maracatu e do "visse". O Recife, o Carnaval de rua e o caldo de cana fazem parte de você.','RJ':'Terra do "maneiro", da praia e do samba. O calor carioca e o jeito solto de levar a vida são a sua assinatura.'};
function regiao(uf){return REGIAO[uf]||'Cada canto do Brasil tem seu tempero — e o seu carrega o sotaque, a comida e as histórias da sua terra natal.';}
function presidente(y){const t=[[1940,1945,'Getúlio Vargas'],[1946,1950,'Eurico Gaspar Dutra'],[1951,1953,'Getúlio Vargas'],[1954,1955,'Café Filho'],[1956,1960,'Juscelino Kubitschek'],[1961,1961,'Jânio Quadros / João Goulart'],[1962,1963,'João Goulart'],[1964,1966,'Castelo Branco'],[1967,1968,'Costa e Silva'],[1969,1973,'Emílio Médici'],[1974,1978,'Ernesto Geisel'],[1979,1984,'João Figueiredo'],[1985,1989,'José Sarney'],[1990,1991,'Fernando Collor'],[1992,1994,'Itamar Franco'],[1995,2002,'Fernando Henrique Cardoso'],[2003,2010,'Lula'],[2011,2012,'Dilma Rousseff']];for(const[a,b,n]of t)if(y>=a&&y<=b)return n;return'—';}

/* ===================== HELPERS DE PERFIL ===================== */
function buildTags(c){
  const comps=[{label:c.signo,kind:'signo',tags:SIGNO[c.signo].tags},{label:'Caminho '+c.lp,kind:'num',tags:NUM[c.lp].tags},{label:'Expressão '+c.exp,kind:'exp',tags:(NUM[c.exp]||{tags:[]}).tags},{label:'Alma '+c.alma,kind:'alma',tags:(NUM[c.alma]||{tags:[]}).tags},{label:'Personalidade '+c.persona,kind:'persona',tags:(NUM[c.persona]||{tags:[]}).tags},{label:c.animal,kind:'animal',tags:ANIMAL[c.animal].tags},{label:c.elemento,kind:'elem',tags:ELEM[c.elemento]}];
  /* PESOS — decisão deliberada, não herdada:
     3 caminho de vida (data inteira)  2 signo  2 alma (vogais do nome completo)
     1 expressão (primeiro nome)  1 personalidade  1 animal  1 elemento
     A Alma pesa 2 porque é o número de nome mais determinante na tradição pitagórica;
     a Personalidade é leitura de superfície e pesa 1. Antes desta mudança o sobrenome
     não entrava em NENHUM cálculo: Maria Silva e Maria Nascimento do mesmo dia eram idênticas. */
  const PESO={num:3,signo:2,alma:2,exp:1,persona:1,animal:1,elem:1};
  const w={};comps.forEach(cp=>{const wt=PESO[cp.kind]||1;cp.tags.forEach(t=>{w[t]=(w[t]||0)+wt;});});
  return {comps,w};
}
function topTags(w,n){return Object.keys(w).sort((a,b)=>w[b]-w[a]).slice(0,n);}
function attribute(itemTags,comps,max){const seen=[];['signo','animal','num','alma','exp','persona','elem'].forEach(kind=>{const cp=comps.find(x=>x.kind===kind&&x.tags.some(t=>itemTags.includes(t)));if(cp)seen.push(cp.label);});return seen.slice(0,max||3);}
function score(itemTags,w){return itemTags.reduce((s,t)=>s+(w[t]||0),0);}
function phrase(labels){if(!labels.length)return 'o seu conjunto de astros';if(labels.length===1)return labels[0];if(labels.length===2)return labels[0]+' e '+labels[1];return labels.slice(0,-1).join(', ')+' e '+labels[labels.length-1];}
// escolha VARIADA: determinística por pessoa, mas diferente entre pessoas
/* Desempate estável: só decide entre itens com nota EXATAMENTE igual.
   Determinístico por pessoa, e sem favorecer quem vem primeiro na tabela. */
function desempate(rotulo,seed){
  let h=(seed>>>0)||1;
  for(let i=0;i<rotulo.length;i++){h^=rotulo.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}
  return h>>>0;
}

/* A escolha é ARGMAX da análise, não sorteio dentro de uma faixa.
   O fator de normalização (FATOR_MIDIA) corrige a assimetria das tabelas —
   mesma técnica já usada nas 13 almas. Sem ele, poucos títulos dominariam.
   O acaso só entra em empate exato, e mesmo aí é fixo para a pessoa. */
function pickMedia(list,w,comps,seed,off,fat){
  const sc=list.map(([t,tags])=>({t,tags,s:score(tags,w)*((fat&&fat[t])||1)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s);
  if(!sc.length)return {titulo:list[0][0].replace(/^!\[|\]$/g,''),why:attribute(list[0][1],comps,3)};
  const max=sc[0].s;
  const empatados=sc.filter(x=>Math.abs(x.s-max)<1e-9);
  const ch=empatados.length===1?empatados[0]:empatados.sort((a,b)=>desempate(a.t,seed)-desempate(b.t,seed))[0];
  return {titulo:ch.t.replace(/^!\[|\]$/g,''),why:attribute(ch.tags,comps,3)};
}
/* As 5 profissões são simplesmente as 5 mais bem pontuadas depois da normalização.
   Antes, 3 das 5 vinham de um embaralhamento das posições 3 a 8. */
function pickProfs(w,comps,seed,fat){
  const sc=PROF.map(p=>({n:p[0],tags:p[1],s:score(p[1],w)*((fat&&fat[p[0]])||1)})).filter(x=>x.s>0)
    .sort((a,b)=>(b.s-a.s)||(desempate(a.n,seed)-desempate(b.n,seed)));
  return sc.slice(0,5).map(p=>({nome:p.n,why:attribute(p.tags,comps,3)}));
}
/* Fatores de normalização das tabelas — gerados por calibrar-midia.mjs.
   Existem para que a escolha possa ser ARGMAX puro sem que poucos títulos
   dominem. Mexeu em MIDIA, PROF, etiqueta ou peso? Rode o script de novo. */
const FATOR_MIDIA={"1984":1.381,"O Poderoso Chefão":1.023,"Cidadão Kane":0.842,"O Senhor dos Anéis":1.559,"Clube da Luta":3.388,"A Vida é Bela":0.962,"Gladiador":0.932,"O Fabuloso Destino de Amélie Poulain":0.584,"O Lobo de Wall Street":0.835,"Forrest Gump":1.325,"Matrix":1.528,"Coringa":0.976,"O Rei Leão":0.84,"Comer Rezar Amar":0.724,"Rocky, Um Lutador":0.915,"Interestelar":1.441,"O Discurso do Rei":0.732,"Uma Mente Brilhante":0.604,"Central do Brasil":0.717,"O Conde de Monte Cristo":0.875,"Dom Casmurro":1.282,"Cem Anos de Solidão":1.065,"Grande Sertão: Veredas":1.319,"O Pequeno Príncipe":0.877,"O Alquimista":0.829,"A Arte da Guerra":0.963,"Orgulho e Preconceito":0.658,"Capitães da Areia":0.962,"Vidas Secas":0.928,"O Nome da Rosa":0.768,"A Hora da Estrela":0.921,"O Cortiço":1.127,"Ensaio Sobre a Cegueira":1.325,"O Diário de Anne Frank":1.198,"Torto Arado":0.984,"A Moreninha":0.898,"Mad Men":1.109,"Breaking Bad":1.033,"The Crown":0.743,"Sherlock":0.99,"Friends":1.02,"La Casa de Papel":1.667,"Stranger Things":1.337,"The Office":0.98,"Peaky Blinders":1.03,"Anne with an E":0.6,"Vikings":0.832,"Dark":1.058,"Grey's Anatomy":0.835,"Ted Lasso":1.193,"Cobra Kai":0.628,"Fleabag":1.002,"The Last of Us":1.206,"Round 6":1.293,"Renascer":0.644,"Avenida Brasil":1.394,"Vale Tudo":0.854,"Tieta":1.014,"O Clone":0.844,"Gabriela":0.845,"Rei do Gado":1.044,"Roque Santeiro":1.512,"Senhora do Destino":0.965,"Terra Nostra":1.546,"A Favorita":1.164,"Império":0.863,"Cheias de Charme":0.831,"Caras e Bocas":0.7,"Pantanal":1.49,"A Viagem":0.724,"Laços de Família":1.004,"O Bem-Amado":1.209,"Raul Seixas":1.192,"Chico Buarque":0.771,"Cartola":0.792,"Elis Regina":0.987,"Tim Maia":1.225,"Cazuza":1.854,"Legião Urbana":0.992,"Roberto Carlos":1.199,"Gilberto Gil":0.845,"Marisa Monte":0.734,"Racionais MC's":1.229,"Beethoven":0.634,"Rita Lee":0.907,"Djavan":0.879,"Adoniran Barbosa":0.718,"Clara Nunes":1.197,"Belchior":1.326,"Ivete Sangalo":1.173};
const FATOR_PROF={"Empreendedor(a) / fundador(a)":1.115,"Advogado(a) / promotor(a)":1.044,"Executivo(a) / CEO":0.752,"Publicidade / marketing":0.836,"Político(a) / líder de causa":0.955,"Palestrante / criador(a) de conteúdo":1.074,"Médico(a) / enfermeiro(a)":0.853,"Professor(a) / educador(a)":0.896,"Psicólogo(a) / terapeuta":0.784,"Artista / músico(a)":0.896,"Escritor(a) / roteirista":0.995,"Designer / arquiteto(a)":0.96,"Cientista / pesquisador(a)":1.28,"Engenheiro(a)":0.896,"Militar / segurança":1.421,"Chef / gastronomia":0.895,"Diplomata / mediador(a) / RH":1.671,"Explorador(a) / guia de turismo":0.895,"Investidor(a) / mercado financeiro":0.959,"Jornalista":1.638,"Ator / atriz":0.767,"Vendedor(a) / negociador(a)":1.023,"Líder espiritual / coach":1.008,"Administrador(a) / contador(a)":0.96};
const WHYTPL=['combina com','fala direto com','tem a cara de','ecoa','é a trilha de'];

const SUPER={poder:'transformar "impossível" em cronograma',lideranca:'fazer uma sala inteira te seguir sem pedir',palavra:'convencer qualquer um em três frases',carisma:'iluminar o ambiente só de entrar',coragem:'agir enquanto os outros ainda pensam',acao:'resolver hoje o que os outros adiam pra amanhã',analise:'enxergar o padrão que ninguém viu',intuicao:'sentir a verdade antes de ela ser dita',sensibilidade:'entender as pessoas por dentro',arte:'transformar sentimento em beleza',disciplina:'terminar o que todo mundo desistiu',resiliencia:'levantar mais forte depois de cada queda',estrategia:'ganhar o jogo três lances antes',liberdade:'achar a saída onde só há paredes',aventura:'transformar qualquer dia comum em história',cuidado:'fazer qualquer um se sentir em casa',visao:'ver o futuro chegando antes de todo mundo',inovacao:'inventar a saída que ninguém tinha pensado',ambicao:'mirar alto e não parar até chegar lá',justica:'defender quem precisa sem pensar duas vezes'};
const KRYP={poder:'delegar de verdade e deixar alguém entrar no comando',lideranca:'aceitar seguir quando não é a sua vez de liderar',palavra:'ouvir tanto quanto você fala',carisma:'o silêncio e a falta de reconhecimento',coragem:'ter paciência com quem é mais lento',acao:'esperar sem se irritar',analise:'aceitar que "bom" às vezes já basta',intuicao:'confiar nos fatos quando o coração grita o contrário',sensibilidade:'não levar tudo para o lado pessoal',arte:'lidar com a parte burocrática e chata da vida',disciplina:'relaxar as próprias regras de vez em quando',resiliencia:'pedir ajuda antes de esgotar',estrategia:'agir pelo impulso e confiar no acaso',liberdade:'compromissos longos e portas fechadas',aventura:'a rotina e a repetição do dia a dia',cuidado:'cuidar de si com o mesmo carinho que dá aos outros',visao:'ter paciência com quem ainda não enxerga o que você vê',inovacao:'as regras sem sentido e o "sempre foi assim"',ambicao:'lembrar que o que você vale não é o que você conquista',justica:'aceitar que nem tudo tem conserto'};
function sintese(tt){const map={poder:'quer construir algo que dure',lideranca:'assume a frente naturalmente',visao:'enxerga longe',palavra:'convence pela conversa',arte:'cria beleza onde passa',coragem:'não recua de um desafio',cuidado:'protege quem ama',liberdade:'não nasceu pra ficar preso',intuicao:'sente antes de entender',disciplina:'termina o que começa',aventura:'vive em movimento',estrategia:'pensa alguns lances à frente',sensibilidade:'sente o mundo em alta definição',ambicao:'mira alto sem pedir desculpa',carisma:'atrai gente sem esforço',rebeldia:'questiona o que os outros aceitam',analise:'entende o que está por trás',resiliencia:'não desiste fácil',inovacao:'inventa caminhos novos',impeto:'age antes que a dúvida chegue',justica:'não deixa barato o que é errado'};return tt.map(t=>map[t]||'deixa marca por onde passa').join(', ')+' — e deixa marca por onde passa';}
function sombra(tt){const map={poder:'Quando aperta, você tende a querer controlar tudo sozinho — e esquece de deixar alguém entrar no comando.',lideranca:'Você lidera com facilidade, mas às vezes carrega peso demais que podia ser dividido.',liberdade:'Sua sede de espaço é linda, mas pode virar fuga bem na hora de fincar raiz.',aventura:'Seu apetite por novidade às vezes deixa o que já é bom para trás cedo demais.',sensibilidade:'Você sente tanto que corre o risco de levar para o pessoal o que nem era com você.',intuicao:'Confia tanto no instinto que às vezes ignora os fatos que insistem em avisar.',analise:'Seu olho afiado pode virar autocrítica — o "bom" te escapa em busca do "perfeito".',intensidade:'Você ama e defende com tudo, mas esquecer e perdoar é o seu treino desta vida.',ambicao:'A meta te move, mas cuidado pra não confundir o que você conquista com o que você vale.',disciplina:'Sua firmeza é rara — só não deixe as próprias regras te aprisionarem.',rebeldia:'Você questiona tudo, e às vezes briga com regras que até jogavam a seu favor.',carisma:'Você encanta fácil — o desafio é deixar as pessoas verem quem você é por baixo do brilho.',arte:'Sua sensibilidade cria beleza, mas pode te fazer fugir do lado prático que a vida cobra.',acao:'Sua pressa resolve muita coisa — só cuidado pra não atropelar o que pedia calma.',justica:'Seu senso de certo é forte — só cuidado pra não virar dureza com quem erra.'};return tt.map(t=>map[t]).filter(Boolean)[0]||'Seu maior aprendizado é equilibrar a força que te move com a leveza de deixar a vida acontecer.';}

/* ===== FRASE "CERTEIRA" DA PRÉVIA (efeito Barnum calibrado) =====
   Derivada do tag dominante do perfil. Duas variações por tag, escolhidas
   pela semente — a mesma pessoa vê sempre a mesma; pessoas diferentes veem
   frases diferentes. Objetivo: o arrepio ANTES do preço. */
const BARNUM={
 poder:['Você já foi chamado de “controlador” por gente que não tinha ideia do peso que você estava segurando sozinho.','Delegar te dá mais trabalho do que fazer — e você sabe que isso um dia vai te cobrar caro.'],
 lideranca:['Você já assumiu a frente de alguma coisa sem ninguém pedir, e depois se perguntou por que sempre sobra pra você.','Em qualquer grupo, você percebe rápido demais quando ninguém está conduzindo — e o silêncio te incomoda até você agir.'],
 ambicao:['Você conquista uma coisa e leva mais ou menos dois dias para se sentir insatisfeito de novo.','Existe uma versão sua de dez anos à frente que você persegue em silêncio, sem contar pra quase ninguém.'],
 visao:['Você já explicou uma ideia e ouviu “não vai dar certo” de gente que, três anos depois, estava fazendo exatamente aquilo.','Você enxerga o final de algumas histórias no começo — e cansa de esperar os outros chegarem lá.'],
 inovacao:['Frases como “sempre foi assim” causam em você uma irritação física, quase involuntária.','Você já reinventou do zero uma coisa que estava funcionando, só porque dava pra ser melhor.'],
 rebeldia:['Você obedece regras que fazem sentido e trava com as que não fazem — e isso já te custou alguma coisa.','Te dizerem “porque sim” funciona com você exatamente ao contrário.'],
 palavra:['As pessoas te contam coisas que não deviam contar — e você nem precisou perguntar.','Você já ganhou uma discussão e saiu com a sensação estranha de que talvez não devesse ter ganhado.'],
 carisma:['Você entra num lugar e sente o clima mudar — e finge que não percebeu.','Muita gente acha que te conhece bem. Pouquíssimas conhecem.'],
 palco:['Você diz que não liga para reconhecimento, mas lembra com precisão da última vez que passou despercebido.','Quando você fala, as pessoas param — e isso te agrada mais do que você admite em voz alta.'],
 coragem:['Você já tomou uma decisão grande no impulso e, olhando pra trás, faria de novo.','Enquanto os outros pesam prós e contras, você já está do outro lado — às vezes cedo demais.'],
 acao:['Esperar te cansa mais do que trabalhar.','Você prefere resolver errado hoje do que resolver certo daqui a um mês.'],
 impeto:['Você já mandou uma mensagem que releu depois e pensou: podia ter esperado uma hora.','Sua primeira reação costuma ser a verdadeira — e a segunda, a educada.'],
 analise:['Você já reescreveu três vezes uma mensagem de duas linhas.','“Bom o suficiente” é uma expressão que você entende, mas não sente.'],
 estrategia:['Você já sabia o final daquela situação semanas antes de ela acontecer — e não falou nada.','Você guarda informação não por segredo, mas porque sabe que a hora certa vale mais.'],
 disciplina:['Você termina o que começou mesmo quando já perdeu a vontade — e chama isso de caráter.','Suas próprias regras já te prenderam mais do que qualquer chefe.'],
 resiliencia:['Você já se levantou de uma coisa que teria derrubado gente que você conhece — e quase ninguém soube.','Você pede ajuda tarde. Sempre tarde demais.'],
 intuicao:['Você já soube que uma pessoa não prestava antes de ter um único motivo concreto — e estava certo.','Quando o instinto e os fatos brigam dentro de você, o instinto costuma ganhar. E costuma acertar.'],
 sensibilidade:['Você já levou pro pessoal uma coisa que nem era com você — e ficou dias com aquilo.','Você sente o humor dos outros entrando em você, como se fosse seu.'],
 arte:['Você repara em detalhes de beleza que as pessoas ao seu lado simplesmente não veem.','Ambientes feios e frios te esgotam de um jeito que você tem dificuldade de explicar.'],
 sonho:['Você tem uma vida inteira acontecendo na sua cabeça que quase ninguém conhece.','Você já se pegou emocionado com uma cena que nem chegou a acontecer.'],
 misterio:['As pessoas te acham difícil de ler — e você deixa que achem.','Você conta a sua história em pedaços, e escolhe com cuidado quem recebe cada um.'],
 intensidade:['Você já foi chamado de “intenso demais” — e no fundo achou graça.','Você não sente as coisas pela metade. Nunca conseguiu.'],
 cuidado:['Você cuida de todo mundo e trava na hora de aceitar que cuidem de você.','Você lembra de datas, alergias e manias dos outros — e ninguém lembra das suas.'],
 familia:['Você mede as suas decisões grandes pelo efeito que elas teriam em duas ou três pessoas específicas.','Tem uma pessoa da sua família que você protege sem nunca ter combinado isso com ninguém.'],
 servico:['Você diz “sim” antes de conferir se tem tempo — e depois dá um jeito.','Você se sente estranhamente culpado quando descansa.'],
 justica:['Você não consegue deixar passar uma injustiça pequena, mesmo quando ela não é sua.','Você já brigou por alguém que nem ficou sabendo.'],
 liberdade:['Você já recusou uma coisa boa só porque vinha com corrente junto.','A ideia de dever satisfação a alguém te sufoca mais do que a própria obrigação.'],
 aventura:['A rotina te dá um cansaço que o esforço nunca deu.','Você já mudou de rumo sem plano B e se saiu bem — o que só piorou o hábito.'],
 versatilidade:['Você é bom em coisas demais, e isso já te atrapalhou na hora de escolher uma.','As pessoas te descrevem de formas completamente diferentes umas das outras. Todas estão certas.'],
 filosofia:['Você tem perguntas que carrega há anos e nunca falou em voz alta.','Você já perdeu uma noite de sono com um pensamento que não tinha nenhuma urgência prática.'],
 tradicao:['Você guarda um objeto sem valor nenhum só porque foi de alguém.','Você respeita o que veio antes — e desconfia de quem quer jogar tudo fora.'],
 diplomacia:['Você percebe uma tensão na sala antes de qualquer palavra ser dita, e já está calculando como desarmar.','Você absorve o desconforto dos outros para o ambiente ficar em paz. E raramente alguém faz isso por você.'],
 harmonia:['Você adia conversas difíceis mais tempo do que devia, esperando que se resolvam sozinhas.','Um clima ruim no ambiente estraga o seu dia inteiro.'],
 precisao:['Um detalhe torto na tela te incomoda até você arrumar.','Você já refez um trabalho inteiro por causa de uma coisa que ninguém teria notado.'],
 generosidade:['Você dá mais do que pode e chama isso de normal.','Você já ficou sem para alguém não ficar sem — e não contou pra ninguém.'],
 lealdade:['Você tem pouquíssimas pessoas de verdade, e por elas você faz qualquer coisa.','Traição é a única coisa que você não consegue relevar.'],
 otimismo:['Você acha jeito onde os outros já desistiram — e às vezes te chamam de ingênuo por isso.','Você segura o astral de gente que nem sabe que você está segurando.'],
 sensualidade:['Você repara em textura, cheiro e sabor mais do que a maioria das pessoas ao seu redor.','Prazer, pra você, nunca foi supérfluo.'],
 curiosidade:['Você já passou quarenta minutos pesquisando uma coisa que não tinha a menor importância.','Você começa mais coisas do que termina — e não é preguiça, é apetite.'],
 esperteza:['Você sempre acha a saída, mesmo quando a porta está fechada.','Você percebe a intenção por trás do que as pessoas falam, não o que elas falam.'],
 sinceridade:['Você é péssimo em fingir que gostou.','As pessoas te procuram quando querem a verdade, e evitam você quando querem consolo.'],
 franqueza:['Você já falou uma verdade necessária na hora errada.','Sua sinceridade já foi confundida com falta de educação por gente que não te conhece.'],
 inspiracao:['Você já mudou o rumo de alguém com uma frase que nem lembra ter dito.','As pessoas saem de perto de você com mais vontade de fazer as coisas.'],
 crescimento:['Você não consegue ficar dois anos sendo a mesma pessoa.','Você mede a sua vida pelo quanto aprendeu, não pelo quanto acumulou.'],
 etica:['Você já perdeu uma oportunidade por não conseguir passar por cima de alguém.','Existe uma linha que você não cruza, mesmo quando ninguém está vendo.'],
 estabilidade:['Você precisa de chão firme para arriscar — e as pessoas confundem isso com medo.','Você é a pessoa em quem os outros se apoiam quando tudo balança.'],
 paixao:['Você não sabe se envolver pela metade em nada que importe.','Quando você quer, você quer inteiro — e isso já assustou alguém.'],
 independencia:['Você prefere carregar sozinho a dever favor.','Você aprendeu cedo que contar com você mesmo dava menos decepção.'],
 sobrevivencia:['Você já se virou em situação que gente com mais recurso não teria aguentado.','Você tem um instinto pra perigo que os outros só entendem depois.']
};
function barnumFrase(c,tt,seed){
  for(const t of tt){
    if(BARNUM[t]){const par=BARNUM[t];return par[(seed+c.lp)%par.length];}
  }
  return 'Você é mais complicado do que a maioria das pessoas percebe — e mais simples do que você mesmo acha.';
}

function analisaSobrenome(nomeCompleto){
  const parts=nomeCompleto.trim().split(/\s+/).filter(p=>!/^(de|da|do|das|dos|e)$/i.test(p));
  const sobs=parts.slice(1);
  for(let i=sobs.length-1;i>=0;i--){const key=stripAccents(sobs[i]).toLowerCase();if(SOBRENOME[key])return {nome:cap(sobs[i]),texto:SOBRENOME[key],nivel:1};}
  if(sobs.length){
    const raw=sobs[sobs.length-1];const k=stripAccents(raw).toLowerCase();let cl=null;
    if(/(es|ez)$/.test(k))cl='é um sobrenome patronímico — dos que nasceram de "filho de", carregando o nome do antepassado como herança e continuidade.';
    else if(/(etto|elli|ini|ato|oni|azzo|ucci)$/.test(k))cl='carrega a raiz das famílias italianas que cruzaram o oceano e trouxeram uma história que não se repete em cada esquina.';
    else if(/(ski|czak|wicz|czyk)$/.test(k))cl='guarda a marca das famílias eslavas (polonesas, ucranianas) que ajudaram a colonizar o Sul do Brasil.';
    else if(/(eira|oso|osa|al|edo)$/.test(k))cl='é um sobrenome toponímico — dos que nasceram do lugar, da árvore ou da paisagem de origem da família. Fala de raízes fincadas numa terra.';
    else if(/(inho|inha)$/.test(k))cl='traz o diminutivo afetuoso, o "pequeno" que virou nome de família — sinal de uma linhagem contada com carinho.';
    if(cl)return {nome:cap(raw),texto:cl,nivel:2};
    return {nome:cap(raw),texto:'é um sobrenome raro no Brasil — dos que quase ninguém divide com você. Nomes assim guardam histórias de família que não se repetem em cada esquina, e combinam com quem nunca foi feito para ser mais um na multidão.',nivel:3};
  }
  return null;
}

/* ===== A SUA RAIZ BRASILEIRA (13 arquétipos) =====
   Aparece na prévia gratuita: é o elemento que nenhum outro site tem.
   [nome, artigo, valor, tags, texto] */
const RAIZ = [
  ['Malandro','do','Astúcia',['esperteza','versatilidade','carisma','sobrevivencia','estrategia'],
   'Você acha a saída quando a porta está fechada. Não por sorte: você lê a situação antes dela acontecer, e sabe que jeitinho bem-dado é uma forma de inteligência. O risco é confiar tanto na improvisação que você deixa de construir o que dá trabalho.',0.694],
  ['Cangaceiro','do','Coragem',['coragem','rebeldia','lideranca','poder','justica','impeto'],
   'Você não abaixa a cabeça para quem não merece. Quando algo te parece injusto, você age — e arrasta gente com você, mesmo sem ter pedido para liderar. A conta vem no cansaço de quem nunca se permite recuar.',0.4879],
  ['Benzedeira','da','Cura',['cuidado','intuicao','sensibilidade','servico','generosidade'],
   'As pessoas saem de perto de você mais leves do que chegaram, e quase nunca sabem explicar por quê. Você sente o que não foi dito e cuida antes de ser chamado. O que falta é lembrar que você também precisa de colo.',0.3767],
  ['Tropeiro','do','Adaptação',['aventura','resiliencia','versatilidade','independencia','liberdade'],
   'Você se ajusta a qualquer terreno e não perde o rumo por causa de imprevisto. Estrada nova não te assusta: te acorda. O perigo é seguir viagem para não ter que ficar e resolver.',0.3769],
  ['Vaqueiro','do','Perseverança',['disciplina','resiliencia','estabilidade','etica','sobrevivencia','lealdade'],
   'Você termina o que começa mesmo depois que a vontade acabou. Não faz barulho, não pede plateia, e é em você que os outros se apoiam quando tudo balança. O preço é aguentar mais do que devia antes de pedir ajuda.',0.5037],
  ['Capoeirista','do','Equilíbrio',['harmonia','diplomacia','esperteza','crescimento','acao'],
   'Você desarma tensão com jogo de corpo, não com força. Sabe recuar para avançar melhor, e transforma conflito em movimento. Quem não te conhece confunde a sua ginga com falta de posição.',0.8833],
  ['Caipira Sábio','do','Simplicidade',['filosofia','tradicao','sinceridade','estabilidade','familia'],
   'Você desconfia de conversa complicada e acerta com frases curtas. Aprendeu com quem veio antes e não tem pressa de jogar fora o que funciona. Às vezes o mundo te chama de atrasado justamente quando você está certo.',0.7232],
  ['Artesã','da','Criatividade',['arte','precisao','inovacao','analise','sonho'],
   'Você repara no detalhe que ninguém vê e não descansa até ele ficar no lugar. Faz com a mão o que a maioria só imagina. A armadilha é refazer para sempre uma coisa que já estava boa.',0.6476],
  ['Pescador','do','Paciência',['analise','misterio','intuicao','precisao','estabilidade'],
   'Você sabe esperar o tempo certo e desconfia de pressa. Observa muito antes de agir, e quando age raramente erra. Mas há coisas na sua vida que estão esperando há tempo demais.',0.5471],
  ['Mateiro','do','Exploração',['curiosidade','aventura','visao','ambicao','coragem'],
   'Você entra onde não tem trilha e volta sabendo o caminho. Enxerga o fim da história quando os outros ainda estão no começo, e cansa de esperar que cheguem lá. O difícil é aceitar companhia num ritmo mais lento que o seu.',0.7009],
  ['Carnavalesco','do','Alegria e conexão',['palco','carisma','otimismo','sensualidade','inspiracao'],
   'Você entra num lugar e o clima muda. Junta gente que não se conhecia e faz parecer fácil, quando é trabalho. Poucos percebem quanto você segura por dentro para manter a festa de pé.',0.7832],
  ['Repentista','do','A palavra',['palavra','franqueza','inspiracao','esperteza','palco'],
   'Você responde antes de pensar e acerta. A palavra é a sua arma e o seu abrigo, e você já mudou o rumo de alguém com uma frase que nem lembra ter dito. O outro lado é a verdade que sai na hora errada.',1],
  ['Seresteiro','do','Saudade',['sensibilidade','paixao','arte','sonho','intensidade'],
   'Você sente as coisas inteiras, nunca pela metade, e guarda com cuidado o que já passou. Transforma falta em beleza. Mas há uma diferença entre honrar a saudade e morar dentro dela.',0.4946]
];

function escolherRaiz(w,seed){
  // o fator (índice 5) equaliza a distribuição. RECALIBRADO sobre 15.600 perfis
  // depois que Alma e Personalidade entraram no buildTags: com os fatores antigos
  // o Repentista saltava para 19,4%. Agora a faixa é 7,0% a 8,6%.
  // Mexeu em etiqueta, peso ou tabela? Rode calibrar.mjs de novo.
  const notas=RAIZ.map(r=>[r,r[3].reduce((s,t)=>s+(w[t]||0),0)*r[5]]);
  const max=Math.max(...notas.map(n=>n[1]));
  // empate é comum: a semente decide, sempre igual para a mesma pessoa
  const pool=notas.filter(n=>Math.abs(n[1]-max)<1e-9).map(n=>n[0]);
  return pool[seed%pool.length];
}


/* ===== POR QUE ESTE ARQUÉTIPO ===== 
   Nomeia os traços que levaram à escolha e de onde cada um veio.
   Cita no máximo dois: três já viram relatório e matam o efeito. */
const SUBST={
 acao:'a pressa de resolver',ambicao:'a ambição',analise:'o rigor',arte:'o olhar para a beleza',
 aventura:'o gosto pela estrada',carisma:'o carisma',coragem:'a coragem',crescimento:'a inquietação',
 cuidado:'o cuidado com os outros',curiosidade:'a curiosidade',diplomacia:'o jogo de cintura',
 disciplina:'a disciplina',esperteza:'a esperteza',estabilidade:'a firmeza',estrategia:'a estratégia',
 etica:'a retidão',familia:'o apego à família',filosofia:'a vontade de entender',franqueza:'a franqueza',
 generosidade:'a generosidade',harmonia:'a busca de harmonia',impeto:'o ímpeto',
 independencia:'a independência',inovacao:'a vontade de reinventar',inspiracao:'o poder de inspirar',
 intensidade:'a intensidade',intuicao:'a intuição',justica:'o senso de justiça',lealdade:'a lealdade',
 liberdade:'a sede de liberdade',lideranca:'a liderança',misterio:'o mistério',otimismo:'o otimismo',
 paixao:'a paixão',palavra:'o domínio da palavra',palco:'a presença',poder:'a força de vontade',
 precisao:'a precisão',rebeldia:'a rebeldia',resiliencia:'a resiliência',sensibilidade:'a sensibilidade',
 sensualidade:'o prazer pelas coisas',servico:'a entrega aos outros',sinceridade:'a sinceridade',
 sobrevivencia:'o instinto de sobrevivência',sonho:'o sonho',tradicao:'o respeito ao que veio antes',
 versatilidade:'a versatilidade',visao:'a visão de longe'
};
const ART_ANIMAL={Rato:'do',Boi:'do',Tigre:'do',Coelho:'do',Dragão:'do',Serpente:'da',
 Cavalo:'do',Cabra:'da',Macaco:'do',Galo:'do','Cão':'do',Porco:'do'};
const ART_ELEM={Metal:'do',Água:'da',Madeira:'da',Fogo:'do',Terra:'da'};

function origemLabel(kind,c){
  if(kind==='signo')return 'de '+c.signo;
  if(kind==='animal')return (ART_ANIMAL[c.animal]||'do')+' '+c.animal;
  if(kind==='elem')return (ART_ELEM[c.elemento]||'do')+' '+c.elemento;
  if(kind==='num')return 'do seu Caminho '+c.lp;
  if(kind==='alma')return 'do seu Número da Alma '+c.alma;
  if(kind==='persona')return 'do seu Número da Personalidade '+c.persona;
  return 'do seu nome';
}

/** Maiúscula só na primeira letra, sem mexer no resto (Áries continua Áries). */
function inicial(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

/** "somada/somado" concorda com o PRIMEIRO traço; a preposição contrai com o
    artigo do SEGUNDO: a+a=à, a+o=ao. */
function somaEntre(primeiro,segundo){
  const v = primeiro.indexOf('o ')===0 ? 'somado' : 'somada';
  if(segundo.indexOf('a ')===0) return v+' à '+segundo.slice(2);
  if(segundo.indexOf('o ')===0) return v+' ao '+segundo.slice(2);
  return v+' a '+segundo;
}

/* Explica de onde veio UMA etiqueta: "a coragem de Áries", "o cuidado do seu
   Número da Alma 6". Usado pelo arquétipo, pelo superpoder e pela kryptonita. */
function derivarTraco(c,tag,comps){
  const prioridade={signo:0,num:1,alma:2,animal:3,elem:4,exp:5,persona:6};
  const achados=comps.filter(cp=>cp.tags.indexOf(tag)>=0)
                     .sort((a,b)=>prioridade[a.kind]-prioridade[b.kind]);
  if(!achados.length||!SUBST[tag])return null;
  return SUBST[tag]+' '+origemLabel(achados[0].kind,c);
}

/* Explica um item que tem VÁRIAS etiquetas (arquétipo, profissão, época):
   cita no máximo duas origens diferentes, nunca repetindo a mesma fonte. */
function derivarItem(c,tags,comps){
  const prioridade={signo:0,num:1,alma:2,animal:3,elem:4,exp:5,persona:6};
  const achados=[];
  tags.forEach(t=>comps.forEach(cp=>{
    if(cp.tags.indexOf(t)>=0 && SUBST[t]) achados.push({t,kind:cp.kind});
  }));
  achados.sort((a,b)=>prioridade[a.kind]-prioridade[b.kind]);
  const origens=new Set(), traos=new Set(), sel=[];
  for(const a of achados){
    if(origens.has(a.kind)||traos.has(a.t))continue;
    origens.add(a.kind); traos.add(a.t); sel.push(a);
    if(sel.length===2)break;
  }
  if(!sel.length)return null;
  const ps=sel.map(a=>SUBST[a.t]+' '+origemLabel(a.kind,c));
  return sel.length===2 ? inicial(ps[0])+' '+somaEntre(ps[0],ps[1])+'.' : inicial(ps[0])+'.';
}

function derivarRaiz(c,raiz,comps,seed){
  const prioridade={signo:0,num:1,alma:2,animal:3,elem:4,exp:5,persona:6};
  const achados=[];
  raiz[3].forEach(t=>comps.forEach(cp=>{
    if(cp.tags.indexOf(t)>=0 && SUBST[t]) achados.push({t,kind:cp.kind});
  }));
  achados.sort((a,b)=>prioridade[a.kind]-prioridade[b.kind]);
  // nunca repetir a mesma origem NEM o mesmo traço
  const origens=new Set(), traos=new Set(), escolhidos=[];
  for(const a of achados){
    if(origens.has(a.kind)||traos.has(a.t))continue;
    origens.add(a.kind); traos.add(a.t); escolhidos.push(a);
    if(escolhidos.length===2)break;
  }
  if(!escolhidos.length)return null;
  const p=escolhidos.map(a=>SUBST[a.t]+' '+origemLabel(a.kind,c));
  const frase = p.length===2 ? inicial(p[0])+' '+somaEntre(p[0],p[1]) : inicial(p[0]);
  return frase+': é daí que vem '+(raiz[1]==='da'?'a ':'o ')+raiz[0]+'.';
}

/* ==================================================================
   GERAÇÃO DO PERFIL COMPLETO (conteúdo pago)
   ================================================================== */
export function calcularBase(nome, y, m, d) {
  const primeiro = nome.trim().split(/\s+/)[0];
  return {
    nome: nome.trim(), primeiro, y, m, d,
    signo: zodiac(m, d),
    animal: chineseAnimal(y, m, d),
    elemento: chineseElement(y, m, d),
    lp: lifePath(y, m, d),
    exp: expression(primeiro),
    alma: almaNum(nome),
    persona: personaNum(nome),
    idade: ageAt(y, m, d)
  };
}

export function gerarPerfil(nome, y, m, d, uf) {
  const c = calcularBase(nome, y, m, d);
  c.uf = uf || '';
  const { comps, w } = buildTags(c);
  const tt = topTags(w, 3);
  const seed = seedNum(c);

  const arqScores = ARQ.map(a => [a, a[1].reduce((s, t) => s + (w[t] || 0), 0)]).sort((x, y2) => y2[1] - x[1]);
  const arq = arqScores[0][0], arq2 = arqScores[1][0];
  const arqNome = arq[0] + (arqScores[1][1] > 0 ? ' ' + arq2[0].replace(/^O /, '').replace(/^A /, '') : '');

  const midia = {
    filme: pickMedia(MIDIA.filme, w, comps, seed, 1, FATOR_MIDIA),
    livro: pickMedia(MIDIA.livro, w, comps, seed, 2, FATOR_MIDIA),
    serie: pickMedia(MIDIA.serie, w, comps, seed, 3, FATOR_MIDIA),
    novela: pickMedia(MIDIA.novela, w, comps, seed, 4, FATOR_MIDIA),
    musica: pickMedia(MIDIA.musica, w, comps, seed, 5, FATOR_MIDIA)
  };
  const profs = pickProfs(w, comps, seed, FATOR_PROF);
  const ep = EPOCA.map(e => [e, e[1].reduce((s, t) => s + (w[t] || 0), 0)]).sort((a, b2) => b2[1] - a[1]);
  const epChoice = (() => {
    const max = ep[0][1];
    let pool = ep.filter(x => x[1] >= max - 2);
    if (pool.length < 2) pool = ep.slice(0, 2);
    return pool[(seed * 7 + 90) % pool.length][0][0];
  })();

  const char = CHAR[c.signo];
  const tarot = TAROT[c.lp] || ['O Mago', 'o poder de transformar vontade em realidade'];
  const sobre = analisaSobrenome(c.nome);
  const wt = i => WHYTPL[(seed + i) % WHYTPL.length];
  const evitaTags = tt.filter(t => EVITA[t]).slice(0, 3);
  const pares = PAR[c.signo] || [];

  const raiz = escolherRaiz(w, seed);
  const raizArquivo = 'alma-' + stripAccents(raiz[0]).toLowerCase().replace(/\s+/g,'-') + '.jpg';

  return {
    almaBrasileira: {
      nome: raiz[0], artigo: raiz[1], valor: raiz[2], texto: raiz[4],
      imagem: raizArquivo,
      porque: derivarRaiz(c, raiz, comps, seed)
    },
    base: {
      nome: c.nome, primeiro: c.primeiro, signo: c.signo, animal: c.animal,
      elemento: c.elemento, lp: c.lp, idade: c.idade, y: c.y, m: c.m, d: c.d, uf: c.uf
    },
    arquetipo: { nome: arqNome, lema: arq[2], porque: derivarItem(c, arq[1], comps) },
    perfil: [
      `${cap(c.primeiro)}, ${SIGNO[c.signo].desc}`,
      `${NUM[c.lp].desc}${NUM[c.exp] ? ' E o seu nome vibra no número ' + c.exp + ', somando a isso um traço de ' + NUM[c.exp].tags[0] + '.' : ''}`,
      `Como ${c.animal} de ${c.elemento}, você é ${ANIMAL[c.animal].adj}. Somando ${phrase(tt)}, desenha-se alguém que ${sintese(tt)}.`,
      sombra(tt)
    ],
    personagem: { nome: char[0], texto: char[1] },
    midia: [
      ['Filme', midia.filme], ['Livro', midia.livro], ['Série', midia.serie],
      ['Novela', midia.novela], ['Música', midia.musica]
    ].map(([k, x], i) => ({ tipo: k, titulo: x.titulo, why: wt(i) + ' ' + phrase(x.why) })),
    profissoes: profs.map(p => ({ nome: p.nome, why: 'o encontro de ' + phrase(p.why) + ' aponta pra cá.' })),
    evitar: (evitaTags.length ? evitaTags : ['liberdade']).map(t => cap(EVITA[t] || EVITA.liberdade) + '.'),
    tarot: { nome: tarot[0], why: `Seu Caminho de Vida ${c.lp} te coloca sob ${tarot[0]}: ${tarot[1]} — e é assim que você se move pelo mundo.` },
    epoca: { nome: epChoice, texto: `O encontro de ${phrase(tt)} te colocaria bem no centro daquele mundo.` },
    superpoder: cap(SUPER[tt[0]] || 'transformar ideias em movimento antes de todo mundo'),
    kryptonita: cap(KRYP[tt[0]] || 'lembrar de desacelerar e deixar os outros acompanharem'),
    // superpoder e kryptonita saem do MESMO traço dominante — uma linha explica os dois
    duplaPorque: (function(){ const t = derivarTraco(c, tt[0], comps);
      return t ? inicial(t) + ' — é daí que vêm os dois.' : null; })(),
    par: pares.length ? { melhores: [pares[0], pares[1]], desafio: pares[2] } : null,
    sobrenome: sobre,
    sorte: { cor: SIGNO[c.signo].cor, numero: c.lp, dia: SIGNO[c.signo].dia, pedra: SIGNO[c.signo].pedra },
    nostalgia: {
      presidente: presidente(c.y),
      regiao: c.uf ? regiao(c.uf) : null
    }
  };
}

export function nomesAlmas(){ return RAIZ.map(r=>r[0]); }

export { UFS, regiao, zodiac, chineseAnimal, chineseElement, lifePath, expression, cap, stripAccents };

// usado apenas pelo script de build para gerar os dados da prévia (cliente)
export const __TABELAS = { SIGNO, NUM, ANIMAL, ELEM, BARNUM };
