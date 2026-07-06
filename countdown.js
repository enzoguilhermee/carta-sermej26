// Alvo: 6 de julho de 2026, 19h no horário de Brasília (UTC-3)
const TARGET_DATE = new Date("2026-07-06T18:30:00-03:00").getTime();

const waitingState = document.getElementById("waitingState");
const revealState = document.getElementById("revealState");
const revealContent = document.getElementById("revealContent");

const els = {
  dd: document.getElementById("dd"),
  hh: document.getElementById("hh"),
  mm: document.getElementById("mm"),
  ss: document.getElementById("ss"),
};

function pad(n){ return String(n).padStart(2, "0"); }

// O conteúdo da revelação fica guardado codificado (base64) em vez de texto
// puro, e só é decodificado e inserido na página no instante em que o
// cronômetro chega a zero. Assim ele não aparece pronto no HTML nem no
// código-fonte legível ao inspecionar a página antes da hora.
function decode(b64){
  return decodeURIComponent(escape(atob(b64)));
}

const REVEAL_DATA = {
  eyebrow: "8J+UpSByZXZlbGFkbw==",
  title: "QSBwcmltZWlyYSBmYcOtc2NhIGZvaSBhY2VzYS4=",
  imgAlt: "TWFwYSBkbyB0ZXNvdXJvIFNFUk1FSiAyNg==",
  imgSrc: "assets/mapa-tesouro.png",
  body: "TyBxdWUgYW50ZXMgZXJhIGFwZW5hcyB1bSBtaXN0w6lyaW8gYWdvcmEgY29tZcOnYSBhIGdhbmhhciBmb3JtYS4KCkV4aXN0ZSB1bSBtYXBhIGVzcGVyYW5kbyBwb3IgYXF1ZWxlcyBxdWUgYWNlaXRhcmVtIG8gZGVzYWZpby4gTWFzIHNldXMgY2FtaW5ob3MgYWluZGEgcGVybWFuZWNlbSBvY3VsdG9zLgoKRHVyYW50ZSBvIFNFUk1FSiAyNiwgY2FkYSBkZXNhZmlvIHJldmVsYXLDoSB1bWEgbm92YSBwYXJ0ZSBkZXNzYSBqb3JuYWRhLiBDb25leMO1ZXMgc2Vyw6NvIGNvbnN0cnXDrWRhcywgZXhwZXJpw6puY2lhcyBzZXLDo28gdml2aWRhcyBlLCBhbyBmaW5hbCwgYXBlbmFzIHF1ZW0gcGVyY29ycmVyIGVzc2UgY2FtaW5obyBwb2RlcsOhIGRlc2NvYnJpciBvIHZlcmRhZGVpcm8gdGVzb3Vyby4KClBvciBlbnF1YW50bywgZ3VhcmRlIGVzdGEgZGVzY29iZXJ0YS4KCkVzcGVyYW1vcyB2b2PDqiBubyBTRVJNRUogMjYuIEFmaW5hbCwgdG9kYSBncmFuZGUgZGVzY29iZXJ0YSBjb21lw6dhIGNvbSB1bWEgcHJpbWVpcmEgZmHDrXNjYS4="
};

function buildRevealContent(){
  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = decode(REVEAL_DATA.eyebrow);

  const title = document.createElement("h1");
  title.className = "title";
  title.textContent = decode(REVEAL_DATA.title);

  const mapWrap = document.createElement("div");
  mapWrap.className = "reveal-map";
  const mapImg = document.createElement("img");
  mapImg.src = REVEAL_DATA.imgSrc;
  mapImg.alt = decode(REVEAL_DATA.imgAlt);
  mapImg.loading = "eager";
  mapWrap.appendChild(mapImg);

  const body = document.createElement("a");
  body.className = "reveal-cta";
  body.href = "https://www.even3.com.br/sermej-26-755277/";
  body.target = "_blank";
  body.rel = "noopener noreferrer";
  body.textContent = "Clique aqui e faça parte desse movimento";

  revealContent.appendChild(eyebrow);
  revealContent.appendChild(title);
  revealContent.appendChild(mapWrap);
  revealContent.appendChild(body);
}

function reveal(){
  if(!revealContent.hasChildNodes()){
    buildRevealContent();
  }
  waitingState.classList.add("hidden");
  revealState.classList.remove("hidden");
}

function tick(){
  const now = Date.now();
  const diff = TARGET_DATE - now;

  if (diff <= 0){
    reveal();
    clearInterval(timerId);
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  els.dd.textContent = pad(days);
  els.hh.textContent = pad(hours);
  els.mm.textContent = pad(minutes);
  els.ss.textContent = pad(seconds);
}

// Se a pessoa já chegar depois do horário, mostra a revelação direto.
if (Date.now() >= TARGET_DATE){
  reveal();
} else {
  tick();
  var timerId = setInterval(tick, 1000);
}
