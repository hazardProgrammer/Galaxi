var canvas;
var ctx;
var energy;
var energyTotal;
var energyCapacity;
var inputs;
var outputs;
var gens;
var research;
var upgrades;
var population;//other than you
var workerAmt;
var robotAmt;
var food;
var humanEfficiencies;
var civData;
var trades;
var civilizationPrefs;
var water;
var oil;
var sunlight;
var intervalNumber;
var states;
var state;
var genIsMouseover;

function startLoading() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	energy = 0;
	energyTotal = 0;
	energyCapacity = 100;
	/*types of output:
	0: nothing
	1: energy
	2: oil
	3: nuclearWaste
	*/
	/*types of input:
	0: nothing
	1: water
	2: oil
	3: sunlight
	4: food
	*/
	inputs = {
		nothing: 0,
		energy: 1,
		oil: 2,
		sunlight: 3,
		food: 4,
		nuclearWaste: 5,
	};
	outputs = {
		nothing: 0,
		energy: 1,
		oil: 2,
		nuclearWaste: 3,
	};
	gens = {//not actually gens but instead buyables, too lazy to change
		lemon: {name: "Lemon", desc: "A citrusy fruit with a shocking<br>electric charge inside it", amt: 1, prodMultiplier: 1, outputType: outputs.energy, inputType: inputs.nothing, baseOut: 1, type: "GreenEnergy", cost: 5},
		waterwheel: {name: "Waterwheel", desc: "A wheel turned by a river.<br>It powers a generator", amt: 0, prodMultiplier: 1, outputType: outputs.energy, inputType: inputs.none, baseOut: 2, nonConsume: true, researchRequired: "Waterwheels", type: "GreenEnergy", cost: 9},
		oilDrill: {name: "Oil Drill", desc: "A primitive drill<br>that slowly lifts up oil", amt: 0, prodMultiplier: 1, outputType: outputs.oil, inputType: inputs.energy, baseOut: 2, input: 1, researchRequired: "Oil Mechanisms", type: "FossilFuel", cost: 10},
		oilEngine: {name: "Oil Generator", desc: "A standard-issue combustion engine<br>that uses oil and generates energy", amt: 0, prodMultiplier: 1, outputType: outputs.energy, inputType: inputs.oil, baseOut: 2, input: 1, researchRequired: "Oil Mechanisms", type: "FossilFuel", cost: 12},
		oilBurner: {name: "Oil-powered Water Heater", desc: "A machine that uses the heat<br>from burning oil to heat water and turn turbines", amt: 0, prodMultiplier: 1, outputType: outputs.energy, inputType: inputs.oil, baseOut: 10, input: 4, researchRequired: "Oil Mechanisms", type: "FossilFuel", cost: 15},
		windTurbine: {name: "Wind Turbine", desc: "A device that uses<br>wind to generate energy", amt: 0, prodMultiplier: 1, outputType: outputs.energy, inputType: inputs.nothing, baseOut: 4, researchRequired: "Wind Turbines", type: "GreenEnergy", cost: 20},
		hydroDam: {name: "Hydroelectric Dam", desc: "An improved waterwheel,<br>the Hydroelectric Dam's turbines are much more efficient", amt: 0, outputType: outputs.energy, inputType: inputs.nothing, baseOut: 4, input: 9, researchRequired: "Hydroelectric Dams", type: "GreenEnergy", cost: 18},
		biofuelMaker: {name: "Biofuel Maker", desc: "A bio-fuel generating device,<br>it makes gas out of crops", amt: 0, prodMultiplier: 1, outputType: outputs.oil, inputType: inputs.food, baseOut: 2, input: 1, researchRequired: "Biofuel", type: "GreenEnergy", cost: 10},
		battery: {name: "Battery", desc: "A device for storing energy", amt: 0, isStorage: true, storageBaseAmt: 100, storeMultiplier: 1, researchRequired: "Batteries",  type: "Batteries", cost: 20}
	};
	research = {
		waterwheels: {cost: 25, researchTime: 15 /*seconds*/, name: "Waterwheels", unlock: 200, has: false},
		oilMechanisms: {cost: 40, researchTime: 25, name: "Oil Mechanisms", unlock: 500, has: false},
		windTurbines: {cost: 60, researchTime: 30, name: "Wind Turbines", unlock: 1200, has: false},
		hydroelectric: {cost: 75, researchTime: 45, name: "Hydroelectric Dams", unlock: 5000, has: false},
		biofuel: {cost: 80, researchTime: 40, name: "Biofuel", unlock: 10000, has: false},
		battery: {cost: 40, researchTime: 20, name: "Batteries", unlock: 1500, has: false}
	};
	upgrades = {
		production: {wheel: {cost: 10, name: "Invent the wheel", desc: "Doubles all production", effect: 2, unlock: 100 /*all is energy*/, has: false}, existence: {cost: 20, name: "Think about existence", desc: "Doubles all production", effect: 2, unlock: 500, has: false}, gravity: {cost: 50, name: "Discover Gravity", desc: "Doubles production", effect: 2, unlock: 2500, has: false}, lightbulb: {cost: 100, name: "Invent the lightbulb", desc: "Doubles Production", effect: 2, unlock: 6000, has: false}},
		lemon: {organic: {cost: 10, name: "Organic Lemons", desc: "Doubles lemon production", effect: 2, unlock: 5}, lemonade: {cost: 20, name: "Lemonade", desc: "Doubles lemon production", effect: 2, unlock: 15}, sour: {cost: 30, name: "Ultra Sourness", desc: "Doubles lemon production", effect: 2, unlock: 30}, gmo: {cost: 40, name: "GMO lemons", desc: "Doubles lemon production", effect: 2, unlock: 50}},
	};
	population = 5;
	workerAmt = {
		maintenance: 1,
		research: 1,
		building: 1,
		farming: 1,
		soldier: 1,
		exploring: 0,//requires the space exploration research
	};
	robotAmt = {
		maintenance: 0,
		research: 0,
		building: 0,
		farming: 0,
		soldier: 0,
		exploring: 0,
	};
	food = 100;
	humanEfficiencies = {
		farming: 1,
		building: 1,
		research: 1,
		maintenance: 1,
	};
	civData = {
		civ1: {discovered: false, population: Math.floor(Math.random() * 50) + 100},
		civ2: {discovered: false, population: Math.floor(Math.random() * 50) + 100},
		civ3: {discovered: false, population: Math.floor(Math.random() * 50) + 100},
		civ4: {discovered: false, population: Math.floor(Math.random() * 50) + 100},
		civ5: {discovered: false, population: Math.floor(Math.random() * 50) + 100},
		civ6: {discovered: false, population: Math.floor(Math.random() * 50) + 100},
		civ7: {discovered: false, population: Math.floor(Math.random() * 50) + 100},
		civ8: {discovered: false, population: Math.floor(Math.random() * 50) + 100},
		civ9: {discovered: false, population: Math.floor(Math.random() * 50) + 100},
		civ10: {discovered: false, population: Math.floor(Math.random() * 50) + 100},
		civ11: {discovered: false, population: Math.floor(Math.random() * 50) + 100},
	};
	trades = {
		civ1: {},
		civ2: {},
		civ3: {},
		civ4: {},
		civ5: {},
		civ6: {},
		civ7: {},
		civ8: {},
		civ9: {},
		civ10: {},
		civ11: {},
	};
	civilizationPrefs = {
		civ1: "Exploration",
		civ2: "GreenEnergy",
		civ3: "Weaponry",
		civ4: "Workers",
		civ5: "Workers",
		civ6: "GreenEnergy",
		civ7: "Weaponry",
		civ8: "Exploration",
		civ9: "Storage",
		civ10: "Storage",
		civ11: "Robots",
	};
	intervalNumber = 0;
	states = {
		genBuy: 1,
		storage: 2,
		research: 3,
		upgrades: 4,
		shipyard: 5,
		populationManage: 6,
	};
	genIsMouseover = {
		lemon: false,
		waterwheel: false,
	}
	state = states.genBuy;
	interval = setInterval(hasLoaded, 250);
}

