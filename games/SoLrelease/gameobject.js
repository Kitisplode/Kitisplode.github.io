// Project: SoL2014
// File: gameobject.js
// Desc: Contains the class definition for the gameobject class, and for the various objects that
//			instantiate the class.
// Author: Kitsu
// Created: January 14, 2014
//
//**************************************************************************************************

// Player class constants.
var playerConstants =
{
	idleCollision: {l:-6, t: -15, w:12, h:22},
	duckCollision: {l:-6, t: -5, w:12, h:12},
	
	gravity: 1.0,
	jumpSpeed: -7.05,
	fallMaxSpeed: 5.0,
	jumpTime: 6,
	
	runSpeed: 3,
	runAccel: 1,
	runDecel: 2,
	airMultiplier: 0.90,
	
	climbingSpeed: 2,
	climbingPointsTop: -6,
	climbingPointsBottom: 10,
	climbingPointsExtend: 18,
	
	chargeFull: 100,
	chargeRate: 5,
	paintBlobSpeed: 10,
	paintDist: 32,
	paintPlatTime: 5,
	
	ouchTimer: -5,
	invulnTimer: 45,
	playerDeathTimer: -90,
	
	paintCan: 2,
	paintHitCost: 1,
	paintSwingHit: 0
};

// Other object constants.
var enemyConstants = 
{
	flyerSpeed: -1,
	pkAccel: 0.025,
	pkSpeed: 0.75,
	
	shotTimer: 75,
	bulletSpeed: 3,
	bossDeathTimer: -60,
	bossTimer: 120,
	bossHP: 8
};

var enemyTypes = 
{
	sol:		-1,

	oneup:		0,
	arthur:		1,
	c2b:		2,
	devi:		3,
	
	dex:		4,
	drako:		5,
	gwen:		6,
	gors:		7,
	
	kaikimi:	8,
	keychain:	9,
	duck:		10,
	metaru:		11,
	
	nindo:		12,
	pk:			13,
	previ:		14,
	rokkan:		15,
	
	ob2ko:		16,
	shawn:		17,
	ng:			18,
	tachikoma:	19,
	
	tom:		20,
	shark:		21,
	a6:			22,
	kit:		23,
	
	ew:			24,
	woppet:		25,
	kosh:		26,
	groove:		27,
	afro:		28,
	gnostic:	29,
	raellyn:	30,
	guy:		31,
	
	dazz:		32,
	masq:		33,
	vic:		34,
	bab:		35,
	iceman:		36,
	
	bullet:		37,
	dazzHat:	38,
	masqBlob:	39,
	masqSplash:	40,
	vicShot:	41,
	icemanFood:	42,
	
	bossCount: 5
};

// Set of object types.
var objectTypes = 
{
	player: 0,
	effect: 1,
	enemy: 2,
	item: 3,
	paint: 4,
	paintPlat: 5,
	jackal: 6,
	credits: 7,
	enemyCredits: 8,
	controlsScreen: 9,
	splashTsr: 10
};

