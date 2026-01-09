function cmToInch(){
    cmOut.innerText = (cm.value / 2.54).toFixed(2) + " inch";
}

function kgToLb(){
    kgOut.innerText = (kg.value * 2.205).toFixed(2) + " lb";
}

function cToF(){
    cOut.innerText = (cel.value * 9/5 + 32) + " °F";
}

function genPass(){
    let chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
    let p="";
    for(let i=0;i<passLen.value;i++){
        p+=chars[Math.floor(Math.random()*chars.length)];
    }
    passOut.innerText=p;
}

function toUpper(){ text1.value=text1.value.toUpperCase(); }
function toLower(){ text2.value=text2.value.toLowerCase(); }

function wordCount(){
    wordOut.innerText = text3.value.trim().split(/\s+/).length + " words";
}

function reverseText(){
    revOut.innerText = text4.value.split("").reverse().join("");
}

function square(){
    sqOut.innerText = numSq.value ** 2;
}

function randomNum(){
    randOut.innerText = Math.floor(Math.random()*1000);
}
