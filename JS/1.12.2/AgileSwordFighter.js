//START OF CONFIG ####################################################################################
var npcNormalMovement = 4;

var shotCooldown = 2 //seconds
var cdVariance = 0 //Projectile cooldown variance, in seconds
var minimumDistance = 3; //blocks away the npc must be to fire.


//===Other Info===\\
//To Have NPC in an initial pose before intro, see InitialPose function
//To trigger an attack for anywhere, use tempdata RemoteTriggeredAttack and start timer 747
//To cancel animations add storeddata AnimCancel. 1 is for back to neutral, 2 for into an attack
//If canceling into an attack be sure to add an attack to RemoteTriggeredAttack

function init(t){
//ADD AND REMOVE ATTACKS HERE
var AttackList = [VerticalCuts,XCuts];
var AttackChances = [50,50]; //Needs to be same length as AttackList
var ShotList = [DashAttack,JumpSlam];
var ShotChances = [100,0]; //Needs to be same length as ShotList
var ShieldingAttackList = [];
var ShieldingAttackChances = []; //Same length as ShieldingAttackList
var HealthTriggeredAttacks = [];
var TriggeredAttackHealth = [];	//Health % to perform trigger attacks. Use 0-100, not decimals
//ADD AND REMOVE ATTACKS HERE
var WalkingAnim = 0			//Can set to 0 if no Walking animation
var ShieldWalkAnim = 0 //Can set to 0 if no shielding or no Walking animation
var IntroAnimation = 0		//Can set to 0 if no Intro Animation
//END OF CONFIG ####################################################################################


t.npc.ai.setNavigationType(0)
t.npc.getTempdata().put("DefaultWalk",WalkingAnim)
t.npc.getTempdata().put("Walk",WalkingAnim)
t.npc.getTempdata().put("ShieldWalk",ShieldWalkAnim)
t.npc.getTempdata().put("IntroAnim",IntroAnimation)
t.npc.getStoreddata().put("Init",1)
t.npc.getStoreddata().put("Attacking",0)
t.npc.getStoreddata().put("shielding",0)
t.npc.getStoreddata().put("Running", 0);
t.npc.getStoreddata().put("dmgRes", 1);
t.npc.getTempdata().put("Blocked",0)
t.npc.getStoreddata().remove("AnimCancel")
t.npc.getTempdata().remove("ManualAttack");
t.npc.getTempdata().remove("RemoteTriggeredAttack");
t.npc.getTempdata().put("HealthTriggeredAttacks",HealthTriggeredAttacks)
t.npc.getTempdata().put("TriggeredAttackHealth",TriggeredAttackHealth)
t.npc.getTempdata().put("AttackList",AttackList)
t.npc.getTempdata().put("AttackChances",AttackChances)
t.npc.getTempdata().put("ShieldingAttackList",ShieldingAttackList)
t.npc.getTempdata().put("ShieldingAttackChances",ShieldingAttackChances)
t.npc.getTempdata().put("ShotList",ShotList)
t.npc.getTempdata().put("ShotChances",ShotChances)
t.npc.ai.setWalkingSpeed(npcNormalMovement)
if(!WalkingAnimation)puppetNbt(t.npc, 0);
else{puppetNbt(t.npc,1,true,true,true,true,true);}
//InitialPose(t.npc)
try{var d = FrontVectors(t.npc,6,9,1)}
catch(e){t.npc.say("Roma God functions not detected. Please install them or there will be crashes")}
t.npc.timers.stop(77);
t.npc.timers.stop(741);
t.npc.timers.stop(742);
t.npc.timers.stop(743);
t.npc.timers.stop(744);
t.npc.timers.stop(745);
t.npc.timers.stop(746);
t.npc.timers.stop(747);
t.npc.timers.stop(748);
t.npc.timers.stop(749);
t.npc.timers.stop(750);}

var shieldChance = 0; //chance to shield when hit. Use 0-100, not decimals
var BlockAngle = 60; //Cone in front they will block. 0-360
var BlockStrength = 10 //Total blockable damage. 0 for infinate
var shieldDuration = [5,7]; //seconds to hold up shield
var shieldCooldown = 5 //Time NPC can't shield again after guard break
var attacksWhileShielding = false; //MUST HAVE SHIELDING ATTACKS
var blockBreakSound = "minecraft:item.shield.break"
var blockSound = "minecraft:item.shield.block";
var blockParticle = "smoke";

var WalkingAnimation = false
var DoIntroAnimation = false


function VerticalCutsFunc(npc){
var Thread = Java.type("java.lang.Thread");
var RomaThread = Java.extend(Thread,{
run: function(){
Thread.sleep(250)
ArcMe(npc,40,-20,-60,70,1.3,1.2,0,20,5,"smoke",3,0,0,0,0.04)
Thread.sleep(300)
ArcMe(npc,-20,40,60,-50,1.3,1.2,0,20,5,"smoke",3,0,0,0,0.04)
}});
var H = new RomaThread();
H.start();}

function XCutsFunc(npc){
var Thread = Java.type("java.lang.Thread");
var RomaThread = Java.extend(Thread,{
run: function(){
Thread.sleep(300)
ArcMe(npc,60,-60,20,-20,1.5,1,0,20,5,"smoke",3,0,0,0,0.04)
Thread.sleep(300)
ArcMe(npc,-60,60,20,-20,1.5,1,0,20,5,"smoke",3,0,0,0,0.04)
}});
var H = new RomaThread();
H.start();}

function JumpSlamFunc(npc){
var Thread = Java.type("java.lang.Thread");
var RomaThread = Java.extend(Thread,{
run: function(){
var targ = npc.getAttackTarget()
if(targ==null)return;
npc.setMotionY(0.7)
var targPos = targ.getPos()
npc.ai.setNavigationType(1)
npc.world.playSoundAt(npc.getPos(),"minecraft:entity.blaze.shoot",1,0.8)
Thread.sleep(1000)
npc.world.playSoundAt(npc.getPos(),"dsurround:sword.swing",1,1)
npc.ai.setNavigationType(0)
drawFwoomLine(npc,targPos,1,3,1)
}});
var H = new RomaThread();
H.start();}

function InitialPose(npc){
npc.ai.setStandingType(1)
npc.setRotation(180)
npc.getJob().getPart(0).setRotation(210,180,180) //Head
npc.getJob().getPart(1).setRotation(180,164,169) //Left Arm
npc.getJob().getPart(2).setRotation(210,223,205) //Right Arm
npc.getJob().getPart(3).setRotation(180,180,180) //Body
npc.getJob().getPart(4).setRotation(180,180,170) //Left Leg
npc.getJob().getPart(5).setRotation(180,180,190) //Right Leg
}

function target(t){
t.npc.timers.stop(746)
if(!t.npc.timers.has(749)){
var time = shotCooldown + (parseInt(Math.random()*((cdVariance*2)+1))-cdVariance)
t.npc.timers.forceStart(749,time*20,false)}
if(t.npc.getStoreddata().get("Init")==1){
t.npc.getStoreddata().put("Init",0)
if(DoIntroAnimation && t.npc.getTempdata().get("IntroAnim") != 0){
t.npc.getTempdata().put("RemoteTriggeredAttack",t.npc.getTempdata().get("IntroAnim"))
t.npc.timers.forceStart(747,1,true)}
//DO INTRO ANIMATION
else{t.npc.timers.forceStart(743,0,false)}}}

