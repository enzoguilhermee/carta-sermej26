# Carta Virtual — SERMEJ 26

## Arquivos
- `index.html` / `style.css` / `script.js` — a carta (envelope + mensagem + QR code)
- `countdown.html` / `countdown.css` / `countdown.js` — a página de contagem regressiva que o QR code abre
- `assets/` — coloque aqui a logo do SERMEJ 26 (`SERMEJ26 PNG.png`), usada como ícone da aba. Se não adicionar, o site funciona normalmente, só fica sem favicon.

## Como funciona
1. A pessoa abre `index.html`, clica no envelope e lê a mensagem misteriosa.
2. Dentro da carta há um QR code. Ele aponta automaticamente para `countdown.html` **no mesmo endereço onde você hospedar os arquivos** (não precisa editar nada no código para isso).
3. Em `countdown.html` roda uma contagem regressiva até **06/07/2026 às 19h (horário de Brasília)**.
4. Quando o relógio chega a zero, a página troca sozinha para a mensagem de revelação ("A primeira faísca foi acesa...").
5. Quem escanear o QR **depois** do horário já cai direto na mensagem revelada, sem precisar esperar.

## Importante sobre o QR code
Um QR code só funciona quando escaneado por um celular se ele apontar para um **link público real** (não para um arquivo no seu computador). Para funcionar de verdade:
1. Hospede a pasta inteira em algum lugar acessível pela internet (ex.: GitHub Pages, Vercel, Netlify, Hostinger etc.) mantendo `index.html` e `countdown.html` na mesma pasta.
2. Abra `index.html` pela URL pública (ex.: `https://seudominio.com/index.html`).
3. O QR code vai gerar sozinho apontando para `https://seudominio.com/countdown.html`.

Se quiser testar antes de hospedar, é só abrir `countdown.html` diretamente no navegador — a contagem funciona local também, só o QR que precisa de link público.

## Para trocar a data/hora do lançamento
Edite a primeira linha de `countdown.js`:
```js
const TARGET_DATE = new Date("2026-07-06T19:00:00-03:00").getTime();
```

## Identidade visual usada
- Azul marinho `#0a1730`, azul intenso `#17509c`, azul lavanda `#8b95e0`, amarelo-ouro `#f4b93c`, laranja `#f2703c`, bege `#f3ecd6`
- Fontes: **Fredoka** (títulos/números) + **Montserrat** (texto), via Google Fonts
- Elementos: estrelas no fundo, ondas animadas na base, bandeirolas triangulares no topo, chama/brasa como elemento central (a "faísca"), triângulos na composição das bandeirolas
