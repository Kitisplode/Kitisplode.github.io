var servants = [ { name: "Mash Kyrielight",		id:"1", class:0 },
	{ name: "Altria Pendragon",					id:"2", class:1},
	{ name: "Altria Pendragon (Alter)",			id:"3", class:1},
	{ name: "Altria Pendragon (Lily)",			id:"4", class:1},
	{ name: "Nero Claudius",					id:"5", class:1},
	{ name: "Siegfried",						id:"6", class:1},
	{ name: "Gaius Julius Caesar",				id:"7", class:1},
	{ name: "Attila the Hun / Altera",			id:"8", class:1},
	{ name: "Gilles de Rais",					id:"9", class:1},
	{ name: "Chevalier d'Eon",					id:"10", class:1},
	{ name: "EMIYA",							id:"11", class:2},
	{ name: "Gilgamesh",						id:"12", class:2},
	{ name: "Robin Hood",						id:"13", class:2},
	{ name: "Atalante",							id:"14", class:2},
	{ name: "Euryale",							id:"15", class:2},
	{ name: "Arash",							id:"16", class:2},
	{ name: "Cu Chulainn",						id:"17", class:3},
	{ name: "Elizabeth Bathory",				id:"18", class:3},
	{ name: "Benkei",							id:"19", class:3},
	{ name: "Cu Chulainn (Prototype)",			id:"20", class:3},
	{ name: "Leonidas I",						id:"21", class:3},
	{ name: "Romulus",							id:"22", class:3},
	{ name: "Medusa",							id:"23", class:4},
	{ name: "Georgios",							id:"24", class:4},
	{ name: "Edward Teach",						id:"25", class:4},
	{ name: "Boudicca",							id:"26", class:4},
	{ name: "Ushiwakamaru",						id:"27", class:4},
	{ name: "Alexander",						id:"28", class:4},
	{ name: "Marie Antoinette",					id:"29", class:4},
	{ name: "Martha",							id:"30", class:4},
	{ name: "Medea",							id:"31", class:5},
	{ name: "Gilles de Rais",					id:"32", class:5},
	{ name: "Hans Christian Andersen",			id:"33", class:5},
	{ name: "William Shakespeare",				id:"34", class:5},
	{ name: "Mephistopheles",					id:"35", class:5},
	{ name: "Wolfgang Amadeus Mozart",			id:"36", class:5},
	{ name: "Zhuge Liang / Lord El-Melloi II",	id:"37", class:5},
	{ name: "Cu Chulainn",						id:"38", class:5},
	{ name: "Sasaki Kojiro",					id:"39", class:6},
	{ name: "Hassan of the Cursed Arm",			id:"40", class:6},
	{ name: "Stheno",							id:"41", class:6},
	{ name: "Jing Ke",							id:"42", class:6},
	{ name: "Charles-Henri Sanson",				id:"43", class:6},
	{ name: "Phantom of the Opera",				id:"44", class:6},
	{ name: "Mata Hari",						id:"45", class:6},
	{ name: "Carmilla",							id:"46", class:6},
	{ name: "Heracles",							id:"47", class:7},
	{ name: "Lancelot",							id:"48", class:7},
	{ name: "Lu Bu Fengxian",					id:"49", class:7},
	{ name: "Spartacus",						id:"50", class:7},
	{ name: "Sakata Kintoki",					id:"51", class:7},
	{ name: "Vlad III",							id:"52", class:7},
	{ name: "Asterios",							id:"53", class:7},
	{ name: "Caligula",							id:"54", class:7},
	{ name: "Darius III",						id:"55", class:7},
	{ name: "Kiyohime",							id:"56", class:7},
	{ name: "Eric Bloodaxe",					id:"57", class:7},
	{ name: "Tamamo Cat",						id:"58", class:7},
	{ name: "Jeanne d'Arc",						id:"59", class:8}
];


function generateFateRouletteContent(parent, data)
{
	console.log("script run");
	for (var thing of data)
	{
		console.log(thing.name);
		console.log(idToImageSource(thing.id));
		var element = document.createElement("DIV");
		parent.appendChild(element);
		var image = document.createElement("IMG");
		image.setAttribute("alt", thing.name);
		image.setAttribute("src", idToImageSource(thing.id));
		element.appendChild(image);
	}
}

function idToImageSource(id)
{
	return "images/fateroulette/" + id + ".png";
}

generateFateRouletteContent(document.querySelector("fateroulette"), servants);