function damaged(t){
t.damage = t.damage*t.npc.getStoreddata().get("dmgRes")
//Health Gated Attacks
var HealthTriggeredAttacks = t.npc.getTempdata().get("HealthTriggeredAttacks")
var TriggeredAttackHealth = t.npc.getTempdata().get("TriggeredAttackHealth")
if(TriggeredAttackHealth.length > 0 && t.npc.getHealth() - t.damage <= t.npc.stats.getMaxHealth()*0.01*TriggeredAttackHealth[0]){
t.npc.getTempdata().put("ManualAttack",t.npc.getTempdata().get("HealthTriggeredAttacks")[0])
HealthTriggeredAttacks.shift()
TriggeredAttackHealth.shift()
t.npc.getTempdata().put("HealthTriggeredAttacks",HealthTriggeredAttacks)
t.npc.getTempdata().put("TriggeredAttackHealth",TriggeredAttackHealth)}
//Shielding
if(!t.npc.timers.has(750) && t.npc.getStoreddata().get("shielding")==0 && t.npc.getStoreddata().get("Init") == 0){
if(parseInt(Math.random()*100)+1 < shieldChance){
t.npc.timers.forceStart(745,1,false)
return;}}
if(t.npc.getStoreddata().get("shielding")==1 && t.source != null){
if(!CheckFOV(t.npc,t.source,BlockAngle))return;
t.npc.getTempdata().put("Blocked",t.npc.getTempdata().get("Blocked")+t.damage)
t.setCanceled(true)
if(t.npc.getTempdata().get("Blocked") >= BlockStrength){
t.npc.timers.forceStart(750,shieldCooldown*20,false)
t.npc.getStoreddata().put("shielding",0)
t.npc.world.playSoundAt(t.npc.getPos(),blockBreakSound,5,1);
if(!WalkingAnimation){t.npc.getTempdata().put("RemoteTriggeredAttack",shieldBreakStanding);
if(t.npc.getStoreddata().get("Running")==0){t.npc.timers.forceStart(747,0,false);return;}}
else{t.npc.getTempdata().put("Walk",t.npc.getTempdata().get("DefaultWalk"));t.npc.getTempdata().put("RemoteTriggeredAttack",shieldBreak);}
t.npc.getStoreddata().put("AnimCancel",2);return;}
t.npc.world.playSoundAt(t.npc.getPos(),blockSound,5,1);
t.npc.world.spawnParticle(blockParticle, t.npc.x , t.npc.y+1, t.npc.z, 0,0,0,0.05, 10);
return;}}

function meleeAttack(t){
if(t.npc.getStoreddata().get("AbilityActive") == 1) return;
t.setCanceled(true);
if(t.npc.getStoreddata().get("Attacking") == 1)return;
if(t.npc.getStoreddata().get("Running") == 1) return;
PickAttack(t.npc,1)}

function timer(t){
//SPECIAL FUNCTION ID TIMERS vvv
if(t.id==1)VerticalCutsFunc(t.npc)
if(t.id==2)XCutsFunc(t.npc)
if(t.id==3)JumpSlamFunc(t.npc)
//SPECIAL FUNCTION ID TIMERS ^^^
//SPIN FUNCTION vvv
if(t.id==77){
var rs = t.npc.getTempdata().get("Rotator")
var count = t.npc.getTempdata().get("SpinRevs")
var r = t.npc.getTempdata().get("SpinStart")
var R = r+rs*count
if(Math.abs(R) > 360)R=R%360;
t.npc.getMCEntity().field_70177_z = R;
t.npc.setMotionX(Math.sin(R*Math.PI/180)*0.01);
t.npc.setMotionZ(Math.cos(R*Math.PI/180)*0.01);
t.npc.getTempdata().put("SpinRevs",count+1)
if(count == 9)t.npc.timers.stop(77)}
//SPIN FUNCTION ^^^
//WALKING ANIMATION vvv
if(t.id==743 && WalkingAnimation){
if(t.npc.getStoreddata().get("Running") == 1) return;
if(t.npc.getStoreddata().get("Attacking") == 0 && t.npc.getAttackTarget() != null){
var TheWalk = t.npc.getTempdata().get("Walk")
SetStats(TheWalk,t.npc)
ANIMATE(TheWalk.actions, t.npc, 30, TheWalk, t.npc.getAttackTarget())}}
//WALKING ANIMATION ^^^
//REMOTE TRIGGERED ATTACK vvv
if(t.id==747){
if(t.npc.getStoreddata().get("Running") == 1) return;
t.npc.timers.stop(747)
if(t.npc.getTempdata().has("RemoteTriggeredAttack")){
var TheAttack = t.npc.getTempdata().get("RemoteTriggeredAttack")
t.npc.getTempdata().remove("RemoteTriggeredAttack");
t.npc.getTempdata().put("MoveInfo",TheAttack);
SetStats(TheAttack,t.npc)
if(!WalkingAnimation)puppetNbt(t.npc, 1, TheAttack.usepart.head, TheAttack.usepart.body, TheAttack.usepart.left_leg, TheAttack.usepart.right_leg, TheAttack.usepart.left_arm);
if(TheAttack.Type == 1)t.npc.timers.forceStart(741,0,false)
t.npc.getStoreddata().put("Attacking",1)
ANIMATE(TheAttack.actions, t.npc, 30, TheAttack, t.npc.getAttackTarget())}}
//REMOTE TRIGGERED ATTACK ^^^
//SOUNDS AND DAMAGE vvv
if(t.id==741){
var info = t.npc.getTempdata().get("MoveInfo");
t.npc.world.playSoundAt(t.npc.getPos(),info.deets.windUpSound,5,1);}
if(t.id==742){
var info = t.npc.getTempdata().get("MoveInfo");
if(info!=null && t.npc.isAlive()){
DAMAGE(t.npc, info.deets,t.npc.getTempdata().get("targ"))}}
if(t.id==748){
var info = t.npc.getTempdata().get("MoveInfo");
if(info!=null && t.npc.isAlive()){
SHOOT(t.npc, info.deets)}}
//SOUNDS AND DAMAGE ^^^
//PROJECTILE ATTACK TRIGGER vvv
if(t.id==749){
if(t.npc.getAttackTarget() != null){
var time = shotCooldown + (parseInt(Math.random()*((cdVariance*2)+1))-cdVariance)
if(minimumDistance == 0 || t.npc.getStoreddata().get("AbilityActive") == 1 || t.npc.getStoreddata().get("Attacking") == 1 ||  t.npc.getStoreddata().get("Running") == 1 || t.npc.getPos().distanceTo(t.npc.getAttackTarget().getPos()) < minimumDistance){
t.npc.timers.forceStart(749,time*10,false)
return;}
PickAttack(t.npc,2)
t.npc.timers.forceStart(749,time*20,false)}}
//PROJECTILE ATTACK TRIGGER ^^^
//SHIELD MANAGEMENT vvv
if(t.id==744){ //Shield Down
if(t.npc.getStoreddata().get("Attacking")==0){
t.npc.getStoreddata().put("shielding",0)
if(WalkingAnimation){
t.npc.getTempdata().put("Walk",t.npc.getTempdata().get("DefaultWalk"))
t.npc.getStoreddata().put("AnimCancel",1)}
if(!WalkingAnimation){
ANIMATE(shieldDown.actions, t.npc, 30,shieldDown,t.npc.getAttackTarget());}}
else{t.npc.timers.forceStart(744,1,false)}}
if(t.id==745){ //Shield up
if(t.npc.getAttackTarget() == null)return;
if(t.npc.getStoreddata().get("Attacking") == 0){
t.npc.getTempdata().put("Blocked",0)
t.npc.getStoreddata().put("shielding",1)
var dur = (Math.random()*(shieldDuration[1]-shieldDuration[0]+1))+shieldDuration[0]
t.npc.timers.forceStart(744,20*dur,false)
if(WalkingAnimation){
t.npc.getTempdata().put("Walk",t.npc.getTempdata().get("ShieldWalk"))
t.npc.getStoreddata().put("AnimCancel",1)}
if(!WalkingAnimation){
puppetNbt(t.npc,1,false,false,false,false,true)
ANIMATE(shieldUp.actions, t.npc, 30, shieldUp, t.npc.getAttackTarget());}}
else{t.npc.timers.forceStart(745,1,false)}}
//SHELD MANAGEMENT ^^^
if(t.id==746){
var players = t.npc.world.getNearbyEntities(t.npc.getPos(),32,1)
if(players.length == 0)t.npc.reset()}}


