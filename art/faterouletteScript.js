var classes = [ "Shielder",	"Saber",
	"Archer",
	"Lancer",
	"Rider",
	"Caster"
	"Assassin",
	"Berserker",
	"Ruler",
	"Avenger",
	"Moon Cancer",
	"Alter Ego",
	"Foreigner",
	"Pretender",
	"Beast"
];

var sources = [
	"Fate/Grand Order",
	"Fate/Stay Night",
	"Fate/Hollow Ataraxia",
	"Fate/Grand Order NPC",
	"Fate/Grand Order Arcade",
	"Fate/Extra",
	"Fate/Extra CCC",
	"Fate/Extra CCC: Foxtail",
	"Fate/Apocrypha",
	"Fate/Extella: Umbral Star",
	"Fate/Extella Link",
	"Fate/Strange Fake",
	"Fate/Zero",
	"Fate/Kaleid Liner Prisma Illya",
	"Fate/Prototype",
	"Fate/Lost Einherjar",
	"Fate/Requiem",
	"Fate/Samurai Remnant",
	"Fate/Redline",
	"FGO Learn With Manga",
	"Koha Ace"
	"Witch of the Holy Night",
	"Garden of Sinners",
	"Tsukihime",
	"Capsule Servant",
	"Other"
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

generateFateRouletteContent(document.getElementById("fateroulette"), servants);