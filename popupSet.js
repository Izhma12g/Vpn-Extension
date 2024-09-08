const saveButton = document.getElementById('save');
const jumpObj = document.getElementById('jump');
const scaleFactObj = document.getElementById('scaleFact');
const imageRepObj = document.getElementById('imgRep');
const webPopObj = document.getElementById('webPop');
const webUrlObj = document.getElementById('webUrl');


chrome.storage.sync.get(['jump', 'imgRep', 'scaleFact', 'webPop', 'webUrl'], (settings) => {
    let { jump, imgRep, scaleFact, webPop, webUrl} = settings;
    if ([jump, imgRep, scaleFact, webPop, webUrl].some(value => value === undefined)) {
        getDefault();
    } else {
        jumpObj.value = jump;
        scaleFactObj.value = scaleFact;
        imageRepObj.value = imgRep;
        webPopObj.value = webPop;
        webUrlObj.value = webUrl;
    }
});


saveButton.addEventListener('click', () => {
    const settings = {
        jump: parseInt(jumpObj.value),
        imgRep: parseInt(imageRepObj.value),
        scaleFact: parseFloat(scaleFactObj.value),
        webPop: parseInt(webPopObj.value),
        webUrl: webUrlObj.value
    };
    chrome.storage.sync.set(settings);
    document.getElementById('link').click();
});

function getDefault(){
    console.log("getting default");
    const settings = {
        jump: 10,
        imgRep: 30,
        scaleFact: 2,
        webPop: 30,
        webUrl: 'https://www.pinterest.com.au/deniselhart77/hot-men-pics/'
    };
    jumpObj.value = 10;
    scaleFactObj.value = 2;
    imageRepObj.value = 30;
    webPopObj.value = 30;
    webUrlObj.value = 'https://www.pinterest.com.au/deniselhart77/hot-men-pics/'
    chrome.storage.sync.set(settings);
}