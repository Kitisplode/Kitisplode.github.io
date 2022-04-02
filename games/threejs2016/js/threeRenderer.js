// Project: threejs2016
// File: threeRenderer.js
// Desc: Contains the classes used to bring three.js into game engine 2015. Based on the
//			Kitsengine3d ThreeRender class.
// Author: Kitsu
// Created: Jun 30, 2016
//
//**************************************************************************************************

function ThreeRenderer()
{
	var _this = this;
	this.renderer;
	var canvas;
	
	this.scene;
	this.playerScene;
	this.camera;
	
	var screensize = {x:0, y:0};
	
	var clock = new THREE.Clock();
	
	this.initialize = function(pScreensize, pCanvas)
	{
		canvas = pCanvas;
		// Create the renderer.
		_this.renderer = new THREE.WebGLRenderer({canvas:pCanvas});
		_this.renderer.setSize(pScreensize.x, pScreensize.y, false);
		screensize.x = pScreensize.x;
		screensize.y = pScreensize.y;
		//pCanvas.width = pScreensize.x;
		//pCanvas.height = pScreensize.y;
		
		_this.renderer.shadowMapEnabled = true;
		_this.renderer.shadowMapSoft = true;
		_this.renderer.shadowMapType = THREE.PCFShadowMap;
		_this.renderer.shadowMapCullFrontFaces = false;
		_this.renderer.shadowMapBias = -0.1;
		
		_this.renderer.autoClear = false;
	}
	
	this.startScene = function()
	{
		// Set up the scene.
		_this.scene = new THREE.Scene();
		//this.playerScene = new THREE.Scene();
		// Set up the camera.
		_this.camera = new THREE.PerspectiveCamera(75, screensize.x/screensize.y, 0.1, 1000);
	}
	
	this.render = function()
	{
		var delta = clock.getDelta();
		THREE.AnimationHandler.update(delta);
		_this.renderer.clear();
		_this.renderer.render(_this.scene, _this.camera);
		//renderer.clearDepth();
		//renderer.render(this.playerScene, this.camera);
	}
}

function kitsuModel(fileName, loader, three, skinning, modelInit)
{
	var _this = this;
	
	this.currentAnimation = "";
	var animations = {};
	
	this.model;
	
	var modelSkinning = skinning;
	
	loader.load(fileName, loadHandler);
	
	function loadHandler(geometry, materials)
	{
		// Set up the materials for skinning.
		if (modelSkinning)
		{
			materials.forEach(function(mat)
			{
			  mat.skinning = true;
			});
		}
		
		// Create the new model.
		_this.model = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
		// Smooth out the model.
		_this.model.geometry.computeFaceNormals();
		_this.model.geometry.computeVertexNormals();
		_this.model.material.shading = THREE.SmoothShading;
		// Set up shadowing.
		_this.model.castShadow = true;
		_this.model.receiveShadow = false;
		// Set up animations.
		if (geometry.animations)
		{
			geometry.animations.forEach(function(animation)
			{
				animations[animation.name] = new THREE.Animation(_this.model, animation, THREE.AnimationHandler.CATMULLROM);
				if (_this.currentAnimation == "") _this.currentAnimation = animation.name;
			});
			
			animations[_this.currentAnimation].play();
		}
		
		three.scene.add(_this.model);
		
		// If we have a valid model initialization function, run it!
		if (modelInit)
		{
			modelInit(_this);
		}
	}
	
	this.changeAnimation = function(animationName)
	{
		if (_this.currentAnimation == animationName) return;
		
		animations[_this.currentAnimation].stop();
		animations[_this.currentAnimation].loop = true;
		animations[_this.currentAnimation].timeScale = 1;
		
		_this.currentAnimation = animationName;
		animations[_this.currentAnimation].play();
	}
	
	this.pauseAnimation = function()
	{
		animations[_this.currentAnimation].pause();
	}
	
	this.playAnimation = function()
	{
		animations[_this.currentAnimation].play();
	}
	
	this.setAnimationLooping = function(looping)
	{
		animations[_this.currentAnimation].loop = looping;
	}
	
	this.setAnimationSpeed = function(speed)
	{
		animations[_this.currentAnimation].timeScale = speed;
	}
}