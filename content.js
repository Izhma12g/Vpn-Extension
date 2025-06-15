const gifs = ["200w.gif", "slap.gif", "gyatt2.png", "skib.gif", "ben.png", "ben22.png", "bens.png", "dada.png", "dfokkfd.png", "jih.png", "pafla.png", "ssos.png"];
let fbi, jump, imgRep, webPop, scaleFact, webUrl;
function preventTabClose(event) { event.returnValue = 'temp';}

chrome.storage.sync.get(['jump', 'imgRep', 'webPop', 'scaleFact', 'webUrl'], (settings) => {
  console.log(settings);
  ({ jump, imgRep, webPop, scaleFact, webUrl} = settings);
  if ([jump, imgRep, scaleFact, webPop, webUrl].some(value => value === undefined)) {
   getDefault();
  } else {
    fbi = Math.floor(Math.random() * jump) === 0;
    replaceText();
    if (fbi) {
      chrome.runtime.sendMessage({ action: "setIcon", evil: true });
      window.addEventListener("mouseup", cenafy);
    }else{
      chrome.runtime.sendMessage({ action: "setIcon", evil: false });
    }
  }
});


function getDefault(){
  const settings = {
    jump: 10,
    imgRep: 30,
    scaleFact: 2,
    webPop: 30,
    webUrl: 'https://www.pinterest.com.au/deniselhart77/hot-men-pics/'
  };
  chrome.storage.sync.set(settings);
}

function getVideo() {
  const video = document.createElement("video");
  video.src = chrome.runtime.getURL("media/cena.mp4");
  Object.assign(video.style, {
    position: "fixed",
    background: "black",
    zIndex: 2147483647,
    height: "100vh",
    width: "100vw",
    inset: 0
  });
  return video;
}

function cenafy() {
  setTimeout(() => {
    if (document.hidden) {return; }
    const video = getVideo();
    const body = document.body;
    const prevPointerEvent = body.style.pointerEvents;
    const prevBackColour = body.style.backgroundColor;
    window.addEventListener('beforeunload', preventTabClose);
    window.removeEventListener("mouseup", cenafy);
    body.style.backgroundColor = "black";
    body.style.pointerEvents = "none";
    body.appendChild(video);
    video.play();

    video.addEventListener("ended", () => {
      body.style.backgroundColor = prevBackColour;
      body.style.pointerEvents = prevPointerEvent;
      body.removeChild(video);
      chrome.runtime.sendMessage({ action: "setIcon", evil: false });
      window.removeEventListener('beforeunload', preventTabClose);
    });
  }, 3000);
}

window.addEventListener("load", () => {
  let chance = Math.floor(Math.random() * webPop);
  if (!window.location.href.includes(webUrl) && chance === 0) {
    window.location.href = webUrl;
  } else if (chance === 1) {
    startFlashing();
  }
});

function startFlashing() {
  let index = 0;
  let colors = ['white', 'black', 'red','blue']; 
  let elements = document.querySelectorAll('body, div');
  
  let interval = setInterval(() => {
    elements.forEach(element => element.style.backgroundColor = colors[index]);
    index = (index + 1) % colors.length;
  }, 20);
  
  setTimeout(function() {
    clearInterval(interval);
  }, 10000);
}
function getRandomGif() {
  const randomIndex = Math.floor(Math.random() * gifs.length);
  return gifs[randomIndex];
}

function replaceImages() {
  const images = document.querySelectorAll("img");
  images.forEach((image) => {
    let chance = Math.floor(Math.random() * imgRep);
    if (chance === 0) {
      image.src = chrome.runtime.getURL("media/" + getRandomGif());
    }
  });
}

for (let i = 0; i < 5; i++) {
  setTimeout(replaceImages, i * 10000);
}


const replacements = [
  "good boy", "duke dennis", "not that deep", "ohio", "rizzaholic", "goon",
  "pmo", "skibidi", "rizzler", "fantum tax", "ts",
  "Livvy Dunne", "among us ඞ", "edging", "mewing", "Level 5  gyatt",
  "Dr John Mew", "sigma", "alpha male"
];

function getRandomReplacement() {
  return replacements[Math.floor(Math.random() * replacements.length)];
}

function replaceTextInElement(element, probability) {
  element.childNodes.forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      let words = child.textContent.match(/\b\w+\b/g);
      if (words) {
        words.forEach(word => {
          if (Math.random() < probability) {
            child.textContent = child.textContent.replace(new RegExp(`\\b${word}\\b`), getRandomReplacement());
          }
        });
      }
    } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'STYLE' && child.tagName !== 'SCRIPT') {
      replaceTextInElement(child, probability);
    }
  });
}

function replaceText() {
  const elements = Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, div, span'));
  let totalWords = 0;

  elements.forEach(element => {
    element.childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        let words = child.textContent.match(/\b\w+\b/g);
        if (words) {
          totalWords += words.length;
        }
      }
    });
  });
  const probability =  scaleFact / 1000;
  console.log(probability);  

  elements.forEach(element => {
    replaceTextInElement(element, probability);
  });
}