function ANIMATE(acts, npc, rate, TheMove, targ){
if(TheMove.Type != 3)npc.getStoreddata().put("Running", 1);
//Special Effect Stuff Here!
if(TheMove.Type != 3)npc.timers.forceStart(TheMove.deets.specialFunctionID,0,false)
npc.getTempdata().put("atkNum",0)
npc.getTempdata().put("shotNum",0)
npc.getTempdata().put("soundNum",0)
if(TheMove.Type == 2){npc.getStoreddata().put("shielding",0);npc.getTempdata().put("Walk",npc.getTempdata().get("DefaultWalk"))}
var atkIndex = 0;
var lngIndex = 0;
var actCnt = 1;
var RomaThread = Java.extend(Thread,{
run: function (){
var last_rotation = {};
var sleep_time = 1000 / rate;
for (var i in acts) {
var act = acts[i];
var start = {};
var act_count = 0;
for (var j in act) {
var part = npc.getJob().getPart(act[j].id);
start[j] = {};
if (last_rotation[j])
start[j].rotation = last_rotation[j].slice();
else
start[j].rotation = [part.getRotationX(), part.getRotationY(), part.getRotationZ()];
start[j].step = [
(act[j].end[0] - start[j].rotation[0]) / rate / act[j].time,
(act[j].end[1] - start[j].rotation[1]) / rate / act[j].time,
(act[j].end[2] - start[j].rotation[2]) / rate / act[j].time];
act_count++;}
while (act_count != 0){
for (var j in act){
var a = act[j];
if (start[j]){
var s = start[j];
s.rotation[0] = NextStep(s.rotation[0], Scale(s.step[0]), a.end[0]);
s.rotation[1] = NextStep(s.rotation[1], Scale(s.step[1]), a.end[1]);
s.rotation[2] = NextStep(s.rotation[2], Scale(s.step[2]), a.end[2]);
var part = npc.getJob().getPart(a.id);
part.setRotation(s.rotation[0], s.rotation[1], s.rotation[2]);
if (s.rotation[0] == a.end[0] && s.rotation[1] == a.end[1] && s.rotation[2] == a.end[2]) {
last_rotation[j] = s.rotation.slice();
start[j] = undefined;
act_count--;}}}
npc.updateClient();
//RETURN STATEMENTS vvv
if(npc.getStoreddata().has("AnimCancel")){
if(npc.getStoreddata().get("AnimCancel") == 1){
npc.getStoreddata().remove("AnimCancel")
npc.getStoreddata().put("Running",0)
npc.getStoreddata().put("Attacking",0)
if(!WalkingAnimation)npc.timers.forceStart(744,0,false)
else{npc.timers.forceStart(743,0,false)}
return;}
if(npc.getStoreddata().get("AnimCancel") == 2){
npc.getStoreddata().remove("AnimCancel")
npc.getStoreddata().put("Running",0)
npc.timers.forceStart(747,0,false)
return;}}
if(npc.getStoreddata().get("Init")==1){InitialPose(npc);return;}
if(TheMove.Type == 3 && npc.getStoreddata().get("Attacking")==1)return;
//RETURN STATEMENTS ^^^
Thread.sleep(sleep_time);}
//AFTER EVERY ACTION vvv
if(TheMove.Type == 3 && actCnt == TheMove.stats.SoundAfterAction[atkIndex]){
npc.world.playSoundAt(npc.getPos(),TheMove.stats.Sounds[npc.getTempdata().get("soundNum")],1,1)
npc.getTempdata().put("soundNum",npc.getTempdata().get("soundNum")+1)}
if(TheMove.Type == 1 && actCnt == TheMove.deets.LungeAfterAction[lngIndex]){Lunge(npc,TheMove.deets.lungeIntensity[lngIndex],targ);lngIndex=lngIndex+1;}
if(actCnt == TheMove.deets.AttackAfterAction[atkIndex]){
npc.getTempdata().put("targ",targ);
if(TheMove.Type == 1)npc.timers.forceStart(742,TheMove.deets.Delay[atkIndex],false)
if(TheMove.Type == 2)npc.timers.forceStart(748,TheMove.deets.Delay[atkIndex],false)
atkIndex = atkIndex + 1;}  
actCnt = actCnt + 1;}
//AFTER EVERY ACTION ^^^
//AFTER ALL ACTIONS vvv
if(TheMove.stats.Movement != -1)npc.ai.setWalkingSpeed(npcNormalMovement)
if(TheMove.stats.knockbackResistance)npc.stats.setResistance(3,npc.getStoreddata().get("kbRes"))
if(TheMove.stats.damageModifier != 1)npc.getStoreddata().put("dmgRes",1)
if(!WalkingAnimation){
if(npc.getStoreddata().get("shielding")==1)puppetNbt(npc,1,false,false,false,false,true)
else{puppetNbt(npc,0)}}
//TARGET LOSS vvv
if(targ && targ.isAlive() && npc.getPos().distanceTo(targ.getPos()) <= 32)npc.setAttackTarget(targ);
else{npc.timers.forceStart(746,60,true)}
//TARGET LOSS ^^^
if(TheMove.Type != 3)npc.getStoreddata().put("Attacking",0)
npc.timers.forceStart(743,1,false)
npc.getStoreddata().put("Running",0);
//AFTER ALL ACTIONS ^^^
}});
var H = new RomaThread();
H.start();}

function PickAttack(npc,MODE){
//Determining which attack to use
if(npc.getTempdata().has("RemoteTriggeredAttack"))return;
var TheMove
if(npc.getTempdata().has("ManualAttack")){
TheMove = npc.getTempdata().get("ManualAttack")
npc.getTempdata().remove("ManualAttack");}
else{
if(MODE == 1 && npc.getStoreddata().get("shielding") == 1){
if(!attacksWhileShielding)return;
var MoveList = npc.getTempdata().get("ShieldingAttackList")
var MoveChances = npc.getTempdata().get("ShieldingAttackChances")}
else{
if(MODE == 1){var MoveList = npc.getTempdata().get("AttackList");var MoveChances = npc.getTempdata().get("AttackChances")}
if(MODE == 2){var MoveList = npc.getTempdata().get("ShotList");var MoveChances = npc.getTempdata().get("ShotChances")}}
TheMove = MoveList[0] //Default to avoid bugs
var rand = parseInt(Math.random()*101)
var cumChance = 0
for(var i = 0; i< MoveChances.length;++i){
cumChance = cumChance + MoveChances[i]
if(rand <= cumChance){
TheMove = MoveList[i]
break;}}}
npc.getStoreddata().put("Attacking",1)
npc.getTempdata().put("MoveInfo",TheMove);
//Change movement and resistancs during animation
SetStats(TheMove,npc)
//Updating NBT to allow animations
if(!WalkingAnimation)puppetNbt(npc, 1, TheMove.usepart.head, TheMove.usepart.body, TheMove.usepart.left_leg, TheMove.usepart.right_leg, TheMove.usepart.left_arm);
//Doing the Animations
if(MODE == 1)npc.timers.forceStart(741,0,false)
ANIMATE(TheMove.actions, npc, 30, TheMove, npc.getAttackTarget())}

