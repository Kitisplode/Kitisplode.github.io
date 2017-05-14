// Project: Dungeons & Generators (Catalyst Training Final Project)
// File: librariesTests.js
// Desc: Contains the tests for the secondary libraries
// Author: mjensen
// Created: July 29, 2015
//
//**************************************************************************************************

QUnit.test("rectangle collision check, positive", function(assert)
{
	var rectA = {l: -16, t: -16, w: 32, h: 32};
	var rectB = {l: -8, t: -8, w: 32, h: 32};
	var depth = RectangleIntersectionDepth(rectA, rectB);
	assert.ok(depth.x != 0 || depth.y != 0, "rectangles are correctly colliding (depth)");
	assert.ok(collideRects(rectA, rectB), "rectangles are correctly colliding");
});

QUnit.test("rectangle collision check, negative, rectangles not colliding", function(assert)
{
	var rectA = {l: -16, t: -16, w: 32, h: 32};
	var rectB = {l: 32, t: 32, w: 32, h: 32};
	var depth = RectangleIntersectionDepth(rectA, rectB);
	assert.ok(depth.x == 0 && depth.y == 0, "rectangles are correctly not colliding (depth)");
	assert.ok(!collideRects(rectA, rectB), "rectangles are correctly not colliding");
});

QUnit.test("rectangle collision check, negative, rectangles colliding, but one has 0 width", function(assert)
{
	var rectA = {l: -16, t: -16, w: 32, h: 32};
	var rectB = {l: 0, t: 0, w: 0, h: 0};
	var depth = RectangleIntersectionDepth(rectA, rectB);
	assert.ok(depth.x == 0 && depth.y == 0, "rectangles are correctly not colliding (depth)");
	assert.ok(!collideRects(rectA, rectB), "rectangles are correctly not colliding");
});

QUnit.test("vector2Equals works", function(assert)
{
	var v1 = {x:0, y:0};
	var v2 = {x:0, y:0};
	
	assert.ok(vector2Equals(v1, v2), "v1 and v2 are equal");
	
	var v3 = {x:1, y:1};
	
	assert.ok(!vector2Equals(v1, v3), "v1 and v3 are not equal");
});

QUnit.test("vector2Difference works", function(assert)
{
	var v1 = {x:1, y:1};
	var v2 = {x:1, y:1};
	
	assert.ok(vector2Equals({x:0, y:0}, vector2Difference(v1, v2)), "v1 - v2 = x:0, y:0 correctly");
});

QUnit.test("vector2Sum works", function(assert)
{
	var v1 = {x:1, y:1};
	var v2 = {x:1, y:1};
	
	assert.ok(vector2Equals({x:2, y:2}, vector2Sum(v1, v2)), "v1 + v2 = x:2, y:2 correctly");
});

QUnit.test("vector2Dot works", function(assert)
{
	var v1 = {x:2, y:2};
	var v2 = {x:1, y:1};
	
	assert.ok(vector2Dot(v1, v1) == 8, "v1 dot v1 = 8");
	assert.ok(vector2Dot(v1, v2) == 4, "v1 dot v2 = 4");
});

QUnit.test("vector2Normalize works", function(assert)
{
	assert.ok(Math.round(vector2LengthSquared(vector2Normalize({x:2, y:2}))) == 1, "v1 normalized length is 1");
	assert.ok(Math.round(vector2LengthSquared(vector2Normalize({x:145, y:373546}))) == 1, "v2 normalized length is 1");
	assert.ok(Math.round(vector2LengthSquared(vector2Normalize({x:-1245, y:-3245}))) == 1, "v3 normalized length is 1");
});

QUnit.test("vector2Angle works", function(assert)
{
	assert.ok(radToDeg(vector2Angle({x:1, y:0})) == 0, "1,0 is 0 degrees");
	assert.ok(radToDeg(vector2Angle({x:0, y:-1})) == 90, "0,-1 is 90 degrees");
	assert.ok(radToDeg(vector2Angle({x:-1, y:0})) == 180, "-1,0 is 180 degrees");
	assert.ok(radToDeg(vector2Angle({x:0, y:1})) == 270, "0,1 is 270 degrees");
});

QUnit.test("degToRad works", function(assert)
{
	assert.ok(degToRad(0) == 0, "0 radians = 0 degrees");
	assert.ok(degToRad(90) == Math.PI / 2, "PI / 2 radians = 90 degrees");
	assert.ok(degToRad(180) == Math.PI, "PI radians = 180 degrees");
	assert.ok(degToRad(270) == Math.PI * 3 / 2, "3PI / 2 radians = 270 degrees");
});

QUnit.test("arrayReverse works", function(assert)
{
	var pArray = null;
	assert.ok(arrayReverse(pArray) == null, "reversing a null array returns null, doesn't break");
	
	pArray = [0, 1, 2, 3, 4];
	arrayReverse(pArray);
	assert.ok(pArray[0] == 4, "last is now first in reversed array");
});