// Game object class
function GameObject(i)
{
	// Game object variables:
	this.index = i;
	this.active = false;
	
	this.type = 0;
	
	this.drawDepth = 0;

	// Physics variables:
	this.position = {x:0, y:0};
	this.prevPos = {x:0, y:0};
	this.velocity = {x:0, y:0};
	this.scale = 1.0;
	
	this.collisionRect = {l:0, t:0, w:0, h:0};
	this.collision = {l:0, t:0, w:0, h:0};
	
	// Sprite variables.
	this.spriteIndex = 0;
	this.frameIndex = 0.0;
	this.frameSpeed = 0.0;
	
	// Other variables. Their use depends on the object type.
	var extraBool = false;
	var extraBool2 = false;
	this.extraFloat = 0.0;
	this.extraFloat2 = 0.0;
	this.extraFloat3 = 0.0;
	this.extraFloat4 = 0.0;
	this.extraFloat5 = 0.0;
	
	this.extraInt = 0;
	this.extraInt2 = 0;
	this.extraInt3 = 0;
	this.extraInt4 = 0;
	this.extraInt5 = 0;
	
	this.extraString = "";
	// Methods
	// Called to initialize and activate an object.
	this.Initialize = function(t, p)
	{
		// Set the type and position.
		this.type = t;
		this.position.x = p.x;
		this.position.y = p.y;
		
		this.velocity.x = 0;
		this.velocity.y = 0;
		this.scale = -1.0;
		
		extraBool = false;
		extraBool2 = false;
		this.extraInt = 0;
		this.extraInt2 = 0;
		this.extraInt3 = 0;
		this.extraInt4 = 0;
		this.extraInt5 = 0;
		
		this.extraFloat = 0.0;
		this.extraFloat2 = 0.0;
		this.extraFloat3 = 0.0;
		this.extraFloat4 = 0.0;
		this.extraFloat5 = 0.0;
		
		// Set up the other variables according to the object type.
		switch (t)
		{
			case objectTypes.player:
				this.spriteIndex = spriteIndices.spr_playerIdle_right;
				this.frameSpeed = 9.0;
				this.collisionRect = {l:playerConstants.idleCollision.l, t:playerConstants.idleCollision.t, w:playerConstants.idleCollision.w, h:playerConstants.idleCollision.h};
				this.drawDepth = 2;
				this.scale = 1;
				// Used to represent the player's charge.
				this.extraInt2 = 0;
				break;
			case objectTypes.effect:
				this.spriteIndex = 1;
				this.frameSpeed = 12;
				this.collisionRect = {l:-1, t: -1, w:3, h:3};
				this.drawDepth = 3;
				this.extraInt2 = -1;
				// If set to 1, this effect will spawn a paintPlat when it's destroyed.
				this.extraInt3 = 0;
				break;
			case objectTypes.paint:
				this.spriteIndex = spriteIndices.spr_paintBlob;
				this.frameSpeed = 9;
				this.collisionRect = {l:-8, t:-8, w:16, h:16};
				this.drawDepth = 3;
				this.extraInt2 = -1;
				break;
			case objectTypes.paintPlat:
				this.spriteIndex = spriteIndices.spr_paintPlat;
				this.frameSpeed = 12;
				this.collisionRect = {l:-8, t:-8, w:16, h:8};
				this.drawDepth = 1;
				// A timer.
				this.extraInt = playerConstants.paintPlatTime * g_fps;
				break;
			case objectTypes.enemy:
			case objectTypes.enemyCredits:
				this.frameSpeed = 9;
				this.collisionRect = {l:playerConstants.idleCollision.l, t:playerConstants.idleCollision.t + 2, w:playerConstants.idleCollision.w, h:playerConstants.idleCollision.h - 2};
				this.drawDepth = 0;
				// The enemy's HP.
				this.extraInt = enemyConstants.bossHP;
				// The enemy's facing direction.
				this.scale = -1;
				// Remember to call enemy reinit on enemies to set up their more specific stuff.
				break;
			case objectTypes.jackal:
				this.spriteIndex = spriteIndices.spr_jackal;
				this.drawDepth = 5;
				this.collisionRect = {l:-1, t:-1, w:2, h:2};
				break;
			case objectTypes.item:
				this.spriteIndex = spriteIndices.spr_items;
				this.drawDepth = 1;
				this.collisionRect = {l:-6, t:-6, w:12, h:12};
				break;
			case objectTypes.credits:
				this.drawDepth = 11;
				this.spriteIndex = spriteIndices.spr_avys;
				break;
			case objectTypes.controlsScreen:
				this.drawDepth = 1;
				break;
			case objectTypes.splashTsr:
				this.spriteIndex = spriteIndices.spr_splash_tsr;
				this.frameSpeed = 0;
				this.velocity.y = 1;
				break;
		}
		
		// Set up some of the variables that will be the same regardless of object type.
		this.frameIndex = 0.0;
		this.prevPos.x = p.x;
		this.prevPos.y = p.y;
		
		this.collision = {l:Math.round(this.position.x) + this.collisionRect.l, t:Math.round(this.position.y) + this.collisionRect.t, w:this.collisionRect.w, h:this.collisionRect.h};
		
		// Activate the object.
		this.active = true;
	}
	
	// Call this function to re-initialize enemies to their own stats.
	this.ReInitEnemies = function(t, c)
	{
		// Set the enemy's type.
		this.extraInt2 = t;
		
		// Set the enemy's color.
		this.extraInt3 = c;
		
		// Set the enemy to non-homing for now.
		this.extraInt4 = 0;
		
		// For bosses, extraInt5 is used for state timers. Dazzhat uses extraInt5 to store the x coord of its target position.
		this.extraInt5 = 0;
		
		// Set the enemy to not jump for now.
		extraBool2 = false;
		
		// Set the enemy's spawntimer so the enemy will be inactive until onscreen.
		this.extraFloat2 = 360;
		
		// Extrafloat3 is used differently by different enemy types. For sine-flying enemies, it's their cycle. For bosses, it's their state. For boss bullets, it's their leash.
		this.extraFloat3 = 0;
		
		// Set the enemy's shooting timer to zero. If the enemy will be shooting, it'll be activated later.
		this.extraFloat4 = 0;
		
		// extraFloat5 is used by bosses as a hurt timer. Dazzhat uses extraFloat5 to store the y coord of its target position.
		this.extraFloat5 = 0;
		
		// Set up the other variables based on the enemy's type.
		switch (t)
		{
			case enemyTypes.arthur:
			case enemyTypes.duck:
			case enemyTypes.shark:
				if (this.type == objectTypes.enemy)
					this.position.x = g_spriteCamera.x + g_screensize.x + 16;
				this.position.y = (Math.round(Math.random() * 6) + 1) * 16 + 8;
				break;
			case enemyTypes.dex:
				this.extraInt4 = 1;
				extraBool2 = true;
				this.collisionRect.t = -7;
				this.collisionRect.h = 14;
				break;
			case enemyTypes.raellyn:
				this.collisionRect.t = -7;
				this.collisionRect.h = 14;
				break;
				
			case enemyTypes.sol:
			case enemyTypes.oneup:
			case enemyTypes.metaru:
			case enemyTypes.tachikoma:
				this.extraInt4 = 1;
				extraBool2 = true;
				break;
				
			case enemyTypes.pk:
			case enemyTypes.ew:
			case enemyTypes.shawn:
			case enemyTypes.devi:
				this.extraInt4 = 1;
				break;
				
			case enemyTypes.c2b:
			case enemyTypes.gwen:
			case enemyTypes.kaikimi:
			case enemyTypes.keychain:
			case enemyTypes.ob2ko:
			case enemyTypes.ng:
			case enemyTypes.tom:
			case enemyTypes.woppet:
			case enemyTypes.groove:
			case enemyTypes.gnostic:
			case enemyTypes.guy:
				extraBool2 = true;
				break;
				
			case enemyTypes.drako:
			case enemyTypes.gors:
			case enemyTypes.nindo:
			case enemyTypes.previ:
			case enemyTypes.rokkan:
			case enemyTypes.kosh:
			case enemyTypes.afro:
				break;
			
			case enemyTypes.a6:
			case enemyTypes.kit:
				break;
				
			case enemyTypes.dazz:
			case enemyTypes.masq:
			case enemyTypes.vic:
			case enemyTypes.bab:
			case enemyTypes.iceman:
				this.position.y = g_screensize.y / 2;
				this.extraInt5 = enemyConstants.bossTimer;
				this.collisionRect.l = -16; this.collisionRect.t = -12;
				this.collisionRect.w = 32; this.collisionRect.h = 24;
				break;
				
			case enemyTypes.bullet:
				this.collisionRect.l = -3; this.collisionRect.t = -3;
				this.collisionRect.w = 6; this.collisionRect.h = 6;
				this.drawDepth = 10;
				break;
			
			case enemyTypes.dazzHat:
				var toPlayer = {x:GameObjectArray[g_playerId].position.x - this.position.x, y:GameObjectArray[g_playerId].position.y - this.position.y};
				// Move towards the player position.
				toPlayer = NormalizeVector(toPlayer);
				this.velocity.x = toPlayer.x * 3;
				this.velocity.y = toPlayer.y * 3;
				this.extraInt5 = 0;
				this.collisionRect.l = -10; this.collisionRect.t = -8;
				this.collisionRect.w = 20; this.collisionRect.h = 8;
				this.drawDepth = 10;
				break;
			
			case enemyTypes.masqBlob:
				this.velocity.x = -Math.random() * 1.5 - 1;
				this.velocity.y = -5;
				this.extraFloat = (this.position.y / g_screensize.y) * 8;
				this.collisionRect.l = -8; this.collisionRect.t = -8;
				this.collisionRect.w = 16; this.collisionRect.h = 16;
				this.drawDepth = 10;
				break;
				
			case enemyTypes.masqSplash:
				this.collisionRect.l = -8; this.collisionRect.t = -8;
				this.collisionRect.w = 16; this.collisionRect.h = 16;
				this.drawDepth = 10;
				break;
				
			case enemyTypes.icemanFood:
				this.frameSpeed = 0;
				this.frameIndex = Math.round(Math.random() * 2);
				this.velocity.y = -5;
				this.extraFloat = (this.position.y / g_screensize.y) * 8;
				this.collisionRect.l = -8; this.collisionRect.t = -8;
				this.collisionRect.w = 16; this.collisionRect.h = 16;
				this.drawDepth = 10;
				break;
				
			case enemyTypes.vicShot:
				this.velocity.x = -3;
				this.collisionRect.l = -7; this.collisionRect.t = -1;
				this.collisionRect.w = 14; this.collisionRect.h = 2;
				this.drawDepth = 10;
				break;
		}
	
		this.collision.l = Math.round(this.position.x) + this.collisionRect.l;
		this.collision.t = Math.round(this.position.y) + this.collisionRect.t;
		this.collision.w = this.collisionRect.w;
		this.collision.h = this.collisionRect.h;
		
		if (this.type == objectTypes.enemyCredits)
		{
			var temp = CreateGameObject(objectTypes.credits, {x:this.position.x, y:g_screensize.y * 3});
			if (temp >= 0 && temp < g_maxobjects)
			{
				GameObjectArray[temp].ReInitCredits(this.extraInt2, 0);
			}
			this.frameSpeed = 5;
		}
	}//*/
	
	// Called to reinit items.
	this.ReInitItems = function(t, c)
	{
		this.extraInt2 = t;
		this.extraInt3 = c;
		this.frameSpeed = 0;
		
		this.extraFloat2 = 120;
		this.extraFloat4 = 1;
		
		if (this.extraInt2 == 0)
		{
			this.frameIndex = this.extraInt3;
		}
		else if (this.extraInt2 == 1)
		{
			// Pick a random cd from the cds we haven't collected.
			var cd = Math.round(Math.random() * (g_cdsHad.length - 1));
			if (g_cdsHad[cd] <= 2) this.extraInt3 = 0;
			else if (g_cdsHad[cd] >= 3 && g_cdsHad[cd] <= 5) this.extraInt3 = 1;
			else if (g_cdsHad[cd] >= 6 && g_cdsHad[cd] <= 8) this.extraInt3 = 2;
			else if (g_cdsHad[cd] >= 9 && g_cdsHad[cd] <= 11) this.extraInt3 = 3;
			else if (g_cdsHad[cd] >= 12) this.extraInt3 = 4;
			
			this.frameIndex = this.extraInt3 + 4;
			this.extraInt4 = cd;
		}
		else if (this.extraInt2 == 2)
		{
			this.frameIndex = 9;
		}
		else if (this.extraInt2 == 3)
		{
			this.spriteIndex = spriteIndices.spr_gameover;
			this.frameIndex = this.extraInt3;
			this.extraFloat4 = 0.5;
		}
	}
	
	this.ReInitCredits = function(t)
	{
		this.frameSpeed = 0;
		if (t == -1) this.frameIndex = 0;
		else if (t > -1) this.frameIndex = t + 1;
		else this.spriteIndex = -1;
		
		switch (t)
		{
			case -1: this.extraString = "SoL"; break;
			case 0: this.extraString = "1up"; break;
			case 1: this.extraString = "Arthur"; break;
			case 2: this.extraString = "chris2balls"; break;
			case 3: this.extraString = "Devicho"; break;
			case 4: this.extraString = "Dex"; break;
			case 5: this.extraString = "Drakocat"; break;
			case 6: this.extraString = "Flannel-Bastard"; break;
			case 7: this.extraString = "Gorsal"; break;
			case 8: this.extraString = "Kaikimi"; break;
			case 9: this.extraString = "Keychain"; break;
			case 10: this.extraString = "Lexou"; break;
			case 11: this.extraString = "Metaru"; break;
			case 12: this.extraString = "Nindo"; break;
			case 13: this.extraString = "Phantom K"; break;
			case 14: this.extraString = "Previous"; break;
			case 15: this.extraString = "Rokkan"; break;
			case 16: this.extraString = "Rosencrantz"; break;
			case 17: this.extraString = "Shawn"; break;
			case 18: this.extraString = "StarSock64"; break;
			case 19: this.extraString = "tachikoma"; break;
			case 20: this.extraString = "tomguycott"; break;
			case 21: this.extraString = "tuna"; break;
			case 22: this.extraString = "tyvon"; break;
			case 23: this.extraString = "kitsu"; break;
			case 24: this.extraString = "vipershark"; break;
			case 25: this.extraString = "woppet"; break;
			case 26: this.extraString = "kosheh"; break;
			case 27: this.extraString = "grooveman.exe"; break;
			case 28: this.extraString = "afrodesiac"; break;
			case 29: this.extraString = "gnostic wetfart"; break;
			case 30: this.extraString = "mighty jetters"; break;
			case 31: this.extraString = "guy"; break;
			case 32: this.extraString = "dazz"; break;
			case 33: this.extraString = "masquerain"; break;
			case 34: this.extraString = "vic"; break;
			case 35: this.extraString = "badassbill"; break;
			case 36: this.extraString = "iceman 404"; break;
		}
		this.position.y = g_screensize.y + 64;
		
		this.extraInt = -1;
		this.extraInt2 = 0;
	}
	
	// Called to update an object.
	this.Update = function()
	{
		// If the object is inactive, skip it.
		if (!this.active) return;
		
		// Save the current position.
		this.prevPos.x = this.position.x;
		this.prevPos.y = this.position.y;
		
		var collisionChanged = false;
		
		var targetVel = 0;
		
		// Update according to the object type.
		switch (this.type)
		{
			// Jackal object.
			case objectTypes.jackal:
				var direction = 0;
				var speed = playerConstants.runSpeed;
				if (g_keyboard.KeyDown(controls.jump)) speed /= 2;
				// Allow the player to move around in 8 directions.
				if (g_keyboard.KeyDown(controls.left) && g_keyboard.KeyUp(controls.right))
				{
					if (g_keyboard.KeyDown(controls.up) && g_keyboard.KeyUp(controls.duck))
						direction = 135;
					else if (g_keyboard.KeyDown(controls.duck) && g_keyboard.KeyUp(controls.up))
						direction = 225;
					else if (g_keyboard.KeyUp(controls.up) && g_keyboard.KeyUp(controls.duck))
						direction = 180;
				}
				else if (g_keyboard.KeyDown(controls.right) && g_keyboard.KeyUp(controls.left))
				{
					if (g_keyboard.KeyDown(controls.up) && g_keyboard.KeyUp(controls.duck))
						direction = 45;
					else if (g_keyboard.KeyDown(controls.duck) && g_keyboard.KeyUp(controls.up))
						direction = 315;
					else if (g_keyboard.KeyUp(controls.up) && g_keyboard.KeyUp(controls.duck))
						direction = 0;
				}
				else if (g_keyboard.KeyUp(controls.left) && g_keyboard.KeyUp(controls.right))
				{
					if (g_keyboard.KeyDown(controls.up) && g_keyboard.KeyUp(controls.duck))
						direction = 90;
					else if (g_keyboard.KeyDown(controls.duck) && g_keyboard.KeyUp(controls.up))
						direction = 270;
					else if (g_keyboard.KeyUp(controls.up) && g_keyboard.KeyUp(controls.duck))
						speed = 0;
				}
				
				this.velocity.x = Math.cos(degToRad(direction)) * speed - g_scrollSpeed;
				this.velocity.y = -Math.sin(degToRad(direction)) * speed;
				
				break;
			// Player object.
			case objectTypes.player:
				// Check to see if we're on a chunk's tile or paint platform.
				extraBool = g_ChunkHandler.rectCheckCollision(this.collision.l, this.position.y + 5, this.collision.w - 1, 5);
				
				{
					var colWithPaintPlat = this.CheckForCollision({x:this.position.x, y:this.position.y + 1}, objectTypes.paintPlat, null);
					var paintYes = false;
					if (colWithPaintPlat)
					{
						var paintYes = false;
						var blockId = GetObjectAtPointRects({x:this.position.x, y:this.position.y + 2}, objectTypes.paintPlat, this.index);
						if (blockId != -1)
						{
							if (GameObjectArray[blockId].position.y >= this.position.y + 16)
							{
								paintYes = true;
							}
						}
					}
					extraBool = extraBool || paintYes;
				}
				
				// If we're in the normal state, allow the player to move around.
				if (this.extraFloat <= playerConstants.invulnTimer + playerConstants.ouchTimer)
				{
					if (this.extraInt == 0)
					{
						// If we're in the air, fall down.
						if (!extraBool)
						{
							//if (this.extraFloat <= 2)
								this.velocity.y += playerConstants.gravity;
							//if (this.extraFloat <= 0)
								//this.velocity.y += playerConstants.gravity;
							
							if (g_jumpType)
							{
								if (g_keyboard.KeyUp(controls.jump) && this.velocity.y < 0) this.velocity.y = 0;
							}
							else
							{
								if (g_keyboard.KeyUp(controls.jump)) this.velocity.y += playerConstants.gravity;
							}
							if (g_keyboard.KeyDown(controls.jump)) this.extraFloat--;
							else this.extraFloat = 0;
							
							// The player can accelerate in the air, but only at quarter rate.
							if (g_keyboard.KeyDown(controls.left) && g_keyboard.KeyUp(controls.right))
							{
								if (this.velocity.x > -playerConstants.runSpeed)
								{
									this.velocity.x -= playerConstants.runAccel * playerConstants.airMultiplier;
									if (this.velocity.x < -playerConstants.runSpeed)
										this.velocity.x = -playerConstants.runSpeed;
								}
								this.scale = -1;
							}
							else if (g_keyboard.KeyDown(controls.right) && g_keyboard.KeyUp(controls.left))
							{
								if (this.velocity.x < playerConstants.runSpeed)
								{
									this.velocity.x += playerConstants.runAccel * playerConstants.airMultiplier;
									if (this.velocity.x > playerConstants.runSpeed)
										this.velocity.x = playerConstants.runSpeed;
								}
								this.scale = 1;
							}
							else if (g_keyboard.KeyUp(controls.left) && g_keyboard.KeyUp(controls.right))
							{
								if (this.velocity.x > 0)
								{
									this.velocity.x -= playerConstants.runDecel / 2;
									if (this.velocity.x < 0)
										this.velocity.x = 0;
								}
								else if (this.velocity.x < 0)
								{
									this.velocity.x += playerConstants.runDecel / 2;
									if (this.velocity.x > 0)
										this.velocity.x = 0;
								}
							}
						}
						// If we're on the ground, act like we're on the ground.
						else
						{
							// If the player presses the jump key, jump.
							if (g_keyboard.KeyPressed(controls.jump))
							{
								this.velocity.y = playerConstants.jumpSpeed;
								this.extraFloat = playerConstants.jumpTime;
								PlaySound(soundIndices.snd_jump, g_soundvolume, false);
							}
							
							// Allow the player to accelerate at full speed on the ground.
							if (g_keyboard.KeyDown(controls.left) && g_keyboard.KeyUp(controls.right))
							{
								if (this.velocity.x > -playerConstants.runSpeed)
								{
									this.velocity.x -= playerConstants.runAccel;
									if (this.velocity.x < -playerConstants.runSpeed)
										this.velocity.x = -playerConstants.runSpeed;
								}
								this.scale = -1;
							}
							else if (g_keyboard.KeyDown(controls.right) && g_keyboard.KeyUp(controls.left))
							{
								if (this.velocity.x < playerConstants.runSpeed)
								{
									this.velocity.x += playerConstants.runAccel;
									if (this.velocity.x > playerConstants.runSpeed)
										this.velocity.x = playerConstants.runSpeed;
								}
								this.scale = 1;
							}
							else if (g_keyboard.KeyUp(controls.left) && g_keyboard.KeyUp(controls.right))
							{
								if (this.velocity.x > 0)
								{
									this.velocity.x -= playerConstants.runDecel;
									if (this.velocity.x < 0)
										this.velocity.x = 0;
								}
								else if (this.velocity.x < 0)
								{
									this.velocity.x += playerConstants.runDecel;
									if (this.velocity.x > 0)
										this.velocity.x = 0;
								}
							}
							
							// If the player is holding down the duck key, duck!
							if (g_keyboard.KeyDown(controls.duck))
							{
								this.extraInt = 3;
								// Update the collision rectangle.
								this.collisionRect.l = playerConstants.duckCollision.l;
								this.collisionRect.t = playerConstants.duckCollision.t;
								this.collisionRect.w = playerConstants.duckCollision.w;
								this.collisionRect.h = playerConstants.duckCollision.h;
								
								collisionChanged = true;
							}
						}
						
						// If the player presses the attack key and we're still in the standing state, switch to the standing attack state.
						if (this.extraInt == 0 && g_keyboard.KeyPressed(controls.attack) && g_playerPaint > 0)
						{
							// If the player is holding down the up key at the same time, then use the block-spawning attack instead.
							if (g_keyboard.KeyDown(controls.up))
							{
								this.extraInt = 6;
								var temp = CreateGameObject(objectTypes.effect, {x:this.position.x + playerConstants.paintDist * this.scale, y:this.position.y});
								if (temp >= 0 && temp < g_maxobjects)
								{
									GameObjectArray[temp].spriteIndex = spriteIndices.spr_paintSplashIn;
									GameObjectArray[temp].extraInt3 = 1;
								}
								g_playerPaint--;
								if (g_playerPaint < 0) g_playerPaint = 0;
								PlaySound(soundIndices.snd_paint, g_soundvolume, false);
								PlaySound(soundIndices.snd_slash, g_soundvolume, false);
							}
							// Otherwise, use the normal standing attack.
							else
							{
								this.extraInt = 4;
								var temp = CreateGameObject(objectTypes.effect, {x:this.position.x, y:this.position.y});
								if (temp >= 0 && temp < g_maxobjects)
								{
									GameObjectArray[temp].extraInt2 = this.index;
									GameObjectArray[temp].extraInt4 = 1;
									if (this.scale == 1) GameObjectArray[temp].spriteIndex = spriteIndices.spr_playerSwing1_right;
									else GameObjectArray[temp].spriteIndex = spriteIndices.spr_playerSwing1_left;
								}
								g_playerPaint -= playerConstants.paintSwingHit;
								if (g_playerPaint < 0) g_playerPaint = 0;
								PlaySound(soundIndices.snd_slash, g_soundvolume, false);
							}
						}
						// If we're still in the standing state and the player is holding the attack key, switch to charging mode.
						if (this.extraInt == 0 && g_keyboard.KeyDown(controls.attack) && g_playerPaint > 0)
						{
							this.extraInt = 8;
							this.extraInt2 = 0;
						}
					}
					// If we're in the ducking state, move around, but more slowly.
					else if (this.extraInt == 3)
					{
						// If we're in the air, fall down.
						if (!extraBool)
						{
							//if (this.extraFloat <= 2)
								this.velocity.y += playerConstants.gravity;
							//if (this.extraFloat <= 0)
								//this.velocity.y += playerConstants.gravity;
							
							if (g_jumpType)
							{
								if (g_keyboard.KeyUp(controls.jump) && this.velocity.y < 0) this.velocity.y = 0;
							}
							else
							{
								if (g_keyboard.KeyUp(controls.jump)) this.velocity.y += playerConstants.gravity;
							}
							if (g_keyboard.KeyDown(controls.jump)) this.extraFloat--;
							else this.extraFloat = 0;
							
							// The player can accelerate in the air, but only at quarter rate.
							if (g_keyboard.KeyDown(controls.left) && g_keyboard.KeyUp(controls.right))
							{
								if (this.velocity.x > -playerConstants.runSpeed)
								{
									this.velocity.x -= playerConstants.runAccel * playerConstants.airMultiplier;
									if (this.velocity.x < -playerConstants.runSpeed)
										this.velocity.x = -playerConstants.runSpeed;
								}
								this.scale = -1;
							}
							else if (g_keyboard.KeyDown(controls.right) && g_keyboard.KeyUp(controls.left))
							{
								if (this.velocity.x < playerConstants.runSpeed)
								{
									this.velocity.x += playerConstants.runAccel * playerConstants.airMultiplier;
									if (this.velocity.x > playerConstants.runSpeed)
										this.velocity.x = playerConstants.runSpeed;
								}
								this.scale = 1;
							}
							else if (g_keyboard.KeyUp(controls.left) && g_keyboard.KeyUp(controls.right))
							{
								if (this.velocity.x > 0)
								{
									this.velocity.x -= playerConstants.runDecel / 2;
									if (this.velocity.x < 0)
										this.velocity.x = 0;
								}
								else if (this.velocity.x < 0)
								{
									this.velocity.x += playerConstants.runDecel / 2;
									if (this.velocity.x > 0)
										this.velocity.x = 0;
								}
							}
						}
						// If we're on the ground, act like we're on the ground.
						else
						{
							// If the player presses the jump key, jump.
							if (g_keyboard.KeyPressed(controls.jump))
							{
								this.velocity.y = playerConstants.jumpSpeed;
								this.extraFloat = playerConstants.jumpTime;
								PlaySound(soundIndices.snd_jump, g_soundvolume, false);
							}
							
							// Allow the player to accelerate at full (crawling) speed on the ground.
							if (g_keyboard.KeyDown(controls.left) && g_keyboard.KeyUp(controls.right))
							{
								//if (this.velocity.x > -playerConstants.runSpeed)
								{
									this.velocity.x -= playerConstants.runAccel;
									if (this.velocity.x < -playerConstants.runSpeed / 2)
										this.velocity.x = -playerConstants.runSpeed / 2;
								}
								this.scale = -1;
							}
							else if (g_keyboard.KeyDown(controls.right) && g_keyboard.KeyUp(controls.left))
							{
								//if (this.velocity.x < playerConstants.runSpeed)
								{
									this.velocity.x += playerConstants.runAccel;
									if (this.velocity.x > playerConstants.runSpeed / 2)
										this.velocity.x = playerConstants.runSpeed / 2;
								}
								this.scale = 1;
							}
							else if (g_keyboard.KeyUp(controls.left) && g_keyboard.KeyUp(controls.right))
							{
								if (this.velocity.x > 0)
								{
									this.velocity.x -= playerConstants.runDecel;
									if (this.velocity.x < 0)
										this.velocity.x = 0;
								}
								else if (this.velocity.x < 0)
								{
									this.velocity.x += playerConstants.runDecel;
									if (this.velocity.x > 0)
										this.velocity.x = 0;
								}
							}
							// If the player releases the duck key and there's space above them, stop ducking!
							if (g_keyboard.KeyUp(controls.duck))
							{
								if (!g_ChunkHandler.rectCheckCollision(this.collision.l, this.position.y + playerConstants.idleCollision.t, this.collision.w - 1, playerConstants.idleCollision.h))
								{
									this.extraInt = 0;
									
									this.collisionRect.l = playerConstants.idleCollision.l;
									this.collisionRect.t = playerConstants.idleCollision.t;
									this.collisionRect.w = playerConstants.idleCollision.w;
									this.collisionRect.h = playerConstants.idleCollision.h;
									
									collisionChanged = true;
								}
							}
						}
						// If the player presses the attack key and we're still in the ducking state, switch to the ducking attack state.
						if (this.extraInt == 3 && g_keyboard.KeyPressed(controls.attack) && g_playerPaint > 0)
						{
							this.extraInt = 5;
							var temp = CreateGameObject(objectTypes.effect, {x:this.position.x, y:this.position.y});
							if (temp >= 0 && temp < g_maxobjects)
							{
								GameObjectArray[temp].extraInt2 = this.index;
								GameObjectArray[temp].extraInt4 = 1;
								if (this.scale == 1) GameObjectArray[temp].spriteIndex = spriteIndices.spr_playerSwingD1_right;
								else GameObjectArray[temp].spriteIndex = spriteIndices.spr_playerSwingD1_left;
							}
							g_playerPaint -= playerConstants.paintSwingHit;
							if (g_playerPaint < 0) g_playerPaint = 0;
							PlaySound(soundIndices.snd_slash, g_soundvolume, false);
						}
					}
					// If we're climbing and stuff, climb and stuff.
					else if (this.extraInt == 1 || this.extraInt == 2)
					{
						// If the player releases the running buttons, fall off the wall.
						if ((this.extraInt == 1 && g_keyboard.KeyUp(controls.left)) || (this.extraInt == 2 && g_keyboard.KeyUp(controls.right)))
						{
							this.extraInt = 0;
							this.velocity.y = 0;
						}
						// If the player presses the jump button, jump off the wall.
						else if (g_keyboard.KeyPressed(controls.jump))
						{
							this.extraInt = 0;
							this.scale *= -1;
							this.velocity.y = playerConstants.jumpSpeed * 0.75;
							this.velocity.x = this.scale * playerConstants.runSpeed;
							this.extraFloat = playerConstants.jumpTime;
							PlaySound(soundIndices.snd_jump, g_soundvolume, false);
						}
						// Otherwise, make the player keep going up.
						else
						{
							this.velocity.y -= playerConstants.runAccel * 2;
							if (this.velocity.y < -playerConstants.climbingSpeed)
								this.velocity.y = -playerConstants.climbingSpeed;
						}
					}
					// During the attacking states, mostly act as normal but with fewer inputs.
					else if (this.extraInt == 4 || this.extraInt == 5 || this.extraInt == 6 || this.extraInt == 7 || this.extraInt == 9 || this.extraInt == 10)
					{
						// If we're in the air, fall down.
						if (!extraBool)
						{
							//if (this.extraFloat <= 2)
								this.velocity.y += playerConstants.gravity;
							//if (this.extraFloat <= 0)
								//this.velocity.y += playerConstants.gravity;
							
							if (g_jumpType)
							{
								if (g_keyboard.KeyUp(controls.jump) && this.velocity.y < 0) this.velocity.y = 0;
							}
							else
							{
								if (g_keyboard.KeyUp(controls.jump)) this.velocity.y += playerConstants.gravity;
							}
							
							if (g_keyboard.KeyDown(controls.jump)) this.extraFloat--;
							else this.extraFloat = 0;
						}
						// Apply friction to the character if they're on the ground.
						else
						{
							if (this.velocity.x > 0)
							{
								this.velocity.x -= playerConstants.runDecel;
								if (this.velocity.x < 0)
									this.velocity.x = 0;
							}
							else if (this.velocity.x < 0)
							{
								this.velocity.x += playerConstants.runDecel;
								if (this.velocity.x > 0)
									this.velocity.x = 0;
							}
						}
						// If we're in the standing attack state and the player presses the attack button again, go into the combo attack.
						if ((this.extraInt == 4 || this.extraInt == 7) && g_keyboard.KeyPressed(controls.attack))
						{
							if ((this.extraInt == 4 && this.frameIndex > 1) || this.extraInt == 7 && this.frameIndex >= 6)
							{
								this.extraInt = 7;
								var temp = CreateGameObject(objectTypes.effect, {x:this.position.x, y:this.position.y});
								if (temp >= 0 && temp < g_maxobjects)
								{
									GameObjectArray[temp].extraInt2 = this.index;
									GameObjectArray[temp].extraInt4 = 1;
									if (this.scale == 1) GameObjectArray[temp].spriteIndex = spriteIndices.spr_playerSwing2_right;
									else GameObjectArray[temp].spriteIndex = spriteIndices.spr_playerSwing2_left;
								}
								g_playerPaint -= playerConstants.paintSwingHit;
								if (g_playerPaint < 0) g_playerPaint = 0;
								PlaySound(soundIndices.snd_slash, g_soundvolume, false);
							}
						}
						// If we're in the spinning jump attack, allow us to move a bit?
						if (this.extraInt == 10)
						{
							if (g_keyboard.KeyDown(controls.left) && g_keyboard.KeyUp(controls.right))
							{
								if (this.velocity.x > -playerConstants.runSpeed)
								{
									this.velocity.x -= playerConstants.runAccel * playerConstants.airMultiplier;
									if (this.velocity.x < -playerConstants.runSpeed)
										this.velocity.x = -playerConstants.runSpeed;
								}
							}
							else if (g_keyboard.KeyDown(controls.right) && g_keyboard.KeyUp(controls.left))
							{
								if (this.velocity.x < playerConstants.runSpeed)
								{
									this.velocity.x += playerConstants.runAccel * playerConstants.airMultiplier;
									if (this.velocity.x > playerConstants.runSpeed)
										this.velocity.x = playerConstants.runSpeed;
								}
							}
						}
						// And allow us to move a bit while in the regular spin attack, too.
						else if (this.extraInt == 9)
						{
							if (g_keyboard.KeyDown(controls.left) && g_keyboard.KeyUp(controls.right))
							{
								if (this.velocity.x > -playerConstants.runSpeed / 2)
								{
									this.velocity.x -= playerConstants.runAccel * playerConstants.airMultiplier;
									if (this.velocity.x < -playerConstants.runSpeed / 2)
										this.velocity.x = -playerConstants.runSpeed / 2;
								}
							}
							else if (g_keyboard.KeyDown(controls.right) && g_keyboard.KeyUp(controls.left))
							{
								if (this.velocity.x < playerConstants.runSpeed / 2)
								{
									this.velocity.x += playerConstants.runAccel * playerConstants.airMultiplier;
									if (this.velocity.x > playerConstants.runSpeed / 2)
										this.velocity.x = playerConstants.runSpeed / 2;
								}
							}
						}
					}
					// During the charging state, charge up as long as the player holds the charging key.
					else if (this.extraInt == 8)
					{
						// If we're in the air, fall down.
						if (!extraBool)
						{
							//if (this.extraFloat <= 2)
								this.velocity.y += playerConstants.gravity;
							//if (this.extraFloat <= 0)
								//this.velocity.y += playerConstants.gravity;
							
							if (g_jumpType)
							{
								if (g_keyboard.KeyUp(controls.jump) && this.velocity.y < 0) this.velocity.y = 0;
							}
							else
							{
								if (g_keyboard.KeyUp(controls.jump)) this.velocity.y += playerConstants.gravity;
							}
							
							if (g_keyboard.KeyDown(controls.jump)) this.extraFloat--;
							else this.extraFloat = 0;
						}
						// Apply friction to the character if they're on the ground.
						else
						{
							if (this.velocity.x > 0)
							{
								this.velocity.x -= playerConstants.runDecel;
								if (this.velocity.x < 0)
									this.velocity.x = 0;
							}
							else if (this.velocity.x < 0)
							{
								this.velocity.x += playerConstants.runDecel;
								if (this.velocity.x > 0)
									this.velocity.x = 0;
							}
						}
						// Charge up!
						if (this.extraInt2 < playerConstants.chargeFull)
							this.extraInt2 += playerConstants.chargeRate;
						
						// If the player releases the attack key...
						if (g_keyboard.KeyUp(controls.attack))
						{
							// and the charge isn't full, just return to standing state.
							if (this.extraInt2 < playerConstants.chargeFull)
								this.extraInt = 0;
							// if the charge is full, use the spin attack!
							else
							{
								this.extraInt = 9;
								var temp = CreateGameObject(objectTypes.effect, {x:this.position.x, y:this.position.y});
								if (temp >= 0 && temp < g_maxobjects)
								{
									GameObjectArray[temp].extraInt2 = this.index;
									GameObjectArray[temp].extraInt4 = 1;
									if (this.scale == 1) GameObjectArray[temp].spriteIndex = spriteIndices.spr_playerSpin_right;
									else GameObjectArray[temp].spriteIndex = spriteIndices.spr_playerSpin_left;
								}
								g_playerPaint -= playerConstants.paintSwingHit;
								if (g_playerPaint < 0) g_playerPaint = 0;
								PlaySound(soundIndices.snd_slash, g_soundvolume, false);
							}
							
						}
						var blobDir = 0;
						// Allow the player to aim with up and down for shooting paint.
						if (this.extraInt == 8)
						{
							if (g_keyboard.KeyDown(controls.up) && g_keyboard.KeyUp(controls.duck))
								blobDir = 30;
							else if (g_keyboard.KeyDown(controls.duck) && g_keyboard.KeyUp(controls.up))
								blobDir = 330;
							else
								blobDir = 0;
						}
						// If the player presses forward at full charge, shoot a ball of paint!
						if (this.extraInt == 8 && g_keyboard.KeyPressed(controls.left) && this.extraInt2 >= playerConstants.chargeFull)// && g_playerPaint > 0)
						{
							this.extraInt = 6;
							this.scale = -1;
							var temp = CreateGameObject(objectTypes.paint, {x:this.position.x - playerConstants.paintDist, y:this.position.y - 4});
							if (temp >= 0 && temp < g_maxobjects)
							{
								GameObjectArray[temp].extraInt2 = this.index;
								if (blobDir == 0) blobDir = 180;
								else if (blobDir == 30) blobDir = 150;
								else blobDir = 210;
								GameObjectArray[temp].velocity.x = Math.cos(degToRad(blobDir)) * playerConstants.paintBlobSpeed;
								GameObjectArray[temp].velocity.y = -Math.sin(degToRad(blobDir)) * playerConstants.paintBlobSpeed;
							}
							
							temp = CreateGameObject(objectTypes.effect, {x:this.position.x - playerConstants.paintDist, y:this.position.y - 4});
							if (temp >= 0 && temp < g_maxobjects)
								GameObjectArray[temp].spriteIndex = spriteIndices.spr_paintSplashIn;
							
							// Decrease the player's amount of paint.
							g_playerPaint -= playerConstants.paintSwingHit;
							if (g_playerPaint < 0) g_playerPaint = 0;
							PlaySound(soundIndices.snd_paint, g_soundvolume, false);
							PlaySound(soundIndices.snd_slash, g_soundvolume, false);
						}
						if (this.extraInt == 8 && g_keyboard.KeyPressed(controls.right) && this.extraInt2 >= playerConstants.chargeFull)// && g_playerPaint > 0)
						{
							this.extraInt = 6;
							this.scale = 1;
							var temp = CreateGameObject(objectTypes.paint, {x:this.position.x + playerConstants.paintDist, y:this.position.y - 4});
							if (temp >= 0 && temp < g_maxobjects)
							{
								GameObjectArray[temp].extraInt2 = this.index;
								GameObjectArray[temp].velocity.x = Math.cos(degToRad(blobDir)) * playerConstants.paintBlobSpeed;
								GameObjectArray[temp].velocity.y = -Math.sin(degToRad(blobDir)) * playerConstants.paintBlobSpeed;
							}
							
							temp = CreateGameObject(objectTypes.effect, {x:this.position.x + playerConstants.paintDist, y:this.position.y - 4});
							if (temp >= 0 && temp < g_maxobjects)
								GameObjectArray[temp].spriteIndex = spriteIndices.spr_paintSplashIn;
							
							// Decrease the player's amount of paint.
							g_playerPaint -= playerConstants.paintSwingHit;
							if (g_playerPaint < 0) g_playerPaint = 0;
							PlaySound(soundIndices.snd_paint, g_soundvolume, false);
							PlaySound(soundIndices.snd_slash, g_soundvolume, false);
						}
						// If the player presses jump at full charge, use the jumping spin attack!
						if (this.extraInt == 8 && g_keyboard.KeyPressed(controls.jump) && this.extraInt2 >= playerConstants.chargeFull)
						{
							this.extraInt = 10;
							this.velocity.y = playerConstants.jumpSpeed;
							this.extraFloat = playerConstants.jumpTime * 1.5;
							var temp = CreateGameObject(objectTypes.effect, {x:this.position.x, y:this.position.y});
							if (temp >= 0 && temp < g_maxobjects)
							{
								GameObjectArray[temp].extraInt2 = this.index;
								GameObjectArray[temp].extraInt4 = 1;
								if (this.scale == 1) GameObjectArray[temp].spriteIndex = spriteIndices.spr_playerSpinJ_right;
								else GameObjectArray[temp].spriteIndex = spriteIndices.spr_playerSpinJ_left;
							}
							g_playerPaint -= playerConstants.paintSwingHit;
							if (g_playerPaint < 0) g_playerPaint = 0;
							PlaySound(soundIndices.snd_slash, g_soundvolume, false);
						}
					}
				}
				// In the hurt state, lose control for a bit.
				else
				{
					// If we're in the air, fall down.
					if (!extraBool)
					{
						//if (this.extraFloat <= 2)
							this.velocity.y += playerConstants.gravity;
						//if (this.extraFloat <= 0)
							//this.velocity.y += playerConstants.gravity;
						
						if (g_jumpType)
						{
							if (g_keyboard.KeyUp(controls.jump) && this.velocity.y < 0) this.velocity.y = 0;
						}
						else
						{
							if (g_keyboard.KeyUp(controls.jump)) this.velocity.y += playerConstants.gravity;
						}
						
						this.extraFloat--;
					}
					// Apply friction to the character if they're on the ground.
					else
					{
						if (this.velocity.x > 0)
						{
							this.velocity.x -= playerConstants.runDecel;
							if (this.velocity.x < 0)
								this.velocity.x = 0;
						}
						else if (this.velocity.x < 0)
						{
							this.velocity.x += playerConstants.runDecel;
							if (this.velocity.x > 0)
								this.velocity.x = 0;
						}
					}
				}
				
				// Limit our downwards velocity.
				if (this.velocity.y > playerConstants.fallMaxSpeed)
					this.velocity.y = playerConstants.fallMaxSpeed;
				
				if (this.position.y > g_spriteCamera.y + g_screensize.y + 16)
				{
					g_playerHP = 0;
					PlaySound(soundIndices.snd_hit, g_soundvolume, false);
				}
				
				// If the player dies, spawn a player death animation, remove us, and start the timer for going to the gameover screen.
				if (g_playerHP <= 0)
				{
					var temp = CreateGameObject(objectTypes.effect, {x:this.position.x, y:this.position.y});
					if (temp >= 0 && temp < g_maxobjects)
					{
						GameObjectArray[temp].spriteIndex = spriteIndices.spr_playerDeath;
						GameObjectArray[temp].velocity.y = playerConstants.jumpSpeed / 2;
						GameObjectArray[temp].extraFloat = playerConstants.jumpTime;
					}
					DestroyGameObject(this.index);
					
					g_playerHP = playerConstants.playerDeathTimer;
				}
					
				break;
				
			// Effect object.
			case objectTypes.effect:
				if (this.spriteIndex == spriteIndices.spr_playerDeath)
				{
					//if (this.extraFloat <= 2)
						this.velocity.y += playerConstants.gravity / 4;
					//if (this.extraFloat <= 0)
						//this.velocity.y += playerConstants.gravity / 4;
					
					this.extraFloat--;
					
					if (this.velocity.y > playerConstants.fallMaxSpeed / 4)
						this.velocity.y = playerConstants.fallMaxSpeed / 4;
				}
				else if (this.extraFloat3 == 1)
				{
					//if (this.extraFloat <= 2)
						this.velocity.y += playerConstants.gravity;
					//if (this.extraFloat <= 0)
						//this.velocity.y += playerConstants.gravity;
					
					this.extraFloat--;
					
					if (this.velocity.y > playerConstants.fallMaxSpeed)
						this.velocity.y = playerConstants.fallMaxSpeed;
				}
				// If we're tied to another object, follow it.
				if (this.extraInt2 >= 0 && this.extraInt2 < g_maxobjects)
				{
					// If the object we're tied to is no longer active, die away.
					if (!GameObjectArray[this.extraInt2].active) extraInt2 = -1;
					// Otherwise, follow the object.
					else
					{
						this.position.x = GameObjectArray[this.extraInt2].position.x;
						this.position.y = GameObjectArray[this.extraInt2].position.y;
						this.frameSpeed = GameObjectArray[this.extraInt2].frameSpeed;
					}
					
					// Change the effect's collision depending on the sprite and current frame.
					if (this.spriteIndex == spriteIndices.spr_playerSwing1_right)
					{
						if (Math.floor(this.frameIndex) == 0)
						{
							this.collisionRect.l = 0; this.collisionRect.t = -29;
							this.collisionRect.w = 33; this.collisionRect.h = 28;
							collisionChanged = true;
						}
					}
					else if (this.spriteIndex == spriteIndices.spr_playerSwing1_left)
					{
						if (Math.floor(this.frameIndex) == 0)
						{
							this.collisionRect.l = -32; this.collisionRect.t = -29;
							this.collisionRect.w = 33; this.collisionRect.h = 28;
							collisionChanged = true;
						}
					}
					else if (this.spriteIndex == spriteIndices.spr_playerSwingD1_right)
					{
						if (Math.floor(this.frameIndex) == 0)
						{
							this.collisionRect.l = 0; this.collisionRect.t = -17;
							this.collisionRect.w = 33; this.collisionRect.h = 24;
							collisionChanged = true;
						}
					}
					else if (this.spriteIndex == spriteIndices.spr_playerSwingD1_left)
					{
						if (Math.floor(this.frameIndex) == 0)
						{
							this.collisionRect.l = -32; this.collisionRect.t = -17;
							this.collisionRect.w = 33; this.collisionRect.h = 24;
							collisionChanged = true;
						}
					}
					else if (this.spriteIndex == spriteIndices.spr_playerSwing2_right)
					{
						if (Math.floor(this.frameIndex) == 0 || Math.floor(this.frameIndex) == 4)
						{
							this.collisionRect.l = 0; this.collisionRect.t = -21;
							this.collisionRect.w = 33; this.collisionRect.h = 32;
							collisionChanged = true;
						}
						if (Math.floor(this.frameIndex) == 2 || Math.floor(this.frameIndex) == 6)
						{
							this.collisionRect.l = -27; this.collisionRect.t = -4;
							this.collisionRect.w = 59; this.collisionRect.h = 26;
							collisionChanged = true;
						}
					}
					else if (this.spriteIndex == spriteIndices.spr_playerSwing2_left)
					{
						if (Math.floor(this.frameIndex) == 0 || Math.floor(this.frameIndex) == 4)
						{
							this.collisionRect.l = -32; this.collisionRect.t = -21;
							this.collisionRect.w = 33; this.collisionRect.h = 32;
							collisionChanged = true;
						}
						if (Math.floor(this.frameIndex) == 2 || Math.floor(this.frameIndex) == 6)
						{
							this.collisionRect.l = -33; this.collisionRect.t = -4;
							this.collisionRect.w = 59; this.collisionRect.h = 26;
							collisionChanged = true;
						}
					}
					else if (this.spriteIndex == spriteIndices.spr_playerSpin_right || this.spriteIndex == spriteIndices.spr_playerSpin_left)
					{
						if (Math.floor(this.frameIndex) == 0)
						{
							this.collisionRect.l = -28; this.collisionRect.t = -8;
							this.collisionRect.w = 56; this.collisionRect.h = 16;
							collisionChanged = true;
						}
					}
					else if (this.spriteIndex == spriteIndices.spr_playerSpinJ_right || this.spriteIndex == spriteIndices.spr_playerSpinJ_left)
					{
						if (Math.floor(this.frameIndex) == 0)
						{
							this.collisionRect.l = -20; this.collisionRect.t = -24;
							this.collisionRect.w = 40; this.collisionRect.h = 40;
							collisionChanged = true;
						}
					}
					
				}
				break;
			// Enemy object.
			case objectTypes.enemy:
				// Count down on the spawntimer.
				if (this.extraFloat2 > 0) this.extraFloat2--;
				
				// If the spawntimer has reached zero, go ahead and do stuff.
				if (this.extraFloat2 <= 0)
				{
					// Find out if we're on a tile or paint platform.
					extraBool = g_ChunkHandler.rectCheckCollision(this.collision.l, this.position.y + 5, this.collision.w - 1, 5);
					
					{
						var colWithPaintPlat = this.CheckForCollision({x:this.position.x, y:this.position.y + 1}, objectTypes.paintPlat, null);
						var paintYes = false;
						if (colWithPaintPlat)
						{
							var paintYes = false;
							var blockId = GetObjectAtPointRects({x:this.position.x, y:this.position.y + 2}, objectTypes.paintPlat, this.index);
							if (blockId != -1)
							{
								if (GameObjectArray[blockId].position.y >= this.position.y + 16)
								{
									paintYes = true;
								}
							}
						}
						extraBool = extraBool || paintYes;
					}
				
					if (this.extraInt2 != enemyTypes.arthur && this.extraInt2 != enemyTypes.shark && this.extraInt2 != enemyTypes.duck && this.extraInt2 != enemyTypes.pk && this.extraInt2 < enemyTypes.dazz)
					{
						// If we're in the air, fall down.
						if (!extraBool)
						{
							//if (this.extraFloat <= 2)
								this.velocity.y += playerConstants.gravity;
							//if (this.extraFloat <= 0)
								//this.velocity.y += playerConstants.gravity;
							this.extraFloat--;
						}
						
						// If we are a homing type enemy, send us towards the player.
						if (this.extraInt4 == 1)
						{
							if (GameObjectArray[g_playerId].position.x < this.position.x) this.scale = -1;
							else this.scale = 1;
						}
						// If we're not homing, go the other direction if we run into a wall.
						else if (extraBool)
						{
							if (g_ChunkHandler.rectCheckCollision(this.collision.l + this.scale * 1, this.collision.t, this.collision.w, this.collision.h))
							{
								this.scale *= -1;
							}
						}
						
						// Accelerate us towards the enemy's direction.
						targetVel = this.scale * this.extraInt3 / 3 * playerConstants.runSpeed;
						
						// If we are a jumping type enemy, have us jump over pits and obstructions.
						if (extraBool && extraBool2 && targetVel != 0)
						{
							if (g_ChunkHandler.rectCheckCollision(this.collision.l + this.scale * 6 * (this.extraInt3), this.collision.t + 1, this.collision.w, this.collision.h - 2))
							{
								this.velocity.y = playerConstants.jumpSpeed;
								this.extraFloat = playerConstants.jumpTime;
							}
							else if (!g_ChunkHandler.pointCheckCollision({x:this.position.x + this.scale * 6 * (this.extraInt3), y:this.position.y + 9}) &&
									!g_ChunkHandler.pointCheckCollision({x:this.position.x + this.scale * 6 * (this.extraInt3), y:this.position.y + 9 + 16}))
							{
								this.velocity.y = playerConstants.jumpSpeed;
								this.extraFloat = playerConstants.jumpTime;
							}
						}
					}
				
					switch (this.extraInt2)
					{
						case enemyTypes.arthur:
						case enemyTypes.shark:
							// Fly in a sinewave pattern.
							this.extraFloat3 += 15;
							if (this.extraFloat3 > 359)
								this.extraFloat3 -= 360;
							this.velocity.y = -Math.sin(degToRad(this.extraFloat3)) * enemyConstants.flyerSpeed * 2 * this.extraInt3;
							this.velocity.x = enemyConstants.flyerSpeed * (this.extraInt3 != 3 ? this.extraInt3 : 2);
							break;
						case enemyTypes.duck:
							// Fly straight.
							this.velocity.x = enemyConstants.flyerSpeed * this.extraInt3;
							break;
						
						case enemyTypes.pk:
							// Accelerate towards the player.
							if (GameObjectArray[g_playerId].position.x < this.position.x) this.scale = -1;
							else this.scale = 1;
							var toPlayer = {x:GameObjectArray[g_playerId].position.x - this.position.x, y:GameObjectArray[g_playerId].position.y - this.position.y};
							toPlayer = NormalizeVector(toPlayer);
							this.velocity.x += toPlayer.x * enemyConstants.pkAccel;
							this.velocity.y += toPlayer.y * enemyConstants.pkAccel;
							if (VectorLengthSquared(this.velocity) > (this.extraInt3 * this.extraInt3 * enemyConstants.pkSpeed * enemyConstants.pkSpeed))
							{
								toPlayer = NormalizeVector(toPlayer);
								this.velocity.x = toPlayer.x * this.extraInt3 * enemyConstants.pkSpeed;
								this.velocity.y = toPlayer.y * this.extraInt3 * enemyConstants.pkSpeed;
							}
							break;
						
						case enemyTypes.c2b:
							// If we're red, limit our speed and become homing.
							if (this.extraInt3 >= 3)
							{
								targetVel = numberSign(targetVel) * 2;
								this.extraInt4 = 1;
							}
							break;
							
						case enemyTypes.oneup:
						case enemyTypes.devi:
						case enemyTypes.dex:
						case enemyTypes.drako:
						case enemyTypes.gwen:
						case enemyTypes.gors:
						case enemyTypes.kaikimi:
						case enemyTypes.keychain:
						case enemyTypes.metaru:
						case enemyTypes.nindo:
						case enemyTypes.previ:
						case enemyTypes.rokkan:
						case enemyTypes.ob2ko:
						
						case enemyTypes.ng:
						case enemyTypes.tachikoma:
						case enemyTypes.tom:
						case enemyTypes.woppet:
						case enemyTypes.kosh:
						case enemyTypes.groove:
						case enemyTypes.afro:
						case enemyTypes.gnostic:
						case enemyTypes.raellyn:
						case enemyTypes.guy:
							break;
						
						case enemyTypes.ew:
							// If the player is facing us, don't move.
							if ((GameObjectArray[g_playerId].position.x > this.position.x && GameObjectArray[g_playerId].scale != 1) || 
								(GameObjectArray[g_playerId].position.x < this.position.x && GameObjectArray[g_playerId].scale != -1))
								targetVel = 0;
							break;
						
						case enemyTypes.shawn:
							targetVel = 0;
							break;
							
						case enemyTypes.a6:
						case enemyTypes.kit:
							if (this.extraInt3 >= 3)
								targetVel = -this.scale * enemyConstants.flyerSpeed * (this.extraInt3);
							else
								targetVel = 0;
							break;
							
							
						case enemyTypes.bab:
						case enemyTypes.dazz:
						case enemyTypes.masq:
						case enemyTypes.vic:
						case enemyTypes.iceman:
							break;
							
						case enemyTypes.bullet:
							this.position.x -= (g_playerType == 1 ? g_scrollSpeed : 0);
							break;
					}
					
					// Handle boss behaviors.
					if (this.extraInt2 >= enemyTypes.dazz && this.extraInt2 <= enemyTypes.iceman)
					{
						// If our hurt timer isn't active, run our statemachines.
						if (this.extraFloat5 <= 0 && this.extraFloat3 != 1 && this.extraInt > 0)
						{
							this.extraInt5--;
							if (this.extraInt5 <= 0)
							{
								if (this.extraFloat3 == 0)
								{
									this.extraInt5 = enemyConstants.bossTimer;
									if (this.extraInt2 == enemyTypes.bab) this.extraInt5 *= 2;
									this.extraFloat3 = 1;
									
									// Dazz shoots out a hat projectile.
									if (this.extraInt2 == enemyTypes.dazz)
									{
										var temp = CreateGameObject(objectTypes.enemy, {x:this.position.x - 2, y:this.position.y - 4});
										if (temp >= 0 && temp < g_maxobjects)
										{
											GameObjectArray[temp].ReInitEnemies(enemyTypes.dazzHat, 1);
											GameObjectArray[temp].extraFloat3 = this.index;
										}
									}
									// Masq shoots out a blob projectile.
									else if (this.extraInt2 == enemyTypes.masq)
									{
										this.extraFloat3 = 2;
										this.extraInt5 = 30;
										for (var i = 0; i < 2; i++)
										{
											var temp = CreateGameObject(objectTypes.enemy, {x:this.position.x - 2, y:this.position.y - 4});
											if (temp >= 0 && temp < g_maxobjects)
											{
												GameObjectArray[temp].ReInitEnemies(enemyTypes.masqBlob, 1);
											}
										}
									}
									// Vic shoots two shots.
									else if (this.extraInt2 == enemyTypes.vic)
									{
										this.extraFloat3 = 2;
										this.extraInt5 = 15;
										for (var i = 0; i < 2; i++)
										{
											var temp = CreateGameObject(objectTypes.enemy, {x:this.position.x - 6, y:this.position.y - 8 + i * 16});
											if (temp >= 0 && temp < g_maxobjects)
											{
												GameObjectArray[temp].ReInitEnemies(enemyTypes.vicShot, 1);
											}
										}
									}
									// Iceman shoots out a bunch of food projectiles.
									else if (this.extraInt2 == enemyTypes.iceman)
									{
										this.extraFloat3 = 2;
										this.extraInt5 = 30;
										for (var i = 0; i < 2; i++)
										{
											var temp = CreateGameObject(objectTypes.enemy, {x:this.position.x - 2, y:this.position.y - 4});
											if (temp >= 0 && temp < g_maxobjects)
											{
												GameObjectArray[temp].ReInitEnemies(enemyTypes.icemanFood, 1);
												GameObjectArray[temp].velocity.x = -0.75 - (i * 1.5);
											}
										}
									}
								}
								else
								{
									this.extraFloat3 = 0;
									this.extraInt5 = enemyConstants.bossTimer;
									if (this.extraInt2 != enemyTypes.bab) this.extraInt5 /= 2;
								}
							}
						}
						// If we're in our idle state, try to stay on the right side of the screen.
						if (this.extraInt > 0)
						{
							if (this.extraFloat3 == 0 || this.extraInt2 != enemyTypes.bab)
							{
								this.position.x -= g_scrollSpeed;
								var targetPos = g_spriteCamera.x + g_screensize.x - 24;
								if (this.position.x < targetPos)
								{
									this.position.x += Math.abs(g_scrollSpeed) * 2;
									if (this.position.x > targetPos) this.position.x = targetPos;
								}
								else if (this.position.x > targetPos)
								{
									this.position.x -= Math.abs(g_scrollSpeed * 2);
									if (this.position.x < targetPos) this.position.x = targetPos;
								}
								
								// If we're in position horizontally, take up the vertical movement behaviors.
								if (this.position.x > targetPos - 5 && this.position.x < targetPos + 5)
								{
									// Bab tries to line up vertically with the player.
									if (this.extraInt2 == enemyTypes.bab)
									{
										if (this.extraInt5 > 30)
										{
											if (this.position.y > GameObjectArray[g_playerId].position.y)
												targetVel = -3;
											else if (this.position.y < GameObjectArray[g_playerId].position.y)
												targetVel = 3;
										}
										else targetVel = 0;
										
										if (this.velocity.y > targetVel)
										{
											this.velocity.y -= playerConstants.runAccel / 4;
											if (this.velocity.y < targetVel) this.velocity.y = targetVel;
										}
										else if (this.velocity.y < targetVel)
										{
											this.velocity.y += playerConstants.runAccel / 4;
											if (this.velocity.y > targetVel) this.velocity.y = targetVel;
										}
										// Keep the boss on the screen (vertically).
										if (this.position.y > g_screensize.y - 12) this.position.y = g_screensize.y - 12;
										else if (this.position.y < 12) this.position.y = 12;
									}
									// The other bosses simply move up and down.
									if (this.extraInt2 != enemyTypes.bab)
									{
										if (this.extraFloat3 == 0)
										{
											if (this.velocity.y == 0)
											{
												var vel = Math.random() * 99;
												if (vel >= 50) this.velocity.y = -2;
												else this.velocity.y = 2;
											}
										}
										else
											this.velocity.y = 0;
										// Keep the boss on the screen (vertically).
										if (this.position.y > g_screensize.y - 24)
										{
											this.position.y = g_screensize.y - 24;
											this.velocity.y *= -1;
										}
										else if (this.position.y < 24)
										{
											this.position.y = 24;
											this.velocity.y *= -1;
										}
									}
								}
							}
							// Bab's bullrush attack state.
							else if (this.extraInt2 == enemyTypes.bab && this.extraFloat3 == 1)
							{
								this.position.x -= g_scrollSpeed;
								var targetPos = g_spriteCamera.x + 24;
								if (this.position.x < targetPos)
								{
									this.position.x += Math.abs(g_scrollSpeed) * 8;
									if (this.position.x >= targetPos)
									{
										this.position.x = targetPos;
										this.extraFloat3 = 0;
									}
								}
								else if (this.position.x > targetPos)
								{
									this.position.x -= Math.abs(g_scrollSpeed * 8);
									if (this.position.x <= targetPos)
									{
										this.position.x = targetPos;
										this.extraFloat3 = 0;
									}
								}
							}
						}
						
						// If our HP reaches zero, start the boss's death timer.
						if (this.extraInt == 0)
						{
							this.extraInt = enemyConstants.bossDeathTimer;
						}
						// If our HP is less than zero, create some splashes while we're dying.
						else if (this.extraInt < 0)
						{
							this.extraInt++;
							// When the timer ends, destroy the boss and get the chunkhandler making normal chunks again.
							if (this.extraInt >= 0) 
							{
								DestroyGameObject(this.index);
								g_ChunkHandler.diffCount = chunkConstants.diffUp;
								g_ChunkHandler.itemCounter = 0;
								g_playerScore += 8000;
								PlaySound(soundIndices.snd_explosion, g_soundvolume, false);
							}
							
							if (Math.floor(this.extraInt / 2) % 2 == 0)
							{
								var temp = CreateGameObject(objectTypes.effect, {x:this.collision.l + Math.random() * this.collision.w, y:this.collision.t + Math.random() * this.collision.h});
								if (temp >= 0 && temp < g_maxobjects)
								{
									GameObjectArray[temp].spriteIndex = spriteIndices.spr_paintSplashIn;
									PlaySound(soundIndices.snd_paint, g_soundvolume, false);
								}
							}
							this.velocity.y = 0.5;
						}
					}
					
					// Behavior for projectiles.
					// Behavior for dazz's hat.
					if (this.extraInt2 == enemyTypes.dazzHat)
					{
						// If our leash is still active, behave as normal.
						if (GameObjectArray[this.extraFloat3].active && GameObjectArray[this.extraFloat3].type == objectTypes.enemy && GameObjectArray[this.extraFloat3].extraInt2 == enemyTypes.dazz)
						{
							this.position.x -= g_scrollSpeed;
							// If we reach a boundary, return to the boss.
							if (this.extraInt5 == 0 && (this.position.x < g_spriteCamera.x + 12 || this.position.y < g_spriteCamera.y + 12 || this.position.y > g_spriteCamera.y + g_screensize.y - 12))
							{
								this.extraInt5 = -1;
								var toPlayer = {x:GameObjectArray[this.extraFloat3].position.x - this.position.x, y:GameObjectArray[this.extraFloat3].position.y - this.position.y};
								toPlayer = NormalizeVector(toPlayer);
								this.velocity.x = toPlayer.x * 3;
								this.velocity.y = toPlayer.y * 3;
							}
						}
						// Otherwise, destroy us!
						else
						{
							var temp = CreateGameObject(objectTypes.effect, {x:this.position.x, y:this.position.y});
							if (temp >= 0 && temp < g_maxobjects)
							{
								GameObjectArray[temp].spriteIndex = spriteIndices.spr_paintSplashIn;
							}
							DestroyGameObject(this.index);
						}
					}
					// Masq's bubble
					else if (this.extraInt2 == enemyTypes.masqBlob)
					{
						//if (this.extraFloat <= 2)
							this.velocity.y += playerConstants.gravity;
						//if (this.extraFloat <= 0)
							//.velocity.y += playerConstants.gravity;
						this.extraFloat--;
						
						// If we're colliding with any tiles, just pop.
						if (g_ChunkHandler.rectCheckCollision(this.collision.l - 1, this.collision.t - 1, this.collision.w + 2, this.collision.h + 2))
						{
							var temp = CreateGameObject(objectTypes.enemy, {x:this.position.x, y:this.position.y});
							if (temp >= 0 && temp < g_maxobjects)
							{
								GameObjectArray[temp].ReInitEnemies(enemyTypes.masqSplash, 1);
							}
							DestroyGameObject(this.index);
						}
						// Limit our downwards velocity.
						if (this.velocity.y > playerConstants.fallMaxSpeed / 2)
							this.velocity.y = playerConstants.fallMaxSpeed / 2;
					}
					// Iceman's food
					else if (this.extraInt2 == enemyTypes.icemanFood)
					{
						//if (this.extraFloat <= 2)
							this.velocity.y += playerConstants.gravity;
						//if (this.extraFloat <= 0)
							//this.velocity.y += playerConstants.gravity;
						this.extraFloat--;
						// Limit our downwards velocity.
						if (this.velocity.y > playerConstants.fallMaxSpeed / 2)
							this.velocity.y = playerConstants.fallMaxSpeed / 2;
					}
					
					// If we're a shooting type enemy, activate shooting behavior!
					if ((((this.extraInt2 == enemyTypes.arthur || this.extraInt2 == enemyTypes.metaru || this.extraInt2 == enemyTypes.tachikoma || this.extraInt2 == enemyTypes.ob2ko || this.extraInt2 == enemyTypes.shawn) && this.extraInt3 >= 3) ||
						g_playerType == 1) && this.extraInt2 < enemyTypes.bullet)
					{
						if (this.extraFloat4 == 0) this.extraFloat4 = enemyConstants.shotTimer / 2 / Math.abs(Math.ceil(g_scrollSpeed)) + (g_playerType == 1 ? Math.random() * 60 : 0) / Math.abs(Math.ceil(g_scrollSpeed));
					}
					
					// If we have shooting behavior activated, count down the timer and shoot the bullets when we're ready.
					if (this.extraFloat4 > 0)
					{
						this.extraFloat4--;
						if (this.extraFloat4 <= 0)
						{
							this.extraFloat4 = enemyConstants.shotTimer;
							var toPlayer = {x:GameObjectArray[g_playerId].position.x - this.position.x, y:GameObjectArray[g_playerId].position.y - this.position.y};
							toPlayer = NormalizeVector(toPlayer);
							for (var i = this.extraInt3; i >= 1 ; i--)
							{
								var temp = CreateGameObject(objectTypes.enemy, {x:this.position.x, y:this.position.y - 4});
								if (temp >= 0 && temp < g_maxobjects)
								{
									GameObjectArray[temp].ReInitEnemies(enemyTypes.bullet, 0);
									GameObjectArray[temp].velocity.x = toPlayer.x * enemyConstants.bulletSpeed * (i / this.extraInt3);
									GameObjectArray[temp].velocity.y = toPlayer.y * enemyConstants.bulletSpeed * (i / this.extraInt3);
								}
								if (g_playerType != 1) break;
							}
						}
					}
				}
				
				// For project type enemies, remove us if we leave the screen.
				if (this.extraInt2 >= enemyTypes.bullet)
				{
					if (this.position.x < g_spriteCamera.x - 8 || this.position.x > g_spriteCamera.x + g_screensize.x + 8 || 
						this.position.y < g_spriteCamera.y - 8 || this.position.y > g_spriteCamera.y + g_screensize.y + 8)
						DestroyGameObject(this.index);
				}
				// If the object is offscreen after the spawntimer has depleted, remove it.
				if (this.position.x < g_spriteCamera.x - 8 || this.position.x > g_spriteCamera.x + g_screensize.x + 8)
				{
					if (this.extraFloat2 <= 0)
					{
						this.extraFloat2 = 60;
						targetVel = 0;
						//DestroyGameObject(this.index);
					}
				}
				
				// Remove normal enemies if they leave the screen.
				if (this.extraInt2 < enemyTypes.dazz || this.extraInt2 > enemyTypes.iceman)
				{
					if (this.position.y < g_spriteCamera.y - 80 || this.position.y > g_spriteCamera.y + g_screensize.y + 8)
						DestroyGameObject(this.index);
				}
				// If the object is offscreen after the spawntimer has depleted, remove it.
				if (this.position.x < g_spriteCamera.x - 8 || this.position.x > g_spriteCamera.x + g_screensize.x + 8)
				{
					if (this.extraFloat2 <= 0)
					{
						this.extraFloat2 = 60;
						targetVel = 0;
						//DestroyGameObject(this.index);
					}
				}
				// Otherwise, make us active immediately.
				else
				{
					if (this.extraFloat2 > 0)
					{
						this.extraFloat2 = 0;
						this.scale = -1;
					}
				}
				break;
				
			// Item object.
			case objectTypes.item:
				if (this.extraFloat2 <= 0)
				{
					this.extraFloat3 += 15;
					if (this.extraFloat3 > 359)
						this.extraFloat3 -= 360;
					this.velocity.y = -Math.sin(degToRad(this.extraFloat3)) * 1 * this.extraFloat4;
				}
			
				if (this.position.x < g_spriteCamera.x - 16 || this.position.x > g_spriteCamera.x + g_screensize.x + 16 ||
					this.position.y < g_spriteCamera.y - 16 || this.position.y > g_spriteCamera.y + g_screensize.y + 16)
				{
					if (this.extraFloat2 <= 0)
						DestroyGameObject(this.index);
				}
				else if (this.extraFloat2 > 0) this.extraFloat2 = 0;
				break;
				
			// Paint object.
			case objectTypes.paint:
				// If the object leaves the screen, remove it.
				if (this.position.x < g_spriteCamera.x - 16 || this.position.x > g_spriteCamera.x + g_screensize.x + 16 ||
					this.position.y < g_spriteCamera.y - 16 || this.position.y > g_spriteCamera.y + g_screensize.y + 16)
				{
					DestroyGameObject(this.index);
				}
				break;
			// Paint platform object.
			case objectTypes.paintPlat:
				// If the object leaves the screen, remove it.
				if (this.position.x < g_spriteCamera.x - 32 || this.position.x > g_spriteCamera.x + g_screensize.x + 32 ||
					this.position.y < g_spriteCamera.y - 32 || this.position.y > g_spriteCamera.y + g_screensize.y + 32)
				{
					DestroyGameObject(this.index);
				}
				// If the object stays on the screen long enough, remove it
				this.extraInt--;
				if (this.extraInt <= 0)
				{
					DestroyGameObject(this.index);
					var temp = CreateGameObject(objectTypes.effect, {x:this.position.x, y:this.position.y});
					if (temp >= 0 && temp < g_maxobjects)
						GameObjectArray[temp].spriteIndex = spriteIndices.spr_paintSplashOut;
				}
				break;
			// Credits bubble object.
			case objectTypes.credits:
				if (this.position.y > this.extraInt || this.extraInt == -1)
				{
					this.position.y -= Math.abs(g_scrollSpeed);
					if (this.position.y < this.extraInt && this.extraInt != -1)
					{
						this.position.y = this.extraInt;
					}
				}
				this.position.x = g_spriteCamera.x + 17 + this.extraInt2;
				if (this.position.y < -32) DestroyGameObject(this.index);
				break;
			// Credits walker object.
			case objectTypes.enemyCredits:
				if (this.extraInt2 >= enemyTypes.dazz)
				{
					//if (this.position.x < g_spriteCamera.x + g_screensize.x + 32)
					{
						this.extraFloat3 += 15;
						if (this.extraFloat3 > 359)
							this.extraFloat3 -= 360;
						this.position.y -= Math.sin(degToRad(this.extraFloat3)) * 1;
					}
				}
				if (this.extraInt2 == enemyTypes.sol && this.position.x < g_spriteCamera.x + g_screensize.x / 2)
				{
					g_scrollSpeed = 0;
					this.frameSpeed = 0;
					this.frameIndex = 1;
				}
				if (this.position.x < g_spriteCamera.x - 16)
				{
					DestroyGameObject(this.index);
				}
				break;
			// Tsr splash object.
			case objectTypes.splashTsr:
				// If it reaches the bottom, flash the animation, then go to the main menu.
				if (this.velocity.y > 0 && this.position.y > g_screensize.y / 2)
				{
					this.position.y = g_screensize.y / 2;
					this.velocity.y = 0;
					this.frameSpeed = 12;
					PlaySound(soundIndices.snd_paint, g_soundvolume, false);
				}
				if (this.extraInt > 0)
				{
					this.extraInt--;
					if (this.extraInt <= 0)
					{
						g_gameStateToUpdate = GAME_STATE_MENU;
						subMenuOption = 0;
					}
				}
				break;
		}
		
		// Update the object's position.
		if (this.type != objectTypes.player && this.type != objectTypes.enemy)
		{
			this.position.x += this.velocity.x;// * 1/g_fps;;
			this.position.y += this.velocity.y;// * 1/g_fps;;
			if (this.type == objectTypes.jackal)
			{
				this.position.x = Math.floor(this.position.x);
			}
		}
		else
		{
			if (this.type != objectTypes.enemy)
				this.MoveWithSlopes();
			else
			{
				if (this.extraInt2 == enemyTypes.arthur || this.extraInt2 == enemyTypes.shark || this.extraInt2 == enemyTypes.duck || this.extraInt2 == enemyTypes.pk || this.extraInt2 >= enemyTypes.dazz)
				{
					if (this.extraInt2 != enemyTypes.masqBlob)
					{
						this.position.x += this.velocity.x;// * 1/g_fps;;
						this.position.y += this.velocity.y;// * 1/g_fps;;
					}
					else this.MoveWithSlopes();
				}
				else
				{
					//if (extraBool)
					{
						if (this.velocity.x > targetVel)
						{
							this.velocity.x -= playerConstants.runAccel / 2;
							if (this.velocity.x < targetVel) this.velocity.x = targetVel;
						}
						else if (this.velocity.x < targetVel)
						{
							this.velocity.x += playerConstants.runAccel / 2;
							if (this.velocity.x > targetVel) this.velocity.x = targetVel;
						}
					}
					this.MoveWithSlopes();
				}
			}
		}
		
		// If the position changed, update our collision area.
		if (this.position.x != this.prevPos.x || this.position.y != this.prevPos.y || collisionChanged)
		{
			this.collision.l = Math.round(this.position.x) + this.collisionRect.l;
			this.collision.t = Math.round(this.position.y) + this.collisionRect.t;
			this.collision.w = this.collisionRect.w;
			this.collision.h = this.collisionRect.h;
		}
	}
		
	// Called at the end of a frame after the main update.
	this.EndUpdate = function()
	{
		// If the object is inactive, skip it.
		if (!this.active) return;
		
		// If we're a player, check to see if we're still climbing.
		if (this.type == objectTypes.player)
		{
			if (this.extraInt == 1 || this.extraInt == 2)
			{
				var climbingPointTop = false;
				var climbingPointBottom = false;
				climbingPointTop = g_ChunkHandler.pointCheckCollision({x:this.position.x + (this.scale * 18), y:this.position.y + playerConstants.climbingPointsTop});
				climbingPointBottom = g_ChunkHandler.pointCheckCollision({x:this.position.x + (this.scale * 18), y:this.position.y + playerConstants.climbingPointsBottom});
					
				// If either climbing point is empty, we should stop climbing.
				if (!climbingPointTop || !climbingPointBottom)
					this.extraInt = 0;
				// If the top is false but not the bottom, we've reached the top of a block and should climb atop it.
				if (!climbingPointTop && climbingPointBottom)
				{
					this.extraInt = 3;
					// Position ourselves on top of the block we just climbed.
					this.position.x += this.scale * 2;
					this.position.y = Math.floor(this.position.y / 16) * 16 - 8;
					
					this.velocity.x = 0;
					this.velocity.y = 0;
					// Update the collision rectangle.
					this.collisionRect.l = playerConstants.duckCollision.l;
					this.collisionRect.t = playerConstants.duckCollision.t;
					this.collisionRect.w = playerConstants.duckCollision.w;
					this.collisionRect.h = playerConstants.duckCollision.h;
				}
			}
			// Keep the player on the screen horizontally.
			if (this.position.x < g_spriteCamera.x + 8)
			{
				this.position.x = g_spriteCamera.x + 8;
				if (this.velocity.x < 0) this.velocity.x = 0;
				for (var i = 0; i < 3; i++)
				{
					var temp = CreateGameObject(objectTypes.effect, {x:this.position.x + 4, y:this.position.y});
					var dir = Math.random() * 45;
					if (temp >= 0 && temp < g_maxobjects)
					{
						GameObjectArray[temp].spriteIndex = spriteIndices.spr_paintSplashIn;
						GameObjectArray[temp].velocity.x = Math.cos(degToRad(dir)) * 4;
						GameObjectArray[temp].velocity.y = -Math.sin(degToRad(dir)) * 12;
						GameObjectArray[temp].extraFloat3 = 1;
					}
				}
				PlaySound(soundIndices.snd_hit, g_soundvolume, false);
				g_playerHP = 0;
			}
			if (this.position.x > g_spriteCamera.x + g_screensize.x - 8)
			{
				this.position.x = g_spriteCamera.x + g_screensize.x - 8;
				if (this.velocity.x > 0) this.velocity.x = 0;
			}
				
			if (g_ChunkHandler.pointCheckCollision({x:this.collision.l, y:this.collision.t + this.collision.h})) this.position.y -= 1;
		}
		
		if (this.type == objectTypes.enemy)
		{
			if (this.extraFloat2 > 0)
			{
				// If the enemy is offscreen and is clipping through a block, push it upwards.
				if (g_ChunkHandler.rectCheckCollision(this.collision.l, this.position.y + 5, this.collision.w, 2))
					this.position.y -= 1;
			}
			/*if (this.position.x < g_spriteCamera.x + 8)
			{
				this.position.x = g_spriteCamera.x + 8;
				if (this.velocity.x < 0) this.velocity.x = 0;
				for (var i = 0; i < 3; i++)
				{
					var temp = CreateGameObject(objectTypes.effect, {x:this.position.x + 4, y:this.position.y});
					var dir = Math.random() * 45;
					if (temp >= 0 && temp < g_maxobjects)
					{
						GameObjectArray[temp].spriteIndex = spriteIndices.spr_paintSplashIn;
						GameObjectArray[temp].velocity.x = Math.cos(degToRad(dir)) * 4;
						GameObjectArray[temp].velocity.y = -Math.sin(degToRad(dir)) * 4;
						GameObjectArray[temp].extraFloat3 = 1;
					}
				}
				DestroyGameObject(this.index);
			}//*/
		}
		
		if (this.type == objectTypes.jackal)
		{
			// Keep the player on the screen.
			if (this.position.x < g_spriteCamera.x + 12)
			{
				this.position.x = g_spriteCamera.x + 12;
			}
			if (this.position.x > g_spriteCamera.x + g_screensize.x - 12)
			{
				this.position.x = g_spriteCamera.x + g_screensize.x - 12;
			}
			if (this.position.y < g_spriteCamera.y + 8)
			{
				this.position.y = g_spriteCamera.y + 8;
			}
			if (this.position.y > g_spriteCamera.y + g_screensize.y - 8)
			{
				this.position.y = g_spriteCamera.y + g_screensize.y - 8;
			}
		}
		
		// Scroll the object.
		//this.position.x += g_scrollSpeed;
		
		// Update our collision area.
		this.collision.l = Math.round(this.position.x) + this.collisionRect.l;
		this.collision.t = Math.round(this.position.y) + this.collisionRect.t;
		this.collision.w = this.collisionRect.w;
		this.collision.h = this.collisionRect.h;
	}
	
	// Called to check for collisions between two objects.
	this.Collide = function(other)
	{
		if (!this.active || !other.active) return;
		// If we're of a type that doesn't handle collisions, skip.
		//if (this.type == objectTypes.block) return;
		
		// Get the intersection depth of the objects' rectangles.
		var depth = RectangleIntersectionDepth(this.collision, other.collision);
		
		// If we collided, pick the action depending on the type of objects.
		if (depth.x != 0 || depth.y != 0)
		{
			switch (this.type)
			{
				case objectTypes.player:
					// If the other object was an enemy, lose HP!
					if (other.type == objectTypes.enemy && other.extraInt > 0)
					{
						if (this.extraFloat4 <= 0 && (((other.extraInt2 < enemyTypes.dazz) && other.extraInt3 > 0) ||
							(other.extraInt2 >= enemyTypes.dazz && other.extraInt2 <= enemyTypes.iceman) || other.extraInt2 >= enemyTypes.bullet) && !g_playerKonami)
						{
							this.extraFloat4 = playerConstants.invulnTimer;
							this.extraFloat = 0;
							this.velocity.y = -3;
							if (this.position.x < other.position.x)
							{
								this.velocity.x = -playerConstants.runSpeed;
								this.scale = 1;
							}
							else
							{
								this.velocity.x = playerConstants.runSpeed;
								this.scale = -1;
							}
							g_playerHP--;
							if (this.extraInt == 5) this.extraInt = 3;
							else if (this.extraInt != 3) this.extraInt = 0;
							PlaySound(soundIndices.snd_hit, g_soundvolume, false);
						}
					}
					break;
				case objectTypes.enemy:
					// If the other object was an effect tied to a player, lose HP!
					if ((other.type == objectTypes.effect || other.type == objectTypes.paint))
					{
						if (other.extraInt2 > -1 && other.extraInt2 < g_maxobjects)
						{
							if (GameObjectArray[other.extraInt2].type == objectTypes.player)
							{
								// For bosses, make them take damage!
								if (this.extraInt2 >= enemyTypes.dazz && this.extraInt2 <= enemyTypes.iceman)
								{
									// Take damage only if our hurttimer is inactive.
									if (this.extraFloat5 <= 0 && this.extraInt > 0)
									{
										this.extraInt--;
										if (this.extraInt < 0) this.extraInt = 0;
										
										this.extraFloat5 = Math.abs(playerConstants.ouchTimer) * 3;
										
										g_playerPaint -= playerConstants.paintHitCost;
										if (g_playerPaint < 0) g_playerPaint = 0;
										PlaySound(soundIndices.snd_paint, g_soundvolume, false);
									}
								}
								// For normal enemies, paint them green and give the player points.
								if (this.extraInt2 != enemyTypes.bullet && this.extraInt2 < enemyTypes.dazzHat && this.extraInt3 > 0)
								{
									var scoreAdd = 100;
									for (var i = 0; i < this.extraInt3 - 1; i++) scoreAdd *= 2;
									g_playerScore += scoreAdd;
								
									this.extraInt3 = 0;
									
									var temp = CreateGameObject(objectTypes.effect, {x:this.position.x, y:this.position.y});
									if (temp >= 0 && temp < g_maxobjects)
									{
										GameObjectArray[temp].spriteIndex = spriteIndices.spr_paintSplashIn;
									}
									
									// If we're a grooveman, maybe spawn a CD!
									if (this.extraInt2 == enemyTypes.groove)
									{
										temp = CreateGameObject(objectTypes.item, {x:this.position.x, y:this.position.y});
										var t = 2;
										if (g_cdsHad.length > 0) t = 1;
											GameObjectArray[temp].ReInitItems(t, Math.round(Math.random() * 4));
									}
									
									g_playerPaint -= playerConstants.paintHitCost;
									if (g_playerPaint < 0) g_playerPaint = 0;
									PlaySound(soundIndices.snd_paint, g_soundvolume, false);
								}
								// For bullet type entities, destroy them.
								else if (this.extraInt2 == enemyTypes.bullet || this.extraInt2 == enemyTypes.masqBlob || this.extraInt2 == enemyTypes.icemanFood)
								{
									DestroyGameObject(this.index);
								}
							}
						}
					}
					// If the other object was a dazzhat and we're dazz, switch back to normal state.
					if (other.type == objectTypes.enemy && other.extraInt2 == enemyTypes.dazzHat && this.extraInt2 == enemyTypes.dazz && other.extraInt5 == -1)
					{
						this.extraFloat3 = 0;
						DestroyGameObject(other.index);
					}
					break;
				case objectTypes.item:
					// If the other object was the player, remove us!
					if (other.index == g_playerId)
					{
						// Do other things depending on what kind of item we were.
						// Paint buckets.
						if (this.extraInt2 == 0)
						{
							if (this.extraInt3 == 0)
							{
								g_playerPaint += playerConstants.paintCan;
								if (g_playerPaint > g_playerMaxPaint) g_playerPaint = g_playerMaxPaint;
							}
							else
							{
								g_playerPaint -= playerConstants.paintCan;
								if (g_playerPaint < 0) g_playerPaint = 0;
							}
						}
						// CDs
						else if (this.extraInt2 == 1)
						{
							// Remove the cd from the array of not-collected cds and mark it as collected in the cds collected array.
							var t = g_cdsHad[this.extraInt4];
							g_cds[t] = 1;
							g_cdsHad.splice(this.extraInt4, 1);
							g_playerPaint = g_playerMaxPaint;
							g_playerHP = g_playerMaxHP;
							
							// save our collected cds.
							SaveCDs();
						}
						
						// Hearts
						else if (this.extraInt2 == 2)
						{
							g_playerHP++;
							if (g_playerHP > g_playerMaxHP) g_playerHP = g_playerMaxHP;
						}
						
						//if (g_difficulty < chunkConstants.maxDiff)
							g_playerScore += 1000;
						if (this.extraInt2 == 1) g_playerScore += 7000;
						
						DestroyGameObject(this.index);
						PlaySound(soundIndices.snd_point, g_soundvolume, false);
					}
					break;
			}
		}
	}
	
	// Called to see if this object would collide with the second given object if this object were moved to the given location.
	this.CollideObjects = function(other, pos)
	{
		return CollideRectangles({l:pos.x + this.collisionRect.l, t:pos.y + this.collisionRect.t, w:this.collisionRect.w, h:this.collisionRect.h}, other.collision); 
	}
	
	function CollideRectangles(first, second)
	{
		if (first.l > second.l + second.w)
			return false;
		if (first.l + first.w < second.l)
			return false;
		if (first.t > second.t + second.h)
			return false;
		if (first.t + first.h < second.t)
			return false;
			
		return true;
	}
	
	this.CollidePoint = function(other, pos)
	{
		return CollidePointWithRect(other.collision, pos);
	}
	
	function CollidePointWithRect(rect, pos)
	{
		if (pos.x < rect.l)
			return false;
		if (pos.x > rect.l + rect.w)
			return false;
		if (pos.y < rect.t)
			return false;
		if (pos.y > rect.t + rect.h)
			return false;
			
		return true;
	}
	
	// Called to see if the object is colliding with any objects of the given type, allowing for any changes in the collision hitbox to use specifically for this.
	this.CheckForCollision = function(pos, type, newcollision)
	{
		// Save the collision rect.
		var tempcollision = {l: this.collisionRect.l, t: this.collisionRect.t, w: this.collisionRect.w, h: this.collisionRect.h};
		// If we set a collision rect to change to, change to it.
		if (newcollision != null)
		{
			this.collisionRect.l = newcollision.l;
			this.collisionRect.t = newcollision.t;
			this.collisionRect.w = newcollision.w;
			this.collisionRect.h = newcollision.h;
		}
		
		var results;
		if (GetObjectAtPointRects(pos, type, this.index) != -1)
			results = true;
		else
			results = false;
		
		// Restore the previously saved collision rect.
		if (newcollision != null)
		{
			this.collisionRect.l = tempcollision.l;
			this.collisionRect.t = tempcollision.t;
			this.collisionRect.w = tempcollision.w;
			this.collisionRect.h = tempcollision.h;
		}
		
		return results;
	}
	
	// Called to draw an object.
	this.Draw = function(paused)
	{
		// If the object is inactive, skip it.
		if (!this.active) return;
		
		var shake = {x:0, y:0};
		
		// Change the sprite to draw depending on the object's type, current state, and direction.
		switch(this.type)
		{
			// Player object:
			case objectTypes.player:
				if (this.extraFloat4 <= playerConstants.invulnTimer + playerConstants.ouchTimer)
				{
					// Normal state.
					if (this.extraInt == 0)
					{
						// If the player is in the air, use jump sprites.
						if (!extraBool)
						{
							if (this.scale == 1) this.ChangeSprite(spriteIndices.spr_playerJump_right);
							else this.ChangeSprite(spriteIndices.spr_playerJump_left);
						}
						// Use ground sprites otherwise.
						else
						{
							// If the player isn't moving, use standing sprites.
							if (g_keyboard.KeyUp(controls.left) && g_keyboard.KeyUp(controls.right))
							{
								if (this.scale == 1) this.ChangeSprite(spriteIndices.spr_playerIdle_right);
								else this.ChangeSprite(spriteIndices.spr_playerIdle_left);
							}
							// Otherwise use walking sprites.
							else
							{
								if (this.scale == 1) this.ChangeSprite(spriteIndices.spr_playerRun_right);
								else this.ChangeSprite(spriteIndices.spr_playerRun_left);
								
								if (Math.floor(this.frameIndex) == 1 && this.extraFloat5 == 0)
								{
									PlaySound(soundIndices.snd_step, g_soundvolume, false);
									this.extraFloat5 = 1;
								}
								if (Math.floor(this.frameIndex) == 0 && this.extraFloat5 == 1)
									this.extraFloat5 = 0;
							}
						}
						this.frameSpeed = 9;
					}
					// Climbing state.
					else if (this.extraInt == 1 || this.extraInt == 2)
					{
						// Use climbing sprites.
						if (this.scale == 1) this.ChangeSprite(spriteIndices.spr_playerClimb_right);
						else this.ChangeSprite(spriteIndices.spr_playerClimb_left);
						this.frameSpeed = 15;
						
						if (Math.floor(this.frameIndex) == 1 && this.extraFloat5 == 0)
						{
							PlaySound(soundIndices.snd_step, g_soundvolume, false);
							this.extraFloat5 = 1;
						}
						if (Math.floor(this.frameIndex) == 0 && this.extraFloat5 == 1)
							this.extraFloat5 = 0;
					}
					// Crawling state.
					else if (this.extraInt == 3)
					{
						if (this.scale == 1) this.ChangeSprite(spriteIndices.spr_playerDuck_right);
						else this.ChangeSprite(spriteIndices.spr_playerDuck_left);
						this.frameSpeed = 15;
					}
					// Normal swing state.
					else if (this.extraInt == 4)
					{
						if (!extraBool)
						{
							if (this.scale == 1) this.ChangeSprite(spriteIndices.spr_playerSwingJ1_right);
							else this.ChangeSprite(spriteIndices.spr_playerSwingJ1_left);
						}
						else
						{
							if (this.scale == 1) this.ChangeSprite(spriteIndices.spr_playerSwing1_right);
							else this.ChangeSprite(spriteIndices.spr_playerSwing1_left);
						}
						this.frameSpeed = 9;
					}
					// Ducking swing state.
					else if (this.extraInt == 5)
					{
						if (this.scale == 1) this.ChangeSprite(spriteIndices.spr_playerSwingD1_right);
						else this.ChangeSprite(spriteIndices.spr_playerSwingD1_left);
						this.frameSpeed = 9;
					}
					// Paintblob swing state.
					else if (this.extraInt == 6)
					{
						if (this.scale == 1) this.ChangeSprite(spriteIndices.spr_playerSwingBlob_right);
						else this.ChangeSprite(spriteIndices.spr_playerSwingBlob_left);
						this.frameSpeed = 9;
					}
					// Combo'd swing state.
					else if (this.extraInt == 7)
					{
						if (this.scale == 1) this.ChangeSprite(spriteIndices.spr_playerSwing2_right);
						else this.ChangeSprite(spriteIndices.spr_playerSwing2_left);
						this.frameSpeed = 12;
					}
					// Charging state.
					else if (this.extraInt == 8)
					{
						if (this.scale == 1) this.ChangeSprite(spriteIndices.spr_playerCharge_right);
						else this.ChangeSprite(spriteIndices.spr_playerCharge_left);
						if (this.extraInt2 >= playerConstants.chargeFull) this.frameSpeed = 12;
						else this.frameSpeed = 0;
					}
					// Spinning state.
					else if (this.extraInt == 9)
					{
						if (this.scale == 1) this.ChangeSprite(spriteIndices.spr_playerSpin_right);
						else this.ChangeSprite(spriteIndices.spr_playerSpin_left);
						this.frameSpeed = 20;
					}
					// Spinjumping state.
					else if (this.extraInt == 10)
					{
						if (this.scale == 1) this.ChangeSprite(spriteIndices.spr_playerSpinJ_right);
						else this.ChangeSprite(spriteIndices.spr_playerSpinJ_left);
						this.frameSpeed = 20;
					}
				}
				else
				{
					if (this.scale == 1) this.ChangeSprite(spriteIndices.spr_playerHurt_right);
					else this.ChangeSprite(spriteIndices.spr_playerHurt_left);
				}
				break;
			// Enemy objects.
			case objectTypes.enemy:
			case objectTypes.enemyCredits:
				// If we're a normal enemy, switch the sprite to the right sheet. We'll set the frames after we animate as a frame limit.
				if (this.extraInt2 < enemyTypes.dazz && this.extraInt2 != -1)
				{
					if (this.extraInt3 == 0)
					{
						if (this.scale == 1) this.ChangeSprite(spriteIndices.spr_enemyGreen_right);
						else this.ChangeSprite(spriteIndices.spr_enemyGreen_left);
					}
					else if (this.extraInt3 == 1)
					{
						if (this.scale == 1) this.ChangeSprite(spriteIndices.spr_enemyBlue_right);
						else this.ChangeSprite(spriteIndices.spr_enemyBlue_left);
					}
					else if (this.extraInt3 == 2)
					{
						if (this.scale == 1) this.ChangeSprite(spriteIndices.spr_enemyYellow_right);
						else this.ChangeSprite(spriteIndices.spr_enemyYellow_left);
					}
					else
					{
						if (this.scale == 1) this.ChangeSprite(spriteIndices.spr_enemyRed_right);
						else this.ChangeSprite(spriteIndices.spr_enemyRed_left);
					}
				}
				else if (this.extraInt2 == -1)
				{
					if (this.scale == 1) this.ChangeSprite(spriteIndices.spr_playerRun_right);
					else this.ChangeSprite(spriteIndices.spr_playerRun_left);
				}
				// If we're a boss, use a boss sprite.
				else if (this.extraInt2 == enemyTypes.dazz)
				{
					this.ChangeSprite(spriteIndices.spr_dazz);
					this.frameSpeed = 0;
					if (this.extraInt <= 0) this.frameIndex = 3;
					else
					{
						if (this.extraFloat3 == 0) this.frameIndex = 1;
						else this.frameIndex = 0;
					}
					if (this.type == objectTypes.enemyCredits) this.frameIndex = 1;
				}
				else if (this.extraInt2 == enemyTypes.masq)
				{
					this.ChangeSprite(spriteIndices.spr_masq);
					this.frameSpeed = 0;
					if (this.extraInt <= 0) this.frameIndex = 2;
					else
					{
						if (this.extraFloat3 == 0) this.frameIndex = 0;
						else this.frameIndex = 1;
					}
					if (this.type == objectTypes.enemyCredits) this.frameIndex = 0;
				}
				else if (this.extraInt2 == enemyTypes.vic)
				{
					this.ChangeSprite(spriteIndices.spr_vic);
					this.frameSpeed = 0;
					if (this.extraInt >= enemyConstants.bossHP * 0.75) this.frameIndex = 0;
					else if (this.extraInt >= enemyConstants.bossHP * 0.5) this.frameIndex = 1;
					else if (this.extraInt >= enemyConstants.bossHP * 0.25) this.frameIndex = 2;
					else if (this.extraInt > 0) this.frameIndex = 3;
					else this.frameIndex = 4;
					if (this.type == objectTypes.enemyCredits) this.frameIndex = 0;
				}
				else if (this.extraInt2 == enemyTypes.bab)
				{
					this.ChangeSprite(spriteIndices.spr_bab);
					this.frameSpeed = 0;
					if (this.extraInt <= 0) this.frameIndex = 1;
					if (this.type == objectTypes.enemyCredits) this.frameIndex = 0;
				}
				else if (this.extraInt2 == enemyTypes.iceman)
				{
					this.ChangeSprite(spriteIndices.spr_iceman);
					this.frameSpeed = 0;
					if (this.extraInt <= 0) this.frameIndex = 2;
					else
					{
						if (this.extraFloat3 == 0) this.frameIndex = 1;
						else this.frameIndex = 0;
					}
					if (this.type == objectTypes.enemyCredits) this.frameIndex = 0;
				}
				// If we're a bullet, just use the bullet sprites.
				else if (this.extraInt2 == enemyTypes.bullet) this.ChangeSprite(spriteIndices.spr_enemy_bulletRed);
				else if (this.extraInt2 == enemyTypes.dazzHat) this.ChangeSprite(spriteIndices.spr_dazzHat);
				else if (this.extraInt2 == enemyTypes.masqBlob) this.ChangeSprite(spriteIndices.spr_masqBlob);
				else if (this.extraInt2 == enemyTypes.masqSplash) this.ChangeSprite(spriteIndices.spr_masqSplash);
				else if (this.extraInt2 == enemyTypes.vicShot) this.ChangeSprite(spriteIndices.spr_vicShot);
				else if (this.extraInt2 == enemyTypes.icemanFood) this.ChangeSprite(spriteIndices.spr_icemanFood);
				
				if (this.extraInt2 >= enemyTypes.dazz && this.extraInt2 <= enemyTypes.iceman)
				{
					if (this.extraFloat5 > 0 || this.extraInt <= 0 || (this.extraInt5 <= 30 && this.extraFloat3 == 0))
					{
						this.extraFloat5--;
						shake.x = Math.random() * 4 - 2;
						shake.y = Math.random() * 4 - 2;
					}
				}
				
				break;
		}
		
		// Animate the sprite.
		if (!paused) this.frameIndex += this.frameSpeed * 1/g_fps;
		
		if (this.spriteIndex == spriteIndices.spr_splash_tsr)
		{
			if (this.frameIndex >= g_SpriteSheetList[this.spriteIndex].frameCount)
			{
				this.frameIndex = 0;
				this.frameSpeed = 0;
				this.extraInt = 30;
			}
		}
		
		// If we're not a one-time effect, loop the animation.
		if (this.spriteIndex >= 0)
		{
			if (((this.type != objectTypes.effect) || (this.type == objectTypes.effect && this.extraInt4 > 1)) && this.type != objectTypes.enemy && this.type != objectTypes.enemyCredits)
			{
				// Don't loop if we're displaying certain sprites.
				if (this.spriteIndex != spriteIndices.spr_playerSwingJ1_right && this.spriteIndex != spriteIndices.spr_playerSwingJ1_left &&
					this.spriteIndex != spriteIndices.spr_playerSwing1_right && this.spriteIndex != spriteIndices.spr_playerSwing1_left &&
					this.spriteIndex != spriteIndices.spr_playerSwingD1_right && this.spriteIndex != spriteIndices.spr_playerSwingD1_left &&
					this.spriteIndex != spriteIndices.spr_playerSwingBlob_right && this.spriteIndex != spriteIndices.spr_playerSwingBlob_left &&
					this.spriteIndex != spriteIndices.spr_playerSwing2_right && this.spriteIndex != spriteIndices.spr_playerSwing2_left &&
					this.spriteIndex != spriteIndices.spr_playerSpin_right && this.spriteIndex != spriteIndices.spr_playerSpin_left &&
					this.spriteIndex != spriteIndices.spr_playerSpinJ_right && this.spriteIndex != spriteIndices.spr_playerSpinJ_left)
				{
					if (this.frameIndex >= g_SpriteSheetList[this.spriteIndex].frameCount)
						this.frameIndex = 0;
					else if (this.frameIndex < 0)
						this.frameIndex += g_spriteSheetList[this.spriteIndex].frameCount;
				}
				// If it is one of those sprites, do some extra things.
				else
				{
					if (this.frameIndex >= g_SpriteSheetList[this.spriteIndex].frameCount)
					{
						this.frameIndex = g_SpriteSheetList[this.spriteIndex].frameCount - 1;
						// If we're in an attack state, switch to standing state once the animation ends.
						if (this.spriteIndex == spriteIndices.spr_playerSwingJ1_right || this.spriteIndex == spriteIndices.spr_playerSwingJ1_left ||
							this.spriteIndex == spriteIndices.spr_playerSwing1_right || this.spriteIndex == spriteIndices.spr_playerSwing1_left ||
							this.spriteIndex == spriteIndices.spr_playerSwing2_right || this.spriteIndex == spriteIndices.spr_playerSwing2_left ||
							this.spriteIndex == spriteIndices.spr_playerSpin_right || this.spriteIndex == spriteIndices.spr_playerSpin_left ||
							this.spriteIndex == spriteIndices.spr_playerSpinJ_right || this.spriteIndex == spriteIndices.spr_playerSpinJ_left)
							this.extraInt = 0;
						else if (this.spriteIndex == spriteIndices.spr_playerSwingD1_right || this.spriteIndex == spriteIndices.spr_playerSwingD1_left)
							this.extraInt = 3;
						else if (this.spriteIndex == spriteIndices.spr_playerSwingBlob_right || this.spriteIndex == spriteIndices.spr_playerSwingBlob_left)
							this.extraInt = 0;
					}
				}
			}
			// If we are a one-time effect, destroy the object when the animation ends.
			else if (this.type == objectTypes.effect)
			{
				if (this.frameIndex >= g_SpriteSheetList[this.spriteIndex].frameCount)
				{
					this.frameIndex = g_SpriteSheetList[this.spriteIndex].frameCount - 1;
					
					if (this.extraInt3 == 1)
						CreateGameObject(objectTypes.paintPlat, {x:this.position.x, y:this.position.y});
					DestroyGameObject(this.index);
				}
			}
			// If we are an enemy, restrict the frames we can be on to the ones for our enemy type.
			else
			{
				// Don't do anything special if we're a boss; just restrict frame limits as normal.
				if (this.extraInt2 >= enemyTypes.dazz || this.extraInt2 == -1)
				{
					if (this.extraInt2 == enemyTypes.masqSplash)
					{
						if (this.frameIndex >= g_SpriteSheetList[this.spriteIndex].frameCount)
							DestroyGameObject(this.index);
					}
					else
					{
						if (this.frameIndex >= g_SpriteSheetList[this.spriteIndex].frameCount)
							this.frameIndex = 0;
						else if (this.frameIndex < 0)
							this.frameIndex += g_spriteSheetList[this.spriteIndex].frameCount;
					}
				}
				// Otherwise, restrict the frames to the enemy type * 2 and enemy type * 2 + 1.
				else
				{
					if (this.frameIndex >= this.extraInt2 * 2 + 2)
						this.frameIndex = this.extraInt2 * 2;
					else if (this.frameIndex < this.extraInt2 * 2)
						this.frameIndex = this.extraInt2 * 2 + 1;
				}
			}
		}
		
		if (this.type == objectTypes.player)
		{
			// If we're invincible, find out if we should even be drawing this frame.
			if (this.extraFloat4 > 0)
			{
				this.extraFloat4--;
				if (Math.floor(this.extraFloat4 / 2) % 2 == 0) return;
			}
		}
		
		// Draw the sprite, if it's not a flagged effect.
		if ((this.type != objectTypes.effect || (this.type == objectTypes.effect && this.extraInt4 == 0)) && this.spriteIndex >= 0)
		{
			if (this.type == objectTypes.credits)
				AddSpriteToQueue(spriteIndices.spr_full, 0, {x:Math.floor(this.position.x + shake.x) - 17, y:Math.floor(this.position.y + shake.y)}, this.drawDepth - 1, 1);
			
			AddSpriteToQueue(this.spriteIndex, this.frameIndex, {x:Math.floor(this.position.x + shake.x), y:Math.floor(this.position.y + shake.y)}, this.drawDepth, 1);
		}
		
		// If the debug option to show hitboxes is true, draw the hitboxes.
		if (g_showHitBoxes || (g_playerType == 1 && g_keyboard.KeyDown(controls.jump) && this.type == objectTypes.jackal))
		{
			AddLineToQueue({x:this.collision.l, y:this.collision.t}, {x:this.collision.l + this.collision.w, y:this.collision.t + this.collision.h}, "rgb(217,203,159)", true, 10, -1);
		}
		
		// If we're a credits object, draw our text.
		if (this.type == objectTypes.credits && this.extraString.length > 0)
		{
			g_layered = true;
			SpriteDrawText(this.extraString, {x:this.position.x + 24, y:this.position.y - 4}, 0, -1);
			g_layered = false;
		}
	}
	
	// Used to change sprites, automatically resetting the frame index if needed.
	this.ChangeSprite = function(newsprite)
	{
		if (this.spriteIndex != newsprite)
		{
			if (!((this.spriteIndex == spriteIndices.spr_playerRun_right && newsprite == spriteIndices.spr_playerRun_left) || (this.spriteIndex == spriteIndices.spr_playerRun_left && newsprite == spriteIndices.spr_playerRun_right) ||
					(this.spriteIndex == spriteIndices.spr_playerSwingJ1_right && newsprite == spriteIndices.spr_playerSwing1_right) || (this.spriteIndex == spriteIndices.spr_playerSwingJ1_left && newsprite == spriteIndices.spr_playerSwing1_left)))
				this.frameIndex = 0.0;
			this.spriteIndex = newsprite;
		}
	}
	
	// Called to destroy an object.
	this.Destroy = function()
	{
		this.active = false;
	}
	
	// Called to move the object until it's just in contact with a tile. Returns the amount moved.
	this.MoveUntilContact = function(amount, xory)
	{
		var sign = numberSign(amount);
		var i = Math.floor(Math.abs(amount));
		
		// In general, move the object to its destination, then step backwards until we're not colliding with terrain.
		// Limited to starting and ending positions.
		for (; i > 0; i--)
		{
			if (xory)
			{
				// If there's no collision with the terrain here, skip out now.
				if (!g_ChunkHandler.rectCheckCollision(this.collision.l + i * sign, this.collision.t, this.collision.w, this.collision.h))
				{
					this.position.x += i * sign;
					break;
				}
			}
			else
			{
				if (!g_ChunkHandler.rectCheckCollision(this.collision.l, this.collision.t + i * sign, this.collision.w, this.collision.h))
				{
					this.position.y += i * sign;
					break;
				}
			}
		}
		return i;
	}
	
	// Called to move the object. Returns the amount of distance travelled.
	// Based on a platformer slopes tutorial found on GameMakerCommunity written by "brod."
	// http://gmc.yoyogames.com/index.php?showtopic=436111
	this.MoveWithSlopes = function()
	{
		var g_maxSlope = 0;
		// Horizontal movement first.
		// Move the object ONE PIXEL AT AT TIME, checking along the way for collisions. This seems a really brute-force method,
		// but it was the only slopes method I'd seen that relies on simple true/false returns for collision.
		for (var i = 0; i < Math.ceil(Math.abs(this.velocity.x)); i++)
		{
			var rectPos = {x: this.position.x + this.collisionRect.l, y: this.position.y + this.collisionRect.t};
			var sign = numberSign(this.velocity.x);
			var moved = false;
			// If the path is obstructed, check to see if we can move up the slope any.
			if (g_ChunkHandler.rectCheckCollision(rectPos.x + sign, rectPos.y, this.collisionRect.w, this.collisionRect.h))
			{
				// If we didn't move during that loop, there must not be a slope. (Of course not, because slopes were removed!)
				if (!moved)
				{
					this.velocity.x = 0
					
					// If the player was in the air and was holding the direction towards the wall, make them start climbing now!
					if (this.type == objectTypes.player)
					{
						// Only start climbing if we're off the ground and not ducking.
						if (!extraBool && this.extraInt == 0)
						{
							var climbingPointTop = false;
							var climbingPointBottom = false;
							climbingPointTop = g_ChunkHandler.pointCheckCollision({x:this.position.x + (this.scale * 18), y:this.position.y + playerConstants.climbingPointsTop});
							climbingPointBottom = g_ChunkHandler.pointCheckCollision({x:this.position.x + (this.scale * 18), y:this.position.y + playerConstants.climbingPointsBottom});
							// If we don't have at least 2 blocks of climbing space, don't start climbing.
							if (climbingPointTop && climbingPointBottom)
							{
								if (g_keyboard.KeyDown(controls.left) && sign < 0)
								{
									this.extraInt = 1;
									this.velocity.y = 0;
								}
								else if (g_keyboard.KeyDown(controls.right) && sign > 0)
								{
									this.extraInt = 2;
									this.velocity.y = 0;
								}
							}
						}
					}
					break;
				}
			}
			// Otherwise, if there is no obstruction, then we need to check downwards for a slope, too.
			else
			{
				var extra = 0;
				// If we didn't move during that loop, then just move normally.
				if (!moved)
					this.position.x += sign;
			}
		}
		
		// Vertical movement second.
		//var vmoved = false;
		for (var i = 0; i < Math.ceil(Math.abs(this.velocity.y)); i++)
		{
			var rectPos = {x: this.position.x + this.collisionRect.l, y: this.position.y + this.collisionRect.t};
			var sign = numberSign(this.velocity.y);
			var colWithPaintPlat = this.velocity.y > 0 && this.CheckForCollision({x:this.position.x, y:this.position.y + sign}, objectTypes.paintPlat, null);
			var paintYes = false;
			if (colWithPaintPlat)
			{
				var paintYes = false;
				var blockId = GetObjectAtPointRects({x:this.position.x, y:this.position.y + 2}, objectTypes.paintPlat, this.index);
				if (blockId != -1)
				{
					if (GameObjectArray[blockId].position.y >= this.position.y + 16)
					{
						paintYes = true;
					}
				}
			}
			// If the next space is solid, stop moving.
			if (g_ChunkHandler.rectCheckCollision(rectPos.x, rectPos.y + sign, this.collisionRect.w, this.collisionRect.h) || paintYes)
			{
				if (this.velocity.y > 0 && this.type == objectTypes.player) PlaySound(soundIndices.snd_step, g_soundvolume, false);;
				this.velocity.y = 0;
				break;
			}
			// Otherwise, move.
			else
			{
				this.position.y += sign;
				//vmoved = true;
			}
		}
	}
}