function NextStep(src, piece, dest) {
if (src != dest) {
if (src < dest)
src = src + piece >= dest ? dest : src + piece;
else if (src > dest)
src = src + piece <= dest ? dest : src + piece;}
if (src > 360)
src = src - 360;
else if (src < 0)
src = 360 - src;
return src;}
var Thread = Java.type("java.lang.Thread");
var NpcAPI = Java.type("noppes.npcs.api.NpcAPI").Instance();
function Scale(num){
num < 0.1 && num > 0 ? num = 0.1 : num
num > -0.1 && num < 0 ? num = -0.1 : num
return num;}

function puppetNbt(npc, value, head, body, Lleg, Rleg, LArm) {
var nbt = npc.getEntityNbt();
nbt.setByte("PuppetStanding", value);
nbt.setByte("PuppetAttacking", value);
nbt.setByte("PuppetMoving", value);
if(!head) nbt.getCompound("PuppetHead").setByte("Disabled", 1);
if(!Rleg) nbt.getCompound("PuppetRLeg").setByte("Disabled", 1);
if(!Lleg) nbt.getCompound("PuppetLLeg").setByte("Disabled", 1);
if(!body) nbt.getCompound("PuppetBody").setByte("Disabled", 1);
if(!LArm) nbt.getCompound("PuppetLArm").setByte("Disabled", 1);
npc.setEntityNbt(nbt);}

function SetStats(TheMove,npc){
if(TheMove.stats.Movement != -1)npc.ai.setWalkingSpeed(TheMove.stats.Movement)
if(TheMove.stats.knockbackResistance){npc.getStoreddata().put("kbRes",npc.stats.getResistance(3));npc.stats.setResistance(3,2)}
if(TheMove.stats.damageModifier != 1)npc.getStoreddata().put("dmgRes",TheMove.stats.damageModifier)}

function Lunge(npc,intensity,targ){
if(targ == null)return;
if(intensity == -0)intensity = TrueDistanceEntity(npc,targ)/2.8
var d = FrontVectors(npc,GetPlayerRotation(npc,targ),0,intensity,0)
npc.setMotionX(d[0])
npc.setMotionZ(d[2])}

function Spin(npc,dir,ticks){
if(!ticks)ticks = 0
if(dir > 0)npc.getTempdata().put("Rotator",40)
if(dir < 0)npc.getTempdata().put("Rotator",-40)
npc.getTempdata().put("SpinRevs",0)
npc.getTempdata().put("SpinStart",npc.getRotation())
npc.timers.forceStart(77,ticks,true)}

function FrontVectors(entity,dr,dp,distance,mode){
if(!mode)mode=0
if(mode == 1){var angle = dr + entity.getRotation();var pitch = (-entity.getPitch()+dp)*Math.PI/180}
if(mode == 0){var angle = dr;var pitch = (dp)*Math.PI/180}
var dx = -Math.sin(angle*Math.PI/180)*(distance*Math.cos(pitch))
var dy = Math.sin(pitch)*distance
var dz = Math.cos(angle*Math.PI/180)*(distance*Math.cos(pitch))
return [dx,dy,dz]}

