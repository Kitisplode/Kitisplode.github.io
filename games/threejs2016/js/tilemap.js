// Project: threejs2016
// File: tilemap.js
// Desc: Contains the class used for tilemaps. Based off of tilemap.js from Kitsengine Three/reneegamemaybe
// Author: Kitsu
// Created: July 01, 2016
//
//**************************************************************************************************

function TileType(t, sl,sr,sf,sb ,b, f, sol, o, ts)
{
	this.topUV = {x:t.x * ts.x, y:t.y * ts.y};
	
	this.sideLeftUV = {x:sl.x * ts.x, y:sl.y * ts.y};
	this.sideRightUV = {x:sr.x * ts.x, y:sr.y * ts.y};
	this.sideFrontUV = {x:sf.x * ts.x, y:sf.y * ts.y};
	this.sideBackUV = {x:sb.x * ts.x, y:sb.y * ts.y};
	
	this.bottomUV = {x:b.x * ts.x, y:b.y * ts.y};
	
	this.friction = f / 100;
	this.solid = sol;
	this.opaque = o;
}

function Tilemap(pEngine)
{
	var engine = pEngine;
	
	this.position = {x:0, y:0, z:0};
	this.center = {x:0, y:0, z:0};
	this.size = {x:0, y:0, z:0};
	var totalTiles = 0;
	var layerTiles = 0;

	// An array to store the different types of tiles.
	var tileTypes = [];
	
	// An array to store the tilemap itself.
	var tiles = [];
	
	// The tilemap's tilesheet and info on it.
	this.tilesheet;
	var tileSize = {x:0.3333, y:1};
	var animatedFrames = 0;
	var phong = 0;
	var smooth = 0;
	
	// The tilemap's mesh.
	this.model;
	
	// The tilemap's file.
	this.file = "";
	
	var madeChanges = false;
	
	// Called to initialize the tilemap.
	this.Initialize = function(p, filename)
	{
		this.position.x = p.x; this.position.y = p.y; this.position.z = p.z;
		
		/*for (var i = 0; i < totalTiles; i++)
		{
			tiles[i] = 0;
			if (i == 5 || i == 7) tiles[i] = -1;
			else if (i < layerTiles) tiles[i] = 1;
		}//*/
		
		this.LoadFromFile(filename);
		this.center.x = this.size.x / 2; this.center.y = this.size.y / 2; this.center.z = this.size.z / 2;
		totalTiles = this.size.x * this.size.y * this.size.z;
		layerTiles = this.size.x * this.size.z;
		
		this.CreateModel();
		engine.renderer3d.scene.add(this.model);
	}
	
	// Called to convert world coordinates to tilemap relative coordinates.
	this.ConvertCoords = function(p)
	{
		var mapPos = {
			x:Math.floor((p.x - this.position.x) + 0.5),
			y:Math.floor((p.y - this.position.y) + 0.5),
			z:Math.floor((p.z - this.position.z) + 0.5)
		};
		return mapPos;
	}
	
	// Called to retrieve the value at a given location on the tilemap.
	this.GetTile = function(p)
	{
		if (p.x < 0 || p.x >= this.size.x ||
			p.y < 0 || p.y >= this.size.y ||
			p.z < 0 || p.z >= this.size.z)
			return -2;
		return tiles[p.x + p.z * this.size.x + p.y * layerTiles];
		//return tiles[p.z + p.x * this.size.z + p.y * layerTiles];
	}
	
	this.GetTileSolid = function(tile)
	{
		if (tile <= -1 || tile >= tileTypes.length) return false;
		return tileTypes[tile].solid >= 1;
	}
	
	this.GetTileFriction = function(tile)
	{
		return tileTypes[tile].friction;
	}
	
	this.GetTileWater = function(tile)
	{
		if (tile <= -1 || tile >= tileTypes.length) return false;
		return tileTypes[tile].solid == 0;
	}
	
	this.GetPositionFromIndex = function(index)
	{
		if (index < 0 || index >= totalTiles)
			return null;
		return {x:index % this.size.z, y:Math.floor(index / layerTiles), z:Math.floor((index % layerTiles) / this.size.x)};
		//return {x:Math.floor((index % layerTiles) / this.size.z), y:Math.floor(index / layerTiles), z:index % this.size.z};
	}
	
	this.CollidePointWithTilemap = function(p)
	{
		mapPos = this.ConvertCoords(p);
		if (mapPos.x < 0 || mapPos.x >= this.size.x || mapPos.y < 0 || mapPos.y >= this.size.y || mapPos.z < 0 || mapPos.z >= this.size.z) return false;
		
		return this.GetTileSolid(this.GetTile(mapPos));
	}
	
	this.CollidePointWithWater = function(p)
	{
		mapPos = this.ConvertCoords(p);
		if (mapPos.x < 0 || mapPos.x >= this.size.x || mapPos.y < 0 || mapPos.y >= this.size.y || mapPos.z < 0 || mapPos.z >= this.size.z) return false;
		
		return this.GetTileWater(this.GetTile(mapPos));
	}
	
	this.CollideAABBWithTilemap = function(aabb)
	{
		var oft = 0.5;
		// Check that the aabb actually collides with the tilemap's aabb
		if (!collideAABBs(aabb, {min:{x:this.position.x - oft,y:this.position.y - oft,z:this.position.z - oft}, max:{x:this.position.x + this.size.x + oft,y:this.position.y + this.size.y + oft,z:this.position.z + this.size.z + oft}})) return false;
	
		// Check all the tiles the aabb occupies.
		var results = false;
		{
			var min = this.ConvertCoords(aabb.min); //alert(aabb.min.x + "," + aabb.min.y + "," + aabb.min.z + ", - " + aabb.max.x + "," + aabb.max.y + "," + aabb.max.z);
			var max = this.ConvertCoords(aabb.max); //alert(min.x + "," + min.y + "," + min.z + ", - " + max.x + "," + max.y + "," + max.z);
			for (var i = min.x; i <= max.x; i++)
			{
				if (i < 0 || i >= this.size.x) continue;
				for (var j = min.y; j <= max.y; j++)
				{
					if (j < 0 || j >= this.size.y) continue;
					for (var k = min.z; k <= max.z; k++)
					{
						if (k < 0 || k >= this.size.z) continue;
						if (this.GetTileSolid(this.GetTile({x:i, y:j, z:k})))
						{
							results = true;
							break;
						}
					}
				}
			}
		}
		return results;
	}
	
	// Called to create a mesh for the tilemap.
	this.CreateModel = function()
	{
		if (this.model != null)
		{
			engine.renderer3d.scene.remove(this.model);
		}
		var geometry = new THREE.Geometry();
		var layerVerts = (this.size.x + 1) * (this.size.z + 1);
		var lineVerts = this.size.z + 1;
		
		var vBuffer = new VBufferHelper();
		
		// Loop through each tile.
		for (var j = 0; j < this.size.y; j++)
		{
			for (var i = 0; i < this.size.x; i++)
			{
				for (var k = 0; k < this.size.z; k++)
				{
					var tile = this.GetTile({x:i, y:j, z:k});
					if (tile <= -1) continue;					// Skip empty air.
					var type = tileTypes[tile];
					var opacity = type.opaque;
					var blockOffset = 0.5;
					var uvOffset = {x:0.01 * tileSize.x, y:0.01 * tileSize.y};
					// If we're in the bottom row or the tile below us is empty, make bottom faces.
					if (type.bottomUV.x >= 0 && (j == 0 || this.GetTile({x:i, y:j - 1, z:k}) <= -1))
					{
						// Get the vertices for the face.
						var bl = vBuffer.AddVertex({x:i - blockOffset, y:j - blockOffset, z:k - blockOffset}); var br = vBuffer.AddVertex({x:i + blockOffset, y:j - blockOffset, z:k - blockOffset});
						var tr = vBuffer.AddVertex({x:i + blockOffset, y:j - blockOffset, z:k + blockOffset}); var tl = vBuffer.AddVertex({x:i - blockOffset, y:j - blockOffset, z:k + blockOffset});
						geometry.faces.push(
							new THREE.Face3(bl, br, tr),
							new THREE.Face3(bl, tr, tl)
						);
						geometry.faceVertexUvs[0].push([ new THREE.Vector2(type.bottomUV.x + uvOffset.x, type.bottomUV.y + tileSize.y - uvOffset.y),
							new THREE.Vector2(type.bottomUV.x + tileSize.x - uvOffset.x, type.bottomUV.y + tileSize.y - uvOffset.y), new THREE.Vector2(type.bottomUV.x + tileSize.x - uvOffset.x, type.bottomUV.y + uvOffset.y)]);
						geometry.faceVertexUvs[0].push([ new THREE.Vector2(type.bottomUV.x + uvOffset.x, type.bottomUV.y + tileSize.y - uvOffset.y),
							new THREE.Vector2(type.bottomUV.x + tileSize.x - uvOffset.x, type.bottomUV.y + uvOffset.y), new THREE.Vector2(type.bottomUV.x + uvOffset.x, type.bottomUV.y + uvOffset.y)]);
					}
					// Top row.
					if (type.topUV.x >= 0 && (j == this.size.y - 1 || this.GetTile({x:i, y:j + 1, z:k}) <= -1))
					{
						var br = vBuffer.AddVertex({x:i - blockOffset, y:j + blockOffset, z:k - blockOffset}); var bl = vBuffer.AddVertex({x:i + blockOffset, y:j + blockOffset, z:k - blockOffset});
						var tl = vBuffer.AddVertex({x:i + blockOffset, y:j + blockOffset, z:k + blockOffset}); var tr = vBuffer.AddVertex({x:i - blockOffset, y:j + blockOffset, z:k + blockOffset});
						geometry.faces.push(
							new THREE.Face3(bl, br, tr),
							new THREE.Face3(bl, tr, tl)
						);
						geometry.faceVertexUvs[0].push([ new THREE.Vector2(type.topUV.x + uvOffset.x, type.topUV.y + tileSize.y - uvOffset.y),
							new THREE.Vector2(type.topUV.x + tileSize.x - uvOffset.x, type.topUV.y + tileSize.y - uvOffset.y), new THREE.Vector2(type.topUV.x + tileSize.x - uvOffset.x, type.topUV.y + uvOffset.y)]);
						geometry.faceVertexUvs[0].push([ new THREE.Vector2(type.topUV.x + uvOffset.x, type.topUV.y + tileSize.y - uvOffset.y),
							new THREE.Vector2(type.topUV.x + tileSize.x - uvOffset.x, type.topUV.y + uvOffset.y), new THREE.Vector2(type.topUV.x + uvOffset.x, type.topUV.y + uvOffset.y)]);
					}
					// Left.
					if (type.sideLeftUV.x >= 0 && (i == 0 || this.GetTile({x:i - 1, y:j, z:k}) <= -1))
					{
						var tr = vBuffer.AddVertex({x:i - blockOffset, y:j - blockOffset, z:k - blockOffset}); var tl = vBuffer.AddVertex({x:i - blockOffset, y:j - blockOffset, z:k + blockOffset});
						var bl = vBuffer.AddVertex({x:i - blockOffset, y:j + blockOffset, z:k + blockOffset}); var br = vBuffer.AddVertex({x:i - blockOffset, y:j + blockOffset, z:k - blockOffset});
						geometry.faces.push(
							new THREE.Face3(bl, br, tr),
							new THREE.Face3(bl, tr, tl)
						);
						geometry.faceVertexUvs[0].push([ new THREE.Vector2(type.sideLeftUV.x + uvOffset.x, type.sideLeftUV.y + tileSize.y - uvOffset.y),
							new THREE.Vector2(type.sideLeftUV.x + tileSize.x - uvOffset.x, type.sideLeftUV.y + tileSize.y - uvOffset.y), new THREE.Vector2(type.sideLeftUV.x + tileSize.x - uvOffset.x, type.sideLeftUV.y + uvOffset.y)]);
						geometry.faceVertexUvs[0].push([ new THREE.Vector2(type.sideLeftUV.x + uvOffset.x, type.sideLeftUV.y + tileSize.y - uvOffset.y),
							new THREE.Vector2(type.sideLeftUV.x + tileSize.x - uvOffset.x, type.sideLeftUV.y + uvOffset.y), new THREE.Vector2(type.sideLeftUV.x + uvOffset.x, type.sideLeftUV.y + uvOffset.y)]);
					}
					// Right.
					if (type.sideRightUV.x >= 0 && (i == this.size.x - 1 || this.GetTile({x:i + 1, y:j, z:k}) <= -1))
					{
						var tl = vBuffer.AddVertex({x:i + blockOffset, y:j - blockOffset, z:k - blockOffset}); var tr = vBuffer.AddVertex({x:i + blockOffset, y:j - blockOffset, z:k + blockOffset});
						var br = vBuffer.AddVertex({x:i + blockOffset, y:j + blockOffset, z:k + blockOffset}); var bl = vBuffer.AddVertex({x:i + blockOffset, y:j + blockOffset, z:k - blockOffset});
						geometry.faces.push(
							new THREE.Face3(bl, br, tr),
							new THREE.Face3(bl, tr, tl)
						);
						geometry.faceVertexUvs[0].push([ new THREE.Vector2(type.sideRightUV.x + uvOffset.x, type.sideRightUV.y + tileSize.y - uvOffset.y),
							new THREE.Vector2(type.sideRightUV.x + tileSize.x - uvOffset.x, type.sideRightUV.y + tileSize.y - uvOffset.y), new THREE.Vector2(type.sideRightUV.x + tileSize.x - uvOffset.x, type.sideRightUV.y + uvOffset.y)]);
						geometry.faceVertexUvs[0].push([ new THREE.Vector2(type.sideRightUV.x + uvOffset.x, type.sideRightUV.y + tileSize.y - uvOffset.y),
							new THREE.Vector2(type.sideRightUV.x + tileSize.x - uvOffset.x, type.sideRightUV.y + uvOffset.y), new THREE.Vector2(type.sideRightUV.x + uvOffset.x, type.sideRightUV.y + uvOffset.y)]);
					}
					// Front.
					if (type.sideFrontUV.x >= 0 && (k == 0 || this.GetTile({x:i, y:j, z:k - 1}) <= -1))
					{
						var tl = vBuffer.AddVertex({x:i - blockOffset, y:j - blockOffset, z:k - blockOffset}); var tr = vBuffer.AddVertex({x:i + blockOffset, y:j - blockOffset, z:k - blockOffset});
						var br = vBuffer.AddVertex({x:i + blockOffset, y:j + blockOffset, z:k - blockOffset}); var bl = vBuffer.AddVertex({x:i - blockOffset, y:j + blockOffset, z:k - blockOffset});
						geometry.faces.push(
							new THREE.Face3(bl, br, tr),
							new THREE.Face3(bl, tr, tl)
						);
						geometry.faceVertexUvs[0].push([ new THREE.Vector2(type.sideFrontUV.x + uvOffset.x, type.sideFrontUV.y + tileSize.y - uvOffset.y),
							new THREE.Vector2(type.sideFrontUV.x + tileSize.x - uvOffset.x, type.sideFrontUV.y + tileSize.y - uvOffset.y), new THREE.Vector2(type.sideFrontUV.x + tileSize.x - uvOffset.x, type.sideFrontUV.y + uvOffset.y)]);
						geometry.faceVertexUvs[0].push([ new THREE.Vector2(type.sideFrontUV.x + uvOffset.x, type.sideFrontUV.y + tileSize.y - uvOffset.y),
							new THREE.Vector2(type.sideFrontUV.x + tileSize.x - uvOffset.x, type.sideFrontUV.y + uvOffset.y), new THREE.Vector2(type.sideFrontUV.x + uvOffset.x, type.sideFrontUV.y + uvOffset.y)]);
					}
					// Rear.
					if (type.sideBackUV.x >= 0 && (k == this.size.z - 1 || this.GetTile({x:i, y:j, z:k + 1}) <= -1))
					{
						var tr = vBuffer.AddVertex({x:i - blockOffset, y:j - blockOffset, z:k + blockOffset}); var tl = vBuffer.AddVertex({x:i + blockOffset, y:j - blockOffset, z:k + blockOffset});
						var bl = vBuffer.AddVertex({x:i + blockOffset, y:j + blockOffset, z:k + blockOffset}); var br = vBuffer.AddVertex({x:i - blockOffset, y:j + blockOffset, z:k + blockOffset});
						geometry.faces.push(
							new THREE.Face3(bl, br, tr),
							new THREE.Face3(bl, tr, tl)
						);
						geometry.faceVertexUvs[0].push([ new THREE.Vector2(type.sideBackUV.x + uvOffset.x, type.sideBackUV.y + tileSize.y - uvOffset.y),
							new THREE.Vector2(type.sideBackUV.x + tileSize.x - uvOffset.x, type.sideBackUV.y + tileSize.y - uvOffset.y), new THREE.Vector2(type.sideBackUV.x + tileSize.x - uvOffset.x, type.sideBackUV.y + uvOffset.y)]);
						geometry.faceVertexUvs[0].push([ new THREE.Vector2(type.sideBackUV.x + uvOffset.x, type.sideBackUV.y + tileSize.y - uvOffset.y),
							new THREE.Vector2(type.sideBackUV.x + tileSize.x - uvOffset.x, type.sideBackUV.y + uvOffset.y), new THREE.Vector2(type.sideBackUV.x + uvOffset.x, type.sideBackUV.y + uvOffset.y)]);
					}
				}
			}
		}
		// randomize each of the vertices by a small amount.
		/*for (var i = 0; i < vBuffer.vertices.length; i++)
		{
			var vert = vBuffer.vertices[i];
			vert.x += Math.random() * 0.1 - 0.05;
			vert.y += Math.random() * 0.1 - 0.05;
			vert.z += Math.random() * 0.1 - 0.05;
		}//*/
		
		// Loop through the vBuffer, copying the vertices over to the geometry.
		for (var i = 0; i < vBuffer.vertices.length; i++)
		{
			var vert = vBuffer.vertices[i];
			geometry.vertices.push(new THREE.Vector3(vert.x, vert.y, vert.z));
		}
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();
		
		if (smooth > 0)
		{
			var modifier = new THREE.SubdivisionModifier( smooth );
			modifier.modify( geometry );
		}
		
		var material;
		if (phong == 0) material = new THREE.MeshLambertMaterial({map: this.tileSheet});
		else
		{
			material = new THREE.MeshPhongMaterial({map:this.tileSheet, transparent:true, shininess:100, specular:new THREE.Color(0xffffff)});
		}
		//material.shading = THREE.FlatShading;
		//var material = new THREE.MeshLambertMaterial({color: 0xffffff});
		this.model = new THREE.Mesh(geometry, material);
		this.model.castShadow = false;
		this.model.receiveShadow = true;
	}
	
	// Called to load a tilemap from a file.
	this.LoadFromFile = function(filename)
	{
		tiles.length = 0;
		try
		{
			var str_temp;
			var request = new XMLHttpRequest();
			request.open('GET', "scripts/" + filename, false);
			request.send(null);
			str_temp = request.responseText;
			
			var linestart = 0;
			var linecount = 0;
			
			var tileset;
			var mode = 0;
			
			for (var i = 0; i < str_temp.length; i++)
			{
				// At the end of each line, read in the data.
				if (str_temp.charAt(i) == '\n')
				{
					// Read set up stuff.
					if (mode == 0)
					{
						// Read in the name of the tileset file.
						if (linecount == 0) tileset = str_temp.substring(linestart, i - 1);
						// Read in the size of the tilemap.
						else if (linecount == 1) this.size.x = parseInt(str_temp.substring(linestart, i - 1));
						else if (linecount == 2) this.size.y = parseInt(str_temp.substring(linestart, i - 1));
						else if (linecount == 3) this.size.z = parseInt(str_temp.substring(linestart, i - 1));
						else if (linecount == 4)
						{
							mode = 1;
							linecount = -1;
							totalTiles = this.size.x * this.size.y * this.size.z;
							layerTiles = this.size.x * this.size.z;
						}
					}
					// Read map data.
					else if (mode == 1)
					{
						if (str_temp.charAt(linestart) == '+')
						{
							linestart = i + 1;
							continue;
						}
						if (linecount <= this.size.y * this.size.x)
						{
							var wordstart = linestart;
							// Read through the line again, reading a number each time we reach a space.
							for (var j = linestart; j <= i; j++)
							{
								//if (tiles.length >= totalTiles) break;
								if (str_temp.charAt(j) == ' ')
								{
									var index = parseInt(str_temp.substring(wordstart, j));
									wordstart = j + 1;
									// If we got -2, set the block back to a normal air block and then set the spawn position.
									if (index == -2)
									{
										index = -1;
										var spawn = this.GetPositionFromIndex(tiles.length);
										engine.spawnPosition.x = spawn.x; engine.spawnPosition.y = spawn.y; engine.spawnPosition.z = spawn.z;
									}
									tiles.push(index);
								}
							}
							/*if (tiles.length >= totalTiles)
							{
								mode = 2;
								linecount = -1;
							}//*/
						}
						else
						{
							mode = 2;
							linecount = -1;
						}
					}
					linestart = i + 1;
					linecount++;
				}
			}
			
			// Read in the tilesheet.
			this.LoadTileSheet(tileset);
		}
		catch(e)
		{
			alert(e + "\n" + filename);
		}
	}
	
	this.LoadTileSheet = function(filename)
	{
		tileTypes.length = 0;
		try
		{
			var str_temp;
			var request = new XMLHttpRequest();
			request.open('GET', "scripts/" + filename, false);
			request.send(null);
			str_temp = request.responseText;
			
			var linestart = 0;
			var linecount = 0;
			
			var mode = 0;
			
			var textureName;
			var ts = {x:0, y:0};
			var tn, tpr, tpc, f, solid, o;
			// ts: tile size in pixels
			// tn: number of tiles on sheet
			// tpr: number of tiles per row
			// tpc: number of tiles per column
			// f: friction for the tile
			
			var top, sideLeft,sideRight,sideFront,sideBack, bottom;
			
			for (var j = 0; j < str_temp.length; j++)
			{
				// At the end of each line, read in the data.
				if (str_temp.charAt(j) == '\n')
				{
					if (mode == 0)
					{
						if (linecount == 0) textureName = str_temp.substring(linestart, j - 1);
						else if (linecount == 1) ts.x = parseInt(str_temp.substring(linestart, j - 1));
						else if (linecount == 2) ts.y = parseInt(str_temp.substring(linestart, j - 1));
						else if (linecount == 3) tn = parseInt(str_temp.substring(linestart, j - 1));
						else if (linecount == 4) tpr = parseInt(str_temp.substring(linestart, j - 1));
						else if (linecount == 5) tpc = parseInt(str_temp.substring(linestart, j - 1));
						else if (linecount == 6) animatedFrames = parseInt(str_temp.substring(linestart, j - 1));
						else if (linecount == 7) phong = parseInt(str_temp.substring(linestart, j - 1));
						else if (linecount == 8) smooth = parseInt(str_temp.substring(linestart, j - 1));
						else if (linecount == 9)
						{
							mode = 1;
							linecount = -1;
							tileSize.x = 1 / tpr;
							tileSize.y = 1 / tpc;
						}
					}
					else
					{
						if (linecount == 0) top = parseInt(str_temp.substring(linestart, j - 1));
						else if (linecount == 1) sideLeft = parseInt(str_temp.substring(linestart, j - 1));
						else if (linecount == 2) sideRight = parseInt(str_temp.substring(linestart, j - 1));
						else if (linecount == 3) sideFront = parseInt(str_temp.substring(linestart, j - 1));
						else if (linecount == 4) sideBack = parseInt(str_temp.substring(linestart, j - 1));
						else if (linecount == 5) bottom = parseInt(str_temp.substring(linestart, j - 1));
						else if (linecount == 6) f = parseInt(str_temp.substring(linestart, j - 1));
						else if (linecount == 7) solid = parseInt(str_temp.substring(linestart, j - 1));
						else if (linecount == 8)
						{
							o = parseInt(str_temp.substring(linestart, j - 1));
							tileTypes.push(new TileType({x:top % tpr,y:(tpc - 1) - Math.floor(top / tpr)},
														{x:sideLeft % tpr,y:(tpc - 1) - Math.floor(sideLeft / tpr)},
														{x:sideRight % tpr,y:(tpc - 1) - Math.floor(sideRight / tpr)},
														{x:sideFront % tpr,y:(tpc - 1) - Math.floor(sideFront / tpr)},
														{x:sideBack % tpr,y:(tpc - 1) - Math.floor(sideBack / tpr)},
														{x:bottom % tpr,y:(tpc - 1) - Math.floor(bottom / tpr)},
														f, solid, o, tileSize));
							linecount = -2;
						}
					}
					linestart = j + 1;
					linecount++;
				}
			}
			this.tileSheet = THREE.ImageUtils.loadTexture(engine.dirImages + "/" + textureName);
			this.tileSheet.magFilter = THREE.NearestFilter;
			this.tileSheet.minFilter = THREE.LinearMipMapLinearFilter;
		}
		catch(e)
		{
			alert(e + "\n" + filename);
		}
	}
	
	// Called to draw the tilemap.
	this.Draw = function()
	{
		if (madeChanges)
		{
			this.CreateModel();
			engine.renderer3d.scene.add(this.model);
		}
		
		this.model.position.x = this.position.x;
		this.model.position.y = this.position.y;
		this.model.position.z = this.position.z;
		
		// If our texture is animated, animate.
		if (animatedFrames > 1)
		{
		
		}
	}
}