// Function to compare two rectangles.
function RectangleIntersectionDepth(rectA, rectB)
{
	// Calculate half dimensions.
	var halfwidthA = rectA.w / 2;
	var halfheightA = rectA.h / 2;
	var halfwidthB = rectB.w / 2;
	var halfheightB = rectB.h / 2;
	
	// Calculate centers.
	var centerA = {x: rectA.l + halfwidthA, y: rectA.t + halfheightA};
	var centerB = {x: rectB.l + halfwidthB, y: rectB.t + halfheightB};
	
	// Calculate current and minimum-non-intersecting distances between centers.
	var distanceX = centerA.x - centerB.x;
	var distanceY = centerA.y - centerB.y;
	var minDistanceX = halfwidthA + halfwidthB;
	var minDistanceY = halfheightA + halfheightB;
	
	// If we are not intersecting at all, return (0, 0).
	if (Math.abs(distanceX) >= minDistanceX || Math.abs(distanceY) >= minDistanceY)
		return {x:0, y:0};
		
	// Calculate and return intersection depths.
	var depthX = ((distanceX > 0) ? minDistanceX - distanceX : -minDistanceX - distanceX);
	var depthY = ((distanceY > 0) ? minDistanceY - distanceY : -minDistanceY - distanceY);
	
	return {x:depthX, y:depthY};
}

// Function to normalize a vector.
function NormalizeVector(vec)
{
	var length = VectorLength(vec);
	var result;
	if (length > 0)
		result = {x:vec.x / length, y: vec.y / length};
	else result = {x:vec.x, y:vec.y};
	return result;
}

// Function to retrieve the length of the vector.
function VectorLength(vec)
{
	return Math.sqrt((vec.x * vec.x) + (vec.y * vec.y));
}

function VectorLengthSquared(vec)
{
	return vec.x * vec.x + vec.y * vec.y;
}