function DoActualDamage(npc,dmg,targ,blockable){
if(targ.getType() == 1){
if(targ.timers.has(3))return;
targ.timers.forceStart(3,4,false)
var totalArmor = 0;
var totalToughness = 0;
for(var i = 0; i < 4; i++){
var REGISTRY = Java.type('net.minecraftforge.fml.common.registry.ForgeRegistries');
var ResourceLocation = Java.type('net.minecraft.util.ResourceLocation');
var Piece = targ.getArmor(i);
var anItem = REGISTRY.ITEMS.getValue(new ResourceLocation(Piece.getName()));
var armor = anItem.field_77879_b;
var toughness = anItem.field_189415_e;
if(armor == 0 && Piece.getName() != "minecraft:air"){
if(Piece.getItemName()=="Wooden Helmet"){armor = 0.6,toughness = 2}
if(Piece.getItemName()=="Stone Helmet"){armor = 1,toughness = 2}
if(Piece.getItemName()=="Flint Helmet"){armor = 1.44,toughness = 3.25}
if(Piece.getItemName()=="Bone Helmet"){armor = 1.14,toughness = 4.5}
if(Piece.getItemName()=="Obsidian Helmet"){armor = 1.76,toughness = 6.83}
if(Piece.getItemName()=="Prismarine Helmet"){armor = 2.08,toughness = 4.5}
if(Piece.getItemName()=="Iron Helmet"){armor = 2.32,toughness = 2}
if(Piece.getItemName()=="Cobalt Helmet"){armor = 2.5,toughness = 2}
if(Piece.getItemName()=="Ardite Helmet"){armor = 2.72,toughness = 7}
if(Piece.getItemName()=="Manyullyn Helmet"){armor = 4,toughness = 5.75}
if(Piece.getItemName()=="Steel Helmet"){armor = 4.2,toughness = 8.75}
if(Piece.getItemName()=="Wooden Chestplate"){armor = 1.5,toughness = 2}
if(Piece.getItemName()=="Stone Chestplate"){armor = 2.5,toughness = 2}
if(Piece.getItemName()=="Flint Chestplate"){armor = 3.6,toughness = 3.25}
if(Piece.getItemName()=="Bone Chestplate"){armor = 2.8,toughness = 4.5}
if(Piece.getItemName()=="Obsidian Chestplate"){armor = 4.4,toughness = 6.83}
if(Piece.getItemName()=="Prismarine Chestplate"){armor = 5.2,toughness = 4.5}
if(Piece.getItemName()=="Iron Chestplate"){armor = 5.8,toughness = 2}
if(Piece.getItemName()=="Cobalt Chestplate"){armor = 6.24,toughness = 2}
if(Piece.getItemName()=="Ardite Chestplate"){armor = 6.8,toughness = 7}
if(Piece.getItemName()=="Manyullyn Chestplate"){armor = 10,toughness = 5.75}
if(Piece.getItemName()=="Steel Chestplate"){armor = 11.04,toughness = 8.75}
if(Piece.getItemName()=="Wooden Leggings"){armor = 1.13,toughness = 2}
if(Piece.getItemName()=="Stone Leggings"){armor = 1.88,toughness = 2}
if(Piece.getItemName()=="Flint Leggings"){armor = 2.7,toughness = 3.25}
if(Piece.getItemName()=="Bone Leggings"){armor = 2.1,toughness = 4.5}
if(Piece.getItemName()=="Obsidian Leggings"){armor = 3.3,toughness = 6.83}
if(Piece.getItemName()=="Prismarine Leggings"){armor = 3.9,toughness = 4.5}
if(Piece.getItemName()=="Iron Leggings"){armor = 4.35,toughness = 2}
if(Piece.getItemName()=="Cobalt Leggings"){armor = 4.68,toughness = 2}
if(Piece.getItemName()=="Ardite Leggings"){armor = 5.1,toughness = 7}
if(Piece.getItemName()=="Manyullyn Leggings"){armor = 7.5,toughness = 5.75}
if(Piece.getItemName()=="Steel Leggings"){armor = 8.28,toughness = 8.75}
if(Piece.getItemName()=="Wooden Boots"){armor = 0.52,toughness = 2}
if(Piece.getItemName()=="Stone Boots"){armor = 0.88,toughness = 2}
if(Piece.getItemName()=="Flint Boots"){armor = 1.26,toughness = 3.25}
if(Piece.getItemName()=="Bone Boots"){armor = 0.98,toughness = 4.5}
if(Piece.getItemName()=="Obsidian Boots"){armor = 1.54,toughness = 6.83}
if(Piece.getItemName()=="Prismarine Boots"){armor = 1.82,toughness = 4.5}
if(Piece.getItemName()=="Iron Boots"){armor = 2.03,toughness = 2}
if(Piece.getItemName()=="Cobalt Boots"){armor = 2.18,toughness = 2}
if(Piece.getItemName()=="Ardite Boots"){armor = 2.38,toughness = 7}
if(Piece.getItemName()=="Manyullyn Boots"){armor = 3.5,toughness = 5.75}
if(Piece.getItemName()=="Steel Boots"){armor = 3.86,toughness = 8.75}}
if(!Piece.getName().equals("minecraft:air")){
totalArmor = totalArmor + armor;
totalToughness = totalToughness + toughness;}}
if(totalArmor >25)totalArmor = 25;
if(totalToughness >20)totalToughness = 20;
var FINAL = dmg * (1 - (Math.max((totalArmor/5),(totalArmor-((dmg)/(totalToughness/4+2))))/25));
if(dmg != 0 && FINAL < 1) FINAL = 1;
//NEW ############### vvv
if(!targ.timers.has(4) && targ.getMCEntity().func_184811_cZ().func_185141_a(targ.getOffhandItem().getMCItemStack().func_77973_b())){FINAL = 0.01;} //IS PARRYING
else{ //IS BLOCKING v
if((targ.timers.has(5) || isShieldBlock(targ,npc)) && CheckFOV(targ,npc,180) && targ.getOffhandItem().getName().indexOf("spartan") == 0){ 
if(!blockable){ //GUARD BREAK
targ.getOffhandItem().damageItem(dmg,npc)
BreakShield(targ)
targ.world.playSoundAt(targ.getPos(),"minecraft:item.shield.break",1,1);}
else{ //ATTACK BLOCKED
targ.getOffhandItem().damageItem(dmg,npc);
FINAL = 0.01;
targ.world.playSoundAt(targ.getPos(),"minecraft:item.shield.block",1,1);}}}
//NEW ############### ^^^
if(FINAL - FINAL != 0)FINAL = 3 //This if statement is a load bearing coconut. Do not remove.
targ.getArmor(3).damageItem(FINAL*0.21,npc)
targ.getArmor(2).damageItem(FINAL*0.3,npc)
targ.getArmor(1).damageItem(FINAL*0.25,npc)
targ.getArmor(0).damageItem(FINAL*0.24,npc)
targ.damage(FINAL);}
else{
targ.damage(dmg)}}

function isShieldBlock(targ,npc){
if(targ.getMCEntity().func_184585_cz())return true;
else{return false;}}

function BreakShield(entity){
var T = 40;
entity.timers.forceStart(4,T,false)
entity.MCEntity.func_184811_cZ().func_185145_a(entity.MCEntity.func_184607_cu().func_77973_b(),T);
entity.MCEntity.func_184602_cy();}

function CheckFOV(seer,seen,FOV){
var P = seer.getRotation()
if(P<0)P=P+360
var rot = Math.abs(GetPlayerRotation(seer,seen) - P)
if(rot > 180) rot = Math.abs(rot - 360)
if(rot < FOV/2)return true;
else{return false;}}

function GetPlayerRotation(npc, player){
var dx = npc.getX()-player.getX();
var dz = player.getZ()-npc.getZ();
if(dz>=0){
var angle = (Math.atan(dx/dz)*180/Math.PI);
if(angle < 0){
angle = 360+angle;}}
if(dz<0){
dz = -dz;
var angle = 180-(Math.atan(dx/dz)*180/Math.PI);}
return angle;}

function DoKnockback(npc,targ,kb,kbVert){
targ.setMotionY(kbVert)
if(kb < 1){
var d = FrontVectors(npc,GetPlayerRotation(npc,targ),0,kb,0)
targ.setMotionX(d[0])
targ.setMotionZ(d[2])
return;}
targ.knockback(kb,GetPlayerRotation(npc,targ))}

function GetPlayerPitch(npc,player){
var distance = Math.sqrt(Math.pow((npc.x - player.x),2)+Math.pow((npc.z - player.z),2))
var dy = player.y-npc.y
var pitch = Math.atan(dy/distance)*180/Math.PI
return pitch}

function GetCoordRotation(npcX,npcZ,playerX,playerZ){
var dx = npcX-playerX;
var dz = playerZ-npcZ;
if(dz>=0){
var angle = (Math.atan(dx/dz)*180/Math.PI);
if(angle < 0){
angle = 360+angle;}}
if(dz<0){
dz = -dz;
var angle = 180-(Math.atan(dx/dz)*180/Math.PI);}
return angle;}

function RandSign(){
var s = Math.floor(Math.random()*2)
if(s==0)s=-1;
return s;}

function drawFwoomLine(entity,pos2,resolution,sleepTime,ID){
var Thread = Java.type("java.lang.Thread");
var MyThread = Java.extend(Thread,{
run: function(){
var pos1 = entity.getPos()
var drawAmount = Math.ceil(entity.getPos().distanceTo(pos2))*resolution;
var subs = pos2.subtract(entity.getPos());
for(var i = 0; i < drawAmount; i++){
var x = (pos1.getX() + subs.getX()*(i/drawAmount)+0.5).toFixed(4);
var y = (pos1.getY() + subs.getY()*(i/drawAmount)+0.5).toFixed(4);
var z = (pos1.getZ() + subs.getZ()*(i/drawAmount)+0.5).toFixed(4);
entity.setPosition(x,y,z)
var CurrentPos = entity.world.getBlock(x,y,z).getPos()
//EveryLoop Function here
if(ID==777){}
Thread.sleep(sleepTime);}
//After Loop Function here
if(ID==1){
Thread.sleep(200)
var npc = entity
npc.world.spawnParticle("largesmoke",npc.x,npc.y+1,npc.z,1,1,1,0.5,150)
npc.world.playSoundAt(npc.getPos(),"minecraft:entity.generic.explode",1,0.8)
}
}});
var th = new MyThread();
th.start();}

