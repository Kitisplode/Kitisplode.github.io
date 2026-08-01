var classes = [ "Shielder",	"Saber",
	"Archer",
	"Lancer",
	"Rider",
	"Caster",
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
		image.setAttribute("onerror", "this.onerror=null; this.src=idToImageSource(\"template\");");
		image.setAttribute("class", classes[thing.class] + " " + thing.tags);
		element.appendChild(image);
	}
}

function idToImageSource(id)
{
	return "images/fateroulette/" + id + ".png";
}

generateFateRouletteContent(document.getElementById("fateroulette"), servants);