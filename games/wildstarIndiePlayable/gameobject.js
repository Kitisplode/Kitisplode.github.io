// Project: WildstarIndie
// File: gameobject.js
// Desc: Contains the class definition for the gameobject class.
// Author: Kitsu
// Created: March 13, 2013
//
//**************************************************************************************************

// Player class constants.
var playerConstants =
{
	extraPos: {x:-1, y:-1},
	jumpSpeed: -9,
	topSpeed: 10,
	runAccel: 1,
	runDecel: 1,
	runSpeed: 4,
	airMultiplier: 0.85,
	gravity: 0.98,
	chargeSpeed: 5,
	bladesInCharge: 5,
	aimRate: 3,
	invinTime: 10,
	spinRate: 20,
	bulletSpeed: 20,
	
	idleCollision: {l:-8, t: -5, w:13, h:14}
};

// Other object constants.
var objectConstants = 
{
	bladeDamage: 1,
	baseCrabHP: 4,
	
	rabbitChaseDist: 160,
	
	hermitSpeed: 1,
	turretTime: 45,
	turretShotSpeed: 11,
	probeSpeed: -0.5,
	probeMaxSpeed: 2,
	probeAccel: 0.25,
	beeAccel: 15,
	beeMaxSpeed: 5,
	beeChaseAccel: 0.15,
	trouncerSpeed: 2,
	trouncerWaitTime: 30,
	trouncerChargeRate: 8,
	
	crabCollision: {l:-12, t:-5, w:16, h:12},
	rabbitCollision: {l:-12, t:-7, w:16, h:14},
	doorCollision: {l:0, t:-23, w:20, h:30},
	hermitCollision: {l:-6, t:-5, w:12, h:12},
	turretShotCollision: {l:-7, t:-7, w:14, h:14},
	beeCollision: {l:-8, t:-5, w:14, h:20},
	beeButtCollision: {l:-6, t:-7, w:13, h:14},
	minicrabCollision: {l:-6, t:0, w:12, h:6},
	trouncerCollision: {l:-12, t:-19, w:24, h:24}
};

var enemyTypes = 
{
	crab: 0,
	rabbit: 1,
	door: 2,
	hermit: 3,
	turret: 4,
	turretShot: 5,
	probe: 6,
	probeLeft: 7,
	probeRight: 8,
	burnbulb: 9,
	shellbee: 10,
	drillbee: 11,
	drillbeebutt: 12,
	minicrab: 13,
	trouncer: 14,
	count: 15
};