function changeFood() {
	food += workerAmt.farming * humanEfficiencies.farming * 25;
	food -= population * 5;
}

function generateWorld() {
	water = Math.floor(Math.random() * 500) + 5;
	sunlight = Math.floor(Math.random() * 100) + 300;
}

function registerTrade(civNum, trade) {
	trades["civ" + civNum]["trade" + Object.keys(trades["civ" + civNum]).length] = trade;
}

function acceptTradeAI(iGive, iGet, civNum) {
	var isLikedTypeGet = (iGet.type === civilizationPrefs["civ" + civNum]);
	var isLikedTypeGive = (iGive.type === civilizationPrefs["civ" + civNum])
}

function buyGen(gen) {
	if (energy >= gens[gen].cost) {
		energy -= gens[gen].cost;
		gens[gen].amt++;
		gens[gen].cost = Math.round(gens[gen].cost * 1.3);
	}
}

function addEnergy() {
	if (intervalNumber % 10 === 0) {
		energy += gens.lemon.amt * gens.lemon.baseOut * gens.lemon.prodMultiplier;
		energy += gens.waterwheel.amt * gens.waterwheel.baseOut * gens.waterwheel.prodMultiplier;
		energyTotal += gens.lemon.amt * gens.lemon.baseOut * gens.lemon.prodMultiplier;
		energyTotal += gens.waterwheel.amt * gens.waterwheel.baseOut * gens.waterwheel.prodMultiplier;
	}
	if (energy > 100) {
		energy = 100;
	}
}