function ArcMe(entity,dr1,dr2,dp1,dp2,dist,shiftV,shiftH,Resolution,Speed,Particle,Count,dx,dy,dz,dv,Dmg,Range,ID,Sound,Pitch){
var Thread = Java.type("java.lang.Thread");
var RomaThread = Java.extend(Thread,{
run: function(){
if(!dx){dx=0};if(!dy){dy=0};if(!dz){dz=0};if(!dv){dv=0}
if(!Dmg){Dmg=0};if(!Range){Range=0};if(!ID){ID=0}

if(Count < 0){
Count = Math.abs(Count)
var Mode = 0}
else{var Mode = 1}
var P1 = FrontVectors(entity,dr1,dp1,dist,Mode);
var P2 = FrontVectors(entity,dr2,dp2,dist,Mode);
var C = Math.acos((P1[0]*P2[0]+P1[1]*P2[1]+P1[2]*P2[2])/(dist*dist))
var xPoints = []
var yPoints = []
var zPoints = []
for(var c = 0;c<=Resolution;++c){
var a = c*C/Resolution;
var x = entity.x+(Math.sin(C-a)*P1[0]+Math.sin(a)*P2[0])/Math.sin(C);
var y = entity.y+(Math.sin(C-a)*P1[1]+Math.sin(a)*P2[1])/Math.sin(C);
var z = entity.z+(Math.sin(C-a)*P1[2]+Math.sin(a)*P2[2])/Math.sin(C);
if(shiftH != 0){
var d = FrontVectors(entity,0,0,shiftH,1);
if(Mode == 0)var d = FrontVectors(entity,(dr1+dr2)/2,0,shiftH,0);
x = x + d[0];
z = z + d[2];}
y = y+shiftV;
xPoints.push(x)
yPoints.push(y)
zPoints.push(z)}
//SpawnParticles
for(var i = 0;i<xPoints.length;++i){
if(Sound && i == 10)entity.world.playSoundAt(entity.world.getBlock(xPoints[i],yPoints[i],zPoints[i]).getPos(),Sound,2,Pitch)
entity.world.spawnParticle(Particle,xPoints[i],yPoints[i],zPoints[i],dx,dy,dz,dv,Count)
if(Dmg != 0){
var targs = entity.world.getNearbyEntities(xPoints[i],yPoints[i],zPoints[i],Range+1,5)
for(var t = 0; t<targs.length;++t){
if(targs[t]!=entity && TrueDistanceCoord(xPoints[i],yPoints[i],zPoints[i],targs[t].getX(),targs[t].getY()+1,targs[t].getZ()) <= Range){
//Extra Damage Effects Here
if(ID==777){}
DoActualDamage(entity,Dmg,targs[t],false)}}}
Thread.sleep(Speed)}
}});
var H = new RomaThread();
H.start();}

function TrueDistanceEntity(Entity1,Entity2){
var dx = Entity1.getX() - Entity2.getX()
var dy = Entity1.getY() - Entity2.getY()
var dz = Entity1.getZ() - Entity2.getZ()
var R = Math.pow((dx*dx+dy*dy+dz*dz),0.5)
return R;}

function TrueDistanceCoord(x1,y1,z1,x2,y2,z2){
var dx = x1 - x2
var dy = y1 - y2
var dz = z1 - z2
var R = Math.pow((dx*dx+dy*dy+dz*dz),0.5)
return R;}


//Shielding Info
var shieldUp = {
actions:{action_1:{left_arm:{id:1,time:0.3,a:[0,0,0],end:[121,228,162],}},},
stats:{Movement:-1,knockbackResistance:false,damageModifier:1,},
deets:{AttackAfterAction:[10],windUpSound:"",specialFunctionID:0,}}
var shieldDown = {
actions:{action_2:{left_arm:{id:1,time:0.3,a:[0,0,0],end:[180,180,180],}},},
stats:{Movement:-1,knockbackResistance:false,damageModifier:1,},
deets:{AttackAfterAction:[10],windUpSound:"",specialFunctionID:0,}}
var shieldBreak = {
actions:{action_1:{head:{id:0,time:0.15,end:[149,180,180],},left_arm:{id:1,time:0.15,end:[86,88,180],},right_arm:{id:2,time:0.15,end:[180,240,197],},left_leg:{id:4,time:0.15,end:[134,149,180],},},action_2:{head:{id:0,time:0.5,end:[135,180,180],},},},
stats:{Movement:0,knockbackResistance:false,damageModifier:1.5,},
deets:{AttackAfterAction:[10],windUpSound:"",specialFunctionID:0,}}
var shieldBreakStanding = {
actions:{action_1:{head:{id:0,time:0.15,end:[149,180,180],},left_arm:{id:1,time:0.15,end:[86,88,180],},right_arm:{id:2,time:0.15,end:[180,240,197],},left_leg:{id:4,time:0.15,end:[134,149,180],},},action_2:{head:{id:0,time:0.5,end:[135,180,180],},},
action_Standing:{head:{id:0,time:.6,end:[180,180,180],},left_arm:{id:1,time:.6,end:[180,180,180],},right_arm:{id:2,time:.6,end:[180,180,180],},left_leg:{id:4,time:.6,end:[180,180,180],},}},
usepart:{head:true,body:false,left_leg:true,right_leg:false,left_arm:true},
stats:{Movement:0,knockbackResistance:true,damageModifier:1.5,},
deets:{AttackAfterAction:[10],windUpSound:"",specialFunctionID:0,}}

function projectileTick(t){
var info = t.projectile.getTempdata().get("EntityShotInfo");
t.projectile.world.spawnParticle(info.trailParticles, t.projectile.getX() , t.projectile.getY(), t.projectile.getZ(), 0,0,0,0.01, 10);}

function projectileImpact(t){
var info = t.projectile.getTempdata().get("EntityShotInfo");
//type 1 is block, type 0 is entity.
if(t.type == 0){
var target = t.projectile.world.getClosestEntity(t.projectile.getPos(),5,1)
if(target!=null){
t.projectile.world.playSoundAt(t.projectile.getPos(),info.hitSound,3,1);
t.projectile.world.spawnParticle(info.hitParticles, t.projectile.getX() , t.projectile.getY(), t.projectile.getZ(), 0,0,0,0.05, 10);
if(info.ingites != 0){
target.setBurning(info.ignites)}
if(info.effectID != 0){
target.addPotionEffect(info.effectID,info.effectDuration,info.effectPotency,true)}
//Special Effect Stuff Here for when hitting a player!
if(info.specialFunctionID == 777){}
if(info.specialFunctionID == 777){}
}}
if(t.type == 1){
var hitLocation = t.projectile.getPos()
t.projectile.world.playSoundAt(t.projectile.getPos(),info.groudSound,1,1);
t.projectile.world.spawnParticle(info.groundParticles, t.projectile.getX() , t.projectile.getY(), t.projectile.getZ(), 0,0,0,0.05, 20);
//Special Effect Stuff Here for when hitting a block!
if(info.specialFunctionID == 777){}
if(info.specialFunctionID == 777){}
}}

