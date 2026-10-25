import test from 'node:test';
import assert from 'node:assert/strict';
import { badgeDragPose, badgeRibbonPath, createBadgeGesture } from './badge-gesture.js';
const event = (x=0,y=0,extra={}) => ({pointerId:1,clientX:x,clientY:y,button:0,isPrimary:true,pointerType:'mouse',...extra});
test('a click or small movement still opens the badge',()=>{const g=createBadgeGesture(()=>{});g.down(event());g.move(event(3,2));g.up(event(3,2));assert.equal(g.consumeClick({detail:1}),false);});
test('drag keeps both axes and suppresses only its resulting click',()=>{let pose;const g=createBadgeGesture(v=>pose=v);g.down(event());assert.equal(g.move(event(250,100)),true);assert.deepEqual(pose,{x:250,y:100});g.up(event());assert.equal(pose,null);assert.equal(g.consumeClick({detail:1}),true);assert.equal(g.consumeClick({detail:1}),false);});
test('vertical touch scroll never turns into a badge drag',()=>{let pose;const g=createBadgeGesture(v=>pose=v);g.down(event(0,0,{pointerType:'touch'}));assert.equal(g.move(event(3,30)),false);assert.equal(g.move(event(50,80)),false);assert.equal(pose,null);assert.equal(g.consumeClick({detail:1}),false);});
test('horizontal touch can drag; unrelated pointers cannot',()=>{let pose;const g=createBadgeGesture(v=>pose=v);g.down(event(0,0,{pointerType:'touch'}));assert.equal(g.move(event(90,0,{pointerId:2})),false);assert.equal(pose,undefined);assert.equal(g.move(event(40,2)),true);assert.ok(pose.x>0);});
test('cancellation releases the badge and keeps keyboard links usable',()=>{let pose;const g=createBadgeGesture(v=>pose=v);g.down(event());g.move(event(70));assert.equal(g.consumeClick({detail:0}),false);g.cancel();assert.equal(pose,null);assert.equal(g.consumeClick({detail:1}),false);});
test('a new tap is not swallowed after an earlier drag',()=>{const g=createBadgeGesture(()=>{});g.down(event());g.move(event(40));g.up(event());g.down(event());g.up(event());assert.equal(g.consumeClick({detail:1}),false);});

test('grabbing an already swinging badge preserves its position',()=>{let pose;const g=createBadgeGesture(v=>pose=v);g.down(event(100,100),{x:60,y:-20});g.move(event(125,115));assert.deepEqual(pose,{x:85,y:-5});});

test('normal travel follows the pointer and permits a much wider swing',()=>{const p=badgeDragPose(250,100);assert.equal(p.x,250);assert.equal(p.y,100);assert.ok(p.roll < -30);assert.ok(p.yaw>25);assert.ok(p.pitch<0);});

test('travel resistance is continuous, symmetric and bounded at extreme distances',()=>{
  const at=badgeDragPose(180,0,180),near=badgeDragPose(180.01,0,180),far=badgeDragPose(10000,10000,180),left=badgeDragPose(-10000,-10000,180);
  assert.ok(near.x>at.x&&near.x-at.x<.01);
  assert.ok(far.x<=250&&far.x>180);assert.equal(left.x,-far.x);
  assert.ok(far.y<=220);assert.ok(left.y>=-145);
  assert.ok(Math.abs(far.roll)<=48&&Math.abs(far.yaw)<=38&&Math.abs(far.pitch)<=24);
});

test('the flexible ribbon stays pinned to the peg and meets the moving clasp',()=>{
  for(const [x,y,angle,length] of [[0,0,0,110],[240,90,-35,55],[-150,-60,25,138]]){
    const path=badgeRibbonPath(x,y,angle,length);
    assert.ok(path.startsWith('M 0 0 C '));
    assert.ok(path.endsWith(`, ${x} ${length+y}`));
    assert.ok(!path.includes('NaN'));
  }
});
