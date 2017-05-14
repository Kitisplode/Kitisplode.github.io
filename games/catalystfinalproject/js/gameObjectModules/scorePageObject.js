// Project: Dungeons & Generators (Catalyst Training Final Project)
// File: scorePageObject.js
// Desc: Contains the module for the score page controller.
// Author: mjensen
// Created: August 07, 2015
//
//**************************************************************************************************
var ScorePageConstants = 
{
	timeOutPhase: 60,
	timeInPhase: 15,
	
	incrementAmount: 15
};

function ModuleScorePage(obj)
{
	var _this = this;
	var thisObject = obj;
	
	this.engine = null;
	
	this.type = "scorePage";
	
	var phase = 0;
	var nextPhase = 1;
	var finishedPhase = 0;
	var timer = ScorePageConstants.timeInPhase;
	
	this.itemCount = 0;
	this.chaseCount = 0;
	this.turnCount = 0;
	this.finalScore = 0;
	
	var localItemCount = 0;
	var localItemScore = 0;
	
	var localChaseCount = 0;
	var localChaseScore = 0;
	
	var localTurnCount = 0;
	var localTurnScore = 0;
	
	var localFinalScore = 0;
	
	var bonus = 0;
	
	var finalGrade = -1;
	
	// Returns nothing.
	this.initialize = function()
	{
		thisObject.spriteIndex = -1;
	}
	
	// Returns a boolean representing whether the collision changed or not.
	this.update = function()
	{
		switch (phase)
		{
			// Final phase
			case -1:
			{
				// If the player clicks, go back to the initial state.
				if (_this.engine.inputMouse.isPressed())
				{
					_this.engine.nextGameState = GameEngineConstants.initialState;
					_this.engine.soundPlayer.playSound("snd_start");
				}
				break;
			}
			// Timer phase
			case 0:
			{
				// Just wait a short while, then go to the next phase.
				timer--;
				if (timer < 0)
				{
					phase = nextPhase;
				}
				break;
			}
			// Adding cheeses phase.
			case 1:
			{
				// If our local cheese count is lower than the final cheese count, add more cheese.
				timer = ScorePageConstants.timeInPhase;
				phase = 0;
				if (localItemCount < _this.itemCount)
				{
					localItemCount++;
					_this.makeRing({x:128 - (GamePlayConstants.itemCount / 2 * 27) + (localItemCount * 27), y:50});
					nextPhase = 1;
					localItemScore = _this.engine.calculateItemScore(localItemCount);
					_this.engine.soundPlayer.playSound("snd_collect_0" + localItemCount);
				}
				// Otherwise, go to the next phase.
				else
				{
					_this.makeRing({x:200, y:66});
					timer = ScorePageConstants.timeOutPhase;
					nextPhase = 2;
					_this.engine.soundPlayer.playSound("snd_score");
				}
				break;
			}
			// Adding up captured enemies.
			case 2:
			{
				// If our local chase count is less than the final chase count, add more chases.
				timer = ScorePageConstants.timeInPhase;
				phase = 0;
				if (localChaseCount < _this.chaseCount)
				{
					_this.makeRing({x:92, y:95});
					localChaseCount++;
					localChaseScore += GamePlayConstants.chaseValue;
					_this.engine.soundPlayer.playSound("snd_cage");
				}
				else
				{
					_this.makeRing({x:200, y:108});
					timer = ScorePageConstants.timeOutPhase;
					nextPhase = 3;
					_this.engine.soundPlayer.playSound("snd_score");
				}
				break;
			}
			// Adding up turns.
			case 3:
			{
				if (localTurnCount < _this.turnCount)
				{
					localTurnCount++;
					localTurnScore -= GamePlayConstants.turnValue;
					_this.engine.soundPlayer.playSound("snd_clink");
				}
				else
				{
					_this.makeRing({x:200, y:150});
					phase = 0;
					timer = ScorePageConstants.timeOutPhase;
					nextPhase = 4;
					_this.engine.soundPlayer.playSound("snd_score");
				}
				break;
			}
			// Completion bonus.
			case 4:
			{
				if (_this.engine.won)
				{
					bonus = GamePlayConstants.startingValue;
					_this.engine.soundPlayer.playSound("snd_bonus");
				}
				else
				{
					_this.engine.soundPlayer.playSound("snd_lose");
				}
				_this.makeRing({x:200, y:174});
				phase = 0;
				timer = ScorePageConstants.timeOutPhase;
				nextPhase = 5;
				break;
			}
			// Update the final score.
			case 5:
			{
				_this.makeRing({x:189, y:206});
				localFinalScore = _this.engine.calculateFinalScore(_this.turnCount, _this.itemCount, _this.chaseCount);
				// Determine the final grade based on the score.
				finalGrade = findFinalGrade(localFinalScore);
				phase = 0;
				timer = 0;
				nextPhase = -1;
				_this.engine.soundPlayer.playSound("snd_finalScore");
				break;
			}
			// Update all scores.
			case 6:
			{
				localItemCount = _this.itemCount;
				localItemScore = _this.engine.calculateItemScore(localItemCount);
				localChaseCount = _this.chaseCount;
				localChaseScore = _this.chaseCount * GamePlayConstants.chaseValue;
				localTurnCount = _this.turnCount;
				localTurnScore = -_this.turnCount * GamePlayConstants.turnValue;
				if (_this.engine.won) bonus = GamePlayConstants.startingValue;
				
				_this.makeRing({x:189, y:206});
				localFinalScore = _this.engine.calculateFinalScore(_this.turnCount, _this.itemCount, _this.chaseCount);
				finalGrade = findFinalGrade(localFinalScore);
				phase = -1;
				_this.engine.soundPlayer.playSound("snd_finalScore");
				break;
			}
		}
		
		// If the player clicks the screen at all, the game will go update to the final phase.
		if (phase > -1 && _this.engine.inputMouse.isPressed())
		{
			_this.engine.soundPlayer.playSound("snd_start");
			phase = 6;
		}
	}
	// Returns a 2d vector representing sprite shake amount.
	this.draw = function(spriteList, drawQueue)
	{
		if (_this.engine)
		{
			var font = spriteList.getSheetID("spr_font7x7.png");
			_this.engine.drawText(font, "Cheese:", {x:77, y:35}, -1, -1, 101, 1, 0);
			var pos = 128 - (GamePlayConstants.itemCount / 2 * 27);
			for (var i = 1; i <= GamePlayConstants.itemCount; i++)
			{
				var frame = 0;
				if (i <= localItemCount) frame = 1;
				drawQueue.addSpriteToQueue(spriteList.getSheetID("spr_score_cheese.png"), frame, {x:pos + (i * 27), y:50}, 101, 1, true);
			}
			_this.engine.drawText(font, localItemScore.toString(), {x:211, y:66}, -1, -1, 101, 1, 1);
			_this.engine.drawText(font, "Captures:", {x:77, y:77}, -1, -1, 101, 1, 0);
			drawQueue.addSpriteToQueue(spriteList.getSheetID("spr_score_cage.png"), 0, {x:92, y:95}, 101, 1, true);
			_this.engine.drawText(font, "x " + localChaseCount, {x:110, y:95}, -1, -1, 101, 1, 0);
			_this.engine.drawText(font, localChaseScore.toString(), {x:211, y:108}, -1, -1, 101, 1, 1);
			_this.engine.drawText(font, "Turns:", {x:77, y:119}, -1, -1, 101, 1, 0);
			drawQueue.addSpriteToQueue(spriteList.getSheetID("spr_score_watch.png"), 0, {x:92, y:137}, 101, 1, true);
			_this.engine.drawText(font, "x " + localTurnCount, {x:110, y:137}, -1, -1, 101, 1, 0);
			_this.engine.drawText(font, localTurnScore.toString(), {x:211, y:150}, -1, -1, 101, 1, 1);
			_this.engine.drawText(font, "Win bonus:", {x:77, y:161}, -1, -1, 101, 1, 0);
			_this.engine.drawText(font, bonus.toString(), {x:211, y:174}, -1, -1, 101, 1, 1);
			_this.engine.drawText(font, "Final score:", {x:77, y:185}, -1, -1, 101, 1, 0);
			_this.engine.drawText(font, localFinalScore.toString(), {x:148, y:228}, 4, 26, 101, 1, 2);
			if (finalGrade > -1)
			{
				drawQueue.addSpriteToQueue(spriteList.getSheetID("spr_score_grade.png"), finalGrade, {x:189, y:206}, 102, 1, true);
				_this.engine.drawText(font, "Touch to", {x:272, y:200}, -1, -1, 101, 1, 2);
				_this.engine.drawText(font, "play again!", {x:272, y:209}, -1, -1, 101, 1, 2);
			}
			
		}
		
		return {x:0, y:0};
	}
	// Returns nothing.
	this.destroy = function()
	{
	}
	// Returns nothing.
	this.collide = function(other)
	{
	}
	
	this.makeRing = function(pPosition)
	{
		var effect = thisObject.handler.create("effect", pPosition);
		effect.spriteIndex = _this.engine.imageLoader.getSheetID("spr_eff_ring.png");
		effect.drawDepth = 9999;
		effect.relative = true;
	}
	
	function findFinalGrade(finalScore)
	{
		if (finalScore < 500) return 0;
		else if (finalScore < 1000) return 1;
		else if (finalScore < 1500) return 2;
		else if (finalScore < 2000) return 3;
		else if (finalScore < 2500) return 4;
		return 5;
	}
}