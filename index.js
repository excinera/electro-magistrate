// i'm so fucking sorry
// x. 2k18 02 16

// i'm even more sorry but i added the tipline function so i'm not
// x with lotus cobra
// 2k18 07 10

// it's currently on 1.0 and running fine on the server
// however there are a couple glitches and the code looks like ass
// i'm going to go through and take some stuff out
// and clean up the indents so it can be put on github
// x. 2k18 12 11

// added some more features and made it actually handle errors instead of just throwing exceptions
// x. 2k19 01 02

const datFolder = __dirname + '/data/';
const logFolder = datFolder + 'logs/';
const deetsFolder = datFolder + 'servers/'
const dataFolder = datFolder + 'config/';

const reactconfig = datFolder + 'react-config.json';
const globalconfig = datFolder + 'global-config.json';
const bridgeconfig = datFolder + 'bridge-config.json';
const badlistpath = datFolder + 'badlist.json';
const lockfilepath = __dirname + '/lock';

const versionid = "Electro-Magistrate v1.0";
const starttime = new Date().getTime();
const cloaklength = 18;
const film = "on";
const filmPostInterval = 10;
var filmOngoing = "0";
var loveFletcher = 0;

const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const https = require('https');
const disco = require('discord.js');
const now = require('moment');
const EventEmitter = require('events');

// class buffEmitter extends EventEmitter {}
// const buffemitter = new buffEmitter();
// const sqlite3 = require('sqlite3').verbose();

var v = (process.argv.indexOf('v') + process.argv.indexOf('-v') + 2);
var h = (process.argv.indexOf('h') + process.argv.indexOf('-h') + 2);
var dbg = (process.argv.indexOf('d') + process.argv.indexOf('-d') + 2);
var m = (process.argv.indexOf('m') + process.argv.indexOf('-m') + 2);
var w = (process.argv.indexOf('w') + process.argv.indexOf('-w') + 2);
var u = (process.argv.indexOf('u') + process.argv.indexOf('-u') + 2);
// Process command-line arguments into variables.

v = v ? 1 : 0;
dbg = dbg ? 1 : 0;
h = h ? 1 : 0;
m = m ? 1 : 0;
w = w ? 1 : 0;
u = u ? 1 : 0;

cbotlog(process.argv);

if (h) {
 console.log(versionid + " / x. cinera 2k18");
 console.log("Usage: node " + path.basename(__filename) + " [-d] [-h] [-m] [-v] [-w]")
 console.log("  -d, debug      Run in debug mode")
 console.log("  -h, help       Display help menu and exit")
 console.log("  -m, multiple   Run without aborting existing")
 console.log("                 already-running process detected")
 console.log("  -v, verbose    Run with verbose logging enabled")
 console.log("  -u, ultraverb  Log every single packet received")
 console.log("  -w, weak       Omit writing to lockfile so that")
 console.log("                 process will be killed by cronjob")
 process.exit(0);
 } // If help flag is set, print command flags and exit.

try { fs.mkdirSync(datFolder) } catch(e) {}

// Try to load configuration data. If it doesn't exist, create a blank template file.
try { configz = JSON.parse(fs.readFileSync(globalconfig))} catch (e) {
 baseconfig = {
  "bridges":"off",
  "debate":"off",
  "hottakes":"off",
  "bigboss":{
   "id":"x",
   "username":"x",
   "dispname":"x",
   "note":"x"},
  "bigserver":{
   "id":"x",
   "dispname":"x",
   "note":"x"},
  "bigchannel":{
   "id":"x",
   "dispname":"x",
   "note":"x"},
  "bigchamber":{
   "id":"x",
   "dispname":"x",
   "note":"x"},
  "filmchannel":{
    "bosses":[],
    "id":"000000000000000000",
    "dispname":"x",
    "note":"x"},
  "lazylog":"off",
  "lockfiletimeout":"60",
  "lockfilewrite":"45"
  };
 fs.appendFileSync(globalconfig, JSON.stringify(baseconfig, null, ' '));
 cbotlog("ERROR: No configuration file detected. Creating one now.");
 configz = baseconfig;
 } // Try to read file, create if absent.

var lazeLog = 0;
if (configz['lazylog'] === "on") {lazeLog = 1}

if (!m) {
const lockfiletimeout = configz.lockfiletimeout; // Number of seconds the program should wait after the last heartbeat to declare old instance dead
 if (os.platform() == "win32") {
  console.log("ERROR: You appear to be using Micro$haft Winblow$! :^(");
  console.log("       Killing currently-running processes won't work.");
  }
 try {
  seconds = ((new Date().getTime() - fs.statSync(lockfilepath).mtime) / 1000);
  lock = JSON.parse(fs.readFileSync(lockfilepath));
  } catch(e) {
   var seconds = 8675309;
   var lock = JSON.parse(-8675309)
   fs.writeFileSync(lockfilepath, JSON.stringify(process.pid));
   } // closes "try" block that either opens/scrapes or creates the lockfile. 
 if(seconds < lockfiletimeout) {
  console.log("ERROR: " + path.basename(__filename) + " (PID " + lock + ") seems to be already running, as of");
  console.log("       " + seconds.toFixed(1) + "s ago. It will be pronounced dead after " + lockfiletimeout + "s (" + (lockfiletimeout - seconds).toFixed(1) + "s left)");
  process.exit(1); // Die with failure code
  } // Kill process if the lock file has been updated in the last thirty seconds prior to Maggie being started.
 else {
  if ((os.platform() != "win32") && ((os.uptime() - seconds) > 0)){
   try {
    process.kill(lock, 'SIGKILL');
    console.log("Killed ghost of previous instance.");
    } catch(e) {
     console.log("No previous instances terminated.");
     } // closes catch for trying to kill
   } // if you aren't running winblow$
  } // if seconds are above the timeout
 } // goes through lockfile check unless, for some reason, you've set the -m flag

if (!w) {
 setInterval(function() {
  fs.writeFileSync(lockfilepath, JSON.stringify(process.pid));
  }, (1000 * configz['lockfilewrite']));
 // As long as the program's running, it should be writing to the LOCKFILE every INTERVAL.
 } // If no w: if weakmode is enabled it shouldn't write to the lockfile.

now.relativeTimeThreshold('ss', 1);
now.relativeTimeThreshold('s', 360);
now.relativeTimeThreshold('m', 360);
now.relativeTimeThreshold('h', 48);
now.relativeTimeThreshold('d', 300);
// Change thresholds for Moment to give more accurate times

console.log(date() + " || " + versionid + ' || INITIALIZING');
console.log("lock: " + lock + ", pid: " + process.pid);
fs.writeFileSync(lockfilepath, JSON.stringify(process.pid));

try { bridged = JSON.parse(fs.readFileSync(logFolder + "bridged.log"))} catch (e) {
 bridged = {"1":"1"};
 fs.writeFileSync(logFolder + "bridged.log", JSON.stringify(bridged));
 console.log("ERROR: No bridge logs. Creating file.");
 } // Try to read file, create if absent.

var bridging = {"1":"1"};
var baleeted = ["1"];
var examined = ["1"];
var flick = now.utc();
var flickrun = [1, 55, 55];
var flickname = ["Battletoads"];
var timeoutz = [];
var interCount = 0;
var lastInter = 0;

// Initialize deets folder and read a list of files from it
// An array that will be used to store all of this stuff so that it doesn't get garbage collected, I guess.
var allDiscos = [];
var allDeets = [];
var allBridges = [];
v && console.log("GLOBAL CONFIG LOADED");
try { fs.mkdirSync(logFolder) } catch(e) {}
try { fs.mkdirSync(deetsFolder) } catch(e) {}
try { fs.mkdirSync(dataFolder) } catch(e) {}
try { badlist = JSON.parse(fs.readFileSync(badlistpath))} catch (e) {
 badlist = ['000000000000000000'];
 fs.appendFileSync(badlistpath, JSON.stringify(badlist, null, ' '));
 cbotlog("ERROR: No badlist detected. Creating empty file.");
 } // Try to access badlist; create if absent.

v && cbotlog("LOG DIR: /" + configz['logdir'] + "/ || CONF DIR: /" + configz['deetsdir'] + "/");
var deezDeets = fs.readdirSync(deetsFolder);
console.log('CONF FILES: ' + deezDeets);
(dbg || v) && cbotlog("STARTING WITH " + (dbg ? "DEBUG " : "") + ((dbg * v) ? "AND " : "") + (v ? "VERBOSE " : "") + "MODE ENABLED");
(w || m) && cbotlog("(" + (m ? "MULTI " : "") + ((m * w) ? "AND " : "") + (w ? "WEAK " : "") + "PROCESS CONTROLS)");

var bridgefigz = 0;




try { bridgefigz = JSON.parse(fs.readFileSync(bridgeconfig))} catch (e) {}
if ((configz['bridges'] === "on") && bridgefigz) {
 cbotlog("BRIDGING ENABLED (" + Object.keys(bridgefigz).length + ")");
 // This is how you return the number of objects in a JSON object, I guess. 
 } // closes bridge setup
else { cbotlog("BRIDGING DISABLED"); } // closes else for the bridge setup
bridgeBuffer = {
 'content':'!',
 'usrname':'!',
 'user_id':'!',
 'dest_ch':'!',
 'dest_sv':'!',
 'attache':{},
 }; // closes bridgeBuffer default JSON


setInterval(function() {
  console.log(date());}, 30000);

var hts = "off";

if (configz['hottakes'] === 'on') {
 hts = "on";
 try { professions = JSON.parse(fs.readFileSync(datFolder + "goofy/professions.json"))} catch (e) {hts = "off";};
 try { oppressed = JSON.parse(fs.readFileSync(datFolder + "goofy/oppressed.json"))} catch (e) {hts = "off";};
 try { oppression = JSON.parse(fs.readFileSync(datFolder + "goofy/oppression.json"))} catch (e) {hts = "off";};
 }

try {
 goodmorning = JSON.parse(fs.readFileSync(datFolder + "goodmorning.json"));
 var wakeup = "on";
 } catch (e) {
  var wakeup = "off";}