function SHOOT(npc, info){
var num = npc.getTempdata().get("shotNum");
//set stats
if(info.dmg[num] > 0){
npc.stats.ranged.setStrength(info.dmg[num])
npc.stats.ranged.setSpeed(info.velocity[num])
npc.stats.ranged.setSize(info.size)
npc.stats.ranged.setKnockback(info.punch[num])
npc.stats.ranged.setRender3D(info.Render3D)
npc.stats.ranged.setHasGravity(info.hasGravity)
npc.stats.ranged.setAccelerate(info.accelerates)
npc.stats.ranged.setAccuracy(info.accuracy[num])
//Shoot projectile(s)
var item = npc.world.createItem(info.itemName, 0, 1);
npc.world.playSoundAt(npc.getPos(),info.fireSound,10,1);
npc.world.spawnParticle(info.fireParticles, npc.x , npc.y+1, npc.z, 0,0,0,0.05, 20);
for(var i = 0;i<info.shotCount[num];++i){
var targ = npc.getAttackTarget();
if(targ != null){
var p = npc.shootItem(targ, item, info.accuracy[num]);
try{p.enableEvents()}
catch(e){}
p.getTempdata().put("npc",npc);
p.getTempdata().put("EntityShotInfo",info);}}}
//Put start of shot special effect stuff here!
if(info.specialFunctionID == 777){}
if(info.specialFunctionID == 777){}
npc.getTempdata().put("shotNum",num+1);}

function DAMAGE(npc, info, targ){
var atkNum = npc.getTempdata().get("atkNum");
if(info.dmg[atkNum] != 0){
npc.world.playSoundAt(npc.getPos(),info.attackSound,5,1);
var victims = []
if(info.AOEAttackNums[atkNum]==1){
victims = npc.world.getNearbyEntities(npc.getPos(),Math.ceil(info.range[atkNum]),5)}
else if(targ != null)victims = [targ]
for(var i = 0; i < victims.length; i++){
if(victims[i] != npc){
if(info.AttackCone[atkNum] != 0){
if(!CheckFOV(npc,victims[i],info.AttackCone[atkNum]))continue;}
if(TrueDistanceEntity(npc,victims[i]) > info.range[atkNum])continue;
npc.world.playSoundAt(npc.getPos(),info.hitSound,1,1)
DoActualDamage(npc,info.dmg[atkNum],victims[i],info.Blockable[atkNum])
if(info.ignites > 0) victims[i].setBurning(info.ignites);
victims[i].addPotionEffect(info.effectID,info.effectDuration,info.effectPotency,false)
if(info.KnockbackAfterAtkNums[atkNum]>0 || info.KBverticalAfterAtkNums[atkNum]>0){
DoKnockback(npc,victims[i],info.KnockbackAfterAtkNums[atkNum],info.KBverticalAfterAtkNums[atkNum])}}}}
//Special effect stuff here! atkNum is indexed!
if(info.specialFunctionID == 777){}
if(info.specialFunctionID == 777){}
if(info.specialFunctionID == 777){}
npc.getTempdata().put("atkNum",atkNum+1)}


//#########################################################
//=========================================================
//======================ACTION CONGIG======================
//=========================================================
//#########################################################


//ATTACK TEMPLATE NORMAL ====================================
var VerticalCuts = {
Type:1,
//Animations --- REMOVE ALL LEFT ARM SECTIONS IF SHIELDING
actions:{
action_1:{head:{id:0,time:0.2,end:[192,187,180],},left_arm:{id:1,time:0.2,end:[126,195,149],},right_arm:{id:2,time:0.2,end:[268,180,220],},},
action_2:{head:{id:0,time:0.15,end:[164,172,180],},left_arm:{id:1,time:0.15,end:[174,154,131],},right_arm:{id:2,time:0.15,end:[60,177,220],},},
action_3:{head:{id:0,time:0.3,end:[172,180,180],},left_arm:{id:1,time:0.2,end:[164,162,139],},right_arm:{id:2,time:0.2,end:[63,187,200],},},
action_4:{head:{id:0,time:0.1,end:[190,180,180],},left_arm:{id:1,time:0.1,end:[207,185,131],},right_arm:{id:2,time:0.1,end:[256,177,220],},},
action_Standing:{head:{id:0,time:0.4,end:[180,180,180],},left_arm:{id:1,time:0.4,end:[180,180,180],},right_arm:{id:2,time:0.4,end:[180,180,180],},}
//action_Standing:{head:{id:0,time:.4,end:[180,180,180],},left_arm:{id:1,time:.4,end:[180,180,180],},right_arm:{id:2,time:.4,end:[180,180,180],},body:{id:3,time:.4,end:[180,180,180],},left_leg:{id:4,time:.4,end:[180,180,180],},right_leg:{id:5,time:.4,end:[180,180,180],},}
},
//Part Usage --- FOR SHIELDING HAVE LEFT ARM ALWAYS TRUE
usepart:{head:false,body:false,left_leg:false,right_leg:false,left_arm:true},
stats:{
Movement:-1, //Movement of the NPC during animation. -1 for no change
knockbackResistance:false, //If npc will be immune to knockback during animation
damageModifier:1, //incoming dmg is  multiplied by this value during animation
},
//Attack Info
deets:{
AttackAfterAction:[2,4], //The action(s) after which the damage is dealt
KnockbackAfterAtkNums:[0.5,1], //The KB intensity after each attack
KBverticalAfterAtkNums:[0.2,0.2], //The Vertical KB after each attack
dmg:[4,4], //The Damage of each attack
AOEAttackNums:[0,0], //Which ATTACKS are aoe. 0 for false, 1 for true
AttackCone:[0,0], //0-360. Set 0 to ignore attack angles
Delay:[0,0], //Number of MC ticks after the action dmg/kb are applied
range:[3,3],
Blockable:[1,1], //1 for blockable, 0 for unblockable
LungeAfterAction:[0], //The action(s) after which the npc lunges
lungeIntensity:[0], //Intensity of npc lunge towards enemy
effectID:0,effectDuration:0,effectPotency:0,ignites:0, //time on fire
windUpSound:"",attackSound:"dsurround:sword.swing",hitSound:"",
specialFunctionID:1, //used for adding scripted effects. Set 0 for none.
}}
//ATTACK TEMPLATE NORMAL ====================================

//ATTACK TEMPLATE NORMAL ====================================
var XCuts = {
Type:1,
//Animations --- REMOVE ALL LEFT ARM SECTIONS IF SHIELDING
actions:{
action_1:{head:{id:0,time:0.2,end:[157,202,182],},left_arm:{id:1,time:0.2,end:[121,174,164],},right_arm:{id:2,time:0.2,end:[43,225,131],},},
action_2:{head:{id:0,time:0.1,end:[190,174,182],},left_arm:{id:1,time:0.1,end:[182,174,164],},right_arm:{id:2,time:0.15,end:[233,167,139],},},
action_3:{head:{id:0,time:0.3,end:[154,174,167],},left_arm:{id:1,time:0.2,end:[182,147,129],},right_arm:{id:2,time:0.2,end:[48,164,243],},},
action_4:{head:{id:0,time:0.1,end:[205,174,180],},left_arm:{id:1,time:0.1,end:[202,172,157],},right_arm:{id:2,time:0.15,end:[250,164,243],},},
action_5:{head:{id:0,time:0.2,end:[200,180,180],},},
action_Standing:{head:{id:0,time:0.4,end:[180,180,180],},left_arm:{id:1,time:0.4,end:[180,180,180],},right_arm:{id:2,time:0.4,end:[180,180,180],},}
//action_Standing:{head:{id:0,time:.4,end:[180,180,180],},left_arm:{id:1,time:.4,end:[180,180,180],},right_arm:{id:2,time:.4,end:[180,180,180],},body:{id:3,time:.4,end:[180,180,180],},left_leg:{id:4,time:.4,end:[180,180,180],},right_leg:{id:5,time:.4,end:[180,180,180],},}
},
//Part Usage --- FOR SHIELDING HAVE LEFT ARM ALWAYS TRUE
usepart:{head:false,body:false,left_leg:false,right_leg:false,left_arm:true},
stats:{
Movement:-1, //Movement of the NPC during animation. -1 for no change
knockbackResistance:false, //If npc will be immune to knockback during animation
damageModifier:1, //incoming dmg is  multiplied by this value during animation
},
//Attack Info
deets:{
AttackAfterAction:[2,4], //The action(s) after which the damage is dealt
KnockbackAfterAtkNums:[0.5,1], //The KB intensity after each attack
KBverticalAfterAtkNums:[0.2,0.2], //The Vertical KB after each attack
dmg:[4,4], //The Damage of each attack
AOEAttackNums:[0,0], //Which ATTACKS are aoe. 0 for false, 1 for true
AttackCone:[0,0], //0-360. Set 0 to ignore attack angles
Delay:[0,0], //Number of MC ticks after the action dmg/kb are applied
range:[3,3],
Blockable:[1,1], //1 for blockable, 0 for unblockable
LungeAfterAction:[0], //The action(s) after which the npc lunges
lungeIntensity:[0], //Intensity of npc lunge towards enemy
effectID:0,effectDuration:0,effectPotency:0,ignites:0, //time on fire
windUpSound:"",attackSound:"dsurround:sword.swing",hitSound:"",
specialFunctionID:2, //used for adding scripted effects. Set 0 for none.
}}
//ATTACK TEMPLATE NORMAL ====================================