function render() {
	ctx.fillStyle = "Blue";
	ctx.fillRect(0, 0, 800, 50);
	ctx.fillStyle = "Black";
	ctx.font = "24px Arial";
	ctx.textAlign = "left";
	ctx.textBaseline = "middle";
	ctx.fillText("Energy: " + energy + "/" + energyCapacity, 50, 25);
	ctx.fillStyle = "DeepSkyBlue";
	ctx.textAlign = "center";
	ctx.fillRect(450, 10, 50, 30);
	ctx.fillStyle = "Black";
	ctx.font = "16px Arial";
	ctx.fillText("Gens", 475, 25);
	ctx.fillStyle = "DeepSkyBlue";
	ctx.fillRect(520, 10, 50, 30);
	ctx.fillStyle = "Black";
	ctx.font = "14px Arial";
	ctx.fillText("Storage", 545, 25);
	ctx.fillStyle = "DeepSkyBlue";
	ctx.fillRect(590, 10, 50, 30);
	ctx.fillStyle = "Black";
	ctx.font = "11px Arial";
	ctx.fillText("Research", 615, 25);
	ctx.fillStyle = "DeepSkyBlue";
	ctx.fillRect(660, 10, 50, 30);
	ctx.fillStyle = "Black";
	ctx.fillText("Upgrades", 685, 25);
	if (state === states.genBuy) {
		renderBuyGen("lemon", 80, 80);
		drawImage("https://i.redd.it/bo2luzz1wlhz.png", 220, 100);
		if (research.waterwheels.has === true) {
			renderBuyGen("waterwheel", 520, 80);
			drawImage("https://i.redd.it/cr6odjxjcwiz.png", 660, 100);
		};
	};
	if (state === states.storage) {
		ctx.font = "32px Arial";
		ctx.fillText("STORAGE: BEING IMPLEMENTED", 400, 300)
	};
	if (state === states.research) {
		if (energyTotal >= research.waterwheels.unlock && research.waterwheels.has === false) {
			renderResearch("waterwheels", 80, 80);
		};
	};
	if (state === states.upgrades) {
		if (energyTotal >= upgrades.production.wheel.unlock && upgrades.production.wheel.has === false) {
			renderUpgrade("wheel", "production", 80, 80);
		};
	};
}

function renderUpgrade(upgradeName, upgradeOther, x, y) {
	var upgradeToDraw = upgrades[upgradeOther][upgradeName];
	ctx.fillStyle = "Blue";
	ctx.fillRect(x, y, 200, 80);
	ctx.fillStyle = "DeepSkyBlue";
	ctx.fillRect(x + 2, y + 2, 196, 76);
	ctx.font = "15px Arial";
	ctx.textAlign = "left";
	ctx.fillStyle = "Black";
	ctx.fillText("Upgrade: " + upgradeToDraw.name, x + 10, y + 20);
	ctx.fillText(upgradeToDraw.desc, x + 10, y + 40);
}