function TilemapStorage(pEngine)
{
	var engine = pEngine;
	// An array to store the tilemaps.
	this.tileMapStorage = [];
	
	this.Initialize = function(filename)
	{
		this.LoadLevelManifest(filename);
	}
	
	this.LoadLevelManifest = function(filename)
	{
		this.tileMapStorage.length = 0;
		var whatup = 1;
		var whatup2 = 1;
		try
		{
			var str_temp;
			var request = new XMLHttpRequest();
			request.open('GET', engine.dirScripts + "/" + filename, false);
			request.send(null);
			str_temp = request.responseText;
			
			var linecount = 0;
			var linestart = 0;
			
			var mode = 0;
			
			var fn, px, py, pz;
			
			for (var j = 0; j < str_temp.length; j++)
			{
				// At the end of each line, read in the data.
				if (str_temp.charAt(j) == '\n')
				{
					if (mode == 0)
					{
						if (linecount == 0)
						{
							mode = 1;
							linecount = -1;
						}
					}
					else
					{
						if (linecount == 0) fn = str_temp.substring(linestart, j - 1);
						else if (linecount == 1) px = parseInt(str_temp.substring(linestart, j - 1));
						else if (linecount == 2) py = parseInt(str_temp.substring(linestart, j - 1));
						else if (linecount == 3)
						{
							whatup = 0;
							var index = this.tileMapStorage.length;whatup++;
							pz = parseInt(str_temp.substring(linestart, j - 1));whatup++;
							this.tileMapStorage.push(new Tilemap(engine));whatup++;
							this.tileMapStorage[index].Initialize({x:px, y:py, z:pz}, fn);whatup++;
							linecount = -2;
						}
					}
					linestart = j + 1;
					linecount++;
					whatup2++;
				}
			}
		}
		catch (e)
		{
			alert(e + "\n" + whatup2 + " " + whatup);
		}
	}
	
	this.CollidePointWithTilemap = function(p)
	{
		var results = false;
		for (var i = 0; i < this.tileMapStorage.length; i++)
		{
			if (this.tileMapStorage[i].CollidePointWithTilemap(p))
			{
				results = true;
				break;
			}
		}
		return results;
	}
	
	this.CollidePointWithWater = function(p)
	{
		
		var results = false;
		for (var i = 0; i < this.tileMapStorage.length; i++)
		{
			if (this.tileMapStorage[i].CollidePointWithWater(p))
			{
				results = true;
				break;
			}
		}
		return results;
	}
	
	this.CollideAABBWithTilemap = function(aabb)
	{
		var results = false;
		for (var i = 0; i < this.tileMapStorage.length; i++)
		{
			if (this.tileMapStorage[i].CollideAABBWithTilemap(aabb))
			{
				results = true;
				break;
			}
		}
		return results;
	}
	
	this.Draw = function()
	{
		for (var i = 0; i < this.tileMapStorage.length; i++)
		{
			this.tileMapStorage[i].Draw();
		}
	}
}

function VBufferHelper()
{
	this.vertices = [];
	this.AddVertex = function(v)
	{
		var i = 0;
		// Before adding the vertex, check through the vertex list to ensure it hasn't already been added.
		for (; i < this.vertices.length; i++)
		{
			if (v.x == this.vertices[i].x && v.y == this.vertices[i].y && v.z == this.vertices[i].z) return i;
		}
		this.vertices.push(v);
		return i;
	}
}