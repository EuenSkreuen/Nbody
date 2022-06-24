//TODO: 
// Väritä aloitustähtijärjestelmät erikseen eri väreillä
// Mahdollisuus valita yksittäisiä tähtiä klikkaamalla jotta näkee niiden tiedot
// Mahdollisuus keskittää kuvakulma klikkamalla valittuun tähteen
// Mahdollisuus antaa hiirelle massa (eli hiiri olisi myös "tähti")
// Näiltä edellisiltä osioilta taustakuva wallpaper engineen???
// Massakeskipisteen laskenta ja visualisointi, jonka voi laittaa päälle ja pois
// Massakeskipisteen liikeradan visualisointi jonka voi laittaa päälle ja pois (älä tallenna liian usein ettei muistia mene hukkaan)
// Mahdollisuus väriavaruuksien säätämiseen (valkoinen vs musta)
// Mahdollisuus graafin skaalamiseen ja täysinäyttöön
// Mahdollisuus putoavien ja karkaavien tähtien värittämiseen eri tavalla (massakeskipisteen suhteen)
// Mahdollisuus hyödyntää GPUta laskentaan, gpu.js
// Pimeän aineen / energian vaikutus järjestelmiin?

// Luokka vektoreita varten
class Vector {
    constructor(items){
        this.items = items;
    }
    add (anotherVector) {
        let sumVector = [];
        for (let i=0; i<this.items.length; i++){
            sumVector.push(this.items[i] + anotherVector.items[i]);
        }
        return new Vector(sumVector);
    }
    subtract (anotherVector){
        let subVector = [];
        for (let i=0; i<this.items.length; i++){
            subVector.push(this.items[i] - anotherVector.items[i]);
        }
        return new Vector(subVector);
    }
    multiply (multiplier){
        let multVector = [];
        for (let i=0; i<this.items.length; i++){
            multVector.push(this.items[i] * multiplier);
        }
        return new Vector(multVector);
    }
    divide (denominator) { 
        let divVector = [];
        for (let i=0; i<this.items.length; i++){
            divVector.push(this.items[i] / denominator);
        }
        return new Vector(divVector);
    }
    pow (exponent) {
        let divVector = [];
        for (let i=0; i<this.items.length; i++){
            temp = this.items[i];
            for (let j = 0; j < exponent; j++){
                temp = temp * this.items[i];
            }
            divVector.push(temp);
        }
        return new Vector(divVector);
    }
    dist (otherVector) {
        let temp = 0;
        for (let i = 0; i < this.items.length; i++){
            temp += Math.pow(this.items[i] - otherVector.items[i], 2);
        }
        return Math.sqrt(temp);
    }
    abs() {
        let absVector = [];
        for (let i = 0; i < this.items.length; i++) {
            absVector.push(Math.abs(this.items[i]));
        }
        return new Vector(absVector);
    }
}

// Luokka tähtiä varten
class Star {
    constructor(position, mass) {
        this.position = position; //2D sijainti, yksikkö parsekeissa
        this.speed = new Vector([0,0]); // Kappaleen vauhti, yksiköt parsekkeja vuodessa (en ole varma tästä)
        this.acceleration = new Vector([0,0]); // Kappaleen kiihtyvyys, yksiköt kuten yllä
        this.mass = mass; // Massa suhteessa aurinkoon
    }
}

// Vakioita
const height = 600;
const width = 600;
const G = -0.004302;
const timeStep = 0.05;
const epsilon = 0.05;
starSystem = formSystem();

// Lisätään ulompi svg-elementti
const outerSvg = d3.select("#wrapper").append("svg")
.attr("x", "0")
.attr("y", "0")
.attr("width", width+100)
.attr("height", height+100)
.style("border", "1px solid black");

// Lisätään sisempi svg elementti graafia varten
const svg = outerSvg.append("svg")
.attr("width", width)
.attr("height", height)
.attr("x", "50")
.attr("y", "50")
.style("border", "1px solid black");

// Lisätään oma ryhmä kappaleita varten
const g = svg.append("g");

// Luodaan skaala x-akselia varten
const x = d3.scaleLinear().domain([0, width]).range([0,width]);

// Luodaan skaala y-akselia varten
const y = d3.scaleLinear().domain([height, 0]).range([0,height]);

// Lisätään x-akseli
const xAxis = outerSvg.append("g")
.attr("transform", "translate(50,"+(height+50)+")")
.call(d3.axisBottom(x));

// Lisätään y-akseli
const yAxis = outerSvg.append("g")
.attr("transform", "translate(50,50)")
.call(d3.axisLeft(y));