function renderResearch(researchName, x, y) {
	var researchToDraw = research[researchName];
	ctx.fillStyle = "Blue";
	ctx.fillRect(x, y, 200, 80);
	ctx.fillStyle = "DeepSkyBlue";
	ctx.fillRect(x + 2, y + 2, 196, 76);
	ctx.font = "15px Arial";
	ctx.textAlign = "left";
	ctx.fillStyle = "Black";
	ctx.fillText("Research: " + researchToDraw.name, x + 10, y + 20);
}

function renderBuyGen(gen, x, y) {
	var genToDraw = gens[gen];
	ctx.fillStyle = "Blue";
	ctx.fillRect(x, y, 200, 80);
	ctx.fillStyle = "DeepSkyBlue";
	ctx.fillRect(x + 2, y + 2, 196, 76);
	if (genIsMouseover[gen] === false) {
		ctx.fillStyle = "Black";
		ctx.font = "12px Arial";
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";
		ctx.fillText(genToDraw.name, x + 10, y + 20);
		ctx.fillText("Amount: " + genToDraw.amt, x + 10, y + 40);
		ctx.fillText("Cost: " + genToDraw.cost, x + 10, y + 60);
	} else {
		ctx.fillStyle = "Black";
		ctx.font = "12px Arial";
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";
		var descFormatted = genToDraw.desc.split("<br>");
		for (var i = 0; i < descFormatted.length; i++) {
			ctx.fillText(descFormatted[i], x + 10, y + ((20*i) + 20));
		}
	};
}

function researchGen(gen) {
	var toResearch = research[gen];
	setTimeout(function(){toResearch.has = true}, toResearch.researchTime * 1000);
}

function researchUpgrade(upgradeRes, division) {
	var res = upgrades[division][upgradeRes];
	res.has = true;
}

function drawImage(img, x, y) {
	var bar = new Image();
	bar.src = img;
	bar.onload = function() {
		ctx.drawImage(bar, x, y);
	}
}

function mouseHandler(event) {
	var mouseX = event.pageX;
	var mouseY = event.pageY;
	if (mouseX >= 80 && mouseX <= 280 && mouseY >= 80 && mouseY <= 160) {
		genIsMouseover.lemon = true;
	} else {
		genIsMouseover.lemon = false;
	};
	if (mouseX >= 520 && mouseX <= 720 && mouseY >= 80 && mouseY <= 160) {
		genIsMouseover.waterwheel = true;
	} else {
		genIsMouseover.waterwheel = false;
	};
}

function clickHandler(event) {
	var clickX = event.clientX - canvas.getBoundingClientRect().left;
    var clickY = event.clientY - canvas.getBoundingClientRect().top;
    if (clickX >= 80 && clickX <= 280 && clickY >= 80 && clickY <= 160 && state === states.genBuy) {
    	buyGen("lemon");
    };
    if (clickX >= 520 && clickX <= 720 && clickY >= 80 && clickY <= 160 && research.waterwheels.has === true && state === states.genBuy) {
    	buyGen("waterwheel");
    };
    if (clickX >= 450 && clickX <= 500 && clickY >= 10 && clickY <= 40) {
    	state = states.genBuy;
    };
    if (clickX >= 520 && clickX <= 570 && clickY >= 10 && clickY <= 40) {
    	state = states.storage;
    };
    if (clickX >= 590 && clickX <= 640 && clickY >= 10 && clickY <= 40) {
    	state = states.research;
    };
    if (clickX >= 660 && clickX <= 710 && clickY >= 10 && clickY <= 40) {
    	state = states.upgrades;
    };
    if (clickX >= 80 && clickX <= 280 && clickY >= 80 && clickY <= 160 && state === states.research && energyTotal >= research.waterwheels.unlock) {
    	researchGen("waterwheels");
    };
    if (clickX >= 80 && clickX <= 280 && clickY >= 80 && clickY <= 160 && state === states.upgrades && energyTotal >= upgrades.production.wheel.unlock) {
    	console.log("click");
    	researchUpgrade("wheel", "production");
    };
}

function hasLoaded() {
	clearInterval(interval);
	startGame();
}

function startGame() {
	interval = setInterval(runGame, 100);
	render();
	$("#canvas").mousemove(mouseHandler);
	$("#canvas").click(clickHandler);
}

function runGame() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	intervalNumber++;
	changeFood();
	addEnergy();
	render();
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
}
