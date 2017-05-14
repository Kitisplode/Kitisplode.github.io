// Project: Dungeons & Generators (Catalyst Training Final Project)
// File: soundPlayer.js
// Desc: Contains the portion that handles the loading and playing of sound assets. Uses Howl.js
// Author: mjensen
// Created: August 05, 2015
//
//**************************************************************************************************

function SoundPlayer(pSoundDirectory, pMusicDirectory)
{
	var _this = this;
	var soundDirectory = pSoundDirectory;
	var musicDirectory = pMusicDirectory;
	
	var sounds = {};
	var musics = {};
	
	var soundCount = 0;
	var musicCount = 0;
	
	var toLoad = 0;
	var loaded = 0;
	
	this.globalVolume = 1.0;
	this.soundVolume = 1.0;
	this.musicVolume = 1.0;
	
	var currentMusic = null;
	
	var muted = false;
	
	// Called to load up a sound.
	this.loadSound = function(pFilename)
	{
		// If a sound with the filename doesn't already exist, create it.
		if (!sounds[pFilename])
		{
			var dirString = soundDirectory + "/" + pFilename;
			sounds[pFilename] = new Howl({
				urls: [dirString + ".ogg", dirString + ".mp3", dirString + ".wav"],
				onload: itemLoaded
			});
			toLoad++;
			soundCount++;
		}
	}
	
	// Called to load up a music.
	this.loadMusic = function(pFilename)
	{
		if (!musics[pFilename])
		{
			var dirString = musicDirectory + "/" + pFilename;
			musics[pFilename] = new Howl({
				urls: [dirString + ".ogg", dirString + ".mp3"],
				loop: true,
				onload: itemLoaded
			});
			toLoad++;
			musicCount++;
		}
	}
	
	// Called to play a sound.
	this.playSound = function(pFilename)
	{
		if (sounds[pFilename])
		{
			sounds[pFilename].play();
			sounds[pFilename].volume(_this.globalVolume * _this.soundVolume);
			return true;
		}
		return false;
	}
	
	// Called to switch the current music, stopping the previous song and starting the new one.
	this.switchMusic = function(pMusicname)
	{
		// If there's current music playing, stop it.
		if (currentMusic != null)
		{
			currentMusic.stop();
			currentMusic = null;
		}
		// Start the new song.
		if (musics[pMusicname])
		{
			currentMusic = musics[pMusicname];
			currentMusic.play();
			currentMusic.volume(_this.globalVolume * _this.musicVolume);
			return true;
		}
		return false;
	}
	
	// Called to mute / unmute the sound.
	this.toggleMute = function()
	{
		if (muted) Howler.unmute();
		else Howler.mute();
		muted = !muted;
	}
	
	// Called to see if the sound is muted or not.
	this.isMuted = function()
	{
		return muted;
	}
	
	// Called to see how many sounds have requested loading.
	this.countSounds = function()
	{
		return soundCount;
	}
	
	// Called to see how many musics have requested loading.
	this.countMusics = function()
	{
		return musicCount;
	}
	
	// Called to check if all the sounds have finished loading.
	this.isLoaded = function()
	{
		return loaded == toLoad;
	}
	
	// Method for checking load progress.
	this.loadProgress = function()
	{
		if (toLoad <= 0) return -1;
		return loaded / toLoad;
	}
	
	function itemLoaded()
	{
		loaded++;
	}
}