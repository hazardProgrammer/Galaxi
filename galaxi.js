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
		lemon: {name: "Lemon", desc: "A citrusy fruit with an shocking electric charge inside it", amt: 1, prodMultiplier: 1, outputType: outputs.energy, inputType: inputs.nothing, baseOut: 1, type: "GreenEnergy", cost: 5},
		waterwheel: {name: "Waterwheel", desc: "A wheel turned by a river. It powers a generator", amt: 0, prodMultiplier: 1, outputType: outputs.energy, inputType: inputs.water, baseOut: 2, input: 5, nonConsume: true, researchRequired: "Waterwheels", type: "GreenEnergy", cost: 9},
		oilDrill: {name: "Oil Drill", desc: "A primitive drill that slowly lifts up oil", amt: 0, prodMultiplier: 1, outputType: outputs.oil, inputType: inputs.energy, baseOut: 2, input: 1, researchRequired: "Oil Mechanisms", type: "FossilFuel", cost: 10},
		oilEngine: {name: "Oil Generator", desc: "A standard-issue combustion engine that uses oil and generates energy", amt: 0, prodMultiplier: 1, outputType: outputs.energy, inputType: inputs.oil, baseOut: 2, input: 1, researchRequired: "Oil Mechanisms", type: "FossilFuel", cost: 12},
		oilBurner: {name: "Oil-powered Water Heater", desc: "A machine that uses the heat from burning oil to heat water and turn turbines", amt: 0, prodMultiplier: 1, outputType: outputs.energy, inputType: inputs.oil, baseOut: 10, input: 4, researchRequired: "Oil Mechanisms", type: "FossilFuel", cost: 15},
		windTurbine: {name: "Wind Turbine", desc: "A device that uses wind to generate energy", amt: 0, prodMultiplier: 1, outputType: outputs.energy, inputType: inputs.nothing, baseOut: 4, researchRequired: "Wind Turbines", type: "GreenEnergy", cost: 20},
		hydroDam: {name: "Hydroelectric Dam", desc: "An improved waterwheel, the Hydroelectric Dam's turbines are much more efficient", amt: 0, outputType: outputs.energy, inputType: inputs.nothing, baseOut: 4, input: 9, researchRequired: "Hydroelectric Dams", type: "GreenEnergy", cost: 18},
		biofuelMaker: {name: "Biofuel Maker", desc: "A bio-fuel generating device, it makes gas out of crops", amt: 0, prodMultiplier: 1, outputType: outputs.oil, inputType: inputs.food, baseOut: 2, input: 1, researchRequired: "Biofuel", type: "GreenEnergy", cost: 10},
		battery: {name: "Battery", desc: "A device for storing energy", amt: 0, isStorage: true, storageBaseAmt: 100, storeMultiplier: 1, researchRequired: "Batteries",  type: "Storage", cost: 20}
	};
	research = {
		waterwheels: {cost: 25, researchTime: 15 /*seconds*/, name: "Waterwheels", unlock: 200},
		oilMechanisms: {cost: 40, researchTime: 25, name: "Oil Mechanisms", unlock: 500},
		windTurbines: {cost: 60, researchTime: 30, name: "Wind Turbines", unlock: 1200},
		hydroelectric: {cost: 75, researchTime: 45, name: "Hydroelectric Dams", unlock: 5000},
		biofuel: {cost: 80, researchTime: 40, name: "Biofuel", unlock: 10000},
	};
	upgrades = {
		production: {wheel: {cost: 10, name: "Invent the wheel", desc: "Doubles all production", effect: 2, unlock: 100 /*all is energy*/}, existence: {cost: 20, name: "Think about existence", desc: "Doubles all production", effect: 2, unlock: 500}, gravity: {cost: 50, name: "Discover Gravity", desc: "Doubles production", effect: 2, unlock: 2500}, lightbulb: {cost: 100, name: "Invent the lightbulb", desc: "Doubles Production", effect: 2, unlock: 6000}},
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
		energyTotal += gens.lemon.amt * gens.lemon.baseOut * gens.lemon.prodMultiplier;
	}
}

function hasLoaded() {
	clearInterval(interval);
	startGame();
}

function startGame() {
	interval = setInterval(runGame, 100);
}

function runGame() {
	intervalNumber++;
	changeFood();
	addEnergy();
}