// Set of object types.
var objectTypes = 
{
	player: 0,
	blade: 1,
	bullet: 2, 
	block: 3,
	crab: 4,
	effect: 5,
	rabbit: 6
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
	
	this.extraInt = 0;
	this.extraInt2 = 0;
	this.extraInt3 = 0;
	this.extraInt4 = 0;
	
	var extraArray;
	
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
		
		this.extraFloat = 0.0;
		this.extraFloat2 = 0.0;
		this.extraFloat3 = 0.0;
		
		// Set up the other variables according to the object type.
		switch (t)
		{
			case objectTypes.player:
				this.spriteIndex = 1;
				this.frameSpeed = 9.0;
				this.collisionRect = {l:playerConstants.idleCollision.l, t:playerConstants.idleCollision.t, w:playerConstants.idleCollision.w, h:playerConstants.idleCollision.h};
				if (extraArray == null) extraArray = new Array();
				this.drawDepth = 2;
				break;
			case objectTypes.blade:
				this.spriteIndex = 12;
				this.frameSpeed = 12;
				this.collisionRect = {l:-5, t: -5, w:10, h:10};
				this.drawDepth = 4;
				break;
			case objectTypes.bullet:
				this.spriteIndex = spriteIndices.spr_guyShots;
				this.frameSpeed = 0;
				this.collisionRect = {l:-5, t:-5, w:10, h:10};
				this.drawDepth = 4;
				break;
			case objectTypes.crab:
				this.spriteIndex = 15;
				this.frameSpeed = 12;
				this.collisionRect = {l:objectConstants.crabCollision.l, t:objectConstants.crabCollision.t, w:objectConstants.crabCollision.w, h:objectConstants.crabCollision.h};
				this.drawDepth = 0;
				this.extraInt = objectConstants.baseCrabHP;
				this.extraInt4 = enemyTypes.crab;
				break;
			case objectTypes.effect:
				this.spriteIndex = 19;
				this.frameSpeed = 12;
				this.collisionRect = {l:-1, t:-1, w:3, h:3};
				this.drawDepth = 3;
				this.extraInt2 = -1;
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
	this.ReInitEnemies = function(t)
	{
		if (this.type != objectTypes.crab) return;
		if (t < 0 || t >= enemyTypes.count) return;
		
		if (t == enemyTypes.probeLeft)
		{
			t = enemyTypes.probe;
			this.extraInt3 = 1;
		}
		else if (t == enemyTypes.probeRight)
		{
			t = enemyTypes.probe;
			this.extraInt3 = 0;
		}
		else if (t == enemyTypes.probe)
		{
			t = enemyTypes.probe;
			this.extraInt3 = 2;
		}
		
		this.extraInt4 = t;
		switch (t)
		{
			case enemyTypes.crab:
				this.extraFloat3 = 8;
				break;
			case enemyTypes.rabbit:
				this.collisionRect.l = objectConstants.rabbitCollision.l;
				this.collisionRect.t = objectConstants.rabbitCollision.t;
				this.collisionRect.w = objectConstants.rabbitCollision.w;
				this.collisionRect.h = objectConstants.rabbitCollision.h;
				this.extraInt = objectConstants.baseCrabHP * 2;
				this.frameSpeed = 12;
				break;
			case enemyTypes.door:
				this.collisionRect.l = objectConstants.doorCollision.l;
				this.collisionRect.t = objectConstants.doorCollision.t;
				this.collisionRect.w = objectConstants.doorCollision.w;
				this.collisionRect.h = objectConstants.doorCollision.h;
				this.spriteIndex = spriteIndices.spr_doorCracked;
				break;
			case enemyTypes.hermit:
				this.spriteIndex = spriteIndices.spr_hermit_LD;
				this.collisionRect.l = objectConstants.hermitCollision.l;
				this.collisionRect.t = objectConstants.hermitCollision.t;
				this.collisionRect.w = objectConstants.hermitCollision.w;
				this.collisionRect.h = objectConstants.hermitCollision.h;
				this.extraFloat2 = 3;
				this.extraFloat = 0;
				if (Math.random() > 0.5) this.extraFloat = 2;
				if (this.extraFloat < 0) this.extraFloat = 3;
				else if (this.extraFloat > 3) this.extraFloat = 0;
				this.extraFloat3 = objectConstants.hermitSpeed;
				break;
			case enemyTypes.turret:
				this.spriteIndex = spriteIndices.spr_turret;
				this.extraFloat3 = objectConstants.turretTime;
				PlaySound(12, 1.0);
				break;
			case enemyTypes.turretShot:
				this.spriteIndex = spriteIndices.spr_turretShot;
				this.frameSpeed = 0;
				this.collisionRect.l = objectConstants.turretShotCollision.l;
				this.collisionRect.t = objectConstants.turretShotCollision.t;
				this.collisionRect.w = objectConstants.turretShotCollision.w;
				this.collisionRect.h = objectConstants.turretShotCollision.h;
				PlaySound(13, 1.0);
				if (g_playerIndex >= -1)
				{
					var temp = {x:(GameObjectArray[g_playerIndex].position.x) - this.position.x, y:(GameObjectArray[g_playerIndex].position.y) - this.position.y};
					temp = NormalizeVector(temp);
					temp.x *= objectConstants.turretShotSpeed;
					temp.y *= objectConstants.turretShotSpeed;
					this.velocity.x = temp.x;
					this.velocity.y = temp.y;
				}
				break;
			case enemyTypes.probe:
				this.spriteIndex = spriteIndices.spr_probeOff;
				this.collisionRect.l = -8;
				this.extraFloat3 = 0;
				this.frameSpeed = 0;
				this.frameIndex = 1;
				if (this.extraInt3 == 2) this.velocity.x = objectConstants.probeSpeed;
				else this.velocity.y = objectConstants.probeSpeed;
				this.extraFloat = 0;
				this.extraFloat2 = 0;
				this.extraInt = objectConstants.baseCrabHP;
				if (g_playerType == 1) this.extraFloat3 = -1;
				break;
			case enemyTypes.shellbee:
				this.spriteIndex = spriteIndices.spr_bug_LD;
				this.collisionRect.l = objectConstants.hermitCollision.l;
				this.collisionRect.t = objectConstants.hermitCollision.t;
				this.collisionRect.w = objectConstants.hermitCollision.w;
				this.collisionRect.h = objectConstants.hermitCollision.h;
				this.extraFloat2 = 3;
				this.extraFloat = 0;
				if (Math.random() > 0.5) this.extraFloat = 2;
				if (this.extraFloat < 0) this.extraFloat = 3;
				else if (this.extraFloat > 3) this.extraFloat = 0;
				this.extraFloat3 = 2;
				this.extraInt = objectConstants.baseCrabHP;
				break;
			case enemyTypes.drillbee:
				this.spriteIndex = spriteIndices.spr_wingbug_L;
				this.collisionRect.l = objectConstants.beeCollision.l;
				this.collisionRect.t = objectConstants.beeCollision.t;
				this.collisionRect.w = objectConstants.beeCollision.w;
				this.collisionRect.h = objectConstants.beeCollision.h;
				this.collisionRect.l = -8;
				this.extraFloat3 = 0;
				this.frameSpeed = 0;
				this.frameIndex = 1;
				this.extraInt3 = 30;
				this.extraFloat = 0;
				this.extraFloat2 = 0;
				break;
			case enemyTypes.drillbeebutt:
				this.spriteIndex = spriteIndices.spr_wingbug_ab;
				this.frameSpeed = 0;
				this.collisionRect.l = objectConstants.beeButtCollision.l;
				this.collisionRect.t = objectConstants.beeButtCollision.t;
				this.collisionRect.w = objectConstants.beeButtCollision.w;
				this.collisionRect.h = objectConstants.beeButtCollision.h;
				break;
			case enemyTypes.minicrab:
				this.spriteIndex = spriteIndices.spr_minicrab_L;
				this.collisionRect.l = objectConstants.minicrabCollision.l;
				this.collisionRect.t = objectConstants.minicrabCollision.t;
				this.collisionRect.w = objectConstants.minicrabCollision.w;
				this.collisionRect.h = objectConstants.minicrabCollision.h;
				this.extraInt = objectConstants.baseCrabHP / 2;
				this.position.x += Math.random() * 8 - 4;
				this.extraFloat3 = 4;
				break;
			case enemyTypes.trouncer:
				this.spritendex = spriteIndices.spr_trouncerWalk_L;
				this.collisionRect.l = objectConstants.trouncerCollision.l;
				this.collisionRect.t = objectConstants.trouncerCollision.t;
				this.collisionRect.w = objectConstants.trouncerCollision.w;
				this.collisionRect.h = objectConstants.trouncerCollision.h;
				this.extraInt = objectConstants.baseCrabHP * 8;
				this.extraFloat3 = -1;
				PlaySound(19, 1.0);
				break;
		}
		
		this.collision.l = Math.round(this.position.x) + this.collisionRect.l;
		this.collision.t = Math.round(this.position.y) + this.collisionRect.t;
		this.collision.w = this.collisionRect.w;
		this.collision.h = this.collisionRect.h;
	}
	
	// Called to update an object.
	this.Update = function()
	{
		// If the object is inactive, skip it.
		if (!this.active) return;
		
		// Save the current position.
		this.prevPos.x = this.position.x;
		this.prevPos.y = this.position.y;
		
		//if (extraInt4 > 0) extraInt4--;
		
		var collisionChanged = false;
		
		// Update according to the object type.
		switch (this.type)
		{
			// Player object.
			case objectTypes.player:
				// Check to see if we're in the air or not.
				extraBool = mainTileMap.rectCheckCollision(this.collision.l, this.position.y + 5, this.collision.w, 5);
				// If we're in the normal state, do normal things...
				if (this.extraInt == 0)
				{
					// If we're in the air, fall down.
					if (!extraBool)
					{
						// Apply gravity.
						this.velocity.y += playerConstants.gravity;
						
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
						// If we're a gunner, allow the player to jump once in midair!
						if (g_playerType == 2)
						{
							if (g_keyboard.KeyPressed(controls.jump) && this.extraInt3 == 0)
							{
								this.velocity.y = playerConstants.jumpSpeed * 0.75;
								this.extraInt3++;
								extraBool2 = true;
								PlaySound(9, 1.0, false);
								
								var temp = CreateGameObject(objectTypes.effect, {x:this.position.x, y:this.position.y + 14});
								if (temp > 0 && temp <= g_maxobjects)
								{
									if (this.scale == 1) GameObjectArray[temp].spriteIndex = spriteIndices.spr_dustDash_L;
									else GameObjectArray[temp].spriteIndex = spriteIndices.spr_dustDash_R;
								}
							}
						}
					}
					// If we're on the ground, allow us to do some stuff (like jump).
					else
					{
						// If the player presses the jump key, jump.
						if (g_keyboard.KeyPressed(controls.jump))
						{
							this.velocity.y = playerConstants.jumpSpeed;
							PlaySound(0, 1.0, false);
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
						
						// For the gunner type, reset our flip count.
						if (g_playerType == 2)
						{
							extraBool2 = false;
							this.extraInt3 = 0;
						}
						
						// For the scientist character, allow us to interact with interactive tile entities if we press up.
						if (g_playerType == 0 && mainTileMap.GetTileType({x:this.position.x, y:this.position.y}) == tileEntityTypes.interactive)
						{
							if (g_keyboard.KeyPressed(controls.up))
							{
								if (g_playerType == 0)
								{
									mainTileMap.InteractTile({x:this.position.x, y:this.position.y}, true);
								}
								/*else
								{
									mainTileMap.InteractTile({x:this.position.x, y:this.position.y}, false);
									
									g_text = "qfSf8*2^F Seh&Hejf...# #... Only a Scientist could translate this shit! ";
									g_textPos = 0;
									// Split the text into lines according to # characters.
									var linestart = 0;
									for (var j = 0; j < g_text.length; j++)
									{
										// If we've come to a # character, cut the string out and put it in a line.
										if (g_text.charCodeAt(j) == 35 || j == g_text.length - 1)
										{
											g_textLines.push(g_text.substring(linestart, j));
											linestart = j + 1;
										}
									}
								}//*/
								this.velocity.x = 0;
							}
						}
					}
					
					// For the gunner player, allow him to aim up or even down.
					if (g_playerType == 2)
					{
						if (g_keyboard.KeyDown(controls.up) && g_keyboard.KeyUp(controls.duck))
						{
							this.extraFloat = 90;
							extraBool2 = false;
						}
						else if (g_keyboard.KeyDown(controls.duck) && g_keyboard.KeyUp(controls.up))
						{
							if (!extraBool)
							{
								this.extraFloat = 270;
								extraBool2 = false;
							}
							else this.extraFloat = 0;
						}
						else if (g_keyboard.KeyUp(controls.up) && g_keyboard.KeyUp(controls.duck))
						{
							this.extraFloat = 0;
						}
					}
					
					// If the player presses the attack key, attack!
					if (g_keyboard.KeyPressed(controls.attack))
					{
						if (g_playerType == 0 || g_playerType == 1)
						{
							this.extraInt = 1;
							this.frameIndex = 0;
							if (g_keyboard.KeyDown(controls.up)) this.extraFloat = 90;
							else
							{
								if (this.scale == -1) this.extraFloat = 180;
								else this.extraFloat = 0;
							}
							if (g_playerType == 0)
								PlaySound(1, 1.0, false);
							else if (g_playerType == 1)
							{
								var temp = CreateGameObject(objectTypes.effect, {x:this.position.x, y:this.position.y});
								if (temp > 0 && temp <= g_maxobjects)
								{
									if (this.scale == 1) GameObjectArray[temp].spriteIndex = spriteIndices.spr_swordFlame_R;
									else GameObjectArray[temp].spriteIndex = spriteIndices.spr_swordFlame_L;
									GameObjectArray[temp].drawDepth = 1;
									GameObjectArray[temp].extraInt2 = this.index;
								}
								PlaySound(7, 1.0, false);
							}
						}
						// For the gunner, fire the guns!
						else if (g_playerType == 2)
						{
							this.extraInt2++;
							if (this.extraInt2 >= 2) this.extraInt2 = 0;
							var tempPos = {x:this.position.x, y:this.position.y};
							if (this.extraInt2 == 0)
							{
								if (this.extraFloat != 0) 
								{
									tempPos.x -= 5 * this.scale;
									if (this.extraFloat == 90) tempPos.y -= 16;
									else tempPos.y += 19;
								}
								else tempPos.x += this.scale * 14;
							}
							else
							{
								if (this.extraFloat != 0)
								{
									tempPos.x += 2 * this.scale;
									if (this.extraFloat == 90) tempPos.y -= 19;
									else tempPos.y += 17;
								}
								else 
								{
									tempPos.x += this.scale * 10;
									tempPos.y += 5;
								}
							}
							var temp;
							if (this.extraFloat != 0) temp = CreateGameObject(objectTypes.bullet, {x:tempPos.x, y:this.position.y});
							else temp = CreateGameObject(objectTypes.bullet, {x:this.position.x, y:tempPos.y});
							if (temp > 0 && temp <= g_maxobjects)
							{

								extraBool2 = false;
								GameObjectArray[temp].extraFloat = this.extraFloat;
								if (this.scale == -1 && this.extraFloat == 0) GameObjectArray[temp].extraFloat = 180;
								GameObjectArray[temp].velocity.x = Math.cos(degToRad(GameObjectArray[temp].extraFloat)) * playerConstants.bulletSpeed;
								GameObjectArray[temp].velocity.y = Math.sin(degToRad(GameObjectArray[temp].extraFloat)) * -playerConstants.bulletSpeed;
								PlaySound(10, 1.0, false);
							}
							temp = CreateGameObject(objectTypes.effect, {x:tempPos.x, y:tempPos.y});
							if (temp > 0 && temp <= g_maxobjects)
							{
								GameObjectArray[temp].spriteIndex = spriteIndices.spr_shotPiff;
								GameObjectArray[temp].frameSpeed = 16;
							}
						}
					}
					// For the rock character, if the player is holding the attack key, charge up.
					if (g_playerType == 1 && this.extraInt == 0)
					{
						if (g_keyboard.KeyDown(controls.attack))
						{
							// At the start, create a charging effect.
							if (this.extraInt2 == 0)
							{
								var temp = CreateGameObject(objectTypes.effect, {x:this.position.x, y:this.position.y});
								if (temp > 0 && temp <= g_maxobjects)
								{
									GameObjectArray[temp].spriteIndex = spriteIndices.spr_chargeup;
									GameObjectArray[temp].extraInt2 = this.index;
								}
							}
						
							if (this.extraInt2 < 100)
							{
								if (this.extraInt2 == playerConstants.chargeSpeed * 2 * 0.5) PlaySound(1, 1.0, false);
								this.extraInt2 += playerConstants.chargeSpeed * 0.5;
								if (this.extraInt2 >= 100)
								{
									PlaySound(2, 1.0, false);
								}
							}
						}
						// If he releases the attack key, release the charge attack (but only if we're at full power).
						if (g_keyboard.KeyUp(controls.attack))
						{
							if (this.extraInt2 > 0)
							{
								if (this.extraInt2 >= 100)
								{
									this.extraInt = 2;
									var temp = CreateGameObject(objectTypes.effect, {x:this.position.x, y:this.position.y});
									if (temp > 0 && temp <= g_maxobjects)
									{
										if (this.scale == 1) GameObjectArray[temp].spriteIndex = spriteIndices.spr_spinFlame_R;
										else GameObjectArray[temp].spriteIndex = spriteIndices.spr_spinFlame_L;
										GameObjectArray[temp].extraInt2 = this.index;
										GameObjectArray[temp].frameSpeed = playerConstants.spinRate;
									}
									
								}
								this.extraInt2 = 0;
							}
						}
					}
				}
				// Otherwise, do other things depending on the state.
				else
				{
					// If we're in the air, apply gravity.
					if (!extraBool)
					{
						// Apply gravity.
						this.velocity.y += playerConstants.gravity;
					}
					// If we're on the ground, apply friction.
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
					// If we're injured, count down the paralysis timer.
					if (this.extraInt < 0)
					{
						this.extraInt++;
					}
					
					// For the aurin character:
					if (g_playerType == 0)
					{
						// Charge up the attack as long as we're still in the charging state.
						if (this.extraInt == 1)
						{
							if (this.extraInt2 < 100)
							{
								this.extraInt2 += playerConstants.chargeSpeed;
								if (this.extraInt2 >= 100)
								{
									this.extraInt2 = 100;
									PlaySound(2, 1.0, false);
								}
							}
							
							// If we need another blade at our current charge level, create one.
							if (extraArray.length * (100 / playerConstants.bladesInCharge) < this.extraInt2)
							{
								var temp = CreateGameObject(objectTypes.blade, {x:this.position.x + 16 * this.scale, y:this.position.y});
								extraArray.push(temp);
								if (temp > -1)
								{
									if (this.scale == -1) GameObjectArray[temp].extraFloat = 180;
									GameObjectArray[temp].extraInt2 = this.index;
								}
							}
							
							// Allow the player to aim around.
							if (g_keyboard.KeyDown(controls.up) && g_keyboard.KeyUp(controls.duck))
							{
								if (this.extraFloat < 90 || this.extraFloat > 270)
								{
									this.extraFloat += playerConstants.aimRate;
									if (this.extraFloat > 90 && this.extraFloat < 270) this.extraFloat = 90;
								}
								else if (this.extraFloat > 90 && this.extraFloat < 270)
								{
									this.extraFloat -= playerConstants.aimRate;
									if (this.extraFloat < 90) this.extraFloat = 90;
								}
								else if (this.extraFloat == 270)
								{
									if (this.scale == -1) this.extraFloat -= playerConstants.aimRate;
									else this.extraFloat += playerConstants.aimRate;
								}
							}
							else if (g_keyboard.KeyDown(controls.duck) && g_keyboard.KeyUp(controls.up))
							{
								if (this.extraFloat < 90 || this.extraFloat > 270)
								{
									this.extraFloat -= playerConstants.aimRate;
									if (this.extraFloat < 270 && this.extraFloat > 90) this.extraFloat = 270;
								}
								else if (this.extraFloat > 90 && this.extraFloat < 270)
								{
									this.extraFloat += playerConstants.aimRate;
									if (this.extraFloat > 270) this.extraFloat = 270;
								}
								else if (this.extraFloat == 90)
								{
									if (this.scale == -1) this.extraFloat += playerConstants.aimRate;
									else this.extraFloat -= playerConstants.aimRate;
								}
							}
							// If the player isn't aiming, slowly move back towards straight ahead.
							else if (g_keyboard.KeyUp(controls.up) && g_keyboard.KeyUp(controls.duck))
							{
								if (this.scale == -1)
								{
									if (this.extraFloat < 180)
									{
										this.extraFloat += playerConstants.aimRate / 2;
										if (this.extraFloat > 180) this.extraFloat = 180;
									}
									else if (this.extraFloat > 180)
									{
										this.extraFloat -= playerConstants.aimRate / 2;
										if (this.extraFloat < 180) this.extraFloat = 180;
									}
								}
								else
								{
									if (this.extraFloat <= 90)
									{
										this.extraFloat -= playerConstants.aimRate / 2;
										if (this.extraFloat < 0) this.extraFloat = 0;
									}
									else if (this.extraFloat >= 270)
									{
										this.extraFloat += playerConstants.aimRate / 2;
										if (this.extraFloat >= 360) this.extraFloat = 0;
									}
								}
							}
							
							if (this.extraFloat >= 360) this.extraFloat -= 360;
							else if (this.extraFloat < 0) this.extraFloat += 360;
						}
						
						// If the player releases the attack key, switch to the next state.
						if (this.extraInt == 1 && ((g_keyboard.KeyUp(controls.attack) && this.frameIndex >= 3)))// || this.extraInt2 >= 100))
						{
							this.extraInt = 2;
							this.frameIndex = 5;
							for (var i = 0; i < extraArray.length; i++)
							{
								if (extraArray[i] < 0 || extraArray[i] >= g_maxobjects) continue;
								GameObjectArray[extraArray[i]].extraInt = 1;
								GameObjectArray[extraArray[i]].extraFloat = this.extraFloat;
								GameObjectArray[extraArray[i]].velocity.x = Math.cos(degToRad(this.extraFloat)) * 18;
								GameObjectArray[extraArray[i]].velocity.y = Math.sin(degToRad(this.extraFloat)) * -18;
							}
							extraArray.length = 0;
							PlaySound(3, 1.0, false);
						}
					}
				}
				
				// Limit the players's vertical velocity.
				if (this.velocity.y > playerConstants.topSpeed || this.velocity.y < -playerConstants.topSpeed)
				{
					this.velocity.y = numberSign(this.velocity.y) * playerConstants.topSpeed;
				}
				
				// If we're on a trap tile, trigger it.
				if (mainTileMap.GetTileType({x:this.position.x, y:this.position.y}) == tileEntityTypes.trap)
				{
					mainTileMap.InteractTile({x:this.position.x, y:this.position.y}, true);
				}
				
				// Check our current tile to see if we're on a warp tile.
				var onWarp = mainTileMap.GetWarpTile({x:this.position.x, y:this.position.y});
				
				if (onWarp > -1)
				{
					// If we are, set our warp position.
					mainTileMap.SetWarp({x:this.position.x, y:this.position.y});
				}
				
				// If we leave the screen and we're not supposed to warp to another map, warp to the warp position.
				if (this.position.x < 0 - this.collisionRect.w || this.position.x > mainTileMap.fullSize.x - this.collisionRect.l || this.position.y < 0 - this.collisionRect.h || this.position.y > mainTileMap.fullSize.y - this.collisionRect.t)
				{
					if (g_nextMap == g_currentMap)
					{
						this.position.x = g_warpPos.x;
						this.position.y = g_warpPos.y;
					}
					else
					{
						g_gameStateToUpdate = GAME_STATE_RESET;
					}
				}//*/

				break;
			case objectTypes.blade:
				// While in the first state, revolve around the player.
				if (this.extraInt == 0)
				{
					if (this.extraInt2 > -1 && this.extraInt2 < g_maxobjects)
					{
						if (GameObjectArray[this.extraInt2].scale == -1) this.extraFloat -= 18;
						else this.extraFloat += 18;
						this.position.x = GameObjectArray[this.extraInt2].position.x + Math.cos(degToRad(this.extraFloat)) * 12;
						this.position.y = GameObjectArray[this.extraInt2].position.y - Math.sin(degToRad(this.extraFloat)) * 12;
					}
					else DestroyGameObject(this.index);
				}
			
				// If the blade leaves the screen while active, remove it.
				else
				{
					this.ChangeSprite(13);
					this.frameIndex = Math.floor(this.extraFloat / 180 * 8);
					this.frameSpeed = 0;
					// Break any breakable tiles.
					if (mainTileMap.BreakTile({x:this.position.x, y:this.position.y}))
					{
						PlaySound(15, 1.0);
					}
					if (this.position.x < g_spriteCamera.x - this.collisionRect.w || this.position.x > g_spriteCamera.x + g_screensize.x - this.collisionRect.l || this.position.y < g_spriteCamera.y - this.collisionRect.h || this.position.y > g_spriteCamera.y + g_screensize.y - this.collisionRect.t)
						DestroyGameObject(this.index);
					//AddLineToQueue({x:this.position.x, y:this.position.y}, {x:this.position.x - this.velocity.x * 3, y:this.position.y - this.velocity.y * 3}, "#ffffff", false, 12, 3);
					/*for (var i = 1; i < 4; i++)
					{
						CreateGameObject(objectTypes.effect, {x:this.position.x - this.velocity.x / i, y:this.position.y - this.velocity.y / i});
					}//*/
				}
				break;
			case objectTypes.bullet:
				this.frameIndex = Math.floor(this.extraFloat / 180 * 2);
				extraBool = mainTileMap.rectCheckCollision(this.collision.l + 2, this.collision.t + 2, this.collision.w - 4, this.collision.h - 4);
				if (this.position.x < g_spriteCamera.x - this.collisionRect.w || this.position.x > g_spriteCamera.x + g_screensize.x - this.collisionRect.l || this.position.y < g_spriteCamera.y - this.collisionRect.h || this.position.y > g_spriteCamera.y + g_screensize.y - this.collisionRect.t)
						DestroyGameObject(this.index);
				break;
			case objectTypes.crab:
				extraBool = mainTileMap.rectCheckCollision(this.collision.l, this.position.y + 5, this.collision.w, 5);
				// Depending on enemy type, run its behaviors.
				if (this.extraInt2 == 0)
				{
					switch (this.extraInt4)
					{
						case enemyTypes.crab:
						case enemyTypes.minicrab:
						// If we are on the screen, run towards the player!
							if (this.position.x > g_spriteCamera.x - this.collisionRect.w && this.position.x <= g_spriteCamera.x + g_screensize.x - this.collisionRect.l &&
								this.position.y > g_spriteCamera.y - this.collisionRect.h && this.position.y <= g_spriteCamera.y + g_screensize.y - this.collisionRect.t)
							{
								if (g_playerIndex >= -1)
								{
									// If we're on the ground, accelerate towards the player.
									if (extraBool)
									{
										if (this.position.x > GameObjectArray[g_playerIndex].position.x)
										{
											if (this.velocity.x > -playerConstants.topSpeed / this.extraFloat3) this.velocity.x -= playerConstants.runAccel / this.extraFloat3;
											this.scale = -1;
										}
										else
										{
											if (this.velocity.x < playerConstants.topSpeed / this.extraFloat3) this.velocity.x += playerConstants.runAccel / this.extraFloat3;
											this.scale = 1;
										}
										// If we hit a wall and the player is still ahead of us, jump!
										if (mainTileMap.pointCheckCollision({x:this.position.x + this.velocity.x * 5, y:this.position.y - 3}) &&
											((this.velocity.x < 0 && this.position.x > GameObjectArray[g_playerIndex].position.x) ||
											(this.velocity.x > 0 && this.position.x < GameObjectArray[g_playerIndex].position.x)) )
										{
											this.velocity.y = playerConstants.jumpSpeed;
										}
										// If we're a minicrab, jump whenever we get near the player but at varying jump heights.
										else if ( this.extraInt4 == enemyTypes.minicrab &&
											((this.velocity.x < 0 && this.position.x > GameObjectArray[g_playerIndex].position.x) ||
											(this.velocity.x > 0 && this.position.x < GameObjectArray[g_playerIndex].position.x)) &&
											Math.abs(this.position.x - GameObjectArray[g_playerIndex].position.x) < 80)
										{
											this.velocity.y = Math.random() * playerConstants.jumpSpeed / 2 + playerConstants.jumpSpeed / 2;
										}
									}
									// If we're in midair, still accelerate towards the player, but at a lower rate.
									else
									{
										if (this.position.x > GameObjectArray[g_playerIndex].position.x)
										{
											if (this.velocity.x > -playerConstants.topSpeed / this.extraFloat3) this.velocity.x -= playerConstants.runAccel / this.extraFloat3 / 2;
											this.scale = -1;
										}
										else
										{
											if (this.velocity.x < playerConstants.topSpeed / this.extraFloat3) this.velocity.x += playerConstants.runAccel / this.extraFloat3 / 2;
											this.scale = 1;
										}
									}
								}
							}
							else if (extraBool) this.velocity.x *= 0.5;
							break;
						case enemyTypes.rabbit:
							// If we are not near the player, hop around randomly.
							if (extraBool)
							{
								this.velocity.y = playerConstants.jumpSpeed;
								if (g_playerIndex > -1)
								{
									// If we're close enough to the player, go ahead and chase him.
									if (VectorLength({x:this.position.x - GameObjectArray[g_playerIndex].position.x, y:this.position.y - GameObjectArray[g_playerIndex].position.y}) < objectConstants.rabbitChaseDist)
									{
										if (this.position.x > GameObjectArray[g_playerIndex].position.x)
										{
											if (this.velocity.x > -playerConstants.topSpeed / 2) this.velocity.x -= 2;
											this.scale = -1;
										}
										else
										{
											if (this.velocity.x < playerConstants.topSpeed / 2) this.velocity.x += 2;
											this.scale = 1;
										}
									}
									else
									{
										if (this.velocity.x < 0)
										{
											this.velocity.x += 4;
											if (this.velocity.x > 0) this.velocity.x = 0;
										}
										else if (this.velocity.x > 0)
										{
											this.velocity.x -= 4;
											if (this.velocity.x < 0) this.velocity.x = 0;
										}
									}
								}
							}
							break;
						case enemyTypes.door:
							this.velocity.x = 0;
							this.velocity.y = 0;
							break;
						case enemyTypes.turret:
							// Countdown to the next time we shoot.
							this.extraFloat3--;
							if (this.position.x > g_spriteCamera.x - this.collisionRect.w && this.position.x <= g_spriteCamera.x + g_screensize.x - this.collisionRect.l &&
								this.position.y > g_spriteCamera.y - this.collisionRect.h && this.position.y <= g_spriteCamera.y + g_screensize.y - this.collisionRect.t)
							{
								if (this.extraFloat3 < objectConstants.turretTime / 4) 
								{
									AddSpriteToQueue(spriteIndices.spr_hudStuff, 5, {x:GameObjectArray[g_playerIndex].position.x, y:GameObjectArray[g_playerIndex].position.y}, 10, 0);
									if (!extraBool2)
									{
										PlaySound(19, 1.0);
										extraBool2 = true;
									}
								}
								// If our timer reaches zero, fire off.
								if (this.extraFloat3 <= 0)
								{
									var temp = CreateGameObject(objectTypes.crab, {x:this.position.x, y:this.position.y});
									if (temp >= 0 && temp < g_maxobjects)
									{
										GameObjectArray[temp].ReInitEnemies(enemyTypes.turretShot);
										GameObjectArray[temp].drawDepth = 3;
									}
									this.extraFloat3 = objectConstants.turretTime;
									extraBool2 = false;
								}
							}
							else
							{
								this.extraFloat3 = objectConstants.turretTime;
							}
							break;
						case enemyTypes.turretShot:
							var temp = CreateGameObject(objectTypes.effect, {x:this.prevPos.x, y:this.prevPos.y});
							if (temp >= 0 && temp < g_maxobjects)
							{
								GameObjectArray[temp].spriteIndex = spriteIndices.spr_turretShot;
							}
							break;
						case enemyTypes.probe:
							// Switch out of patrol mode if the switch is activated.
							if (this.extraFloat3 == 0)
							{
								// If the global switch is active, then switch to chase mode!
								if (g_switches[3] != null && g_switches[3] == true)
								{
									this.extraFloat3 = 1;
									PlaySound(12, 1.0);
									this.extraInt3 = objectConstants.turretTime * 2;
								}
							}
							// If we're in mode -1, chase the player immediately when we come on screen.
							if (this.extraFloat3 == -1)
							{
								this.velocity.x = 0;
								this.velocity.y = 0;
								if (this.position.x > g_spriteCamera.x - this.collisionRect.w && this.position.x <= g_spriteCamera.x + g_screensize.x - this.collisionRect.l &&
									this.position.y > g_spriteCamera.y - this.collisionRect.h && this.position.y <= g_spriteCamera.y + g_screensize.y - this.collisionRect.t)
								{
									this.extraFloat3 = 1;
									this.extraInt3 = objectConstants.turretTime * 2;
								}
							}
							// If we're in patrol mode, go back and forth, turning around when we reach a wall.
							else if (this.extraFloat3 == 0)
							{
								var templine;
								// Check the line ahead of the enemy.
								if (this.extraInt3 == 0)
								{
									// Pointing right.
									templine = mainTileMap.lineCheckCollision({x:this.position.x, y:this.position.y + 3}, {x:this.position.x + 640, y:this.position.y + 3});
								}
								else if (this.extraInt3 == 1)
								{
									// Pointing left.
									templine = mainTileMap.lineCheckCollision({x:this.position.x, y:this.position.y + 3}, {x:this.position.x - 640, y:this.position.y + 3});
								}
								else
								{
									// Pointing down.
									templine = mainTileMap.lineCheckCollision({x:this.position.x, y:this.position.y + 3}, {x:this.position.x, y:this.position.y + 483});
								}
								if (templine != null)
								{
									var finalPos = {x:this.position.x, y: this.position.y + 3};
									var addPos = {x:0, y:0};
									if (this.extraInt3 == 0)
									{
										finalPos.x = templine.x * mainTileMap.tileSize.x;
										addPos.x = 4;
									}
									else if (this.extraInt3 == 1)
									{
										finalPos.x = (templine.x + 1) * mainTileMap.tileSize.x;
										addPos.x = -4;
									}
									else finalPos.y = templine.y * mainTileMap.tileSize.y;
									AddLineToQueue({x:this.position.x + addPos.x, y:this.position.y + addPos.y + 3}, {x:finalPos.x, y:finalPos.y}, "#ff0000", false, 10, 2);
									
									if (g_playerIndex >= -1)
									{
										// Check to see if the player collides with this line, and if he does, trigger the alarm. Which alarm, sadly, has to be hardcoded since I didn't include space for it to be defined in the tile entities.
										if (RectangleLineCollide({l:GameObjectArray[g_playerIndex].collision.l, t:GameObjectArray[g_playerIndex].collision.t, w:GameObjectArray[g_playerIndex].collision.w, h:GameObjectArray[g_playerIndex].collision.h},
																	{x0:this.position.x, y0: this.position.y + 3, x1:finalPos.x, y1:finalPos.y}) == true)
										{
											g_switches[3] = true;
										}
									}
								}
							}
							// If we're in chase mode, chase after the player.
							else if (this.extraFloat3 == 1)
							{
								if ((g_playerType == 2 && this.position.x > g_spriteCamera.x - this.collisionRect.w && this.position.x <= g_spriteCamera.x + g_screensize.x - this.collisionRect.l &&
									this.position.y > g_spriteCamera.y - this.collisionRect.h && this.position.y <= g_spriteCamera.y + g_screensize.y - this.collisionRect.t) ||
									g_playerType != 2)
								{
									if (g_playerIndex >= -1)
									{
										var temp = {x:(GameObjectArray[g_playerIndex].position.x) - this.position.x, y:(GameObjectArray[g_playerIndex].position.y) - this.position.y};
										temp = NormalizeVector(temp);
										temp.x *= objectConstants.probeAccel * (g_playerType == 1 ? 3 : 1);
										temp.y *= objectConstants.probeAccel;
										this.velocity.x += temp.x;
										this.velocity.y += temp.y;
										if (VectorLengthSquared(this.velocity) > objectConstants.probeMaxSpeed * (g_playerType == 1 ? 2 : 1))
										{
											temp = NormalizeVector(this.velocity);
											temp.x *= objectConstants.probeMaxSpeed * (g_playerType == 1 ? 2 : 1);
											temp.y *= objectConstants.probeMaxSpeed * (g_playerType == 1 ? 2 : 1);
											this.velocity.x = temp.x;
											this.velocity.y = temp.y;
										}
										// Countdown on the shooting counter and then fire off when the timer expires.
										/*if (this.position.x > g_spriteCamera.x - this.collisionRect.w && this.position.x <= g_spriteCamera.x + g_screensize.x - this.collisionRect.l &&
											this.position.y > g_spriteCamera.y - this.collisionRect.h && this.position.y <= g_spriteCamera.y + g_screensize.y - this.collisionRect.t)
										{
											this.extraInt3--;
											if (this.extraInt3 < objectConstants.turretTime / 4) 
											{
												AddSpriteToQueue(spriteIndices.spr_hudStuff, 5, {x:GameObjectArray[g_playerIndex].position.x, y:GameObjectArray[g_playerIndex].position.y}, 10, 0);
												if (!extraBool2)
												{
													PlaySound(19, 1.0);
													extraBool2 = true;
												}
											}
											if (this.extraInt3 <= 0)
											{
												var temp = CreateGameObject(objectTypes.crab, {x:this.position.x, y:this.position.y});
												if (temp >= 0 && temp < g_maxobjects)
												{
													GameObjectArray[temp].ReInitEnemies(enemyTypes.turretShot);
													GameObjectArray[temp].drawDepth = 3;
												}
												this.extraInt3 = objectConstants.turretTime * 2;
												extraBool2 = false;
											}
										}
										else
										{
											this.extraInt3 = objectConstants.turretTime * 2;
										}//*/
									}
								}
								else
								{
									this.velocity.x *= 0.5;
									this.velocity.y *= 0.5;
								}
							}
							break;
						case enemyTypes.hermit:
							// Keep wall-crawlers' velocity to zero for while they're crawling.
							if (!extraBool2)
							{
								this.velocity.x = 0;
								this.velocity.y = 0;
							}
							break;
						case enemyTypes.shellbee:
							// Keep wall-crawlers' velocity to zero for while they're crawling.
							if (!extraBool2)
							{
								this.velocity.x = 0;
								this.velocity.y = 0;
								
								// If the player is under the enemy and the enemy is on the ceiling, drop down!
								if (g_playerIndex >= -1)
								{
									if (!mainTileMap.lineCheckCollision({x:this.position.x, y:this.position.y}, {x:GameObjectArray[g_playerIndex].position.x, y:GameObjectArray[g_playerIndex].position.y}))
									{
										if (this.extraFloat == 1)
										{
											if (this.position.x + this.collisionRect.l < GameObjectArray[g_playerIndex].position.x &&
												this.position.x + this.collisionRect.l + this.collisionRect.w > GameObjectArray[g_playerIndex].position.x &&
												this.position.y < GameObjectArray[g_playerIndex].position.y && !extraBool)
												extraBool2 = true;
										}
									}
								}
							}
							break;
						case enemyTypes.drillbee:
							// When we're not chasing the player, just hover around aimlessly.
							if (this.extraFloat3 == 0)
							{
								// Slow down.
								this.velocity.x *= 0.55;
								this.velocity.y *= 0.55;
								// Decrement the timer that controls how often the enemy changes direction.
								this.extraInt3--;
								// If the timer expires, reset it and change our direction.
								if (this.extraInt3 <= 0)
								{
									for (var k = 0; k < 5; k++)
									{
										this.extraInt3 = (Math.round(Math.random() * 3) + 1) * 10;
										var temp = Math.round(Math.random() * 359);
										this.velocity.x += Math.cos(degToRad(temp)) * objectConstants.beeAccel;
										this.velocity.y -= Math.sin(degToRad(temp)) * objectConstants.beeAccel;
										if (!mainTileMap.rectCheckCollision(this.collision.l + this.velocity.x, this.position.y + this.velocity.y, this.collision.w, this.collision.h)) break;
									}
								}
								if (g_playerIndex >= -1)
								{
									if (!mainTileMap.lineCheckCollision({x:this.position.x, y:this.position.y}, {x:GameObjectArray[g_playerIndex].position.x, y:GameObjectArray[g_playerIndex].position.y}))
									{
										this.extraFloat3 = 1;
									}
								}
							}
							// Otherwise, chase the player.
							else
							{
								this.extraInt3 = 30;
								if (this.position.x > g_spriteCamera.x - this.collisionRect.w && this.position.x <= g_spriteCamera.x + g_screensize.x - this.collisionRect.l &&
									this.position.y > g_spriteCamera.y - this.collisionRect.h && this.position.y <= g_spriteCamera.y + g_screensize.y - this.collisionRect.t)
								{
									if (g_playerIndex >= -1)
									{
										var temp = {x:(GameObjectArray[g_playerIndex].position.x) - this.position.x, y:(GameObjectArray[g_playerIndex].position.y) - this.position.y};
										temp = NormalizeVector(temp);
										temp.x *= objectConstants.beeChaseAccel * 2;
										temp.y *= objectConstants.beeChaseAccel;
										this.velocity.x += temp.x;
										this.velocity.y += temp.y;
										if (VectorLengthSquared(this.velocity) > objectConstants.beeMaxSpeed * 2)
										{
											temp = NormalizeVector(this.velocity);
											temp.x *= objectConstants.beeMaxSpeed;
											temp.y *= objectConstants.beeMaxSpeed;
											this.velocity.x = temp.x;
											this.velocity.y = temp.y;
										}
									}
									else this.extraFloat3 = 0;
								}
								else this.extraFloat3 = 0;
							}
							break;
						case enemyTypes.drillbeebutt:
							// Trigger any switchswitch tiles we hit.
							mainTileMap.SwitchSwitchTile({x:this.collision.l, y:this.collision.t + this.collision.h});
							mainTileMap.SwitchSwitchTile({x:this.collision.l + this.collision.w, y:this.collision.t + this.collision.h});
							// If we hit a solid tile, die.
							if (mainTileMap.rectCheckCollision(this.collision.l, this.collision.t, this.collision.w, this.collision.h)) this.extraInt = 0;
							// Apply gravity.
							this.velocity.y += playerConstants.gravity;
							break;
						case enemyTypes.trouncer:
							// If in movement mode, just move towards the player.
							if (this.extraFloat3 == 0 && this.extraInt > 0)
							{
								if (g_playerIndex >= 0)
								{
									var temp = Math.floor(this.frameIndex);
									if (this.position.x > GameObjectArray[g_playerIndex].position.x)
									{
										this.scale = -1;
										if (temp == 4 || temp == 5 || temp == 6 || temp == 11 || temp == 12 || temp == 13) this.velocity.x = 0;
										else this.velocity.x = -objectConstants.trouncerSpeed;
									}
									else if (this.position.x < GameObjectArray[g_playerIndex].position.x)
									{
										this.scale = 1;
										if (temp == 4 || temp == 5 || temp == 6 || temp == 11 || temp == 12 || temp == 13) this.velocity.x = 0;
										else this.velocity.x = objectConstants.trouncerSpeed;
									}
									// If the player is above us, attack him.
									if (this.position.y + this.collisionRect.t > GameObjectArray[g_playerIndex].position.y + GameObjectArray[g_playerIndex].collisionRect.t + GameObjectArray[g_playerIndex].collisionRect.h &&
										this.position.x + this.collisionRect.l < GameObjectArray[g_playerIndex].position.x &&
										this.position.x + this.collisionRect.l + this.collisionRect.w > GameObjectArray[g_playerIndex].position.x)
									{
										this.extraFloat3 = 1;
										this.velocity.x = 0;
										this.velocity.y = playerConstants.jumpSpeed / 2;
										PlaySound(18, 1.0);
										var temp = CreateGameObject(objectTypes.effect, {x:this.position.x, y:this.position.y});
										if (temp > 0 && temp <= g_maxobjects)
										{
											if (this.scale == 1) GameObjectArray[temp].spriteIndex = spriteIndices.spr_trouncerFlap_R;
											else GameObjectArray[temp].spriteIndex = spriteIndices.spr_trouncerFlap_L;
											GameObjectArray[temp].extraInt2 = this.index;
											GameObjectArray[temp].extraFloat3 = -2;
											GameObjectArray[temp].frameSpeed = 12;
											GameObjectArray[temp].scale = this.scale;
										}
									}
								}
							}
							break;
					}
				}
				
				// For trouncers, handle AI state.
				if (this.extraInt4 == enemyTypes.trouncer)
				{
					if (this.extraInt > 0)
					{
						if (g_playerIndex >= 0)
						{
							// Do the other stuff only if we're still in movement mode.
							if (this.extraFloat3 == 0)
							{
								// If the player stays within melee range for a period of time, start charging.
								if (Math.abs(this.position.x - GameObjectArray[g_playerIndex].position.x) < 64)
								{
									this.extraFloat2++;
									if (this.extraFloat2 >= objectConstants.trouncerWaitTime)
									{
										this.extraFloat3 = 2;
										this.extraFloat2 = 0;
										this.velocity.x = 0;
										PlaySound(19, 1.0);
										if (this.extraFloat > objectConstants.trouncerWaitTime) this.extraFloat -= objectConstants.trouncerWaitTime / 2;
									}
								}
								// Meanwhile, also increment the ranged attack timer whenever we can, and when it expires, charge the ranged attack.
								if (this.extraFloat3 == 0)
								{
									this.extraFloat++;
									if (this.extraFloat >= objectConstants.trouncerWaitTime * 5)
									{
										this.extraFloat3 = 3;
										this.extraFloat = 0;
										this.extraFloat2 = 0;
										this.velocity.x = 0;
										PlaySound(19, 1.0);
									}
								}
							}
							// If we're charging a melee attack, charge up.
							else if (this.extraFloat3 == 2)
							{
								this.extraFloat2 += objectConstants.trouncerChargeRate;
								if (this.extraFloat2 >= 100)
								{
									this.extraFloat3 = 4;
									this.extraFloat2 = 0;
									PlaySound(8, 1.0);
									
									var temp = CreateGameObject(objectTypes.effect, {x:this.position.x, y:this.position.y});
									if (temp > 0 && temp <= g_maxobjects)
									{
										if (this.scale == 1) GameObjectArray[temp].spriteIndex = spriteIndices.spr_trouncerPunch_R;
										else GameObjectArray[temp].spriteIndex = spriteIndices.spr_trouncerPunch_L;
										GameObjectArray[temp].extraInt2 = this.index;
										GameObjectArray[temp].extraFloat3 = -2;
										GameObjectArray[temp].frameSpeed = 18;
										GameObjectArray[temp].scale = this.scale;
									}
								}
							}
							// If we're charging a range attack, charge up.
							else if (this.extraFloat3 == 3)
							{
								this.extraFloat += objectConstants.trouncerChargeRate / 2;
								if (this.extraFloat >= 100)
								{
									this.extraFloat3 = 0;
									this.extraFloat = 0;
								}
							}
							// If we're in none of the charging or movement states, reset the waiting timers.
							else
							{
								this.extraFloat2 = 0;
								extraBool2 = false;
							}
							
							// Change our hitbox to properly fit the position of the enemy while attack.
							if (this.extraFloat3 == 4)
							{
								var temp = Math.floor(this.frameIndex);
								if (temp == 2)
								{
									this.collisionRect.l = objectConstants.trouncerCollision.l + this.scale * 7;
									collisionChanged = true;
								}
								else if (temp == 3)
								{
									this.collisionRect.l = objectConstants.trouncerCollision.l + this.scale * 14;
									collisionChanged = true;
								}
								else if (temp == 9)
								{
									this.collisionRect.l = objectConstants.trouncerCollision.l;
								}
							}
						}
					}
					// If we're invin and have no HP left, spawn lots of explosions!
					else
					{
						if (this.extraInt2 % 4 == 0)
						{
							var temp = CreateGameObject(objectTypes.effect, {x:this.position.x + Math.random() * this.collisionRect.w - this.collisionRect.w / 2, y:this.position.y + Math.random() * this.collisionRect.h - this.collisionRect.h / 2});
							if (temp > 0 && temp <= g_maxobjects)
							{
								GameObjectArray[temp].spriteIndex = spriteIndices.spr_ring;
								GameObjectArray[temp].frameSpeed = 15;
								GameObjectArray[temp].drawDepth = 5;
							}
							PlaySound(14, 1.0);
						}
					}
				}
				
				// Don't move normally for wallcrawlers; all of their movement is handled separately.
				if (this.extraInt4 != enemyTypes.hermit && this.extraInt4 != enemyTypes.turret && this.extraInt4 != enemyTypes.turretShot && this.extraInt4 != enemyTypes.probe &&
					this.extraInt4 != enemyTypes.shellbee && this.extraInt4 != enemyTypes.drillbee && this.extraInt4 != enemyTypes.drillbeebutt)
				{
					// If we're not on the ground, apply gravity.
					if (!extraBool)
					{
						this.velocity.y += playerConstants.gravity;
					}
					// If we're on the ground
					else
					{
						// If we've been hurt, apply friction.
						if (this.extraInt2 != 0)
						{
							if (this.velocity.x > 0)
							{
								this.velocity.x -= playerConstants.runDecel;
								if (this.velocity.x < 0) this.velocity.x = 0;
							}
							else if (this.velocity.x < 0)
							{
								this.velocity.x += playerConstants.runDecel;
								if (this.velocity.x > 0) this.velocity.x = 0;
							}
						}
					}
				}
				// If the object should be dead, destroy it now.
				if (this.extraInt <= 0 && this.extraInt2 == 0)
				{
					//if (this.extraInt4 != enemyTypes.door)
					{
						var temp = CreateGameObject(objectTypes.effect, {x:this.position.x, y:this.position.y});
						if (temp > 0 && temp <= g_maxobjects)
						{
							if (this.extraInt4 == enemyTypes.trouncer) GameObjectArray[temp].spriteIndex = spriteIndices.spr_explosion_2x;
							else GameObjectArray[temp].spriteIndex = spriteIndices.spr_explosion_small;
							GameObjectArray[temp].frameSpeed = 13;
						}
						temp = CreateGameObject(objectTypes.effect, {x:this.position.x, y:this.position.y});
						if (temp > 0 && temp <= g_maxobjects)
						{
							GameObjectArray[temp].spriteIndex = spriteIndices.spr_ring;
							GameObjectArray[temp].frameSpeed = 15;
							GameObjectArray[temp].drawDepth = 5;
						}
						
						if (this.extraInt4 == enemyTypes.drillbee)
						{
							temp = CreateGameObject(objectTypes.crab, {x:this.position.x, y:this.position.y});
							if (temp > 0 && temp <= g_maxobjects)
							{
								GameObjectArray[temp].ReInitEnemies(enemyTypes.drillbeebutt);
							}
						}
					}
					if (this.extraInt4 == enemyTypes.trouncer) PlaySound(20, 1.0);
					else PlaySound(14, 1.0);
					DestroyGameObject(this.index);
				}
				// If the enemy leaves the room, destroy it.
				if (this.extraInt4 != enemyTypes.probe)
				{
					if (this.position.x < 0 - this.collisionRect.w || this.position.x > mainTileMap.fullSize.x - this.collisionRect.l || this.position.y < 0 - this.collisionRect.h || this.position.y > mainTileMap.fullSize.y - this.collisionRect.t)
						DestroyGameObject(this.index);
				}
				// For probes, don't let them leave the room.
				else
				{
					if (this.position.x < -this.collisionRect.l) this.position.x = -this.collisionRect.l;
					else if (this.position.x > mainTileMap.fullSize.x + this.collisionRect.l - this.collisionRect.w) this.position.x = mainTileMap.fullSize.x + this.collisionRect.l - this.collisionRect.w;
					if (this.position.y < -this.collisionRect.t) this.position.y = -this.collisionRect.t;
					else if (this.position.y > mainTileMap.fullSize.y + this.collisionRect.t - this.collisionRect.h) this.position.y = mainTileMap.fullSize.y + this.collisionRect.t - this.collisionRect.h;
				}
				break;
			case objectTypes.effect:
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
					}
					
					// If we're a sword flame, change our collision each frame to match the displayed frame.
					if (this.spriteIndex == spriteIndices.spr_swordFlame_L)
					{
						if (Math.floor(this.frameIndex) == 0)
						{
							this.collisionRect.l = -31; this.collisionRect.t = -29;
							this.collisionRect.w = 22; this.collisionRect.h = 48;
							collisionChanged = true;
						}
						else if (Math.floor(this.frameIndex) == 3)
						{
							this.collisionRect.l = 0; this.collisionRect.t = 0;
							this.collisionRect.w = 0; this.collisionRect.h = 0;
							collisionChanged = true;
						}
					}
					else if (this.spriteIndex == spriteIndices.spr_swordFlame_R)
					{
						if (Math.floor(this.frameIndex) == 0)
						{
							this.collisionRect.l = 8; this.collisionRect.t = -29;
							this.collisionRect.w = 22; this.collisionRect.h = 48;
							collisionChanged = true;
						}
						else if (Math.floor(this.frameIndex) == 3)
						{
							this.collisionRect.l = 0; this.collisionRect.t = 0;
							this.collisionRect.w = 0; this.collisionRect.h = 0;
							collisionChanged = true;
						}
					}
					else if (this.spriteIndex == spriteIndices.spr_spinFlame_L || this.spriteIndex == spriteIndices.spr_spinFlame_R)
					{
						if (Math.floor(this.frameIndex) == 0)
						{
							this.collisionRect.l = -30; this.collisionRect.t = -10;
							this.collisionRect.w = 60; this.collisionRect.h = 20;
							collisionChanged = true;
							this.drawDepth = 3;
						}
						else if (Math.floor(this.frameIndex) == 1) this.drawDepth = 1;
						else if (Math.floor(this.frameIndex) == 3) this.drawDepth = 3;
						else if (Math.floor(this.frameIndex) == 4) this.drawDepth = 1;
						else if (Math.floor(this.frameIndex) == 7) this.drawDepth = 3;
						else if (Math.floor(this.frameIndex) == 8) this.drawDepth = 1;
					}
					// If we're a trouncer attack, adjust the hitboxes.
					if (this.spriteIndex == spriteIndices.spr_trouncerFlap_L)
					{
						var temp = Math.floor(this.frameIndex);
						if (temp == 0)
						{
							this.collisionRect.l = 2; this.collisionRect.t = -36;
							this.collisionRect.w = 19; this.collisionRect.h = 15;
							collisionChanged = true;
						}
						else if (temp == 1)
						{
							this.collisionRect.l = -23; this.collisionRect.t = -43;
							this.collisionRect.w = 42; this.collisionRect.h = 30;
							collisionChanged = true;
						}
						else if (temp == 2)
						{
							this.collisionRect.l = -35; this.collisionRect.t = -40;
							this.collisionRect.w = 29; this.collisionRect.h = 28;
							collisionChanged = true;
						}
						else if (temp == 3)
						{
							this.collisionRect.l = -33; this.collisionRect.t = -9;
							this.collisionRect.w = 17; this.collisionRect.h = 18;
							collisionChanged = true;
						}
					}
					if (this.spriteIndex == spriteIndices.spr_trouncerFlap_R)
					{
						var temp = Math.floor(this.frameIndex);
						if (temp == 0)
						{
							this.collisionRect.l = -22; this.collisionRect.t = -36;
							this.collisionRect.w = 19; this.collisionRect.h = 15;
							collisionChanged = true;
						}
						else if (temp == 1)
						{
							this.collisionRect.l = -20; this.collisionRect.t = -43;
							this.collisionRect.w = 42; this.collisionRect.h = 30;
							collisionChanged = true;
						}
						else if (temp == 2)
						{
							this.collisionRect.l = 5; this.collisionRect.t = -40;
							this.collisionRect.w = 29; this.collisionRect.h = 28;
							collisionChanged = true;
						}
						else if (temp == 3)
						{
							this.collisionRect.l = 15; this.collisionRect.t = -9;
							this.collisionRect.w = 17; this.collisionRect.h = 18;
							collisionChanged = true;
						}
					}
					if (this.spriteIndex == spriteIndices.spr_trouncerPunch_L)
					{
						var temp = Math.floor(this.frameIndex);
						if (temp == 0)
						{
							this.collisionRect.l = 0; this.collisionRect.t = 0;
							this.collisionRect.w = 0; this.collisionRect.h = 0;
							collisionChanged = true;
						}
						else if (temp == 2)
						{
							this.collisionRect.l = -42; this.collisionRect.t = -21;
							this.collisionRect.w = 29; this.collisionRect.h = 23;
							collisionChanged = true;
						}
						else if (temp == 3)
						{
							this.collisionRect.l = -58; this.collisionRect.t = -21;
							this.collisionRect.w = 38; this.collisionRect.h = 23;
							collisionChanged = true;
						}
						else if (temp == 4)
						{
							this.collisionRect.l = -63; this.collisionRect.t = -21;
							this.collisionRect.w = 18; this.collisionRect.h = 23;
							collisionChanged = true;
						}
						else if (temp == 6)
						{
							this.collisionRect.l = -21; this.collisionRect.t = 0;
							this.collisionRect.w = 0; this.collisionRect.h = 0;
							collisionChanged = true;
						}
					}
					if (this.spriteIndex == spriteIndices.spr_trouncerPunch_R)
					{
						var temp = Math.floor(this.frameIndex);
						if (temp == 0)
						{
							this.collisionRect.l = 0; this.collisionRect.t = 0;
							this.collisionRect.w = 0; this.collisionRect.h = 0;
							collisionChanged = true;
						}
						else if (temp == 2)
						{
							this.collisionRect.l = 12; this.collisionRect.t = -21;
							this.collisionRect.w = 29; this.collisionRect.h = 23;
							collisionChanged = true;
						}
						else if (temp == 3)
						{
							this.collisionRect.l = 19; this.collisionRect.t = -21;
							this.collisionRect.w = 38; this.collisionRect.h = 23;
							collisionChanged = true;
						}
						else if (temp == 4)
						{
							this.collisionRect.l = 44; this.collisionRect.t = -21;
							this.collisionRect.w = 18; this.collisionRect.h = 23;
							collisionChanged = true;
						}
						else if (temp == 6)
						{
							this.collisionRect.l = 21; this.collisionRect.t = 0;
							this.collisionRect.w = 0; this.collisionRect.h = 0;
							collisionChanged = true;
						}
					}
					// If we're a player charging effect, don't go away unless the player releases the attack key or if the player gets hit.
					if (this.spriteIndex == spriteIndices.spr_chargeup)
					{
						if (g_keyboard.KeyUp(controls.attack) || GameObjectArray[this.extraInt2].extraInt < 0)
							DestroyGameObject(this.index);
						if (GameObjectArray[this.extraInt2].extraInt2 >= 100)
							this.ChangeSprite(spriteIndices.spr_chargedone);
					}
					else if (this.spriteIndex == spriteIndices.spr_chargedone)
					{
						if (g_keyboard.KeyUp(controls.attack) || GameObjectArray[this.extraInt2].extraInt < 0)
							DestroyGameObject(this.index);
					}
				}
				break;
		}
		
		// Update the object's position.
		if (this.type == objectTypes.player || this.type == objectTypes.crab || this.type == objectTypes.rabbit)
		{
			if (this.type == objectTypes.crab && (this.extraInt4 == enemyTypes.hermit || this.extraInt4 == enemyTypes.shellbee))
				this.MoveWallCrawl();
			else
			{
				if (this.type == objectTypes.crab && (this.extraInt4 == enemyTypes.turretShot || this.extraInt4 == enemyTypes.drillbeebutt))
				{
					this.position.x += this.velocity.x;// * 1/g_fps;;
					this.position.y += this.velocity.y;// * 1/g_fps;;
				}
				else if (this.type == objectTypes.crab && (this.extraInt4 == enemyTypes.probe || this.extraInt4 == enemyTypes.drillbee))
				{
					if (this.extraInt4 == enemyTypes.drillbee || (this.extraInt4 == enemyTypes.probe && this.extraFloat3 == 0 && g_playerType != 1) && this.extraInt2 == 0)
					{
						this.extraFloat2 += this.velocity.x;
						this.extraFloat += this.velocity.y;
						var vel = Math.abs(this.velocity.x);
						for (var i = 0; i < vel; i++)
						{
							var rectPos = {x: this.position.x + this.collisionRect.l, y: this.position.y + this.collisionRect.t};
							if (mainTileMap.rectCheckCollision(rectPos.x + numberSign(this.velocity.x), rectPos.y, this.collisionRect.w, this.collisionRect.h))
							{
								if (this.extraInt4 == enemyTypes.probe && this.extraFloat3 == 0) this.velocity.x *= -1;
								else 
								{
									this.velocity.x /= 2;
									break;
								}
							}
							this.position.x += numberSign(this.velocity.x);
							this.ExtraFloat2 -= numberSign(this.ExtraFloat2);
						}
						
						vel = Math.abs(this.velocity.y);
						for (var i = 0; i < vel; i++)
						{
							var rectPos = {x: this.position.x + this.collisionRect.l, y: this.position.y + this.collisionRect.t};
							if (mainTileMap.rectCheckCollision(rectPos.x, rectPos.y + numberSign(this.velocity.y), this.collisionRect.w, this.collisionRect.h))
							{
								if (this.extraInt4 == enemyTypes.probe && this.extraFloat3 == 0) this.velocity.y *= -1;
								else 
								{
									this.velocity.y /= 2;
									break;
								}
							}
							this.position.y += numberSign(this.velocity.y);
							this.ExtraFloat -= numberSign(this.ExtraFloat);
						}
					}
					else
					{
						this.position.x += this.velocity.x;// * 1/g_fps;;
						this.position.y += this.velocity.y;// * 1/g_fps;;
					}
				}
				else
				{
					this.MoveWithSlopes();
				}
			}
		}
		else
		{
			this.position.x += this.velocity.x;// * 1/g_fps;;
			this.position.y += this.velocity.y;// * 1/g_fps;;
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
		// Also skip objects that don't have update enders.
		//if (this.type == objectTypes.block || this.type == objectTypes.splashTSR) return;
		if (this.type == objectTypes.bullet)
		{
			if (extraBool)
			{
				var temp = CreateGameObject(objectTypes.effect, {x:this.prevPos.x, y:this.prevPos.y});
				if (temp > 0 && temp <= g_maxobjects) GameObjectArray[temp].spriteIndex = 20;
				DestroyGameObject(this.index);
			}
		}
	}
	
	// Called to check for collisions between two objects.
	this.Collide = function(other)
	{
		if (!this.active || !other.active) return;
		// If we're of a type that doesn't handle collisions, skip.
		if (this.type == objectTypes.block) return;
		if (this.type == objectTypes.crab && (this.extraInt4 == enemyTypes.turretShot)) return;
		
		// Get the intersection depth of the objects' rectangles.
		var depth = RectangleIntersectionDepth(this.collision, other.collision);
		
		// If we collided, pick the action depending on the type of objects.
		if (depth.x != 0 || depth.y != 0)
		{
			switch (this.type)
			{
				case objectTypes.player:
				// If we're a player and we collided with an enemy, take some damage!
					if (other.type == objectTypes.crab ||
						(other.type == objectTypes.effect &&
						(other.spriteIndex == spriteIndices.spr_trouncerFlap_L || other.spriteIndex == spriteIndices.spr_trouncerFlap_R ||
						 other.spriteIndex == spriteIndices.spr_trouncerPunch_L || other.spriteIndex == spriteIndices.spr_trouncerPunch_R)))
					{
						if (this.extraInt >= 0 && (other.type != objectTypes.crab || (other.type == objectTypes.crab && other.extraInt2 == 0)) && this.extraInt4 == 0)
						{
							// If we were charging an attack, destroy any blades we have out.
							if (this.extraInt == 1 || this.extraInt == 2)
							{
								for (var i = 0; i < extraArray.length; i++)
								{
									if (extraArray[i] < 0 || extraArray[i] >= g_maxobjects) continue;
									DestroyGameObject(extraArray[i]);
								}
								extraArray.length = 0;
							}
							this.extraInt = -playerConstants.invinTime / 2;
							this.extraInt2 = 0;
							this.extraInt4 = playerConstants.invinTime * 2;
							this.velocity.y = playerConstants.jumpSpeed / 4;
							if (other.type == objectTypes.crab)
							{
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
							}
							else
							{
								this.velocity.x = other.scale * playerConstants.runSpeed * 2;
							}
							var temp = CreateGameObject(objectTypes.effect, {x:this.position.x - depth.x, y:this.position.y - depth.y});
							if (temp > 0 && temp <= g_maxobjects)
								GameObjectArray[temp].spriteIndex = 20;
							PlaySound(6, 1.0, false);
							g_playerHP--;
						}
					}
					break;
				case objectTypes.crab:
					var hit = false;
					// If we're an enemy and we collided with a player's blade, take some damage!
					if (other.type == objectTypes.blade && other.extraInt == 1 && this.extraInt2 == 0)
					{
						if (this.extraInt4 == enemyTypes.door || this.extraInt4 == enemyTypes.turret)
						{
							PlaySound(11, 1.0);
							this.extraInt2 = playerConstants.invinTime;
						}
						else if (this.extraInt4 != enemyTypes.drillbeebutt)
						{
							this.extraInt -= objectConstants.bladeDamage * 2;
							this.extraInt2 = playerConstants.invinTime;
							var temp = CreateGameObject(objectTypes.effect, {x:this.position.x, y:this.position.y});
							if (temp > 0 && temp <= g_maxobjects)
								GameObjectArray[temp].spriteIndex = 20;
							PlaySound(5, 1.0, false);
							if (this.extraInt == 0)
							{
								this.velocity.x = 0;
								this.velocity.y = 0;
							}
							hit = true;
						}
					}
				// If we collided with a player's bullet, take some minimal damage.
					if (other.type == objectTypes.bullet && this.extraInt2 == 0)
					{
						if (this.extraInt4 == enemyTypes.door || this.extraInt4 == enemyTypes.turret || this.extraInt4 == enemyTypes.probe) 
						{
							PlaySound(11, 1.0);
							DestroyGameObject(other.index);
						}
						else
						{
							this.extraInt -= objectConstants.bladeDamage;
							this.extraInt2 = 2;
							var temp = CreateGameObject(objectTypes.effect, {x:this.position.x - depth.x, y:this.position.y - depth.y});
							if (temp > 0 && temp <= g_maxobjects)
								GameObjectArray[temp].spriteIndex = 20;
							DestroyGameObject(other.index);
							PlaySound(5, 1.0, false);
							hit = true;
						}
					}
				// If we collided with a sword flame, take some damage!
					if (other.type == objectTypes.effect && this.extraInt2 == 0)
					{
						if (other.spriteIndex == spriteIndices.spr_swordFlame_L || other.spriteIndex == spriteIndices.spr_swordFlame_R)
						{
							if (this.extraInt4 == enemyTypes.door)
							{
								PlaySound(11, 1.0);
								this.extraInt2 = playerConstants.invinTime;
							}
							else
							{
								this.extraInt -= objectConstants.bladeDamage * 2;
								this.extraInt2 = playerConstants.invinTime;
								if (this.extraInt4 != enemyTypes.trouncer && this.extraInt4 != enemyTypes.probe)
								{
									this.velocity.y = playerConstants.jumpSpeed / 4;
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
								}
								else if (this.extraInt4 == enemyTypes.probe)
								{
									this.velocity.y = Math.random() * playerConstants.runSpeed * 2 - playerConstants.runSpeed;
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
									if (this.extraInt3 < objectConstants.turretTime / 4) this.extraInt3 = objectConstants.turretTime * 2;
								}
								var temp = CreateGameObject(objectTypes.effect, {x:this.position.x, y:this.position.y});
								if (temp > 0 && temp <= g_maxobjects)
									GameObjectArray[temp].spriteIndex = 20;
								PlaySound(5, 1.0, false);
								hit = true;
							}
						}
						// Same for the spin flame, though take more damage.
						else if (other.spriteIndex == spriteIndices.spr_spinFlame_L || other.spriteIndex == spriteIndices.spr_spinFlame_R)
						{
							this.extraInt -= objectConstants.bladeDamage * 4;
							this.extraInt2 = playerConstants.invinTime;
							if (this.extraInt4 != enemyTypes.trouncer && this.extraInt4 != enemyTypes.probe)
							{
								this.velocity.y = playerConstants.jumpSpeed / 5;
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
							}
							else if (this.extraInt4 == enemyTypes.probe)
								{
									this.velocity.y = Math.random() * playerConstants.runSpeed * 2 - playerConstants.runSpeed;
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
									if (this.extraInt3 < objectConstants.turretTime / 4) this.extraInt3 = objectConstants.turretTime * 2;
								}
							var temp = CreateGameObject(objectTypes.effect, {x:this.position.x, y:this.position.y});
							if (temp > 0 && temp <= g_maxobjects)
								GameObjectArray[temp].spriteIndex = 20;
							PlaySound(5, 1.0, false);
							hit = true;
						}
					}
					// If we got hit and we now have 0 HP, extend the the invintimer to allow for more explosions (for bigger enemies).
					if (this.extraInt4 == enemyTypes.trouncer)
					{
						if (hit && this.extraInt <= 0) this.extraInt2 *= 4;
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
		
		// Change the sprite depending on the object's state.
		if (this.type == objectTypes.player)
		{
			// If we're in the normal state, use normal sprites.
			if (this.extraInt == 0)
			{
				// If we're on the ground, use ground frames.
				if (extraBool)
				{
					// If we're not moving, use standing frames.
					if ((g_keyboard.KeyUp(controls.left) && g_keyboard.KeyUp(controls.right)) || g_text != "")
					{
						if (this.scale == 1)
						{
							if (g_playerType == 0)
								this.ChangeSprite(spriteIndices.spr_bunnyIdle_R);
							else if (g_playerType == 1)
								this.ChangeSprite(spriteIndices.spr_rockIdle_R);
							else if (g_playerType == 2)
							{
								if (this.extraFloat == 0) this.ChangeSprite(spriteIndices.spr_guyIdle_R);
								else this.ChangeSprite(spriteIndices.spr_guyIdle_RU);
							}
						}
						else
						{
							if (g_playerType == 0)
								this.ChangeSprite(spriteIndices.spr_bunnyIdle_L);
							else if (g_playerType == 1)
								this.ChangeSprite(spriteIndices.spr_rockIdle_L);
							else if (g_playerType == 2)
							{
								if (this.extraFloat == 0) this.ChangeSprite(spriteIndices.spr_guyIdle_L);
								else this.ChangeSprite(spriteIndices.spr_guyIdle_LU);
							}
						}
						this.frameSpeed = 9;
					}
					// If we are moving, use running frames.
					else
					{
						if (this.scale == 1)
						{
							if (g_playerType == 0)
								this.ChangeSprite(spriteIndices.spr_bunnyRun_R);
							else if (g_playerType == 1)
								this.ChangeSprite(spriteIndices.spr_rockRun_R);
							else if (g_playerType == 2)
							{
								if (this.extraFloat == 0) this.ChangeSprite(spriteIndices.spr_guyRun_R);
								else this.ChangeSprite(spriteIndices.spr_guyRun_RU);
							}
						}
						else
						{
							if (g_playerType == 0)
								this.ChangeSprite(spriteIndices.spr_bunnyRun_L);
							else if (g_playerType == 1)
								this.ChangeSprite(spriteIndices.spr_rockRun_L);
							else if (g_playerType == 2)
							{
								if (this.extraFloat == 0) this.ChangeSprite(spriteIndices.spr_guyRun_L);
								else this.ChangeSprite(spriteIndices.spr_guyRun_LU);
							}
						}
						this.frameSpeed = 25;
					}
				}
				// If we're in the air, use air frames instead.
				else
				{
					if (this.scale == 1)
					{
						if (g_playerType == 0)
							this.ChangeSprite(spriteIndices.spr_bunnyJump_R);
						else if (g_playerType == 1)
							this.ChangeSprite(spriteIndices.spr_rockJump_R);
						else if (g_playerType == 2)
						{
							if (!extraBool2)
							{
								if (this.extraFloat == 0) this.ChangeSprite(spriteIndices.spr_guyJump_R);
								else if (this.extraFloat == 90) this.ChangeSprite(spriteIndices.spr_guyJump_RU);
								else this.ChangeSprite(spriteIndices.spr_guyJump_RD);
							}
							else this.ChangeSprite(spriteIndices.spr_guyFlip_R);
						}
					}
					else
					{
						if (g_playerType == 0)
							this.ChangeSprite(spriteIndices.spr_bunnyJump_L);
						else if (g_playerType == 1)
							this.ChangeSprite(spriteIndices.spr_rockJump_L);
						else if (g_playerType == 2)
						{
							if (!extraBool2)
							{
								if (this.extraFloat == 0) this.ChangeSprite(spriteIndices.spr_guyJump_L);
								else if (this.extraFloat == 90) this.ChangeSprite(spriteIndices.spr_guyJump_LU);
								else this.ChangeSprite(spriteIndices.spr_guyJump_LD);
							}
							else this.ChangeSprite(spriteIndices.spr_guyFlip_L);
						}
					}
					if (this.spriteIndex == spriteIndices.spr_guyFlip_R || this.spriteIndex == spriteIndices.spr_guyFlip_L) this.frameSpeed = 20;
					else this.frameSpeed = 11;
				}
			}
			// Otherwise, use sprites according to the other states.
			else if (this.extraInt == 1)
			{
				if (this.scale == 1)
				{
					if (g_playerType == 0)
						this.ChangeSprite(spriteIndices.spr_bunnyThrow_R);
					else if (g_playerType == 1)
						this.ChangeSprite(spriteIndices.spr_rockSword_R);
				}
				else
				{
					if (g_playerType == 0)
						this.ChangeSprite(spriteIndices.spr_bunnyThrow_L);
					else if (g_playerType == 1)
						this.ChangeSprite(spriteIndices.spr_rockSword_L);
				}
				this.frameSpeed = 13;
			}
			// For the second attack type.
			else if (this.extraInt == 2)
			{
				// If we're a rock, use the spin frames.
				if (g_playerType == 1)
				{
					if (this.scale == 1) this.ChangeSprite(spriteIndices.spr_rockSpin_R);
					else this.ChangeSprite(spriteIndices.spr_rockSpin_L);
					this.frameSpeed = playerConstants.spinRate;
				}
			}
			// If the player is hurt, use hurt sprites.
			else if (this.extraInt < 0)
			{
				if (this.scale == 1)
				{
					if (g_playerType == 0)
						this.ChangeSprite(spriteIndices.spr_bunnyHurt_R);
					else if (g_playerType == 1)
						this.ChangeSprite(spriteIndices.spr_rockHurt_R);
					else if (g_playerType == 2)
						this.ChangeSprite(spriteIndices.spr_guyHurt_R);
				}
				else
				{
					if (g_playerType == 0)
						this.ChangeSprite(spriteIndices.spr_bunnyHurt_L);
					else if (g_playerType == 1)
						this.ChangeSprite(spriteIndices.spr_rockHurt_L);
					else if (g_playerType == 2)
						this.ChangeSprite(spriteIndices.spr_guyHurt_L);
				}
				this.frameSpeed = 12;
			}
			
			// Move the camera to follow the player.
			g_spriteCameraGoTo.x = this.position.x - g_screensize.x / 2 + this.velocity.x * 8;
			g_spriteCameraGoTo.y = this.position.y - g_screensize.y / 2;// + this.velocity.y * 8;
		}
		// Enemies
		else if (this.type == objectTypes.crab)
		{
			// Crabs
			if (this.extraInt4 == enemyTypes.crab)
			{
				if (this.extraInt2 == 0)
				{
					if (this.scale == 1)
						this.ChangeSprite(spriteIndices.spr_crabIdle_R);
					else
						this.ChangeSprite(spriteIndices.spr_crabIdle_L);
					if (this.velocity.x != 0)
						this.frameSpeed = 12;
					else
						this.frameSpeed = 0;
				}
				else
				{
					if (this.scale == 1)
						this.ChangeSprite(spriteIndices.spr_crabHurt_R);
					else
						this.ChangeSprite(spriteIndices.spr_crabHurt_L);
				}
			}
			// Minicrabs
			else if (this.extraInt4 == enemyTypes.minicrab)
			{
				if (this.extraInt2 == 0)
				{
					if (this.scale == 1)
						this.ChangeSprite(spriteIndices.spr_minicrab_R);
					else
						this.ChangeSprite(spriteIndices.spr_minicrab_L);
					if (this.velocity.x != 0)
						this.frameSpeed = 12;
					else
						this.frameSpeed = 0;
				}
			}
			// Rabbits
			else if (this.extraInt4 == enemyTypes.rabbit)
			{
				if (this.extraInt2 == 0)
				{
					if (this.scale == 1)
						this.ChangeSprite(spriteIndices.spr_rabbit_R);
					else
						this.ChangeSprite(spriteIndices.spr_rabbit_L);
					this.frameSpeed = 12;
				}
				else
				{
					if (this.scale == 1)
						this.ChangeSprite(spriteIndices.spr_rabbitHurt_R);
					else
						this.ChangeSprite(spriteIndices.spr_rabbitHurt_L);
				}
			}
			// Hermitcrabs
			else if (this.extraInt4 == enemyTypes.hermit)
			{
				if (this.extraInt2 == 0)
				{
					if (this.extraFloat2 == 0)
					{
						if (this.extraFloat == 1) this.ChangeSprite(spriteIndices.spr_hermit_RU);
						else this.ChangeSprite(spriteIndices.spr_hermit_RD);
					}
					else if (this.extraFloat2 == 1)
					{
						if (this.extraFloat == 0) this.ChangeSprite(spriteIndices.spr_hermit_UR);
						else this.ChangeSprite(spriteIndices.spr_hermit_UL);
					}
					else if (this.extraFloat2 == 2)
					{
						if (this.extraFloat == 1) this.ChangeSprite(spriteIndices.spr_hermit_LU);
						else this.ChangeSprite(spriteIndices.spr_hermit_LD);
					}
					else
					{
						if (this.extraFloat == 0) this.ChangeSprite(spriteIndices.spr_hermit_DR);
						else this.ChangeSprite(spriteIndices.spr_hermit_DL);
					}
					this.frameSpeed = 12;
				}
				/*else
				{
					if (this.scale == 1)
						this.ChangeSprite(spriteIndices.spr_rabbitHurt_R);
					else
						this.ChangeSprite(spriteIndices.spr_rabbitHurt_L);
				}//*/
			}
			// Probes
			else if (this.extraInt4 == enemyTypes.probe)
			{
				if (this.extraInt2 == 0)
				{
					if (this.extraFloat3 == 0)
					{
						if (this.extraInt3 == 0) this.frameIndex = 2;
						else if (this.extraInt3 == 1) this.frameIndex = 0;
						else this.frameIndex = 1;
					}
					else
					{
						this.ChangeSprite(spriteIndices.spr_probeOn);
						if (this.velocity.x > 1) this.frameIndex = 2;
						else if (this.velocity.x < -1) this.frameIndex = 0;
						else this.frameIndex = 1;
						AddSpriteToQueue(spriteIndices.spr_probeFx, this.frameIndex, {x:this.prevPos.x - this.velocity.x + shake.x, y:this.prevPos.y - this.velocity.y + shake.y}, this.drawDepth - 1, 0);
						AddSpriteToQueue(spriteIndices.spr_probeFx, this.frameIndex, {x:this.prevPos.x - this.velocity.x * 3 + shake.x, y:this.prevPos.y - this.velocity.y * 3 + shake.y}, this.drawDepth - 1, 0);
					}
				}
			}
			// Shellbees
			else if (this.extraInt4 == enemyTypes.shellbee)
			{
				if (this.extraInt2 == 0)
				{
					if (this.extraFloat2 == 0)
					{
						if (this.extraFloat == 1) this.ChangeSprite(spriteIndices.spr_bug_RU);
						else this.ChangeSprite(spriteIndices.spr_bug_RD);
					}
					else if (this.extraFloat2 == 1)
					{
						if (this.extraFloat == 0) this.ChangeSprite(spriteIndices.spr_bug_UR);
						else this.ChangeSprite(spriteIndices.spr_bug_UL);
					}
					else if (this.extraFloat2 == 2)
					{
						if (this.extraFloat == 1) this.ChangeSprite(spriteIndices.spr_bug_LU);
						else this.ChangeSprite(spriteIndices.spr_bug_LD);
					}
					else
					{
						if (this.extraFloat == 0) this.ChangeSprite(spriteIndices.spr_bug_DR);
						else this.ChangeSprite(spriteIndices.spr_bug_DL);
					}
					this.frameSpeed = 12;
				}
			}
			// Drillbees
			else if (this.extraInt4 == enemyTypes.drillbee)
			{
				if (this.extraInt2 == 0)
				{
					if (this.velocity.x < 0) this.ChangeSprite(spriteIndices.spr_wingbug_L);
					else if (this.velocity.x > 0) this.ChangeSprite(spriteIndices.spr_wingbug_R);
					this.frameSpeed = 16;
				}
			}
			
			// Trouncer
			else if (this.extraInt4 == enemyTypes.trouncer)
			{
				//if (this.extraInt2 == 0)
				{
					if (this.extraFloat3 == 0)
					{
						if (this.scale == 1)
							this.ChangeSprite(spriteIndices.spr_trouncerWalk_R);
						else
							this.ChangeSprite(spriteIndices.spr_trouncerWalk_L);
						this.frameSpeed = 12;
					}
					else if (this.extraFloat3 == -1)
					{
						this.ChangeSprite(spriteIndices.spr_trouncerWake);
						this.frameSpeed = 12;
					}
					else if (this.extraFloat3 == 1)
					{
						if (this.scale == 1)
							this.ChangeSprite(spriteIndices.spr_trouncerFlap_R);
						else
							this.ChangeSprite(spriteIndices.spr_trouncerFlap_L);
						this.frameSpeed = 12;
					}
					else if (this.extraFloat3 == 2)
					{
						if (this.scale == 1)
							this.ChangeSprite(spriteIndices.spr_trouncerMeleeCharge_R);
						else
							this.ChangeSprite(spriteIndices.spr_trouncerMeleeCharge_L);
						this.frameSpeed = 12;
					}
					else if (this.extraFloat3 == 3)
					{
						if (this.scale == 1)
							this.ChangeSprite(spriteIndices.spr_trouncerRangeCharge_R);
						else
							this.ChangeSprite(spriteIndices.spr_trouncerRangeCharge_L);
						this.frameSpeed = 12;
					}
					else if (this.extraFloat3 == 4)
					{
						if (this.scale == 1)
							this.ChangeSprite(spriteIndices.spr_trouncerPunch_R);
						else
							this.ChangeSprite(spriteIndices.spr_trouncerPunch_L);
						this.frameSpeed = 18;
					}
				}
				//else this.frameSpeed = 0;
			}
			
			// Hurt timer
			if (this.extraInt2 != 0)
			{
				this.extraInt2--;
				shake.x = (Math.random() * 4) - 2;
				shake.y = (Math.random() * 4) - 2;
			}
		}
		
		// Animate the sprite.
		if (!paused)
			this.frameIndex += this.frameSpeed * 1/g_fps;
		
		// Loop the sprite.
		if ((this.type != objectTypes.effect || (this.type == objectTypes.effect && (this.spriteIndex == spriteIndices.spr_chargeup || this.spriteIndex == spriteIndices.spr_chargedone))) &&
			this.type != objectTypes.blade)
		{
			if (this.spriteIndex != spriteIndices.spr_bunnyThrow_R && this.spriteIndex != spriteIndices.spr_bunnyThrow_L &&
				this.spriteIndex != spriteIndices.spr_bunnyJump_R && this.spriteIndex != spriteIndices.spr_bunnyJump_L &&
				this.spriteIndex != spriteIndices.spr_rockJump_R && this.spriteIndex != spriteIndices.spr_rockJump_L &&
				this.spriteIndex != spriteIndices.spr_rockSword_R && this.spriteIndex != spriteIndices.spr_rockSword_L &&
				this.spriteIndex != spriteIndices.spr_rockSpin_R && this.spriteIndex != spriteIndices.spr_rockSpin_L &&
				this.spriteIndex != spriteIndices.spr_guyJump_R && this.spriteIndex != spriteIndices.spr_guyJump_L &&
				this.spriteIndex != spriteIndices.spr_guyJump_RU && this.spriteIndex != spriteIndices.spr_guyJump_LU &&
				this.spriteIndex != spriteIndices.spr_guyJump_RD && this.spriteIndex != spriteIndices.spr_guyJump_LD &&
				
				this.spriteIndex != spriteIndices.spr_rabbit_R && this.spriteIndex != spriteIndices.spr_rabbit_L &&
				this.spriteIndex != spriteIndices.spr_turret &&
				this.spriteIndex != spriteIndices.spr_trouncerFlap_R && this.spriteIndex != spriteIndices.spr_trouncerFlap_L &&
				this.spriteIndex != spriteIndices.spr_trouncerPunch_R && this.spriteIndex != spriteIndices.spr_trouncerPunch_L &&
				this.spriteIndex != spriteIndices.spr_trouncerWake)
			{
				if (this.frameIndex >= g_SpriteSheetList[this.spriteIndex].frameCount)
					this.frameIndex = 0;
				else if (this.frameIndex < 0)
					this.frameIndex += g_spriteSheetList[this.spriteIndex].frameCount;
			}
		}
		
		// Do some frame limits, based on the type and current sprite.
		if (this.type == objectTypes.player)
		{
			// If we're jumping, restrict our animations a little depending on y direction.
			if (this.spriteIndex == spriteIndices.spr_bunnyJump_L || this.spriteIndex == spriteIndices.spr_bunnyJump_R)
			{
				// If we're going up, use only the up frames.
				if (this.velocity.y < -3 && this.frameIndex >= 2)
					this.frameIndex = 0;
				// If we're going down, use only the down frames.
				else if (this.velocity.y >= -3 && this.frameIndex >= 7)
					this.frameIndex = 5;
			}
			// If we're attacking, switch back to the normal state when the animation is finished.
			if (this.spriteIndex == spriteIndices.spr_bunnyThrow_L || this.spriteIndex == spriteIndices.spr_bunnyThrow_R)
			{
				// If the player is still charging, hold the animation at frame 3.
				if (this.frameIndex >= 5 && this.extraInt == 1)
				{
					this.frameIndex = 3;
				}
				// When the animation ends, return to the normal state.
				if (this.frameIndex >= 9)
				{
					this.extraInt = 0;
					this.frameIndex = 7;
					this.extraInt2 = 0;
				}
			}
			// If we're swinging a sword, return to normal state at the end of the animation.
			if (this.spriteIndex == spriteIndices.spr_rockSword_L || this.spriteIndex == spriteIndices.spr_rockSword_R)
			{
				if (this.frameIndex >= 4)
				{
					this.extraInt = 0;
					this.frameIndex = 3;
					this.extraInt2 = 0;
				}
			}
			// Rock's jumping
			if (this.spriteIndex == spriteIndices.spr_rockJump_L || this.spriteIndex == spriteIndices.spr_rockJump_R)
			{
				// If we're going up, use only the up frames.
				if (this.velocity.y < -3 && this.frameIndex >= 1)
					this.frameIndex = 0;
				// If we're going down, use only the down frames.
				else if (this.velocity.y >= -3 && this.frameIndex >= 4)
					this.frameIndex = 3;
			}
			// If we're in a spin attack, stop after three full spins.
			if (this.spriteIndex == spriteIndices.spr_rockSpin_L || this.spriteIndex == spriteIndices.spr_rockSpin_R)
			{
				if (this.frameIndex >= 12)
				{
					this.frameIndex = 11;
					this.extraInt = 0;
				}
			}
			// Guy's jumping
			if (this.spriteIndex == spriteIndices.spr_guyJump_L || this.spriteIndex == spriteIndices.spr_guyJumpR ||
				this.spriteIndex == spriteIndices.spr_guyJump_LU || this.spriteIndex == spriteIndices.spr_guyJump_RU ||
				this.spriteIndex == spriteIndices.spr_guyJump_LD || this.spriteIndex == spriteIndices.spr_guyJump_RD)
			{
				// If we're going up, use only the up frames.
				if (this.velocity.y < -3 && this.frameIndex >= 2)
					this.frameIndex = 1;
				// If we're going down, use only the down frames.
				else if (this.velocity.y >= -3 && this.frameIndex >= 5)
					this.frameIndex = 4;
			}
			
			// If we're aiming, draw the targetting things.
			if (this.extraInt == 1 && g_playerType == 0)
			{
				for (var i = 1; i <= 5; i++)
				{
					AddSpriteToQueue(14, 0, {x:this.position.x + Math.cos(degToRad(this.extraFloat)) * 24 * i, y:this.position.y - Math.sin(degToRad(this.extraFloat)) * 24 * i}, 12, 0);
				}
			}
			// If we're spinning, play the spin sound for each spin.
			if (this.spriteIndex == spriteIndices.spr_rockSpin_L || this.spriteIndex == spriteIndices.spr_rockSpin_R)
			{
				if ((Math.floor(this.frameIndex) == 0 || Math.floor(this.frameIndex) == 6) && !extraBool2)
				{
					extraBool2 = true;
					PlaySound(7, 1.0, false);
				}
				if ((Math.floor(this.frameIndex) == 1 || Math.floor(this.frameIndex) == 7) && extraBool2)
					extraBool2 = false;
			}
			
			// If we're on an interactive tile type, draw the up arrow over the player's head.
			if (g_playerType == 0 && mainTileMap.GetTileType({x:this.position.x, y:this.position.y}) == tileEntityTypes.interactive)
			{
				AddSpriteToQueue(spriteIndices.spr_hudStuff, 2, {x:this.position.x, y:this.position.y - 18}, 12, 0);
			}
			
			// If we're invincible, find out if we should even be drawing this frame.
			if (this.extraInt4 > 0)
			{
				this.extraInt4--;
				if (Math.floor(this.extraInt4 / 2) % 2 == 0) return;
			}
		}
		else if (this.type == objectTypes.blade)
		{
			if (this.spriteIndex == 12 && this.frameIndex >= 5)
			{
				this.frameIndex = 4;
				this.frameSpeed = 0;
			}
		}
		// After the animation ends, destroy the effect object.
		else if (this.type == objectTypes.effect)
		{
			if (((this.spriteIndex != spriteIndices.spr_spinFlame_L && this.spriteIndex != spriteIndices.spr_spinFlame_R) && this.frameIndex >= g_SpriteSheetList[this.spriteIndex].frameCount)||
				((this.spriteIndex == spriteIndices.spr_spinFlame_L || this.spriteIndex == spriteIndices.spr_spinFlame_R) && this.frameIndex >= g_SpriteSheetList[this.spriteIndex].frameCount * 3))
			{
				if (this.extraInt == 0)
				{
					this.frameIndex = g_SpriteSheetList[this.spriteIndex].frameCount - 1;
					DestroyGameObject(this.index);
				}
				else
				{
					this.frameIndex = 0;
				}
			}
		}
		// For enemy types, handle their own animation limits.
		else if (this.type == objectTypes.crab)
		{
			if (this.extraInt4 == enemyTypes.rabbit)
			{
				if (this.spriteIndex == spriteIndices.spr_rabbit_L || this.spriteIndex == spriteIndices.spr_rabbit_R)
				{
					// If we're on the ground, revert to the ground frame.
					if (extraBool) this.frameIndex == 0;
					// Otherwise, coordinate the jumping animation.
					else
					{
						// If we're going up, use only the up frames.
						if (this.velocity.y < -3 && this.frameIndex >= 2)
							this.frameIndex = 1;
						// If we're going down, use only the down frames.
						else if (this.velocity.y >= -3 && this.frameIndex >= 4)
							this.frameIndex = 3;
					}
				}
			}
			else if (this.extraInt4 == enemyTypes.turret)
			{
				if (this.frameIndex >= 2)
				{
					this.frameIndex = 2;
					this.frameSpeed = 0;
				}
			}
			else if (this.extraInt4 == enemyTypes.trouncer)
			{
				// Make the footstep sounds.
				if (this.spriteIndex == spriteIndices.spr_trouncerWalk_L || this.spriteIndex == spriteIndices.spr_trouncerWalk_R)
				{
					var temp = Math.floor(this.frameIndex);
					if ((temp == 4 || temp == 11) && !extraBool2)
					{
						extraBool2 = true;
						PlaySound(17, 1.0);
					}
					else if ((temp == 5 || temp == 12) && extraBool2)
					{
						extraBool2 = false;
					}
				}
				// If the attack animation ends, go back to patrol mode.
				else if (this.spriteIndex == spriteIndices.spr_trouncerFlap_L || this.spriteIndex == spriteIndices.spr_trouncerFlap_R ||
							this.spriteIndex == spriteIndices.spr_trouncerPunch_L || this.spriteIndex == spriteIndices.spr_trouncerPunch_R ||
							this.spriteIndex == spriteIndices.spr_trouncerWake)
				{
					if (this.frameIndex >= g_SpriteSheetList[this.spriteIndex].frameCount)
					{
						this.extraFloat3 = 0;
						this.frameIndex = g_SpriteSheetList[this.spriteIndex].frameCount - 1;
					}
				}
			}
		}
		
		//if (this.type == objectTypes.player) infoBox.innerHTML = playerConstants.extraPos.x + ", " + playerConstants.extraPos.y;
		
		// Add the sprite to the drawing queue.
		// If the object is an effect and its extraFloat3 is -1, don't draw it.
		if (this.type != objectTypes.effect || (this.type == objectTypes.effect && this.extraFloat3 != -1 && this.extraFloat3 != -2))
			AddSpriteToQueue(this.spriteIndex, this.frameIndex, {x:this.position.x + shake.x, y:this.position.y + shake.y}, this.drawDepth, 0);
			
		if (g_showHitBoxes)
		{
			AddLineToQueue({x:this.collision.l, y:this.collision.t}, {x:this.collision.l + this.collision.w, y:this.collision.t + this.collision.h}, "#ff0000", true, 10, -1);
		}
		
	}
	
	// Used to change sprites, automatically resetting the frame index if needed.
	this.ChangeSprite = function(newsprite)
	{
		if (this.spriteIndex != newsprite)
		{
			if (!((this.spriteIndex == 5 && newsprite == 6) || (this.spriteIndex == 6 && newsprite == 5) ||
					(this.spriteIndex == spriteIndices.spr_rockJump_R && newsprite == spriteIndices.spr_rockJump_L) || (this.spriteIndex == spriteIndices.spr_rockJump_L && newsprite == spriteIndices.spr_rockJump_R) ||
					
					(this.spriteIndex == spriteIndices.spr_guyJump_R && newsprite == spriteIndices.spr_guyJump_L) || (this.spriteIndex == spriteIndices.spr_guyJump_L && newsprite == spriteIndices.spr_guyJump_R) ||
					(this.spriteIndex == spriteIndices.spr_guyJump_RU && newsprite == spriteIndices.spr_guyJump_LU) || (this.spriteIndex == spriteIndices.spr_guyJump_LU && newsprite == spriteIndices.spr_guyJump_RU) ||
					(this.spriteIndex == spriteIndices.spr_guyJump_R && newsprite == spriteIndices.spr_guyJump_RU) || (this.spriteIndex == spriteIndices.spr_guyJump_RU && newsprite == spriteIndices.spr_guyJump_R) ||
					(this.spriteIndex == spriteIndices.spr_guyJump_L && newsprite == spriteIndices.spr_guyJump_LU) || (this.spriteIndex == spriteIndices.spr_guyJump_LU && newsprite == spriteIndices.spr_guyJump_L) ||
					
					(this.spriteIndex == spriteIndices.spr_guyJump_RD && newsprite == spriteIndices.spr_guyJump_LD) || (this.spriteIndex == spriteIndices.spr_guyJump_LD && newsprite == spriteIndices.spr_guyJump_RD) ||
					(this.spriteIndex == spriteIndices.spr_guyJump_LU && newsprite == spriteIndices.spr_guyJump_LD) || (this.spriteIndex == spriteIndices.spr_guyJump_LD && newsprite == spriteIndices.spr_guyJump_LU) ||
					(this.spriteIndex == spriteIndices.spr_guyJump_RU && newsprite == spriteIndices.spr_guyJump_RD) || (this.spriteIndex == spriteIndices.spr_guyJump_RD && newsprite == spriteIndices.spr_guyJump_RU) ||
					(this.spriteIndex == spriteIndices.spr_guyJump_R && newsprite == spriteIndices.spr_guyJump_RD) || (this.spriteIndex == spriteIndices.spr_guyJump_RD && newsprite == spriteIndices.spr_guyJump_R) ||
					(this.spriteIndex == spriteIndices.spr_guyJump_L && newsprite == spriteIndices.spr_guyJump_LD) || (this.spriteIndex == spriteIndices.spr_guyJump_LD && newsprite == spriteIndices.spr_guyJump_L) ||
					(this.spriteIndex == spriteIndices.spr_guyFlip_L && newsprite == spriteIndices.spr_guyFlip_R) || (this.spriteIndex == spriteIndices.spr_guyFlip_R && newsprite == spriteIndices.spr_guyFlip_L)))
				this.frameIndex = 0.0;
			this.spriteIndex = newsprite;
		}
	}
	
	// Called to destroy an object.
	this.Destroy = function()
	{
		this.active = false;
		if (extraArray != null)
			extraArray.length = 0;
	}
	
	// Called to move the object until it's just in contact with the a tile. Returns the amount moved.
	this.MoveUntilContact = function(amount, xory)
	{
		var sign = numberSign(amount);
		var i = Math.abs(amount);
		// In general, move the object to its destination, then step backwards until we're not colliding with terrain.
		// Limited to starting and ending positions.
		for (; i > 0; i--)
		{
			if (xory)
			{
				// If there's no collision with the terrain here, skip out now.
				if (!mainTileMap.rectCheckCollision(this.collision.l + i * sign, this.collision.t, this.collision.w, this.collision.h))
				{
					this.position.x += i * sign;
					break;
				}
			}
			else
			{
				if (!mainTileMap.rectCheckCollision(this.collision.l, this.collision.t + i * sign, this.collision.w, this.collision.h))
				{
					this.position.y += i * sign;
					break;
				}
			}
		}
		return i;
	}
	
	// Called to move the object including slopes. Returns the amount of distance travelled.
	// Based on a platformer slopes tutorial found on GameMakerCommunity written by "brod."
	// http://gmc.yoyogames.com/index.php?showtopic=436111
	this.MoveWithSlopes = function()
	{
		// Horizontal movement first.
		// Move the object ONE PIXEL AT AT TIME, checking along the way for collisions. This seems a really brute-force method,
		// but it was the only slopes method I'd seen that relies on simple true/false returns for collision.
		for (var i = 0; i < Math.ceil(Math.abs(this.velocity.x)); i++)
		{
			var rectPos = {x: this.position.x + this.collisionRect.l, y: this.position.y + this.collisionRect.t};
			var sign = numberSign(this.velocity.x);
			var moved = false;
			// If the path is obstructed, check to see if we can move up the slope any.
			if (mainTileMap.rectCheckCollision(rectPos.x + sign, rectPos.y, this.collisionRect.w, this.collisionRect.h))
			{
				for (var a = 1; a <= g_maxSlope; a++)
				{
					// If there's empty space directly above the obstructed space, move up to it.
					if (!mainTileMap.rectCheckCollision(rectPos.x + sign, rectPos.y - a, this.collisionRect.w, this.collisionRect.h))
					{
						this.position.x += sign;
						this.position.y -= a;
						moved = true;
						if (a > 1) i += a * 2;
						break;
					}
				}
				// If we didn't move during that loop, there must not be a slope.
				if (!moved)
				{
					this.velocity.x = 0;
					break;
				}
			}
			// Otherwise, if there is no obstruction, then we need to check downwards for a slope, too.
			else
			{
				var extra = 0;
				for (var a = g_maxSlope; a >= (1 - extra); a--)
				{
					// If the space is empty, we might have a slope.
					if (!mainTileMap.rectCheckCollision(rectPos.x + sign, rectPos.y + a, this.collisionRect.w, this.collisionRect.h))
					{
						// Make sure there's solid beneath that empty space before moving there.
						if (mainTileMap.rectCheckCollision(rectPos.x + sign, rectPos.y + a + 1, this.collisionRect.w, this.collision.h))
						{
							this.position.x += sign;
							this.position.y += a;
							moved = true;
							break;
						}
					}
				}
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
			// If the next space is solid, stop moving.
			if (mainTileMap.rectCheckCollision(rectPos.x, rectPos.y + sign, this.collisionRect.w, this.collisionRect.h))
			{
				if (this.velocity.y > 0 && this.type == objectTypes.player) PlaySound(4, 1.0, false);
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
	
	// Called to move an object so it crawls along walls.
	this.MoveWallCrawl = function()
	{
		// If extraBool is switched off, crawl along the wall.
		if (!extraBool2)
		{
			var counter = 0;
			var flipCounter = 0;
			var maxTries = 8;
			var movement = this.extraFloat3;
			if (this.extraInt2 != 0) movement--;
			// Handle movement one step at a time.
			for (var i = 0; i < movement && counter < maxTries; i++)
			{
				var moved = false;
				var rectPos = {x: this.position.x + this.collisionRect.l, y: this.position.y + this.collisionRect.t};
				
				var vel = {x:0, y:0};
				if (this.extraFloat2 == 0) vel.x = 1;
				else if (this.extraFloat2 == 1) vel.y = -1;
				else if (this.extraFloat2 == 2) vel.x = -1;
				else vel.y = 1;
				
				var down = {x:0, y:0};
				if (this.extraFloat == 0) down.x = 1;
				else if (this.extraFloat == 1) down.y = -1;
				else if (this.extraFloat == 2) down.x = -1;
				else down.y = 1;
				
				// Check to see if the way forward is blocked.
				if (mainTileMap.rectCheckCollision(rectPos.x + vel.x, rectPos.y + vel.y, this.collisionRect.w, this.collisionRect.h))
				{
					// If the way forward is blocked, see if we can move up a slope.
					for (var j = 0; j <= g_maxSlope - 1; j++)
					{
						if (!mainTileMap.rectCheckCollision(rectPos.x + vel.x - down.x * j, rectPos.y + vel.y - down.y * j, this.collisionRect.w, this.collisionRect.h))
						{
							this.position.x += vel.x - down.x * j;
							this.position.y += vel.y - down.y * j;
							moved = true;
							break;
						}
					}
					// If we didn't move up a slope, there must be a wall ahead, meaning we should change our direction and try again.
					if (!moved)
					{
						// Facing right...
						if (this.extraFloat2 == 0)
						{
							// Facing right with down vector pointing up. Turn clockwise.
							if (this.extraFloat == 1)
							{
								this.extraFloat2 = 3;
								this.extraFloat = 0;
							}
							// Facing right with down vector pointing down. Turn counterclockwise.
							else
							{
								this.extraFloat2 = 1;
								this.extraFloat = 0;
							}
						}
						// Facing up...
						else if (this.extraFloat2 == 1)
						{
							// Facing up with down vector pointing left. Turn cw.
							if (this.extraFloat == 2)
							{
								this.extraFloat2 = 0;
								this.extraFloat = 1;
							}
							// Facing up with down vector pointing right. Turn ccw.
							else
							{
								this.extraFloat2 = 2;
								this.extraFloat = 1;
							}
						}
						// Facing left...
						else if (this.extraFloat2 == 2)
						{
							// Facing left with down vector pointing down. Turn cw.
							if (this.extraFloat == 3)
							{
								this.extraFloat2 = 1;
								this.extraFloat = 2;
							}
							// Facing left with down vector pointing up. Turn ccw.
							else
							{
								this.extraFloat2 = 3;
								this.extraFloat = 2;
							}
						}
						// Facing down...
						else
						{
							// Facing down with down vector pointing right. Turn cw.
							if (this.extraFloat == 0)
							{
								this.extraFloat2 = 2;
								this.extraFloat = 3;
							}
							// Facing down with down vector pointing left. Turn ccw.
							else
							{
								this.extraFloat2 = 0;
								this.extraFloat = 3;
							}
						}
						// Try again, but increment the counter to keep the thing from going out of control.
						i--;
						counter++;
					}
					continue;
				}
				// If there was nothing obstructing the path, check to make sure there'll be ground under us after we move.
				else if (!mainTileMap.rectCheckCollision(rectPos.x + vel.x + down.x, rectPos.y + vel.y + down.y, this.collisionRect.w, this.collisionRect.h))
				{
					// Check for downwards slope.
					for (var j = g_maxSlope; j >= 1; j--)
					{
						// If the space is empty, we might have a slope.
						if (!mainTileMap.rectCheckCollision(rectPos.x + vel.x + down.x * j, rectPos.y + vel.y + down.y * j, this.collisionRect.w, this.collisionRect.h))
						{
							// Make sure there's solid underneath that empty space before moving there.
							if (mainTileMap.rectCheckCollision(rectPos.x + vel.x + down.x * (j + 1), rectPos.y + vel.y + down.y * (j + 1), this.collisionRect.w, this.collisionRect.h))
							{
								this.position.x += vel.x + down.x * j;
								this.position.y += vel.y + down.y * j;
								moved = true;
								break;
							}
						}
					}
					// If we didn't move during that loop, move normally, but then turn around the corner.
					if (!moved)
					{
						this.position.x += vel.x;
						this.position.y += vel.y;
						// Facing right...
						if (this.extraFloat2 == 0)
						{
							// Facing right with down vector pointing up. Turn counterclockwise.
							if (this.extraFloat == 1)
							{
								this.extraFloat2 = 1;
								this.extraFloat = 2;
							}
							// Facing right with down vector pointing down. Turn clockwise.
							else
							{
								this.extraFloat2 = 3;
								this.extraFloat = 2;
							}
						}
						// Facing up...
						else if (this.extraFloat2 == 1)
						{
							// Facing up with down vector pointing left. Turn ccw.
							if (this.extraFloat == 2)
							{
								this.extraFloat2 = 2;
								this.extraFloat = 3;
							}
							// Facing up with down vector pointing right. Turn cw.
							else
							{
								this.extraFloat2 = 0;
								this.extraFloat = 3;
							}
						}
						// Facing left...
						else if (this.extraFloat2 == 2)
						{
							// Facing left with down vector pointing down. Turn ccw.
							if (this.extraFloat == 3)
							{
								this.extraFloat2 = 3;
								this.extraFloat = 0;
							}
							// Facing left with down vector pointing up. Turn cw.
							else
							{
								this.extraFloat2 = 1;
								this.extraFloat = 0;
							}
						}
						// Facing down...
						else
						{
							// Facing down with down vector pointing right. Turn ccw.
							if (this.extraFloat == 0)
							{
								this.extraFloat2 = 0;
								this.extraFloat = 1;
							}
							// Facing down with down vector pointing left. Turn cw.
							else
							{
								this.extraFloat2 = 2;
								this.extraFloat = 1;
							}
						}
						
						rectPos.x = this.position.x + this.collisionRect.l;
						rectPos.y = this.position.y + this.collisionRect.t;
						if (this.extraFloat2 == 0) vel.x = 1;
						else if (this.extraFloat2 == 1) vel.y = -1;
						else if (this.extraFloat2 == 2) vel.x = -1;
						else vel.y = 1;
						if (this.extraFloat == 0) down.x = 1;
						else if (this.extraFloat == 1) down.y = -1;
						else if (this.extraFloat == 2) down.x = -1;
						else down.y = 1;
						if (!mainTileMap.rectCheckCollision(rectPos.x + vel.x + down.x * 2, rectPos.y + vel.y + down.y * 2, this.collisionRect.w, this.collisionRect.h))
							flipCounter++;
					}
					continue;
				}//*/
				// If our current velocity would take us offscreen, turn around.
				if (this.position.x + vel.x < 0 || this.position.x + vel.x > mainTileMap.fullSize.x || this.position.y + vel.y < 0 || this.position.y + vel.y > mainTileMap.fullSize.y)
				{
					this.extraFloat2 += 2;
					if (this.extraFloat2 >= 4) this.extraFloat2 = this.extraFloat2 % 2;
				}
				// Otherwise just move normally.
				else
				{
					this.position.x += vel.x;
					this.position.y += vel.y;
				}
			}
			// If the flipCounter is >= the total amount we were supposed to move, switch to falling mode.
			if (flipCounter >= 2)
			{
				extraBool2 = true;
			}
		}
		// If extraBool is switched on, fall down until we reach a block.
		else
		{
			var tempBool = mainTileMap.rectCheckCollision(this.collision.l, this.position.y + 5, this.collision.w, 5);
			if (tempBool)
			{
				extraBool2 = false;
				if (g_playerIndex >= -1)
				{
					this.extraFloat = 3;
					if (this.position.x < GameObjectArray[g_playerIndex].position.x) this.extraFloat2 = 0;
					else this.extraFloat2 = 2;
				}
			}
			else
			{
				this.velocity.y += playerConstants.gravity;
				this.MoveWithSlopes();
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

// Function to check for collision between a line and a rectangle.
// rectA: {l, t, w, h}
// lineB: {x0, y0, x1, y1}
function RectangleLineCollide(rectA, lineB)
{
	// Check first to see if the line and rectangle are in the same area.
	var lineTopLeft = {x:(lineB.x0 < lineB.x1 ? lineB.x0 : lineB.x1), y:(lineB.y0 < lineB.y1 ? lineB.y0 : lineB.y1)};
	var lineBottomRight = {x:(lineB.x0 >= lineB.x1 ? lineB.x0 : lineB.x1), y:(lineB.y0 >= lineB.y0 ? lineB.y1 : lineB.y1)};
	if (rectA.l + rectA.w < lineTopLeft.x || rectA.l > lineBottomRight.x || rectA.t + rectA.h < lineTopLeft.y || rectA.t > lineBottomRight.y) return false;

	// Find the equation of the line.
	var dx = lineB.x1 - lineB.x0;
	var dy = lineB.y1 - lineB.y0;
	
	// If both dx and dy are zero, our line is just a point; return false.
	if (dx == 0 && dy == 0)
	{
		return false;
	}
	// If it's a vertical line, check only the top edge.
	else if (dx == 0)
	{
		if (lineB.x0 > rectA.l && lineB.x0 < rectA.l + rectA.w) return true;
		return false;
	}
	// For horizontal lines, check the left edge.
	else if (dy == 0)
	{
		if (lineB.y0 > rectA.t && lineB.y0 < rectA.t + rectA.h) return true;
		return false;
	}
	// For other more general lines, check the various edges with the equation of the line.
	else
	{
		var m = dy / dx;
		var k = lineB.y0 - m * lineB.x0;
		var linePoint;
		
		// Check the left edge with it first to see if the line goes through the edge.
		linePoint = m * rectA.l + k;
		if (linePoint > rectA.t && linePoint < rectA.t + rectA.h) return true;
		// Check the right edge next.
		linePoint = m * (rectA.l + rectA.w) + k;
		if (linePoint > rectA.t && linePoint < rectA.t + rectA.h) return true;
		// Check the top edge.
		linePoint = (rectA.t - k) / m;
		if (linePoint > rectA.l && linePoint < rectA.l + rectA.w) return true;
		// Check the bottom edge.
		linePoint = (rectA.t + rectA.h - k) / m;
		if (linePoint > rectA.l && linePoint < rectA.l + rectA.w) return true;
		
		return false;
	}
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