// this is where the magic happens. outer control loop iterated over all configs
for (var i = 0; i < deezDeets.length; i++){
 // Initialize Discord connection
 const disClient = new disco.Client();
 // Connect to Discord API using credentials taken from the i-th file in the directory
 const disFile = JSON.parse(fs.readFileSync(deetsFolder + deezDeets[i]));   
 const authDeets  = disFile['token'];
 var disBridges = {"nullenberg":"nullenborg"};
 try { disClient.login(authDeets)
  .catch(console.error);
  }
  catch (e) {
   cbotlog('Authentication failure on ' + disFile['appellation']);
   }
 // If the global and local bridge flags are set...
 if (configz['bridges'] === "on") {
  if (bridgefigz[disFile['server_id']]) {
   disFile['bridges'] = bridgefigz[disFile['server_id']];
   console.log('Attempting connection (B:' + Object.keys(bridgefigz[disFile['server_id']]).length + ') to "' + disFile['appellation'] + '" (' + deetsFolder + deezDeets[i] + ')');
   //console.log(disBridges);
   } // closes "if there's any bridges for this server"'
  else {
   console.log('Attempting connection (B:0) to "' + disFile['appellation'] + '" (' + deetsFolder + deezDeets[i] + ')');
   //console.log(disBridges);
   } // closes first else for if bridging is enabled but no bridges exist
  } // closes "if bridges are enabled globally + per server"
  else {
   console.log('Attempting connection (B:X) to "' + disFile['appellation'] + '" (' + deetsFolder + deezDeets[i] + ')');
   //console.log(disBridges);
   } // closes else for if they're disabled
  // Cram the client object into allDiscos so that it can exist outside of this scope
 allDiscos.push(disClient);
 allDeets.push(disFile);

disClient.on('error', (errorEvent) => {
  cbotlog(errorEvent.message);
})

 // this is the startup routine that iterates over every client when it connects
 disClient.on('ready', () => {
  disServer = disClient.guilds.get(disFile['server_id']);
  // creates an object, local to this scope, of the single guild named in the specific config file
  // multiple config files can use the same authentication tokens.
  // config files may only contain deets for one server, so each disFile only uses one server
  var supMsg = "!";
  if (wakeup === "on") {
   if (!disClient.channels.get(goodmorning[1])) return;
   disClient.channels.get(goodmorning[1]).send(goodmorning[2])
   .then(message => {
   console.log("Wew lad");
   supMsg = message;
   console.log("Wew lad");
   })
   .catch(console.log("asdf"));
   }

  disFile['client_id'] = disClient.user.id;
  disFile['client_name'] = disClient.user.username;
  if (disServer) {
   disFile['server_name'] = disServer.name;
   }
  else {
   cbotlog("Error: Cannot fetch server for " + disFile['server_id'] + " (" + disFile['appellation'] + ")");
   }
  cbotlog("Connected to \"" + disFile['appellation'] + "\": " + disFile['server_name'] + " (" + disFile['server_id'] + ") as " + disFile['client_name'] + " (" + disFile['client_id'] + ")");
  
  try { fs.mkdirSync(dataFolder + disFile['server_id']) } catch(e) {}

  // const secrets = JSON.parse(fs.readFileSync(dataFolder + disFile['server_id'] + "/secrets.json"));
  // const sterces = reverseSecrets(secrets);
  console.log("Server configuration loaded for " + disFile['appellation']);
  try {
   disFile['introed'] = JSON.parse(fs.readFileSync(dataFolder + disFile['server_id'] + "/introduced.json"));
   console.log("Introduced users list loaded.");
   setTimeout(function() {if (supMsg != "!") supMsg.react('🤝');}, 5000);
   // 🤝 U+1F91D HANDSHAKE, decimal: 129309, HTML: &#129309;
   }
   catch (e) {
    console.log("No introed configuration found. Creating empty file.");
    disFile['introed'] = ["0","0"];
    fs.writeFileSync(dataFolder + disFile['server_id'] + "/introduced.json", JSON.stringify(disFile['introed'], null, ' '));
    } 
  try {
   disFile['reaccs'] = JSON.parse(fs.readFileSync(dataFolder + disFile['server_id'] + "/reaccs.json"));
   console.log("React config loaded.");
   setTimeout(function() {if (supMsg != "!") supMsg.react('👀');}, 5250);
   //👀 U+1F440 EYES, decimal: 128064, HTML: &#128064;
   }
   catch (e) {
    console.log(e);
    console.log("No reaction configuration found. Creating empty file.");
    disFile['reaccs'] = {"a":"a"};
    fs.writeFileSync(dataFolder + disFile['server_id'] + "/reaccs.json", JSON.stringify(disFile['reaccs'], null, ' '));
    }
  try {
   disFile['roles'] = JSON.parse(fs.readFileSync(dataFolder + disFile['server_id'] + "/roles.json"));
   console.log("Role config loaded.");
   setTimeout(function() {if (supMsg != "!") supMsg.react('👥');}, 5500);
   //👥 U+1F465 BUSTS IN SILHOUETTE, decimal: 128101, HTML: &#128101;
   }
   catch (e) {
    console.log(e);
    console.log("No reaction configuration found. Creating empty file.");
    disFile['roles'] = {"a":"a"};
    fs.writeFileSync(dataFolder + disFile['server_id'] + "/roles.json", JSON.stringify(disFile['roles'], null, ' '));
    }


  setTimeout(function() {if (supMsg != "!" && disFile['anon'] === "on") supMsg.react('🕵');}, 5750);
  // SLEUTH OR SPY' (U+1F575)
  setTimeout(function() {if (supMsg != "!" && disFile['rot13'] === "on") supMsg.react('🕜');}, 6000);
  // UNICODE: 1F55C CLOCK FACE ONE-THIRTY 
  setTimeout(function() {if (supMsg != "!" && disFile['film'] === "on") supMsg.react('🎞');}, 6250);
  //🎞 U+1F39E FILM FRAMES, decimal: 127902, HTML: &#127902;
  setTimeout(function() {if (supMsg != "!" && disFile['bridges'] != "off") supMsg.react('🌉');}, 6500);
  // 	Bridge At Night U+1F309

  // 🌄 U+1F304 SUNRISE OVER MOUNTAINS, decimal: 127748, HTML: &#127748;
  setTimeout(function() {
  //logUpAJson(disFile, ["token", "register_on_guild", "introed"]);
  dbg && console.log(disFile['client_name']);
  dbg && logInAJson(disFile, 'bridges');
   if (supMsg != "!") {
    fs.unlink(datFolder + "goodmorning.json", (err) => {
     if (err) cbotlog(err);
     else supMsg.react('🌄');
     });
    }
   }, 7000);
  
  for(var ds in Object.keys(disFile['reaccs'])) {
   re = disFile['reaccs'];
   ki = Object.keys(re)[ds];
   if (ki === "a") return;
   if (re[ki]['kill'] === "yes") return;
   disClient.guilds.get(re[ki]['chat']).channels.get(re[ki]['chan']).fetchMessage(ki)
    .then (message => {
     // console.log(message.reactions.keys());
     for(var dd in message.reactions.keys()) {
      // console.log(message.reactions[dd]);
      }
     //console.log(message.reactions.find(x => x.Emoji.id === re[ki][')
     })
    .catch(console.error);
   // disClient.guilds.get(disFile.reaccs[ds].
   }
  }); // this closes out the startup routine

  // see: https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/coding-guides/raw-events.md
  // that's what this is adapted from
 disClient.on('raw', packet => {
  u && console.log(date());
  u && console.log(packet);
  if(packet.t == 'PRESENCE_UPDATE') return;
  if(packet.t === 'GUILD_MEMBER_UPDATE') {
   // console.log(packet);
   if (disFile['server_id'] === packet.d.guild_idbg && disFile['rolecatcher'] === "on") {
    // console.log(packet.d.user.id);
    disFile['roles'][packet.d.user.id] = packet.d.roles;
    try {
     fs.writeFileSync(dataFolder + disFile['server_id'] + "/roles.json", JSON.stringify(disFile['roles'], null, ' '));
     // console.log("Roles saved.");
     } catch (e) {console.log("Error: no roles json found.")}
    } // if rolecatcher's on and it's on the monitored server
   } // if it's a guild member update 

  if(packet.t === 'GUILD_MEMBER_REMOVE' && disFile['memberlog'] === "on") {
   memberlog("REM: " + packet.d.guild_id + " / " + packet.d.user.id + " (" + packet.d.user.username + "#" + packet.d.user.discriminator + ")");
   }
  
  if(packet.t === 'GUILD_MEMBER_ADD') {
   if (disFile['memberlog'] === "on") { memberlog("ADD: " + packet.d.guild_id + " / " + packet.d.user.id + " (" + packet.d.user.username + "#" + packet.d.user.discriminator + ")");}
 console.log(packet);
 // console.log(packet.d.user.id);
  if (disFile['roles'][packet.d.user.id]) {
   var newRoles = disFile['roles'][packet.d.user.id];
   //console.log(newRoles);
   // console.log(disClient.guilds.get(packet.d.guild_id).name);
   setTimeout(function() {
    for (var inc in newRoles) {
     //console.log(newRoles[inc]);
     disClient.guilds.get(packet.d.guild_id).members.get(packet.d.user.id).addRole(newRoles[inc])
     }
    }, 3000);
   } // if there's a roles entry for the user id
  } // if it's a guild member add

  // this will re-emit events for emoji add/remove and deletions on non-cached messages
  // basically it accounts for discord.js being stupid and not doing this
  if (configz.sec) {
   if(packet.t === 'VOICE_STATE_UPDATE' && packet.d.channel_id === configz.sec.orig) {
    disClient.guilds.get(packet.d.guild_id).members.get(packet.d.user_id).addRole(configz.sec.role)
    disClient.guilds.get(packet.d.guild_id).members.get(packet.d.user_id).setVoiceChannel(configz.sec.dest)
    //console.log("illuminated");
    }
   if(packet.t === 'VOICE_STATE_UPDATE' && packet.d.channel_id === null) {
    setTimeout(function() {
     // console.log(disClient.guilds.get(packet.d.guild_id).members.get(packet.d.user_id));
     disClient.guilds.get(packet.d.guild_id).members.get(packet.d.user_id).removeRole(configz.sec.role);
     //console.log("rming illuminatus");
     }, 1500);
    }
   }
  if(packet.t == 'MESSAGE_CREATE') {
   // Bridge config still exists here.
   }
  if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE', 'MESSAGE_DELETE', 'MESSAGE_UPDATE', 'TYPING_START'].includes(packet.t)) return;
  // if it's anything that we don't care about, gtfo this loop
  if(packet.t == 'TYPING_START') {
   return;
   // not implemented yet
   }
  if(packet.t == 'MESSAGE_UPDATE') {
   var channel = disClient.channels.get(packet.d.channel_id);
   if (!packet.d.guild_id) return; // if it was a DM!
   if (channel.lastMessageID != packet.d.id) return;
   // This will only process a message if it's the most recent one in the channel.
   dbg && console.log("Last message edited!");
   examined.splice(examined.indexOf(packet.d.id), 1)
   disClient.emit('messageDelete', {
    'channel': disClient.channels.get(packet.d.channel_id),
    'deleted': 'true',
    'id': packet.d.id,
    'type': 'DEFAULT',
    'content': '0ldmessagebal33t',
    'author': 'kilgore_trout',
    'pinned': 'false',
    'tts': 'false',
    'nonce': 'n0tan0nce',
    'system': 'false',
    'embeds': [],
    'attachments': [],
    'createdTimestamp': 'false',
    'editedTimestamp': 'false',
    'reactions': 'false',
    'mentions': 'false',
    'webhookID': 'false',
    'hit': 'false'
    });
   setTimeout(emitMessage, 1000, disClient);
   function emitMessage (disClient) {
    disClient.emit('message', disClient.channels.get(packet.d.channel_id).messages.get(packet.d.id));
    }
   return;
   }
  // dbg && console.log(packet);
  var channel = disClient.channels.get(packet.d.channel_id);
  if (['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) {
   // if (channel.messages.has(packet.d.message_id)) return;
   // don't emit an event if the message is already cached
   channel.fetchMessage(packet.d.message_id)
    .then(message => {
     const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
     console.log(emoji);
     // Emojis can have identifiers of name:id format, so we have to account for that case as well
     const reaction = message.reactions.get(emoji);
     //console.log(reaction);
     // This gives us the reaction we need to emit the event properly, in top of the message object
     if (packet.d.user_id === disClient.user.id) return;
     // it shouldn't be processing stuff for its own reaccs
     if (packet.t === 'MESSAGE_REACTION_ADD') {
      // dbg && console.log(packet);
      disClient.emit('bessageReactionAdd', reaction, disClient.users.get(packet.d.user_id));
      }
     if (packet.t === 'MESSAGE_REACTION_REMOVE') {
      // dbg && console.log(packet);
      if (!reaction) return;
      disClient.emit('bessageReactionRemove', reaction, disClient.users.get(packet.d.user_id));
      } // if it's an emoji raw
     })
     .catch(console.log("oop")); // closes what to do with the message once fetched
   return;
   } // closes "if it's a react or a remove react"
  if (['MESSAGE_DELETE'].includes(packet.t)) {
   dbg && console.log("'This message is cached' = " + channel.messages.has(packet.d.id));
   if (channel.messages.has(packet.d.id)) return;
   // don't emit an event if the message is already cached
   channel.fetchMessage(packet.d.id)
    .then(message => {
    dbg && console.log('Message fetched.');
     disClient.emit('messageDelete', message);
     }) // if it does fetch a message
    .catch(function() {
     dbg && console.log('Emitting messageDelete');
     disClient.emit('messageDelete', {
      'channel': disClient.channels.get(packet.d.channel_id),
      'deleted': 'true',
      'id': packet.d.id,
      'type': 'DEFAULT',
      'content': '0ldmessagebal33t',
      'author': 'kilgore_trout',
      'pinned': 'false',
      'tts': 'false',
      'nonce': 'n0tan0nce',
      'system': 'false',
      'embeds': [],
      'attachments': [],
      'createdTimestamp': 'false',
      'editedTimestamp': 'false',
      'reactions': 'false',
      'mentions': 'false',
      'webhookID': 'false',
      'hit': 'false'
      }) // emits a message object to messageDelete
    }); // closes what to do with the message once fetched
   return;
   } // if it's a delete raw
  }); // closes out handler for raw event

 disClient.on('bessageReactionAdd', (messageReaction, user) => {
  var mcid = messageReaction.message.channel.id;
  var mid = messageReaction.message.id;
  if (messageReaction._emoji.name ===  "🕜") {
    var pontent = messageReaction.message.content.substr(messageReaction.message.content.indexOf(">") + 3, 3000);
    //console.log(pontent.length);
    //if (pontent.length % 2 === 0) {return;}
    //console.log(messageReaction.message.author.id);
    if (messageReaction.message.author.id === "429368441577930753" && user.id === "429368441577930753") {
     messageReaction.message.delete();
     }
    if (messageReaction.message.author.id != disClient.user.id) {return;}
    user.send(messageReaction.message.channel.guild.members.get(user.id).displayName + ": " + rot13(pontent));
    } // if it's rrrrr
  if (disFile['reaccs'][mid]) {
   if (disFile['reaccs'][mid]['kill'] === "yes") {
    messageReaction.message.clearReactions();
    } // closes if kill=yes
   if (disFile['reaccs'][mid]['kill'] === "no") {
    if (!disFile['reaccs'][mid][messageReaction._emoji.name]) {
     messageReaction.remove(user)
     return;
     }
    entry = disFile['reaccs'][mid][messageReaction._emoji.name];
    messageReaction.message.channel.guild.members.get(user.id).addRole(entry['role']);
    if (entry['keep'] === "no") {
     setTimeout(function() {
      messageReaction.remove(user)
      }, 60000);
     } // If "keep" is set to "no", remove the reaction.
    // console.log(messageReaction);
    } // closes if kill=no
   } // closes if mid

  if (disFile['bridges'][mcid] && disFile['bridges'][mcid]['active'] === "yes"){
   dbg && cbotlog("Bridged from " + disFile['bridges'][mcid]['from_name'] + " / to: " + disFile['bridges'][mcid]['to_name']);
   var bridgeBuffer = {
    'message' : messageReaction.message.id,
    'dest_ch' : disFile['bridges'][mcid]['to_id'],
    'dest_sv' : disFile['bridges'][mcid]['to_svid'],
    'reacced' : messageReaction._emoji.name,
    'msgmode' : 'r',
    'methode' : 'react',
    };
   for(var f = 0; f < Object.keys(allDiscos).length; f++){
    if ((allDiscos[f].guilds.find(x => x.id === disFile['bridges'][mcid]['to_svid'])) != null) {
     dbg && console.log('Emitting bridgedMessage for copy of ' + disFile['bridges'][mcid]['to_svname']);
     allDiscos[f].emit('bridgedMessage', bridgeBuffer)
      .catch( console.log("Error: could not emit bridged message"));
     } // closes event emitter for when it finds the right disco
    } // closes iterator for f
   } // close check for bridge existence, activation and non-webhook post
  }); // messageReactionAdd handler 

 disClient.on('bessageReactionRemove', (messageReaction, user) => {

  var mcid = messageReaction.message.channel.id;
  var mid = messageReaction.message.id;

  if (disFile['reaccs'][mid]) {
   if (!disFile['reaccs'][mid]['kill']) return;
   if (disFile['reaccs'][mid]['kill'] === "no") {
    entry = disFile['reaccs'][mid][messageReaction._emoji.name];
    messageReaction.message.channel.guild.members.get(user.id).removeRole(entry['role']);
    // console.log(messageReaction);
    } // closes if kill=no
   } // closes if mid
  if (disFile['bridges'][mcid] && disFile['bridges'][mcid]['active'] === "yes"){
   dbg && cbotlog("Bridged from " + disFile['bridges'][mcid]['from_name'] + " / to: " + disFile['bridges'][mcid]['to_name']);
   var bridgeBuffer = {
    'message' : messageReaction.message.id,
    'dest_ch' : disFile['bridges'][mcid]['to_id'],
    'dest_sv' : disFile['bridges'][mcid]['to_svid'],
    'reacced' : messageReaction._emoji.name,
    'msgmode' : 'd',
    'methode' : 'deact',
    };
   for(var f = 0; f < Object.keys(allDiscos).length; f++){
    if ((allDiscos[f].guilds.find(x => x.id === disFile['bridges'][mcid]['to_svid'])) != null) {
     dbg && console.log('Emitting bridgedMessage for copy of ' + disFile['bridges'][mcid]['to_svname']);
     allDiscos[f].emit('bridgedMessage', bridgeBuffer);
     } // closes event emitter for when it finds the right disco
    } // closes iterator for f
   } // close check for bridge existence, activation and non-webhook post
  }); // messageReactionAdd handler 

 disClient.on('messageDelete', message => {
  // console.log(message);
  if (examined.indexOf(message.id) != -1) return;
  examined.push(message.id);
  var mcid = message.channel.id;
  dbg && console.log('messageDelete: ' + message.content);
  dbg && console.log('Channel ID ' + message.channel.id + ' on guild ' + message.channel.guild.id);
  if (disFile['bridges'][mcid] && disFile['bridges'][mcid]['active'] === "yes"){
   dbg && cbotlog("Bridged from " + disFile['bridges'][mcid]['from_name'] + " / to: " + disFile['bridges'][mcid]['to_name']);
   var bridgeBuffer = {
    'message' : message.id,
    'dest_ch' : disFile['bridges'][mcid]['to_id'],
    'dest_sv' : disFile['bridges'][mcid]['to_svid'],
    'msgmode' : 'k',
    'methode' : 'kill',
    };
   for(var f = 0; f < Object.keys(allDiscos).length; f++){
    if ((allDiscos[f].guilds.find(x => x.id === disFile['bridges'][mcid]['to_svid'])) != null) {
     dbg && console.log('Emitting bridge-kill for copy of ' + disFile['bridges'][mcid]['to_svname']);
     allDiscos[f].emit('bridgedMessage', bridgeBuffer);
     } // closes event emitter for when it finds the right disco
    } // closes iterator for d
   } // close check for bridge existence, activation and non-webhook post
  else {
   dbg && console.log("Bridge not found for deleted message. Doing nothing.");
   }
  }) // end of handler for messageDelete ohh yeah

 disClient.on('bridgedMessage', bridgeBuffer => {

  serv = disClient.guilds.find(x => x.id === bridgeBuffer['dest_sv']);
  dest = serv.channels.find(x => x.id === bridgeBuffer['dest_ch']);
  if (!dest) {cbotlog("ERROR: Bridge " + bridgeBuffer['dest_ch'] + " (on " + bridgeBuffer['dest_sv'] + ") is bad!");}
   else {
    dbg && console.log('received bridge event for ' + bridged[bridgeBuffer['message']]);
    // dbg && console.log(bridgeBuffer);
    if(bridgeBuffer['msgmode'] == 'k' && bridged[bridgeBuffer['message']]) {
     dbg && console.log("Del'd id " + bridgeBuffer['message'] + " [killing " + bridged[bridgeBuffer['message']] + "]");
     dest.fetchMessage(bridged[bridgeBuffer['message']])
      .then(message => {
       setTimeout(baleet, 100, message);
       function baleet(message) {
        // console.log(baleeted);
        dest.fetchMessage(bridged[bridgeBuffer['message']]);
        if (bridged[bridgeBuffer['message']] && baleeted.indexOf(message.id) == -1) {
         dbg && console.log("baleeting " + message.content);
         message.delete();
         } // if the message was bridged, go ahead and baleet it, and push its ID
        } // defines function for baleeting
       }) // ends handling of message from fetch
      .catch(console.error);
     } // if msgmode = k
    if (badlist.indexOf(bridgeBuffer['user_id']) == -1) {
     if(bridgeBuffer['msgmode'] == 'r' && bridged[bridgeBuffer['message']]) {
      dbg && console.log("reacc'd id " + bridgeBuffer['message'] + " [reaccing " + bridged[bridgeBuffer['message']] + "]");
      dest.fetchMessage(bridged[bridgeBuffer['message']])
       .then(message => {
        setTimeout(reacc, 100, message);
        function reacc(message) {
         dest.fetchMessage(bridged[bridgeBuffer['message']]);
         if (bridged[bridgeBuffer['message']]) {
          message.react(bridgeBuffer['reacced']);
          } // if the message was bridged, go ahead and baleet it, and push its ID
         } // defines function for baleeting
        }) // ends handling of message from fetch
       .catch(console.error);
      } // if msgmode = r
     if(bridgeBuffer['msgmode'] == 'd' && bridged[bridgeBuffer['message']]) {
      dbg && console.log("deacc'd id " + bridgeBuffer['message'] + " [deaccing " + bridged[bridgeBuffer['message']] + "]");
      dest.fetchMessage(bridged[bridgeBuffer['message']])
       .then(message => {
        setTimeout(deacc, 100, message);
        function deacc(message) {
         dest.fetchMessage(bridged[bridgeBuffer['message']]);
         if (bridged[bridgeBuffer['message']]) {
          dbg && console.log("reaccing " + message.content);
          // var meacts = message.reactions.get(bridgeBuffer['reacced']);
          // console.log(message.reactions);
          var meacts = message.reactions.get(bridgeBuffer['reacced']);
          dbg && console.log(meacts);
          // console.log(meacts);
          meacts.remove();
          } // if the message was bridged, go ahead and baleet it, and push its ID
         } // defines function for baleeting
        }) // ends handling of message from fetch
       .catch(console.error);
      } // if msgmode = r
     // dest.send("<" + bridgeBuffer['usrname'] + "> " + bridgeBuffer['content']);
     dbg && console.log('Sending bridged message with code ' + bridgeBuffer['msgmode'] + " / " + bridgeBuffer['methode']);
     if (bridgeBuffer['msgmode'] == "w" || bridgeBuffer['msgmode'] == "e") {
      // I expect to put some regex modification of the content string here.
      // Mentions have a couple dumb behaviors at the moment.
      if (typeof bridgeBuffer['content'] === 'string') {
        bridgeBuffer['content'] = bridgeBuffer['content'].replace(/@everyone/g, "@\u200beveryone").replace(/@here/g, "@\u200bhere");
      }
     } // if msgmode is "w" or "e"
     if(bridgeBuffer['msgmode'] == "w") {
      //console.log(bridgeBuffer['message']);
      // var disHook = new Discord.WebhookClient("Webhook ID", "Webhook Token");
      dest.fetchWebhooks()
       .then(hooks => {
        var sentImages = 0;
        sendEmbed = [];
        bridgeBuffer['attache'].forEach(item => {
         // dest.send("<" + bridgeBuffer['usrname'] + "> " + item.url);
         sendEmbed.push(item.url);
         sentImages++;
         }); // for each attachment...
        var rightHook = hooks.find(x => x.id === bridgeBuffer['hook_id']);
        var nameToSend = bridgeBuffer['user_un'];
        if (serv.members.find(x => x.id === bridgeBuffer['user_id']) != null) {
         nameToSend = serv.members.find(x => x.id === bridgeBuffer['user_id']).displayName;
         }
        if (nameToSend.length === 1) nameToSend = nameToSend + ".";
        //avatar_url: bridgeBuffer['user_av'],
        //rightHook.edit("blanku", bridgeBuffer['user_av'])
        //.then(rightHook => {
        if (bridgeBuffer['strip'] === "no") {
         rightHook.send(bridgeBuffer['content'], {
          "username": nameToSend,
          "avatarURL": bridgeBuffer['user_av'],
          "files": sendEmbed
          }); } else {
         rightHook.send(bridgeBuffer['content'], {
          "username": nameToSend,
          "avatarURL": bridgeBuffer['user_av']
          }); }
        }) // closes THEN HOOKS 
       .catch(console.error);
      } // closes "if msg mode = w"
     if(bridgeBuffer['msgmode'] == "e") {
      sendEmbed = {
       color: bridgeBuffer['user_cl'],
       author: {
        name: bridgeBuffer['user_dn'],
        icon_url: bridgeBuffer['user_av']
        },
       description: bridgeBuffer['content'] + " ",
       image: {}
       }
      var sentImages = 0;
      bridgeBuffer.attache.forEach(item => {
      // dest.send("<" + bridgeBuffer['usrname'] + "> " + item.url);
      sendEmbed.image = {"url": item.url};
      dest.send({embed: sendEmbed});
      sendEmbed.description = " "; // Has to go after the dest.send because the first send will have the text in it!
      sentImages++;
      }); // for each attachment...
       if (sentImages == 0) {dest.send({embed: sendEmbed})} // If no attachments, just send the embed off.
      } // closes "if msg mode = e"
     } // closes "if user isn't on badlist"
    } // closes "if the bridge isn't bad"
   }) // closes event handler for bridgedMessage event

 // THE REAL MEAT AND POTATOES OF IT ALL: message handler
 disClient.on('message', message => {
  if (!message) return;
  dbg && console.log("message");
  var server = 0;
  if (message.guild) server = message.guild;    
  var isBigBoss = 0;
  var isFilmBoss = 0;
  if (message.author.id === configz['bigboss']['id']) isBigBoss = 1;   
  if (disFile['film']) {
   if (!disFile['filmchannel']) {
    if (disFile['filmchannel']['bosses']) {
     if (disFile['filmchannel']['bosses'].indexOf(message.author.id) != -1) isFilmBoss = 1;
     }
    }
   }
  var gotMsg = message.content;
  if (message.content.search(/^<pid /) != -1 && isBigBoss === 1) {
   if (message.content.substring(5, message.content.indexOf(">")) != process.pid) {
    gotMsg = "";
    return;
    } else {
     message.reply("Executing on PID " + process.pid);
     gotMsg = message.content.slice(message.content.indexOf(">") + 2);
     }
   }   
  if (message.content.search(/^<!pid /) != -1 && isBigBoss === 1) {
   if (message.content.substring(6, message.content.indexOf(">")) === process.pid) {
    gotMsg = "";
    return;
    } else {
     message.reply("Executing on PID " + process.pid);
     gotMsg = message.content.slice(message.content.indexOf(">") + 2);
     }
   }   
  if ((gotMsg.search(/^pid$/) != -1) && (isBigBoss == 1)) {
   message.reply(process.pid);
   } // print pid
  if (server == 0 && message.author.id != disClient.user.id  && (isFilmBoss + isBigBoss) >= 1) {
   //console.log("test");   

   if (disFile['arm'] && (isBigBoss == 1)) {}
    else {disFile['arm'] = 1;}
   if (gotMsg.search(/^arm/) != -1 && isBigBoss == 1) {
    if (gotMsg.search(/^arm\+\+/) != -1) {
     disFile['arm'] = disFile['arm'] + 1; } // Add one to arm count.
    if (gotMsg.search(/^arm\-\-/) != -1) {
     disFile['arm'] = disFile['arm'] - 1; } // Reduce arm count by 1.
    if (gotMsg.search(/^arm 0/) != -1) {
     disFile['arm'] = 0; } // Disarm entirely.
    if (gotMsg.search(/^arm x/) != -1) {
     disFile['arm'] = 99999999; } // Mass arm.
    message.reply("Arm count: " + disFile['arm']);
    } // if it's modifying arm...

   if ((gotMsg.search(/^die/) != -1) && (isBigBoss == 1)) {
    if (disFile['arm'] < 1){
     message.reply("Error code NUI: not armed");
     } // If unarmed.
    else{process.abort();} // This kills the Electro-Magistrate.
    } // closes code for "die"
   if (gotMsg.search(/^purge/) != -1 && (isBigBoss == 1)) {
    if (disFile['arm'] < 1){
     message.reply("Error code NUI: not armed");
     }
    else{
     disFile['arm'] = disFile['arm'] - 1;
      if (gotMsg.substring(6,24) == gotMsg.substring(6,23)){
     message.reply("Invalid channel ID string.");
     disFile['arm']++;
     }
      else{
     var fetchid = gotMsg.substring(6,24);
     var todelete = gotMsg.substring(25,36);
     if (todelete != parseInt(todelete, 10)) {todelete = 1}
     message.reply("Arm count: " + disFile['arm'] + " / Fetch ID: " + fetchid + " (" + todelete + " messages)");
     fetchChannel = disClient.channels.find(x => x.id === fetchid);
     if (fetchChannel) {
      message.reply("Server: " + fetchChannel.guild.name + " / Channel: " + fetchChannel.name);
      if (todelete != 1) {fetchChannel.bulkDelete(todelete, 1);}
      else {console.log(fetchChannel.lastMessageID);
       fetchChannel.fetchMessage(fetchChannel.lastMessageID)
        .then(message => message.delete())
        .catch(console.error);
       } // if toDelete = 1
      } // Closes if on the fetch channel being real.
     } // Closes on if the string is valid.
     } // Closes on if it's armed.
    } // Closes on if it detects a purge.
   if (gotMsg.search(/^brankav/) != -1  && isBigBoss == 1) {
    if (disFile['arm'] < 1){
     message.reply("Error code NUI: not armed");
     } // If it's unarmed.
    else{
     disFile['arm'] = disFile['arm'] - 1;
     var blanktar = fs.readFileSync(__dirname + "/data/b64.png");
     message.reply("Current (" + disClient.user.avatar + "): " + disClient.user.avatarURL);
     setTimeout(function() {disClient.user.setAvatar(blanktar)}, 10000);
     setTimeout(function() {message.reply("New: (" + disClient.user.avatar + "): " + disClient.user.avatarURL)}, 20000);
     } // Closes on if it's armed.
    } // Closes on if it detects an avatar reset.

   if (gotMsg.search(/^bad/) != -1 && (isBigBoss == 1)) {
    if (disFile['arm'] < 1){
     message.reply("Error code NUI: not armed");
     } // If unarmed.
    else{
     disFile['arm'] = disFile['arm'] - 1;
      if(gotMsg.search(/^bad\+/) != -1) {
     if((gotMsg.substring(5,22) != gotMsg.substring(5,21)) && (gotMsg.substring(5,23) == gotMsg.substring(5,24))) {
      badlist.push(gotMsg.substring(5,23));
      } // Add user ID to badlist.
     else {
      message.reply("Error: this isn't a user ID");
      } // If user ID is invalid.
     } // closes if "bad+"
      if(gotMsg.search(/^bad\-/) != -1) {
     if((gotMsg.substring(5,22) != gotMsg.substring(5,21)) &&(gotMsg.substring(5,23) == gotMsg.substring(5,24))) {
      if(badlist.indexOf(gotMsg.substring(5,23)) != -1) {
      badlist.splice(badlist.indexOf(gotMsg.substring(5,23)), 1);
      }
      else { message.reply("Error: ID not in badlist"); }
      }
     else { message.reply("Error: this isn't a user ID");}
     } // closes if "bad-"
     message.reply("```\n" + badlist + "```");
     fs.writeFileSync(__dirname + '/data/badlist.json', JSON.stringify(badlist, null, ' '));
     } // Closes on if it's armed.
    } // Closes on if it detects a badlist command.



   if (gotMsg.search(/^film cancel/) != -1 && (isFilmBoss == 1) && film == "on") {
    for(var i = 0; i < Object.keys(timeoutz).length ; i++) {
     // console.log(timeoutz[i]);
     clearTimeout(timeoutz[i]);
     }
    message.reply("Canceled outstanding timeouts.");
    timeoutz = [];
    }

   if (gotMsg.search(/^film set/) != -1 && (isFilmBoss == 1) && film == "on") {
    dateString = gotMsg.substring(9,34);
    flick = now.utc(dateString);
    // message.reply(dateString + " (" + flickname + ")");
    disClient.guilds.get(disFile['server_id']).channels.get(disFile['filmchannel']['id']).send(now.utc(dateString).fromNow());
    intervals = [1800, 1200, 600, 300, 180, 120, 60, 30, 20, 10, 5, 4, 3, 2, 1, 0];
    intervalmsg = {
     "1800":"**Thirty minutes until showtime!**",
     "1200":"**Thirty minutes until showtime!**",
     "600":"**Ten minutes until showtime!**",
     "300":"**Five minutes until showtime!**",
     "180":"**Three minutes until showtime!**",
     "120":"**Two minutes until showtime!**",
     "60":"**One minute until showtime!**",
     "30":"**- 0:30**",
     "20":"**- 0:20**",
     "10":"**- 0:10**",
     "5":"**- 0:05**",
     "4":"**- 0:04**",
     "3":"**- 0:03**",
     "2":"**- 0:02**",
     "1":"**- 0:01**"
     };
    timerinc = 0;
    for (var i = 0; i < intervals.length; i++){
     console.log(timerinc);
     flack = now(flick);
     flack.subtract({hours: 0, minutes: 0, seconds: intervals[i]});
     intToStart = 0 - now.utc().diff(flack);
     if (intToStart > 0) {
      timeoutz.push(setTimeout(function () {
       console.log(timerinc + " way before");
       console.log("the thing is now + " + intervals[timerinc] + " with timeout " + intToStart);
       if(intervalmsg[intervals[timerinc]] && intervals[timerinc] != 0) {
        disClient.guilds.get(disFile['server_id']).channels.get(disFile['filmchannel']['id']).send(intervalmsg[intervals[timerinc]]);
        } // if interval message found
       else {
        disClient.guilds.get(disFile['server_id']).channels.get(disFile['filmchannel']['id']).send(intervals[timerinc] + " SECONDS UNTIL START!");
        } // if specific message for interval not found
       if(intervals[timerinc] == 0) {
        disClient.guilds.get(disFile['server_id']).channels.get(disFile['filmchannel']['id']).send("**Now playing: " + flickname + "** (00:00:00 / " + twoPad(flickrun[1]) + ":" + twoPad(flickrun[2]) + ":" + twoPad(flickrun[3]) + ")");
        } // if it's showtime
       console.log(timerinc + " before");
       timerinc++;
       console.log(timerinc + " after");
       }, intToStart)); // closes timeout
      } // closes "if the timeout interval is a positive number, i.e. if it hasn't happened yet"
     else {
      timeoutz.push(setTimeout(function () {
       timerinc++;
       console.log(timerinc + " : " + intervals[timerinc]);
       console.log(intervalmsg[intervals[timerinc]]);
       }, 1)); // closes timeout
      } // if the timeout interval is negative?? 
     } // closes for loop
    message.reply("Starting movie at: " + now.utc(flick).format() + " (" + now.utc(flick).format("dddd, MMMM Do YYYY, HH:mm:ss") + " UTC)");   
    var totalMins = (60 * flickrun[1]) + flickrun[2];
    timerincr = 1;
    for(var i = 1; i < totalMins; i += disFile['filmchannel']['postinterval']) {
     console.log("Setting timeout for " + i + " minutes");
     timeoutz.push(setTimeout(function() {
      disClient.guilds.get(disFile['server_id']).channels.get(disFile['filmchannel']['id']).send("**Now playing: " + flickname + "** (" + twoPad(Math.floor(timerincr / 60)) + ":" + twoPad(timerincr) + " / " + twoPad(flickrun[1]) + ":" + twoPad(flickrun[2]) + ":" + twoPad(flickrun[3]) + ")");
      if (timerincr == 1) timerincr = 0; // same as with "i" down below!
      timerincr += disFile['filmchannel']['postinterval'];
      }, intToStart + 1000*60*i)); // closes timeout
     if (i == 1) i = 0; // it'll do this on minute 1 but apart from that it should be even with the increment.
     } // Set timeouts for during-film time checks.
    timeoutz.push(setTimeout(function() {
     filmOngoing = 1;
     }, intToStart)); // set timeout on setting film status to ongoing!
    } // Closes on if it detects a film command.
// date format: 25 chars w/offset
// 2018-12-14T17:41:10-05:00

   if (gotMsg.search(/^film title/) != -1 && (isFilmBoss == 1) && film == "on") {
    flickname = gotMsg.substring(11,999);
    message.reply("Title set: " + flickname + " (" + twoPad(flickrun[1]) + ":" + twoPad(flickrun[2]) + ":" + twoPad(flickrun[3]) + ")");
    } // Closes on if it detects a film command.

   if (gotMsg.search(/^film hrs/) != -1 && (isFilmBoss == 1) && film == "on") {
    massage = gotMsg.substring(9,99999);
    flickrun[1] = parseInt(massage.substring(0,massage.indexOf(":")));
    massage = massage.substring(massage.indexOf(":")+1, 9999);
    flickrun[2] = parseInt(massage.substring(0,massage.indexOf(":")));
    flickrun[3] = parseInt(massage.substring(massage.indexOf(":")+1, 9999));
    message.reply("Film set: " + flickname + " (" + twoPad(flickrun[1]) + ":" + twoPad(flickrun[2]) + ":" + twoPad(flickrun[3]) + ")");
    } // Closes on if it detects a film command.

   if (gotMsg.search(/^film mins/) != -1 && (isFilmBoss == 1)) {
    massage = gotMsg.substring(9,99999);
    totalMinutes = parseInt(massage.substring(0,massage.indexOf(":")));
    flickrun[1] = Math.floor(totalMinutes / 60);
    flickrun[2] = totalMinutes % 60;
    flickrun[3] = parseInt(massage.substring(massage.indexOf(":")+1, 9999));
    message.reply("Film set: " + flickname + " (" + twoPad(flickrun[1]) + ":" + twoPad(flickrun[2]) + ":" + twoPad(flickrun[3]) + ")");
    } // Closes on if it detects a film command.

   if (gotMsg.search(/^utc/) != -1 && (isFilmBoss == 1) && film === "on") {
    message.reply("film set " + now.utc(flick).format());
    } // Closes on if it detects a fromnow command.



   if (gotMsg === 'ping') {
    message.reply('pong');
    }

   if (disFile['anon'] === 'on') {
    if (!secrets) {
     var antechamber = disClient.channels.find(x => x.id === configz['bigchamber']['id']);
     var secrets = JSON.parse(fs.readFileSync(dataFolder + disFile['server_id'] + "/secrets.json"));
     var sterces = reverseSecrets(secrets);
     console.log(secrets);
     console.log(sterces);
     } // closes "if no secrets"
    if (secrets[message.author.id]) {
     cloak = secrets[message.author.id];
     console.log("Cloak found");
     } // closes "if there's a secret with that id"
    else {
     secrets = generateCloak(message, secrets, antechamber, disFile);
     sterces = reverseSecrets(secrets);
     message.reply('Hello. I am the **ELECTRO-MAGISTRATE**. Welcome ')
     message.reply('Cloak generated: ' + secrets[message.author.id]);
     antechamber.send('CLOAK GENERATED');
     antechamber.send(secrets[message.author.id]);
     console.log(secrets);
     console.log(sterces);
     } // closes "if there's no secret with that id"
    antechamber.send(secrets[message.author.id] + ' : ' + gotMsg);
    dbg && console.log(secrets);
    } // closes "if the damn anonline is even turned on"

   if (gotMsg.search(/^ld$/) != -1 && (isBigBoss === 1)) {
    message.reply("```ld cfg: list / load server config\nld reacts: load reaction config```");
    }

   var listTheGuilds = 0;
   var listTheConfigs = 0;

   if (gotMsg.search(/^ld cfg/) != -1 && (isBigBoss == 1)) {
    var serverid = parseInt(gotMsg.slice(7));
    if (!(serverid < deezDeets.length && serverid > -1)) {
     message.reply("```Which configuration would you like to load?\nSyntax: ld cfg <index number>```");
     listTheGuilds = 1;
     }
    else {

     try {
      allDeets[serverid] = JSON.parse(fs.readFileSync(deetsFolder + deezDeets[serverid])); 
      cbotlog("Reloaded config for " + allDiscos[serverid].user.client_name + " (" + deezDeets[serverid] + " / " + allDeets[serverid]['appellation'] + ")");
      message.reply("Reloaded config for " + allDiscos[serverid].user.username + " (" + deezDeets[serverid] + " / " + allDeets[serverid]['appellation'] + ")");
      var listTheConfigs = 1;

      try {
       allDeets[serverid]['introed'] = JSON.parse(fs.readFileSync(dataFolder + allDeets[serverid]['server_id'] + "/introduced.json"));
       console.log("Introduced users list loaded.");
       message.reply("Introduced users list loaded.");
       } catch (e) {message.reply("Error: no intro'd json found.")} 

      try {
       allDeets[serverid]['reaccs'] = JSON.parse(fs.readFileSync(dataFolder + allDeets[serverid]['server_id'] + "/reaccs.json"));
       console.log("React config loaded.");
       message.reply("React config loaded.");
       } catch (e) {message.reply("Error: no reaccs json found.")} 

      if (configz['bridges'] === "on") {
       bridgefigz = JSON.parse(fs.readFileSync(bridgeconfig)); 
       if (bridgefigz[allDeets[serverid]['server_id']]) {
        allDeets[serverid]['bridges'] = bridgefigz[allDeets[serverid]['server_id']];
        message.reply("Loaded in " + Object.keys(disBridges).length + " bridges");
        //console.log(disBridges);
        } // closes "if there's any bridges for this server"'
       else {
        message.reply("Bridges enabled (none found)");
        //console.log(disBridges);
        } // closes first else for if bridging is enabled but no bridges exist
       } // closes "if bridges are enabled globally + per server"
       else {
        message.reply("Bridges disabled");
        //console.log(disBridges);
        } // closes else for if they're disabled

      } catch (e) {message.reply("[No valid disco] (" + allDeets[serverid] + " / " + allDeets[serverid]['appellation'] + ")")} 
     } // if valid server id
    } // if ld cfg

   if ((gotMsg.search(/^ls cfg /) != -1 && isBigBoss == 1) || listTheConfigs === 1) {
    if (!listTheConfigs) var serverid = parseInt(gotMsg.substring(7, 200));
    if (!(serverid < deezDeets.length && serverid > -1)) {
     message.reply("```Which configuration would you like to load?\nSyntax: ld cfg <index number>```");
     listTheGuilds = 1;
     }
    else {
     replyParceledJson(message, allDeets[serverid], ["token", "register_on_guild", "introed"]);
     }
    }

   if (gotMsg.search(/^ls roles/) != -1 && (isBigBoss == 1)) {
    var channelString = gotMsg.slice(9);
    // console.log(disClient.guilds);
    for(var f = 0; f < Object.keys(allDiscos).length; f++){
     var iterator1 = allDiscos[f].guilds.keys();
     for (var i = 0; i < allDiscos[f].guilds.size; i++) {
      //console.log(i);
      //console.log(allDiscos[f].guilds.keys(i));
      serverId = iterator1.next().value;
      if (allDiscos[f].guilds.get(channelString)) {
       var rolesoutput = "``" + twoPad(allDiscos[f].guilds.get(serverId).roles.size) + "`` for ``" + allDiscos[f].user.id + "`` **\"" + allDiscos[f].user.username + "\"** on ``" + allDiscos[f].guilds.get(serverId).id + "`` **\"" + allDiscos[f].guilds.get(serverId).name + "\"**";
       var iterator2 = allDiscos[f].guilds.get(serverId).roles.keys();
       for (var fq = 0; fq < allDiscos[f].guilds.get(serverId).roles.size; fq++){
        roleId = iterator2.next().value;
        // console.log(allDiscos[f].guilds.get(serverId).roles.get(roleId));
        console.log(fq);
        rolesoutput = rolesoutput + twoPad(fq + 1) + ": " + allDiscos[f].guilds.get(serverId).roles.get(roleId).id + " \"" + allDiscos[f].guilds.get(serverId).roles.get(roleId).name + "\"\n";
        } // closes loop for iterating over roles. god help our souls
       rolesoutput = parcelify(1994, rolesoutput, "\n");
       for (k in rolesoutput) { message.reply("```" + rolesoutput[k] + "```"); }
       return;
       } // closes "if there's a server named it!"
      } // closes for loop
     } // closes iterator over all discos
    } // Closes on if it detects a list guilds command.

   if ((gotMsg.search(/^ls cfg$/) != -1 && isBigBoss == 1) || (listTheGuilds === 1)) { 
    for (var i = 0; i < deezDeets.length; i++) {
     try { message.reply("``" + i + "`` " + allDiscos[i].user.username + " (" + deezDeets[i] + " / " + allDeets[i]['appellation'] + ")")} catch (e) {message.reply("``" + i + "``  [No valid disco] (" + allDeets[i] + " / " + allDeets[i]['appellation'] + ")");}
     // message.reply(allDiscos[i].user.username); 
     }
    }   
   if (gotMsg.search(/^ls guilds/) != -1 && isBigBoss == 1) {
    // console.log(disClient.guilds);
    for(var f = 0; f < Object.keys(allDiscos).length; f++){
     if (!allDiscos[f].user) break;
     console.log(allDiscos[f].user.username);
     message.reply("**" + twoPad(allDiscos[f].guilds.size) + "** on ``" + allDiscos[f].user.id + "`` **\"" + allDiscos[f].user.username + "\"**");
     //message.reply(allDiscos[f].guilds.keys());
     console.log(allDiscos[f].guilds.keys());
     console.log(allDiscos[f].guilds.size);
     var iterator1 = allDiscos[f].guilds.keys();
     for (var i = 0; i < allDiscos[f].guilds.size; i++) {
      //console.log(i);
      //console.log(allDiscos[f].guilds.keys(i));
      serverId = iterator1.next().value;
      message.reply("--> ``" + twoPad(i + 1) + "``: ``" + allDiscos[f].guilds.get(serverId).id + "`` *\"" + allDiscos[f].guilds.get(serverId).name + "\"*");
      } // closes for loop
     } // closes iterator over all discos
    } // Closes on if it detects a list guilds command.
   
   if (gotMsg.search(/^echo /) != -1 && (isBigBoss == 1)) {
    var chanid = gotMsg.substring(5, 23);
    var sendpart = gotMsg.substring(24, 2024);
    disClient.channels.get(chanid).send(sendpart);
    }

   if (gotMsg.search(/^scraperoles /) != -1 && (isBigBoss == 1)) {
    if (disFile['rolecatcher'] != "on") {
     message.reply("ERROR: rolecatcher disabled");
     return;
     }
    var servid = gotMsg.substring(12, 30);
    var iterMemb = disClient.guilds.get(servid).members.keys();
    for (var fq = 0; fq < disClient.guilds.get(servid).members.size; fq++){
     memberId = iterMemb.next().value;
     ith = disClient.guilds.get(servid).members.get(memberId);
     console.log("-------");
     console.log(memberId);
     var iterRole = ith.roles.keys();
     var rolesToApply = [];
     for (var fr = 0; fr < ith.roles.size; fr++){
      roleId = iterRole.next().value;
      rolesToApply.push(roleId);
      console.log(memberId);
      console.log(roleId);
      } // closes iteration over role objects
      disFile['roles'][memberId] = rolesToApply;
     } // closes loop for iterating over roles. god help our souls
    try {
     fs.writeFileSync(dataFolder + disFile['server_id'] + "/roles.json", JSON.stringify(disFile['roles'], null, ' '));
     console.log("Roles saved.");
     message.reply("Role file updated");
     } catch (e) {console.log("Error: no roles json found.")}
    } // if scraperoles



   if (gotMsg.search(/^template/) != -1 && (isBigBoss == 1)) {
    message.reply("template");
    }

   if (gotMsg.search(/^ld reacts/) != -1 && (isBigBoss == 1)) {
    try {
     disFile['introed'] = JSON.parse(fs.readFileSync(dataFolder + disFile['server_id'] + "/introduced.json"));
     console.log("Introduced users list loaded.");
     message.reply("Introduced users list loaded.");
     } catch (e) {message.reply("Error: no intro'd json found.")} 
    try {
     disFile['reaccs'] = JSON.parse(fs.readFileSync(dataFolder + disFile['server_id'] + "/reaccs.json"));
     console.log("React config loaded.");
     message.reply("React config loaded.");
     } catch (e) {message.reply("Error: no reaccs json found.")} 
    }

   if (gotMsg.search(/^sv reacts/) != -1 && (isBigBoss == 1)) {
    try {
     fs.writeFileSync(dataFolder + disFile['server_id'] + "/introduced.json", JSON.stringify(disFile['introed'], null, ' '));
     console.log("Introduced users list saved.");
     message.reply("Introduced users list saved.");
     } catch (e) {message.reply("Error: no intro'd json found.")} 
    try {
     fs.writeFileSync(dataFolder + disFile['server_id'] + "/reaccs.json", JSON.stringify(disFile['reaccs'], null, ' '));
     console.log("Reaccs saved.");
     message.reply("Reaccs saved.");
     } catch (e) {message.reply("Error: no reaccs json found.")} 
    }

   if (gotMsg.search(/^rd /) != -1 && (isBigBoss == 1)) {
    var mscguild = gotMsg.substring(3, 21);
    var mscchannel = gotMsg.substring(22, 40);
    var mscmessage = gotMsg.substring(41, 59);
    message.reply("[ " + disClient.guilds.get(mscguild).name + " / " + disClient.guilds.get(mscguild).channels.get(mscchannel).name + " ] " + mscmessage);
    disClient.guilds.get(mscguild).channels.get(mscchannel).fetchMessage(mscmessage)
     .then(msg => {
      message.reply(msg.content);
      console.log(msg.reactions);
      for (var asdf in msg.reactions) {
       console.log(msg.reactions[asdf]);
       console.log(asdf);
       console.log(msg.reactions[asdf]._emoji);
       }
      })
     .catch(message.reply("Error"));

    } // if rd

   if (gotMsg.search(/^help/) != -1) {
    if (isBigBoss === 1) {
     message.reply("**ADMIN COMMANDS**\n```arm [ ++ | -- | 0 | x ]: increase arm count for dangerous commands\ndie: exit process (requires arm)\nbad[ + | - ] [user ID]: + adds/removes user to badlist (if flags set) and prints badlist.\nbrankav: loads b64.png and sets as avatar (broken)\nls guilds\nls roles [guild ID]\nscraperoles [guild ID]: scrapes all guild user roles to roles.json (must have rolecatcher flag enabled in config.json)\n[ ld | sv] reacts: loads/saves reaccs.json and introduced.json.```");
     }
    if (isFilmBoss === 1) {
     message.reply("**FILM COMMANDS**\n```utc: Produces UTC timestamp for right now, in ISO 6801 format. Remember to modify this string before setting the film!\nfilm mins: Set film runtime, in minutes. Format it like: 123:45\nfilm hrs: Set film runtime, in hours. Format it like: 02:03:45\nfilm title: Set film title. Limit is 999 characters.\nfilm set: Queue the film for watching. This WILL send messages in the channel, so don't mess it up. Format it like: film set 2045-01-29T21:08:59Z\nfilm cancel: So you messed it up, huh? This will cancel all outstanding countdowns and announcements.```");
     }
   } // closes "if help command"




   } // closes "if !server and not itself"

  if (server == 0 && gotMsg.search(/^time$/) != -1) {
   if (filmOngoing == 0) {
    message.reply("Film club's not in session, bonehead!");
    return;
    }
   for(var i = 0; i < 5; i++) {
     // message.reply(now.utc(intToStart).format("HH:mm:ss"));
    setTimeout(function() {
     intToStart = now.utc().diff(flick);
     message.reply(now.utc(intToStart).format("HH:mm:ss"));
     }, 5000 * i);
    }
   } // Closes reply to timechecks. Woo!

  // if it's a server message, i.e. in a channel somewhere
  if (server != 0 && lazeLog == 1) {
   lazyLog(message);
   }

  if (server != 0 && message.author.id != disClient.user.id) {
  // POLAR BLAST bug will get to here.
   if (disFile['intro']) {
    if (disFile['intro'] === "on") {
     if (message.channel.id === disFile['intro-channel']) {
      if(disFile['introed'].indexOf(message.author.id) === -1) disFile['introed'].push(message.author.id);
      } // if it's in the intro channel, check to see if there's an entry for that userid int he file. if not, push it in!
     } // polar blasted
    } // if there's a disFile[intro],
   
   if (message.mentions.users.get(disClient.user.id)) {
    setTimeout(function() {message.channel.send("No one cared who I was till I loaded node_modules.")}, 3000);
    }
   if (gotMsg === "In fact, one of them is in this very room!") {
    message.reply("You're god damn right I am, boss!")
    } // closes lol
   if (gotMsg === "If I break that module, will you die?") {
    setTimeout(function() {message.reply("it would be extremely painful.")}, 3000);
    } // closes lol
   if (gotMsg === "You're a big bot.") {
    console.log(message.channel.permissionOverwrites);
    setTimeout(function() {message.channel.send("For you.")}, 3000);
    } // closes lol
   if (gotMsg === "We're about to start having fun.") {
    setTimeout(function() {message.channel.send("**This isn't even my final form!**")}, 3000);
    } // closes lol
// && message.channel.id === "345047533099286550"
   if (gotMsg === "!hottake" && hts === "on") {
    var randint = Math.floor(Math.random() * 9);
    switch (randint) {
     case 1:
      message.channel.send("Why We Need More " + randArray(oppressed) + " " + randArray(professions));
      break;
     case 2:
      message.channel.send(randArray(professions) + " Have A Big " + randArray(oppressed) + " Problem" + randArray(["", " -- And " + randArray(professions) + " Are To Blame"]));
      break;
     case 3:
      message.channel.send("Meet The Bro" + randArray(professions));
      break;
     case 4:
      message.channel.send("How " + randArray(professions) + " Are Enabling " + randArray(oppression));
      break;
     case 5:
      message.channel.send("Should The Government Ban " + randArray(professions) + randArray(["To End " + randArray(oppression), ""]) + "?");
      break;
     case 6:
      message.channel.send("Why Are We Still Talking About " + randArray(professions) + "? We Should Be Concerned About Their " + randArray(oppressed) + " Victims");
      break;
     case 7:
      message.channel.send("The " + randArray(oppressed) + " " + randArray(oppressed) + " Activist Behind This Year's Biggest Anti-" + randArray(oppression) + " Hashtag Speaks Out");
      break;
     case 8:
      message.channel.send("We Need To Talk About " + randArray(professions));
      break;
     default:
      message.channel.send("In 2019, " + randArray(oppression) + " Is Still Rampant Among " + randArray(professions));
      break;
     }
    } // closes lol

   if (gotMsg === "!boomertake" && hts === "on") {
    var randint = Math.floor(Math.random() * 6);
    switch (randint) {
     case 1:
      message.channel.send("Why " + randArray(oppression) + " Is Good");
      break;
     case 2:
      message.channel.send("Alarming Numbers Of Teens Now Identify As " + randArray(oppressed) + " ");
      break;
     case 3:
      message.channel.send("How To Tell If You're Paying Too Much For Your " + randArray(professions));
      break;
     case 4:
      message.channel.send("Should The Government Ban " + randArray(oppressed) + " People?");
      break;
     case 5:
      message.channel.send(randArray(professions) + " HATE Her! One Weird Trick Discovered By A Mom");
      break;
     case 6:
      message.channel.send(randArray(professions) + " HATE Her! One Weird Trick Discovered By A Mom");
      break;
     case 7:
      message.channel.send("ATTN: " + randArray(professions) + " Who Haven't Had A Traffic Ticket In 5 Years");
      break;
     case 8:
      message.channel.send("BREAKING: Thousands Of People Making " + (Math.floor(Math.random() * 25) + 30) + "/hr Working From Home As " + randArray(professions) + "!");
      break;
     default:
      message.channel.send("Are Millenials Putting " + randArray(professions) + " Out Of Business?");
      break;
     }
    } // closes lol

   if (gotMsg.search(/^Computer, reload thyself./) != -1 && isBigBoss === 1) {
    try {
     var goodmorning = [
     message.guild.id,
     message.channel.id,
     "I have returned." ];
     fs.writeFileSync(datFolder + "goodmorning.json", JSON.stringify(goodmorning, null, ' '));
     message.reply("*Autumn ends: bots settle down into the earth.*");
     cbotlog("Aborting process due to user command.");
     setTimeout(function() {process.abort();}, 2000);
     } catch (e) {
      message.reply("*Then as it was, so again it shall be.")
      cbotlog("Aborting process due to user command!");
      setTimeout(function() {process.abort();}, 2000);
      } 
    } // Reload thyself! 



   if (gotMsg.search(/meow/) != -1 && disFile['meow'] === "on") {
    message.react('🐈');
    // this is the unicode for a cat, it's not blank.
    // it's one character, despite taking up many spaces
    }
   if (gotMsg.search(/freeze peach/) != -1 && disFile['meow'] === "on") {
    message.react('❄');
    // this is the unicode for a snowflake, it's not blank.
    setTimeout(function() {message.react('🍑')}, 500);
    // unicode: peach. it's one character, despite taking up many spaces
    }

   if (gotMsg.search(/disc horse/) != -1 && disFile['meow'] === "on") {
    message.react('📀');
    // this is the unicode for a snowflake, it's not blank.
    setTimeout(function() {message.react('🐎')}, 500);
    // unicode: dvd and horse
    }

   if (gotMsg.search(/^!rot13/) != -1 && disFile['rot13'] === "on") {
    if (message.author.id === disClient.user.id) {return;}
    if (gotMsg.length < 8) {return;}
    pessage = gotMsg.substr(7, 2000);
    // if (pessage.length % 2 === 0) {return;}
    message.reply(rot13(pessage))
    .then(mussage => {
     mussage.react('🕜');
     // UNICODE: 1F55C CLOCK FACE ONE-THIRTY 
     });
    message.delete();
    } // if it's rrrrr

   if (gotMsg.search(/Debate me./) != -1 && configz['debate'] === "on") {
    if (lastInter === message.author.id) {return;}
    interCount++;
    lastInter = message.author.id;
    if (interCount === 1) {
     console.log(configz['debateguild']);
     debGuild = disClient.guilds.get(configz['debateguild']);
     debGuild.createChannel('lycaeum', 'text')
     .then( channel => {
      message.reply("!portal #lycaeum");
      channel.setParent('362797734345834498');
      console.log(channel.permissionOverwrites);
      console.log(message.member.roles.get('345045447745732608'))
      channel.overwritePermissions('345045447745732608', {
       VIEW_CHANNEL: false,
       READ_MESSAGES: false,
       MENTION_EVERYONE: false
       }); // overwrites perms.
      channel.overwritePermissions('345045447745732608', {
       VIEW_CHANNEL: true,
       SEND_MESSAGES: false,
       MENTION_EVERYONE: false
       }); // overwrites perms
      }); // closes out "after the channel's created"
     } // if interCoutn is high enough.
    } // closes "Debate me."



  
   // Note: I don't know why or how disFile is being associated with the server that the message is on.
   // It seems pretty robust. I'm pretty sure that messing around with it is a bad idea.
   // var homeroom = message.guild.channels.find('name', disFile['home']);
   // var backroom = message.guild.channels.find('name', disFile['backroom']);
   // var darkroom = message.guild.channels.find('name', disFile['darkroom']);
   // var headroom = message.guild.channels.find('name', disFile['headroom']);
   // old format, in case the new deprecation-avoiding version ends up not working
   // no idea why it's returning null for both the logged new ver and the old ver
   var homeroom = message.guild.channels.find(x => x.name == disFile['home']);
   var backroom = message.guild.channels.find(x => x.name == disFile['backroom']);
   var darkroom = message.guild.channels.find(x => x.name == disFile['darkroom']);
   var headroom = message.guild.channels.find(x => x.name == disFile['headroom']);
   // get element 'home' or 'backroom' or whatever from disFile, and then
   // search for a channel named it in the channels of the guild of the message
   // and store the resutant ID as the variable
   // console.log(homeroom + " " + backroom + "  " + darkroom + " " + headroom)
   var mcid = message.channel.id;
   dbg && console.log("mcid: " + mcid);
   //   console.log(disFile['bridges'][mcid]);
   //   console.log(Object.keys(disFile['bridges']));
   //   console.log(disFile['bridges'][Object.keys(disFile['bridges'])]);
   //   console.log(disFile['bridges']);
   //   console.log(disFile['bridges'][1]);     
   // left here as a monument to human idiocy. all of these commands above won't work.
   // disFile['bridges'][mcid] is the right one. -x 2k18 09 18

   if (disFile['bridges'][mcid] && disFile['bridges'][mcid]['active'] === "yes" && message.webhookID == null) {
    console.log('detected! bridge post')
    //console.log("to name: " + disFile['bridges'][mcid]['to_name']);
    //console.log("to id: " + disFile['bridges'][mcid]['to_id']);
    //console.log("to svid: " + disFile['bridges'][mcid]['to_svid']);
    // note to self: substr takes an index and a length, substring and slice take two indices
    // okay, so, believe it or not
    var bridgeBuffer = {
     'message' : message.id,
     'content' : message.content,
     'usrname' : message.author.username,
     'user_id' : message.author.id,
     'user_dn' : message.member.displayName,
     'user_un' : message.member.user.username,
     'user_cl' : message.member.displayColor,
     'user_av' : message.author.displayAvatarURL.substr(0, message.author.displayAvatarURL.length - 10),
     'dest_ch' : disFile['bridges'][mcid]['to_id'],
     'dest_sv' : disFile['bridges'][mcid]['to_svid'],
     'hook_id' : disFile['bridges'][mcid]['hook_id'],
     'hook_tk' : disFile['bridges'][mcid]['hook_token'],
     'msgmode' : disFile['bridges'][mcid]['mode'],
     'methode' : 'post',
     'attache' : message.attachments,
     'strip'   : disFile['bridges'][mcid]['strip']
     };
    for(var d = 0; d < Object.keys(allDiscos).length; d++){
     // console.log(Object.keys(allDiscos[d].guilds));
     // console.log(allDiscos[d].guilds);
     // console.log(Object.keys(allDiscos[d].guilds).length);
     // console.log(allDiscos[d].guilds.find('id', '8675309'));
     if ((allDiscos[d].guilds.find(x => x.id === disFile['bridges'][mcid]['to_svid'])) != null) {
      allDiscos[d].emit('bridgedMessage', bridgeBuffer);
      } // closes event emitter for when it finds the right disco
     } // closes iterator for d
    //allDiscos.find('guilds', 
    //allDiscos[0].emit('lorry');
    bridging[message.content] = message.id;
    //console.log(bridging);
    } // closes "if it's in a bridged channel"

   if (disFile['bridges'][mcid] && disFile['bridges'][mcid]['active'] === "yes" && message.webhookID) {
    //console.log(bridging[message.content]);
    bridged[bridging[message.content]] = message.id;
    //console.log(bridged);
    fs.writeFileSync(logFolder + "bridged.log", JSON.stringify(bridged));
    } // if it's in a bridged channel but it has a webhook ID

   //   console.log(disFile['bridges'][mcnb]);
   //   console.log(disFile['bridges'][1]);     
   if (mcid == homeroom) {}
   if (mcid == backroom) {}
   if (mcid == darkroom) {}
   if (disFile['anon'] === 'on') {
    if (gotMsg.search(/^recloak 0x/) != -1) {
     console.log("not implemented yet lol");
     } // if "recloak"
    if (gotMsg.search(/^0x/) != -1) {
     console.log("Message author: " + message.author.id);
     var sendto = gotMsg.substring(0,cloaklength);
     var sender = message.author.username;
     console.log("Sendto: " + sendto);
     console.log("Sender: " + sender);
     var sendage = gotMsg.substring(cloaklength + 1);
     console.log("Sending: " + sendage);
     darkroom.send('Sending to ' + sendto + ".");
     console.log(dataFolder + disFile['server_id'] + "/secrets.json");
     secrets = JSON.parse(fs.readFileSync(dataFolder + disFile['server_id'] + "/secrets.json"));
     sterces = reverseSecrets(secrets);
     console.log(sterces[sendto]);var sendtouser = message.guild.members.find(x => x.id === sterces[sendto]);
     // console.log(sendtouser);
     // console.log(message.guild.members[sterces[sendto]]);
     // console.log(message.guild.members[sterces[sendto]].id);
     sendtouser.send("<" + sender + "> " + sendage);
     } // if the message starts with 0x
    } // if anon flag is set
   if (mcid == headroom) {
    // if (gotMsg === 'pingas'){
    doNothing(message, isBigBoss);
    // }
    }
   // this is the line that logs all messages
   console.log(date() + " " + message.channel.name + ": " + message);
   if (gotMsg === "pingas") {
    message.reply('usual, i see');
    v && isBigBoss && console.log('big boss in the house');
    } // if pingas
   if (gotMsg === 'compingas' && isBigBoss) {
    backroom.send('hi');
    console.log(darkroom.name);
    // darkroom.send(darkroom);
    message.reply(mcid + " (" + message.channel.name + ")");           
    console.log(mcid + " (" + message.channel.name + ")");
    } // if compingas
   //   if ((message.search(/^set /) != -1) && (isBigBoss > 0)) {
   //   var command = message.replace(/^j /,'');
   //   antechamber = message.guild.channels.find('name', disFile['darkroom']);
   //   v && console.log("antechamber set : " + message.guild.channels.find('name', disFile['darkroom'])); 
   //   }
   } // closes loop for handling server messages that aren't sent by the bot herself
  }); // closes handler for message events
 } // closes the loop that iterates over all the discos

function dFuncs(message, isBigBoss) {
 if (isBigBoss > 0) {
  if (gotMsg === 'writeout'){  
   v && console.log("writing out");
   message.reply("writing out to " + logFolder);
   botlog("writing out params");
   } // writeout
  if (gotMsg === 'dumpparams'){    
   console.log("dumping params");
   message.reply(JSON.stringify(configz)); 
   } // dump params
  if (gotMsg === 'rl configz'){
   console.log("reloading configuration data");
   message.reply()
   } // reload configz
 }
 } // closes dFuncs

function generateCloak(message, secrets, antechamber, disFile) {
 var text = "0x";//set to string
 var allowed_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";//pick whatever
 for (var i = 0; i < (cloaklength - 2); i++) {//20 is the number of characters
  text += allowed_chars.charAt(Math.floor(Math.random() * allowed_chars.length));//select from allowed_chars
  } // for loop
 secrets[message.author.id] = text;
 fs.writeFileSync(dataFolder + disFile['server_id'] + "/secrets.json", JSON.stringify(secrets));
 return secrets;
 }

function doNothing() {
 console.log('im gay');
 } // closes doNothing

function date() {
 // [MM/DD/YYYY @ HH:MM:SS]
 return now().format('MM/DD/YYYY @ HH:mm:ss')
 } // closes date

function botlog (message) {
 var filename;
 try { fs.mkdirSync(logFolder) } catch(e) {}
 try { fs.readFileSync(`${logFolder}/event.log`) } catch(e) {console.log("Error: could not access botlog");}
 fs.appendFileSync(`${logFolder}/event.log`, '\n[' + `${date()}` + "] " + message);
 } // closes botlog

function cbotlog (message) {
 var filename;
 console.log(message);
 try { fs.mkdirSync(logFolder) } catch(e) {}
 try { fs.readFileSync(`${logFolder}/event.log`) } catch(e) {console.log("Error: could not access botlog");}
 fs.appendFileSync(`${logFolder}/event.log`, '\n[' + `${date()}` + "] " + message);
 } // closes cbotlog

function memberlog (message) {
 var filename;
 try { fs.mkdirSync(logFolder) } catch(e) {}
 try { fs.readFileSync(`${logFolder}/members.log`) } catch(e) {console.log("Error: could not access member log");}
 fs.appendFileSync(`${logFolder}/members.log`, '\n[' + `${date()}` + "] " + message);
 } // closes dumblog

function objectlog (whatever) {
 dumblog('\n[' + `${date()}` + "] Logging object");
 for(var iterator in whatever) {
  dumblog("\n" + iterator);
  dumblog("\n> " + JSON.stringify(whatever[iterator]));
  dumblog("\n>> " + whatever[iterator]);
  // console.log(disClient.guilds.array()[iterator]);
  } // closes iterator thing
 } // closes objectlog

function writeout (filecontents, filename) {
 try { fs.mkdirSync(logFolder) } catch(e) {}
 try { fs.readFileSync(`${logFolder}/`) } catch(e) {}
 fs.appendFileSync(`${logFolder}/sleuthery.log`, message);
 } // closes writeout

function writeouttodate (filecontents, filename) {
 try { fs.mkdirSync(logFolder) } catch(e) {}
 try { fs.readFileSync(`${logFolder}/`) } catch(e) {}
 fs.appendFileSync(`${logFolder}/`+now().format('YYYY-MM-DDTHH:mm:ss'), message);
 } // closes writeouttodate

function loadServerConfig (id) {
 v && console.log("Attempting to create directory at" + dataFolder + id);
 try { fs.mkdirSync(dataFolder + id) } catch(e) {}
 try { fs.readFileSync(dataFolder + id + "/roles.json") } catch(e) {
  fs.appendFileSync(dataFolder + id + "/roles.json", '{"asdf":"asdf"}');
  v && cbotlog("Creating roles.json");
  } // closes try
 try { fs.readFileSync(dataFolder + id + "/secrets.json") } catch(e) {
  fs.appendFileSync(dataFolder + id + "/secrets.json", '{"asdf":"asdf"}');
  v && cbotlog("Creating secrets.json");
  } // closes try
 } // closes loadServerConfig

function saveServerConfig (id) {
 v && console.log("Attempting to create directory at" + dataFolder + id);
 try { fs.mkdirSync(dataFolder + id) } catch(e) {}
 try { fs.readFileSync(dataFolder + id + "/roles.json") } catch(e) {
  fs.appendFileSync(dataFolder + id + "/roles.json", '{"asdf":"asdf"}');
  v && cbotlog("Creating roles.json");
  } // closes try
  try { fs.readFileSync(dataFolder + id + "/secrets.json") } catch(e) {
   fs.appendFileSync(dataFolder + id + "/secrets.json", '{"asdf":"asdf"}');
   v && cbotlog("Creating secrets.json");
   } // closes try
 } // closes loadServerConfig

function reverseSecrets (secrets) {
 var sterces = {};
 for(var key in secrets) {
  sterces[secrets[key]] = key;        
  } // for loop
 return sterces;
 } // closes reverseSecrets

function twoPad (input) {
 if (input > 9) {
  return input;
  }
 return "0" + input;
 }

function zPad (input, n) {
input = input.toString();
 while (input.length < n) {
  input = "0" + input;
  }
 return input;
 }

function xPad (input, n, x) {
input = input.toString();
 while (input.length < n) {
  input = x + input;
  }
 return input;
 }

function rot13 (input) {
 var rot00 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
 var rot13 = "nopqrstuvwxyzabcdefghijklmNOPQRSTUVWXYZABCDEFGHIJKLM";
 var rotten = "";
 for(var ii = 0; ii < input.length; ii++) {
  rot00index = rot00.indexOf(input.substr(ii, 1));
  if (rot00index === -1) {rotten = rotten + input.substr(ii, 1)}
  if (rot00index != -1) {rotten = rotten + rot13.substr(rot00index, 1)}
  } // closes for
 return rotten;
 } // closes rot13

function randArray(array) {
 return array[Math.floor(Math.random() * array.length)];
 }

function parcelify(limit, input, breaker) {
 var midput = [];
 console.log(input.substr(1900,  500));
 while (input.length > limit) {
  var index = input.indexOf(breaker);
  console.log("Index is " + index);
  if (index >= limit || index === -1) {
   midput.push(input.substr(0, limit));
   input = input.slice(limit);
   console.log("xx" + input);
   } // handle if it's too long
  else {
   latest = 1;
   console.log("Index is now " + input.indexOf(breaker, latest));
   while (input.indexOf(breaker, latest+1) < limit) {
    latest = input.indexOf(breaker, latest+1);
    console.log("Index is now " + input.indexOf(breaker, latest));
    }
   console.log(latest); 
   midput.push(input.substr(0, latest));
   input = input.slice(latest);
   } // else
 } // while input length is less than limit
 midput.push(input);
 return midput;
 } // function def for parcelify

function replyParceledJson (message, json, spicyEntries) {
 var index = -1;
 var cfgmidput = "";
 for (j in json) {
  index++;
  if (!spicyEntries.includes(j)) cfgmidput = cfgmidput + xPad(index, 3, " ") + " " + j + " : " + json[j] + "\n";
  else cfgmidput = cfgmidput + xPad(index, 3, " ") + " [redacted] : [redacted]\n";
  } // iterate to find deets
  cfgoutput = parcelify(1994, cfgmidput, "\n");
 console.log(cfgoutput);
 for (k in cfgoutput) { message.reply("```" + cfgoutput[k] + "```"); }
 }

function logUpAJson (json, spicyEntries) {
 for (j in json) {
  if (!spicyEntries.includes(j)) console.log(j + json[j]);
  } // iterate to find deets
 }

function logInAJson (json, object, spicyEntries) {
 for (j in json) {
  if (j === object) logUpAJson(json[j], []);
  } // iterate to find deets
 }








function convertToText (message) {
  var text = message.content;
  // text = sanitize(text);
  // text = censor(text)
  // formatting as auxr.epic according to pisg.sourceforge.net/formats
  // should look like '[MM/DD/YYYY @ HH:MM:SS] <5318008101> X XXXX XXX XX XXXXXX'
  return `[${date()}] <${message.author.username.replace(/ /,'_')}> ${text}\n`
}

function date() {
  // [MM/DD/YYYY @ HH:MM:SS]
  return now().format('MM/DD/YYYY @ HH:mm:ss')
}

function lazyLog (message) {
  const servers = {"345045447745732608":"acn",
   "417426624779124747":"dub"};
  const text = convertToText(message)
  const logFold = `${logFolder}chat/${now().format('YYYY-MM')}`
  const logFoldCurrent = `${logFolder}chat/current`
  try { fs.mkdirSync(logFolder + "chat/")} catch(e) {}
  try { fs.mkdirSync(logFold) } catch(e) {}
  try { fs.mkdirSync(logFoldCurrent) } catch(e) {}
  if (message.channel.type == 'text') {
    var channel = message.channel.name
    var guild = message.guild.id;
    if (servers[message.guild.id]) {guild = servers[message.guild.id]}

    try { fs.mkdirSync(logFoldCurrent + "/" + guild) } catch(e) {}
    try { fs.mkdirSync(logFoldCurrent + "/" + guild + "-d") } catch(e) {}
    try { fs.mkdirSync(logFold + "/" + guild) } catch(e) {}
    try { fs.mkdirSync(logFold + "/" + guild + "-d") } catch(e) {}

    try {fs.appendFileSync(`${logFold}/${guild}.txt`, text)}
    catch(e) {
     fs.writeFileSync(`${logFold}/${guild}.txt`, text)}

    try {fs.appendFileSync(`${logFold}/${guild}-d.txt`, "X")}
    catch(e) {
     fs.writeFileSync(`${logFold}/${guild}-d.txt`, "X")}

    try {fs.appendFileSync(`${logFold}/${guild}/${channel}.txt`, text)}
    catch(e) {
     fs.writeFileSync(`${logFold}/${guild}/${channel}.txt`, text)}

    try {fs.appendFileSync(`${logFold}/${guild}-d/${channel}.txt`, "X")}
    catch(e) {
     fs.writeFileSync(`${logFold}/${guild}-d/${channel}.txt`, "X")}

    try {fs.appendFileSync(`${logFold}/${guild}/${channel}.txt`, text)}
    catch(e) {
     fs.writeFileSync(`${logFold}/${guild}/${channel}.txt`, text)}

    try {fs.appendFileSync(`${logFold}/${guild}-d/${channel}.txt`, "X")}
    catch(e) {
     fs.writeFileSync(`${logFold}/${guild}-d/${channel}.txt`, "X")}

    try {fs.appendFileSync(`${logFoldCurrent}/${guild}.txt`, text)}
    catch(e) {
     fs.writeFileSync(`${logFoldCurrent}/${guild}.txt`, text)}

    try {fs.appendFileSync(`${logFoldCurrent}/${guild}-d.txt`, "X")}
    catch(e) {
     fs.writeFileSync(`${logFoldCurrent}/${guild}-d.txt`, "X")}

    try {fs.appendFileSync(`${logFoldCurrent}/${guild}/${channel}.txt`, text)}
    catch(e) {
     fs.writeFileSync(`${logFoldCurrent}/${guild}/${channel}.txt`, text)}

    try {fs.appendFileSync(`${logFoldCurrent}/${guild}-d/${channel}.txt`, "X")}
    catch(e) {
     fs.writeFileSync(`${logFoldCurrent}/${guild}-d/${channel}.txt`, "X")}
  }
  try {fs.appendFileSync(`${logFold}.txt`, text)}
  catch(e) {
   fs.writeFileSync(`${logFold}.txt`, text)}
  try {fs.appendFileSync(`${logFoldCurrent}.txt`, text)}
  catch(e) {
   fs.writeFileSync(`${logFoldCurrent}.txt`, text)}
}