//ATTACK TEMPLATE NORMAL ====================================
var JumpSlam = {
Type:1,
//Animations --- REMOVE ALL LEFT ARM SECTIONS IF SHIELDING
actions:{
action_1:{head:{id:0,time:0.3,end:[157,187,180],},left_arm:{id:1,time:0.3,end:[103,167,114],},right_arm:{id:2,time:0.3,end:[167,233,304],},left_leg:{id:4,time:0.3,end:[180,180,167],},right_leg:{id:5,time:0.3,end:[180,180,195],},},
action_2:{head:{id:0,time:1,end:[155,187,180],},},
action_3:{head:{id:0,time:0.1,end:[212,187,180],},left_arm:{id:1,time:0.1,end:[215,202,131],},right_arm:{id:2,time:0.1,end:[197,152,197],},left_leg:{id:4,time:0.1,end:[164,180,167],},right_leg:{id:5,time:0.1,end:[200,180,195],},},
action_4:{head:{id:0,time:0.5,end:[177,187,180],},},
action_Standing:{head:{id:0,time:.4,end:[180,180,180],},left_arm:{id:1,time:.4,end:[180,180,180],},right_arm:{id:2,time:.4,end:[180,180,180],},body:{id:3,time:.4,end:[180,180,180],},left_leg:{id:4,time:.4,end:[180,180,180],},right_leg:{id:5,time:.4,end:[180,180,180],},}
},
//Part Usage --- FOR SHIELDING HAVE LEFT ARM ALWAYS TRUE
usepart:{head:false,body:false,left_leg:false,right_leg:false,left_arm:true},
stats:{
Movement:0, //Movement of the NPC during animation. -1 for no change
knockbackResistance:false, //If npc will be immune to knockback during animation
damageModifier:1, //incoming dmg is  multiplied by this value during animation
},
//Attack Info
deets:{
AttackAfterAction:[3], //The action(s) after which the damage is dealt
KnockbackAfterAtkNums:[2], //The KB intensity after each attack
KBverticalAfterAtkNums:[0.3], //The Vertical KB after each attack
dmg:[8], //The Damage of each attack
AOEAttackNums:[1], //Which ATTACKS are aoe. 0 for false, 1 for true
AttackCone:[0], //0-360. Set 0 to ignore attack angles
Delay:[5], //Number of MC ticks after the action dmg/kb are applied
range:[5],
Blockable:[0], //1 for blockable, 0 for unblockable
LungeAfterAction:[0], //The action(s) after which the npc lunges
lungeIntensity:[0], //Intensity of npc lunge towards enemy
effectID:0,effectDuration:0,effectPotency:0,ignites:0, //time on fire
windUpSound:"",attackSound:"",hitSound:"",
specialFunctionID:3, //used for adding scripted effects. Set 0 for none.
}}
//ATTACK TEMPLATE NORMAL ====================================

//ATTACK TEMPLATE NORMAL ====================================
var DashAttack = {
Type:1,
//Animations --- REMOVE ALL LEFT ARM SECTIONS IF SHIELDING
actions:{
action_1:{head:{id:0,time:0.3,end:[177,187,180],},left_arm:{id:1,time:0.3,end:[139,202,131],},right_arm:{id:2,time:0.3,end:[63,185,197],},left_leg:{id:4,time:0.3,end:[167,180,174],},right_leg:{id:5,time:0.3,end:[190,180,185],},},
action_2:{head:{id:0,time:0.4,end:[185,195,180],},left_arm:{id:1,time:0.4,end:[131,202,131],},right_arm:{id:2,time:0.4,end:[261,210,250],},left_leg:{id:4,time:0.4,end:[167,180,174],},right_leg:{id:5,time:0.4,end:[190,180,185],},},
action_3:{head:{id:0,time:0.2,end:[183,195,180],},},
action_4:{head:{id:0,time:0.2,end:[177,190,180],},left_arm:{id:1,time:0.1,end:[223,202,131],},right_arm:{id:2,time:0.1,end:[136,177,202],},left_leg:{id:4,time:0.1,end:[134,180,174],},right_leg:{id:5,time:0.1,end:[210,180,185],},},
action_5:{head:{id:0,time:0.1,end:[175,190,180],},},
action_Standing:{head:{id:0,time:.4,end:[180,180,180],},left_arm:{id:1,time:.4,end:[180,180,180],},right_arm:{id:2,time:.4,end:[180,180,180],},body:{id:3,time:.4,end:[180,180,180],},left_leg:{id:4,time:.4,end:[180,180,180],},right_leg:{id:5,time:.4,end:[180,180,180],},}
},
//Part Usage --- FOR SHIELDING HAVE LEFT ARM ALWAYS TRUE
usepart:{head:false,body:false,left_leg:false,right_leg:false,left_arm:true},
stats:{
Movement:0, //Movement of the NPC during animation. -1 for no change
knockbackResistance:false, //If npc will be immune to knockback during animation
damageModifier:1, //incoming dmg is  multiplied by this value during animation
},
//Attack Info
deets:{
AttackAfterAction:[5], //The action(s) after which the damage is dealt
KnockbackAfterAtkNums:[1], //The KB intensity after each attack
KBverticalAfterAtkNums:[0.2], //The Vertical KB after each attack
dmg:[6], //The Damage of each attack
AOEAttackNums:[0], //Which ATTACKS are aoe. 0 for false, 1 for true
AttackCone:[0], //0-360. Set 0 to ignore attack angles
Delay:[0], //Number of MC ticks after the action dmg/kb are applied
range:[3],
Blockable:[1], //1 for blockable, 0 for unblockable
LungeAfterAction:[3], //The action(s) after which the npc lunges
lungeIntensity:[-0], //Intensity of npc lunge towards enemy
effectID:0,effectDuration:0,effectPotency:0,ignites:0, //time on fire
windUpSound:"",attackSound:"dsurround:sword.swing",hitSound:"",
specialFunctionID:0, //used for adding scripted effects. Set 0 for none.
}}
//ATTACK TEMPLATE NORMAL ====================================




//end