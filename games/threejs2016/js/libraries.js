// Project: Game Engine 2015
// File: libraries.js
// Desc: Contains the functions used as libraries.
// Author: mjensen
// Created: July 28, 2015
//
//**************************************************************************************************

// String splice method from http://stackoverflow.com/questions/13925103/replace-substring-in-string-with-range-in-javascript by Kolink
String.prototype.splice = function(start,length,replacement) {
    return this.substr(0,start)+replacement+this.substr(start+length);
}

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
function collideAABBs (a, b)
{
	return (a.max.x > b.min.x &&
			a.min.x < b.max.x &&
			a.max.y > b.min.y &&
			a.min.y < b.max.y &&
			a.max.z > b.min.z &&
			a.min.z < b.max.z);
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
// Adds two vectors together and returns a new vector containing that sum.
function vector2Sum(v1, v2) { return {x: v1.x + v2.x, y:v1.y + v2.y}; }
// Subtracts the second vector from the first and returns a new vector containing that difference.
function vector2Difference(v1, v2) { return {x: v1.x - v2.x, y: v1.y - v2.y}; }
// Multiplies a vector by a scalar value and returns a new vector after the scale.
function vector2Scale(v, n) { return {x:v.x * n, y:v.y * n}; }
// Assigns the values of the first vector to match those of the second vector (basically copying the second vector into the first). Returns the first vectory.
function vector2Copy(v1, v2) { v1.x = v2.x; v1.y = v2.y; return v1; }
// Checks to see if two vectors match. Returns true if so, false otherwise.
function vector2Equals(v1, v2) { return (v1.x == v2.x && v1.y == v2.y); }
// Returns a new vector with values matching the input vector.
function vector2Clone(v) { return {x:v.x, y:v.y}; }
// Calculates the angle between two vectors.
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
// Floors the values of a vector.
function vector2Floor(v) { v.x = Math.floor(v.x); v.y = Math.floor(v.y); return v; }
var vector2Zero = {x:0, y:0};

// Calculates the angular difference between two angles, accounting for looping around.
function angleDiff(a1, a2)
{
	if (a1 < 180) { if (a2 < a1 + 180) return Math.abs(a1 - a2); else return Math.abs(a1 + 360 - a2); }
	else { if (a2 > a1 - 180) return Math.abs(a1 - a2); else return Math.abs(a1 - 360 - a2); }
}
// Same as above, but gives signed values.
function angleDiffSigned(a1, a2)
{
	if (a1 < 180) { if (a2 < a1 + 180) return (a1 - a2); else return (a1 + 360 - a2); }
	else { if (a2 > a1 - 180) return (a1 - a2); else return (a1 - 360 - a2); }
}
// Helper function to return a degree version of a radian angle.
function radToDeg(x) { return x * 180 / Math.PI; }
// Helper function to return a radian version of a degree angle.
function degToRad(x) { return x * Math.PI / 180; }
// Helper function to return the sign of an input.
function numberSign(x) { return x ? x < 0 ? -1 : 1 : 0; }
// Helper function for linear interpolation.
function lerp(x,y,a) { return x + (y - x) * a; }