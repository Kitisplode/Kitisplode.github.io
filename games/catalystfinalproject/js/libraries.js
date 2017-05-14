// Project: Dungeons & Generators (Catalyst Training Final Project)
// File: libraries.js
// Desc: Contains the functions used as libraries.
// Author: mjensen
// Created: July 28, 2015
//
//**************************************************************************************************

// Closure used for generating random numbers.
// Code based off http://stackoverflow.com/posts/19303725/revisions
var random = {};
random.value = Math.random();
random.next = function()
{
	var x = Math.sin(random.value++) * 10000;
	return x - Math.floor(x);
}
random.seed = function(pSeed)
{
	random.value = pSeed;
}

// Function to reverse an array.
function arrayReverse(pArray)
{
	if (!pArray) return pArray;
	for (var i = 0; i < Math.floor(pArray.length / 2); i++)
	{
		var item1 = pArray[i];
		pArray[i] = pArray[pArray.length - 1 - i];
		pArray[pArray.length - 1 - i] = item1;
	}
	return pArray;
}

// Function to truncate an array.
function arrayTruncate(pArray, pNewLength)
{
	if (!pArray || pNewLength >= pArray.length || pNewLength < 0) return pArray;
	pArray.splice(pNewLength, pArray.length - pNewLength);
}

// Function to compare two rectangles and retrieve a collision depth.
function RectangleIntersectionDepth(rectA, rectB)
{
	// If either has a width or height of zero, return immediately.
	if (rectA.w == 0 || rectA.h == 0 || rectB.w == 0 || rectB.h == 0)
		return {x:0, y:0};
	
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

// Just does a simple check to see if the rectangles collide at all.
function collideRects (rectA, rectB)
{
	if (rectA.w == 0 || rectA.h == 0 || rectB.w == 0 || rectB.h == 0)
		return false;
	return !(rectA.l + rectA.w < rectB.l || rectB.l + rectB.w < rectA.l ||
		rectA.t + rectA.h < rectB.t || rectB.t + rectB.h < rectA.t)
}

// Function to normalize a vector.
function vector2Normalize(vec)
{
	var length = vector2Length(vec);
	var result;
	if (length > 0)
		result = {x:vec.x / length, y: vec.y / length};
	else result = {x:vec.x, y:vec.y};
	return result;
}
// Function to retrieve the length of the vector.
function vector2Length(vec) { return Math.sqrt((vec.x * vec.x) + (vec.y * vec.y)); }
function vector2LengthSquared(vec) { return vec.x * vec.x + vec.y * vec.y; }
// Helper function to return the dotproduct between two 2d vectors.
function vector2Dot(v1, v2) { return v1.x * v2.x + v1.y * v2.y; }
function vector2Sum(v1, v2) { return {x: v1.x + v2.x, y:v1.y + v2.y}; }
function vector2Difference(v1, v2) { return {x: v1.x - v2.x, y: v1.y - v2.y}; }
function vector2Scale(v, n) { return {x:v.x * n, y:v.y * n}; }
function vector2Equals(v1, v2) { return (v1.x == v2.x && v1.y == v2.y); }
function vector2Clone(v) { return {x:v.x, y:v.y}; }
function vector2AngleBetween(v1, v2) { return Math.acos(vector2Dot(v1,v2) / vector2Length(v1) / vector2Length(v2)); }
// Helper function to return the exact angle of a vector.
function vector2Angle(v)
{
	var results = vector2AngleBetween(v, {x:1, y:0});
	if (v.y > 0)
	{
		results *= -1;
		results += 2 * Math.PI;
	}
	return results;
}
function vector2Floor(v) { v.x = Math.floor(v.x); v.y = Math.floor(v.y); return v; }

// Helper function to return a degree version of a radian angle.
function radToDeg(x) { return x * 180 / Math.PI; }
// Helper function to return a radian version of a degree angle.
function degToRad(x) { return x * Math.PI / 180; }
// Helper function to return the sign of an input.
function numberSign(x) { return x ? x < 0 ? -1 : 1 : 0; }