// Lisätään kappaleita niin paljon kuin data vaatii, ja asetetaan jokaiselle kappaleelle kuuntelija klikkauksia varten
const circle = g.selectAll("circle")
.data(starSystem.map(s => s.position.items))
.join("circle")
.attr("transform", d => `translate(${d})`)
.attr("r", 1.5)
.on("click", function(){
    alert("Bläää");
});

// Asettaa zoomauksen svg elementille
outerSvg.call(d3.zoom()
.on("zoom", zoomed));

// Alusta muuttuja zoomauksen tallennusta varten
globalTransform = d3.zoomTransform(svg);

// Funktio joka määrittelee mitä tapahtuu kun zoomataan (parametreissa destructuring assignment).
// Tallentaa zoomauksen tiedot muuttujaan.
function zoomed({transform}) {
    globalTransform = transform;
}

// Funktio kappaleiden luomiseen
function formSystem() {
    // Tähtiryhmä 1
    const randomX1 = d3.randomNormal(width / 2, 80);
    const randomY1 = d3.randomNormal(height / 2, 80);
    arr = [];
    for (let i = 0; i < 25; i ++){
        let position = new Vector([randomX1(), randomY1()]);
        let mass = Math.random() * (250 - 1) + 1;
        let star = new Star(position, mass);
        arr.push(star);
    }
    // Satunnaisia planetoideja
    for (let i = 0; i < 150; i++){
        let position = new Vector([randomX1(), randomY1()]);
        let mass = Math.random() * (0.0009543 - 0.000003003) + 0.000003003
        //let mass = Math.random() * (10- 1) + 1
        let planetoid = new Star(position, mass);
        arr.push(planetoid);
    }
    return arr;
    /*
    // Tähtiryhmä 2
    const randomX2 = d3.randomNormal(width / 2 + 2000, 80);
    const randomY2 = d3.randomNormal(height / 2 + 1500, 80);
    for (let i = 0; i < 100; i ++){
        let position = new Vector([randomX2(), randomY2()]);
        let mass = Math.random() * (250 - 0.1) + 0.1;
        let star = new Star(position, mass);
        arr.push(star);
    }
    // Tähtiryhmä 3 
    const randomX3 = d3.randomNormal(width / 2 + 2000, 80);
    const randomY3 = d3.randomNormal(height / 2 - 1500, 80);
    for (let i = 0; i < 100; i ++){
        let position = new Vector([randomX3(), randomY3()]);
        let mass = Math.random() * (250 - 0.1) + 0.1;
        let star = new Star(position, mass);
        arr.push(star);
    }
    return arr;
    */
}

// Ajastin ja funktio kappaleiden sijaintien päivittämiseen
setInterval(simulateAndTransform, 50);
function simulateAndTransform() {
    // 1 pikseli = 1 parsekki
    // Menetelmä on kopioitu aiemmasta projektista pienillä muokkauksilla: https://github.com/EuenSkreuen/Simulaattori/
    for (i = 0; i < starSystem.length; i++){
        // Leapfrog metodi 1.osa
        halfStepPosition = starSystem[i].speed.multiply(timeStep).multiply(0.5).add(starSystem[i].position);
        starSystem[i].position = halfStepPosition;

        // Yksittäisiin kappaleisiin kohdistuvien voimien laskeminen //////
        force = new Vector([0,0]);
        for (j = 0; j < starSystem.length; j++){
            if (i == j) continue;
            distanceVector = starSystem[i].position.subtract(starSystem[j].position);
            distance = starSystem[i].position.dist(starSystem[j].position);
            force = force.add(distanceVector.divide(Math.pow(distance, 2) + epsilon).multiply(starSystem[j].mass));
            
        }        
        starSystem[i].acceleration = force.multiply(starSystem[i].mass).multiply(G);

        // Leapfrog metodi 2.osa
        starSystem[i].speed = starSystem[i].speed.add(starSystem[i].acceleration.multiply(timeStep));
        starSystem[i].position = starSystem[i].position.add(starSystem[i].speed.multiply(timeStep).multiply(0.5));
    }
    // Päivitetään yksittäisten kappaleiden sijainnit
    circle.data(starSystem.map(s => s.position.items));
    //Päivitetään koko graafi uusien tietojen pohjalta (ja ottaen zoomaus huomioon)
    let newX = globalTransform.rescaleX(x);
    let newY = globalTransform.rescaleY(y);
    xAxis.call(d3.axisBottom(newX));
    yAxis.call(d3.axisLeft(newY));
    circle.attr("transform", d => `translate(${globalTransform.apply(d)})`);
}
