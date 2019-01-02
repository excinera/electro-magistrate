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
const filmPostInterval = 2;
var filmOngoing = "0";

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
var d = (process.argv.indexOf('d') + process.argv.indexOf('-d') + 2);
var m = (process.argv.indexOf('m') + process.argv.indexOf('-m') + 2);
var w = (process.argv.indexOf('w') + process.argv.indexOf('-w') + 2);
// Process command-line arguments into variables.

v = v ? 1 : 0;
d = d ? 1 : 0;
h = h ? 1 : 0;
m = m ? 1 : 0;
w = w ? 1 : 0;

cbotlog(process.argv);

if (h) {
 console.log(versionid + " / x. cinera 2k18");
 console.log("Usage: node " + path.basename(__filename) + " [-d] [-h] [-m] [-v] [-w]")
 console.log("  -d, debug      Run in debug mode")
 console.log("  -h, help       Display help menu and exit")
 console.log("  -m, multiple   Run without aborting existing")
 console.log("                 already-running process detected")
 console.log("  -v, verbose    Run with verbose logging enabled")
 console.log("  -w, weak       Omit writing to lockfile so that")
 console.log("                 process will be killed by cronjob")
 process.exit(0);
 } // If help flag is set, print command flags and exit.

try { fs.mkdirSync(datFolder) } catch(e) {}

// Try to load configuration data. If it doesn't exist, create a blank template file.
try { configz = JSON.parse(fs.readFileSync(globalconfig))} catch (e) {
 baseconfig = {
  "bridges":"off",
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
  "lockfiletimeout":"60",
  "lockfilewrite":"45"
  };
 fs.appendFileSync(globalconfig, JSON.stringify(baseconfig, null, ' '));
 cbotlog("ERROR: No configuration file detected. Creating one now.");
 configz = baseconfig;
 } // Try to read file, create if absent.

if (!m) {
const lockfiletimeout = configz.lockfiletimeout; // Number of seconds the program should wait after the last heartbeat to declare old instance dead
 if (os.platform() == "win32") {
  console.log("ERROR: You appear to be using Micro$haft Winblow$! :^(");
  console.log("       Killing currently-running processes won't work.");
  }
 try {
  fs.readFileSync(lockfilepath);
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

console.log(versionid + ' || INITIALIZING');
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
(d || v) && cbotlog("STARTING WITH " + (d ? "DEBUG " : "") + ((d * v) ? "AND " : "") + (v ? "VERBOSE " : "") + "MODE ENABLED");
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


// this is where the magic happens. outer control loop iterated over all configs
for (var i = 0; i < deezDeets.length; i++){
 // Initialize Discord connection
 const disClient = new disco.Client();
 // Connect to Discord API using credentials taken from the i-th file in the directory
 const disFile = JSON.parse(fs.readFileSync(deetsFolder + deezDeets[i]));   
 const authDeets  = disFile['token'];
 var disBridges = {"null":"null"};
 disClient.login(authDeets).catch(err => {console.log('Authentication failure on ' + disFile['appellation']); throw err});
 // If the global and local bridge flags are set...
 if (configz['bridges'] === "on" && disFile['bridges'] === "on" && bridgefigz) {
  const bridgefigz = JSON.parse(fs.readFileSync(bridgeconfig)); 
  if (bridgefigz[disFile['server_id']]) {
   disBridges = bridgefigz[disFile['server_id']];
   console.log('Attempting connection (B:' + Object.keys(disBridges).length + ') to "' + disFile['appellation'] + '" (' + deetsFolder + deezDeets[i] + ')');
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
  disFile['bridges'] = disBridges;
  // Cram the client object into allDiscos so that it can exist outside of this scope
 allDiscos.push(disClient);
 allDeets.push(disFile);


 // this is the startup routine that iterates over every client when it connects
 disClient.on('ready', () => {
  disServer = disClient.guilds.get(disFile['server_id']);
  // creates an object, local to this scope, of the single guild named in the specific config file
  // multiple config files can use the same authentication tokens.
  // config files may only contain deets for one server, so each disFile only uses one server
  disFile['client_id'] = disClient.user.id;
  disFile['username'] = disClient.user.username;
  if (disServer) {
   disFile['server_name'] = disServer.name;
   }
  else {
   cbotlog("Error: Cannot fetch server for " + disFile['server_id'] + " (" + disFile['appellation'] + ")");
   }
  cbotlog("Connected to \"" + disFile['appellation'] + "\": " + disFile['server_name'] + " (" + disFile['server_id'] + ") as " + disFile['username'] + " (" + disFile['client_id'] + ")");
  const secrets = JSON.parse(fs.readFileSync(dataFolder + disFile['server_id'] + "/secrets.json"));
  const sterces = reverseSecrets(secrets);
  console.log("Server configuration loaded for " + disFile['appellation']);
  try {
   disFile['introed'] = JSON.parse(fs.readFileSync(dataFolder + disFile['server_id'] + "/introduced.json"));
   console.log("Introduced users list loaded.");
   }
   catch (e) {
    console.log("No introed configuration found. Creating empty file.");
    disFile['introed'] = ["0","0"];
    fs.writeFileSync(dataFolder + disFile['server_id'] + "/introduced.json", JSON.stringify(disFile['introed'], null, ' '));
    } 
  try {
   disFile['reaccs'] = JSON.parse(fs.readFileSync(dataFolder + disFile['server_id'] + "/reaccs.json"));
   console.log("React config loaded.");
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
   }
   catch (e) {
    console.log(e);
    console.log("No reaction configuration found. Creating empty file.");
    disFile['roles'] = {"a":"a"};
    fs.writeFileSync(dataFolder + disFile['server_id'] + "/roles.json", JSON.stringify(disFile['roles'], null, ' '));
    }
  for(var ds in Object.keys(disFile['reaccs'])) {
   re = disFile['reaccs'];
   ki = Object.keys(re)[ds];
   if (ki === "a") return;
   if (re[ki]['kill'] === "yes") return;
   disClient.guilds.get(re[ki]['chat']).channels.get(re[ki]['chan']).fetchMessage(ki)
    .then (message => {
     console.log(message.reactions.keys());
     for(var dd in message.reactions.keys()) {
      console.log(message.reactions[dd]);
      }
     //console.log(message.reactions.find(x => x.Emoji.id === re[ki][')
     })
    .catch(console.error);
   // disClient.guilds.get(disFile.reaccs[ds].
   }
  }); // this closes out the startup routine

  // see: https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/coding-guides/raw-events.md
  // that's what this is adapted from
  //others: GUILD_MEMBER_UPDATE
 disClient.on('raw', packet => {
  // console.log(packet)
  if(packet.t === 'GUILD_MEMBER_UPDATE') {
   console.log(packet);
   if (disFile['server_id'] === packet.d.guild_id && disFile['rolecatcher'] === "on") {
    console.log(packet.d.user.id);
    disFile['roles'][packet.d.user.id] = packet.d.roles;
    try {
     fs.writeFileSync(dataFolder + disFile['server_id'] + "/roles.json", JSON.stringify(disFile['roles'], null, ' '));
     console.log("Roles saved.");
     } catch (e) {console.log("Error: no roles json found.")}
    } // if rolecatcher's on and it's on the monitored server
   } // if it's a guild member update 
  
  if(packet.t === 'GUILD_MEMBER_ADD') {
  console.log(packet);
  console.log(packet.d.user.id);
  if (disFile['roles'][packet.d.user.id]) {
   var newRoles = disFile['roles'][packet.d.user.id];
   console.log(newRoles);
   // console.log(disClient.guilds.get(packet.d.guild_id).name);
   setTimeout(function() {
    for (var inc in newRoles) {
     console.log(newRoles[inc]);
     disClient.guilds.get(packet.d.guild_id).members.get(packet.d.user.id).addRole(newRoles[inc])
     }
    }, 3000);
   } // if there's a roles entry for the user id
  } // if it's a guild member add

  //console.log(packet);
  // this will re-emit events for emoji add/remove and deletions on non-cached messages
  // basically it accounts for discord.js being stupid and not doing this
  if (configz.sec) {
   if(packet.t === 'VOICE_STATE_UPDATE' && packet.d.channel_id === configz.sec.orig) {
    disClient.guilds.get(packet.d.guild_id).members.get(packet.d.user_id).addRole(configz.sec.role)
    disClient.guilds.get(packet.d.guild_id).members.get(packet.d.user_id).setVoiceChannel(configz.sec.dest)
    console.log("illuminated");
    }
   if(packet.t === 'VOICE_STATE_UPDATE' && packet.d.channel_id === null) {
    setTimeout(function() {
     // console.log(disClient.guilds.get(packet.d.guild_id).members.get(packet.d.user_id));
     disClient.guilds.get(packet.d.guild_id).members.get(packet.d.user_id).removeRole(configz.sec.role);
     console.log("rming illuminatus");
     }, 1500);
    }
   }
  if(packet.t == 'PRESENCE_UPDATE') return;
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
   d && console.log("Last message edited!");
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
  // d && console.log(packet);
  var channel = disClient.channels.get(packet.d.channel_id);
  if (['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) {
   // if (channel.messages.has(packet.d.message_id)) return;
   // don't emit an event if the message is already cached
   channel.fetchMessage(packet.d.message_id)
    .then(message => {
     const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
     // Emojis can have identifiers of name:id format, so we have to account for that case as well
     const reaction = message.reactions.get(emoji);
     // This gives us the reaction we need to emit the event properly, in top of the message object
     if (packet.d.user_id === disClient.user.id) return;
     // it shouldn't be processing stuff for its own reaccs
     if (packet.t === 'MESSAGE_REACTION_ADD') {
      disClient.emit('bessageReactionAdd', reaction, disClient.users.get(packet.d.user_id));
      }
     if (packet.t === 'MESSAGE_REACTION_REMOVE') {
      disClient.emit('bessageReactionRemove', reaction, disClient.users.get(packet.d.user_id));
      } // if it's an emoji raw
     })
     .catch(console.log("Error on fetching message")); // closes what to do with the message once fetched
   return;
   } // closes "if it's a react or a remove react"
  if (['MESSAGE_DELETE'].includes(packet.t)) {
   d && console.log("'This message is cached' = " + channel.messages.has(packet.d.id));
   if (channel.messages.has(packet.d.id)) return;
   // don't emit an event if the message is already cached
   channel.fetchMessage(packet.d.id)
    .then(message => {
    d && console.log('Message fetched.');
     disClient.emit('messageDelete', message);
     }) // if it does fetch a message
    .catch(function() {
     d && console.log('Emitting messageDelete');
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

 disClient.on('bessageReactionAdd', messageReaction => {
  // console.log(messageReaction);
  // console.log('asdf');
  // console.log(messageReaction._emoji.name + " from " + messageReaction._users);
  var mcid = messageReaction.message.channel.id;
  var mid = messageReaction.message.id;
  if (disFile['reaccs'][mid]) {
   if (disFile['reaccs'][mid]['kill'] === "yes") {
    console.log(messageReaction);
    } // closes if kill=yes
   if (disFile['reaccs'][mid]['kill'] === "no") {
    messageReaction.fetchUsers(100)
    .then(users => {
     console.log(users.keys());
     
     }); // then users
    } // closes if kill=no
   } // closes if mid
  












  if (disFile['bridges'][mcid] && disFile['bridges'][mcid]['active'] === "yes"){
   d && cbotlog("Bridged from " + disFile['bridges'][mcid]['from_name'] + " / to: " + disFile['bridges'][mcid]['to_name']);
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
     d && console.log('Emitting bridgedMessage for copy of ' + disFile['bridges'][mcid]['to_svname']);
     allDiscos[f].emit('bridgedMessage', bridgeBuffer)
      .catch( console.log("Error: could not emit bridged message"));
     } // closes event emitter for when it finds the right disco
    } // closes iterator for f
   } // close check for bridge existence, activation and non-webhook post
  }); // messageReactionAdd handler 

 disClient.on('bessageReactionRemove', messageReaction => {
  // d && console.log(messageReaction.count);
  // d && console.log('asdf');
  // d && console.log(messageReaction._emoji.name + " from " + messageReaction._users);
  var mcid = messageReaction.message.channel.id;
  if (disFile['bridges'][mcid] && disFile['bridges'][mcid]['active'] === "yes"){
   d && cbotlog("Bridged from " + disFile['bridges'][mcid]['from_name'] + " / to: " + disFile['bridges'][mcid]['to_name']);
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
     d && console.log('Emitting bridgedMessage for copy of ' + disFile['bridges'][mcid]['to_svname']);
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
  d && console.log('messageDelete: ' + message.content);
  d && console.log('Channel ID ' + message.channel.id + ' on guild ' + message.channel.guild.id);
  if (disFile['bridges'][mcid] && disFile['bridges'][mcid]['active'] === "yes"){
   d && cbotlog("Bridged from " + disFile['bridges'][mcid]['from_name'] + " / to: " + disFile['bridges'][mcid]['to_name']);
   var bridgeBuffer = {
    'message' : message.id,
    'dest_ch' : disFile['bridges'][mcid]['to_id'],
    'dest_sv' : disFile['bridges'][mcid]['to_svid'],
    'msgmode' : 'k',
    'methode' : 'kill',
    };
   for(var f = 0; f < Object.keys(allDiscos).length; f++){
    if ((allDiscos[f].guilds.find(x => x.id === disFile['bridges'][mcid]['to_svid'])) != null) {
     d && console.log('Emitting bridgedMessage for copy of ' + disFile['bridges'][mcid]['to_svname']);
     allDiscos[f].emit('bridgedMessage', bridgeBuffer);
     } // closes event emitter for when it finds the right disco
    } // closes iterator for d
   } // close check for bridge existence, activation and non-webhook post
  else {
   d && console.log("Bridge not found for deleted message. Doing nothing.");
   }
  }) // end of handler for messageDelete ohh yeah

 disClient.on('bridgedMessage', bridgeBuffer => {
  //console.log("Bridgin");
  //console.log(disClient.guilds);
  serv = disClient.guilds.find(x => x.id === bridgeBuffer['dest_sv']);
  dest = serv.channels.find(x => x.id === bridgeBuffer['dest_ch']);
  if (!dest) {cbotlog("ERROR: Bridge " + bridgeBuffer['dest_ch'] + " (on " + bridgeBuffer['dest_sv'] + ") is bad!");}
   else {
    d && console.log('received bridge event for ' + bridged[bridgeBuffer['message']]);
    // d && console.log(bridgeBuffer);
    if(bridgeBuffer['msgmode'] == 'k' && bridged[bridgeBuffer['message']]) {
     d && console.log("Del'd id " + bridgeBuffer['message'] + " [killing " + bridged[bridgeBuffer['message']] + "]");
     dest.fetchMessage(bridged[bridgeBuffer['message']])
      .then(message => {
       setTimeout(baleet, 100, message);
       function baleet(message) {
        // console.log(baleeted);
        dest.fetchMessage(bridged[bridgeBuffer['message']]);
        if (bridged[bridgeBuffer['message']] && baleeted.indexOf(message.id) == -1) {
         d && console.log("baleeting " + message.content);
         message.delete();
         } // if the message was bridged, go ahead and baleet it, and push its ID
        } // defines function for baleeting
       }) // ends handling of message from fetch
      .catch(console.error);
     } // if msgmode = k
    if (badlist.indexOf(bridgeBuffer['user_id']) == -1) {
     if(bridgeBuffer['msgmode'] == 'r' && bridged[bridgeBuffer['message']]) {
      d && console.log("reacc'd id " + bridgeBuffer['message'] + " [reaccing " + bridged[bridgeBuffer['message']] + "]");
      dest.fetchMessage(bridged[bridgeBuffer['message']])
       .then(message => {
        setTimeout(reacc, 100, message);
        function reacc(message) {
         dest.fetchMessage(bridged[bridgeBuffer['message']]);
         if (bridged[bridgeBuffer['message']]) {
          // d && console.log("reaccing " + message.content);
          message.react(bridgeBuffer['reacced']);
          } // if the message was bridged, go ahead and baleet it, and push its ID
         } // defines function for baleeting
        }) // ends handling of message from fetch
       .catch(console.error);
      } // if msgmode = r
     if(bridgeBuffer['msgmode'] == 'd' && bridged[bridgeBuffer['message']]) {
      d && console.log("deacc'd id " + bridgeBuffer['message'] + " [deaccing " + bridged[bridgeBuffer['message']] + "]");
      dest.fetchMessage(bridged[bridgeBuffer['message']])
       .then(message => {
        setTimeout(deacc, 100, message);
        function deacc(message) {
         dest.fetchMessage(bridged[bridgeBuffer['message']]);
         if (bridged[bridgeBuffer['message']]) {
          d && console.log("reaccing " + message.content);
          // var meacts = message.reactions.get(bridgeBuffer['reacced']);
          // console.log(message.reactions);
          var meacts = message.reactions.get(bridgeBuffer['reacced']);
          d && console.log(meacts);
          // console.log(meacts);
          meacts.remove();
          } // if the message was bridged, go ahead and baleet it, and push its ID
         } // defines function for baleeting
        }) // ends handling of message from fetch
       .catch(console.error);
      } // if msgmode = r
     // dest.send("<" + bridgeBuffer['usrname'] + "> " + bridgeBuffer['content']);
     d && console.log('Sending bridged message with code ' + bridgeBuffer['msgmode'] + " / " + bridgeBuffer['methode']);
     if (bridgeBuffer['msgmode'] == "w" || bridgeBuffer['msgmode'] == "e") {
      // I expect to put some regex modification of the content string here.
      // Mentions have a couple dumb behaviors at the moment.
      } // if msgmode is "w" or "e"
     if(bridgeBuffer['msgmode'] == "w") {
      //https://discordapp.com/api/webhooks/521012475685240842/bmtSFMVoXLk17Sh2Q4iK23LF2XYc9-OC7Rv7i-ii1YaGJ7kCiEtpIbm_U644ScKcxbia",
      //console.log(bridgeBuffer['message']);
      // var disHook = new Discord.WebhookClient("Webhook ID", "Webhook Token");
      dest.fetchWebhooks()
       .then(hooks => {
        //console.log(hooks);
        // console.log(hooks.find('id', bridgeBuffer['hook_id']));
        //hooks.find('id', bridgeBuffer['hook_id']).send(bridgeBuffer['content']);
        // hooks.find('id', bridgeBuffer['hook_id']).edit(bridgeBuffer['user_dn'], bridgeBuffer['user_av'])
        var sentImages = 0;
        sendEmbed = [];
        bridgeBuffer.attache.forEach(item => {
         // dest.send("<" + bridgeBuffer['usrname'] + "> " + item.url);
         sendEmbed.push(item.url);
         sentImages++;
         }); // for each attachment...
        var rightHook = hooks.find(x => x.id === bridgeBuffer['hook_id']);
        var nameToSend = bridgeBuffer['user_un'];
        if (serv.members.find(x => x.id === bridgeBuffer['user_id']) != null) {
         nameToSend = serv.members.find(x => x.id === bridgeBuffer['user_id']).displayName;
         } // 
        //https://cdn.discordapp.com/avatars/134073775925886976/970d33bddeb40f9b7a20f7524a6b07f5.png?size=2048
        //avatar_url: bridgeBuffer['user_av'],
        //rightHook.edit("blanku", bridgeBuffer['user_av'])
        //.then(rightHook => {
         rightHook.send(bridgeBuffer['content'], {
          "username": nameToSend,
          "avatarURL": bridgeBuffer['user_av'],
          "files": sendEmbed
          });
         //}); // closes "then right hook" because it's slow as hell even if it makes the thing work
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
  d && console.log("message");
  var server = 0;
  if (message.guild) server = message.guild;    
  var isBigBoss = 0;
  if (message.author.id === configz['bigboss']['id']) {
   isBigBoss = 1;   
   // console.log("hi boss");
   } // Sets the sentry variable to 1 if it's being sent by the botlord.
  if (server == 0 && message.author.id != disClient.user.id  && isBigBoss == 1) {
   console.log("test");
   // d ? dFuncs(message, isBigBoss) : doNothing();
   if (disFile['arm'] && (isBigBoss == 1)) {}
    else {disFile['arm'] = 1;}
   if (message.content.search(/^arm/) != -1 && isBigBoss == 1) {
    if (message.content.search(/^arm\+\+/) != -1) {
     disFile['arm'] = disFile['arm'] + 1; } // Add one to arm count.
    if (message.content.search(/^arm\-\-/) != -1) {
     disFile['arm'] = disFile['arm'] - 1; } // Reduce arm count by 1.
    if (message.content.search(/^arm 0/) != -1) {
     disFile['arm'] = 0; } // Disarm entirely.
    if (message.content.search(/^arm x/) != -1) {
     disFile['arm'] = 99999999; } // Mass arm.
    message.reply("Arm count: " + disFile['arm']);
    } // if it's modifying arm...
   if ((message.content.search(/^die/) != -1) && (isBigBoss == 1)) {
    if (disFile['arm'] < 1){
     message.reply("Error code NUI: not armed");
     } // If unarmed.
    else{process.abort();} // This kills the Electro-Magistrate.
    } // closes code for "die"
   if (message.content.search(/^purge/) != -1 && (isBigBoss == 1)) {
    if (disFile['arm'] < 1){
     message.reply("Error code NUI: not armed");
     }
    else{
     disFile['arm'] = disFile['arm'] - 1;
      if (message.content.substring(6,24) == message.content.substring(6,23)){
     message.reply("Invalid channel ID string.");
     disFile['arm']++;
     }
      else{
     var fetchid = message.content.substring(6,24);
     var todelete = message.content.substring(25,36);
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
       console.log("im gay");
      } // Closes if on the fetch channel being real.
     } // Closes on if the string is valid.
     } // Closes on if it's armed.
    } // Closes on if it detects a purge.
   if (message.content.search(/^brankav/) != -1  && isBigBoss == 1) {
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

   if (message.content.search(/^bad/) != -1 && (isBigBoss == 1)) {
    if (disFile['arm'] < 1){
     message.reply("Error code NUI: not armed");
     } // If unarmed.
    else{
     disFile['arm'] = disFile['arm'] - 1;
      if(message.content.search(/^bad\+/) != -1) {
     if((message.content.substring(5,22) != message.content.substring(5,21)) && (message.content.substring(5,23) == message.content.substring(5,24))) {
      badlist.push(message.content.substring(5,23));
      } // Add user ID to badlist.
     else {
      message.reply("Error: this isn't a user ID");
      } // If user ID is invalid.
     } // closes if "bad+"
      if(message.content.search(/^bad\-/) != -1) {
     if((message.content.substring(5,22) != message.content.substring(5,21)) &&(message.content.substring(5,23) == message.content.substring(5,24))) {
      if(badlist.indexOf(message.content.substring(5,23)) != -1) {
      badlist.splice(badlist.indexOf(message.content.substring(5,23)), 1);
      }
      else { message.reply("Error: ID not in badlist"); }
      }
     else { message.reply("Error: this isn't a user ID");}
     } // closes if "bad-"
     message.reply("```\n" + badlist + "```");
     fs.writeFileSync(__dirname + '/data/badlist.json', JSON.stringify(badlist, null, ' '));
     } // Closes on if it's armed.
    } // Closes on if it detects a badlist command.

   if (message.content.search(/^film cancel/) != -1 && (isBigBoss == 1) && film == "on") {
    for(var i = 0; i < Object.keys(timeoutz).length ; i++) {
     // console.log(timeoutz[i]);
     clearTimeout(timeoutz[i]);
     }
    message.reply("Canceled outstanding timeouts.");
    timeoutz = [];
    }

   if (message.content.search(/^film set/) != -1 && (isBigBoss == 1) && film == "on") {
    dateString = message.content.substring(9,34);
    flick = now.utc(dateString);
    // message.reply(dateString + " (" + flickname + ")");
    message.reply(now.utc(dateString).fromNow());
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
        message.reply(intervalmsg[intervals[timerinc]]);
        } // if interval message found
       else {
        message.reply(intervals[timerinc] + " SECONDS UNTIL START!");
        } // if specific message for interval not found
       if(intervals[timerinc] == 0) {
        message.reply("**Now playing: " + flickname + "** (00:00:00 / " + twoPad(flickrun[1]) + ":" + twoPad(flickrun[2]) + ":" + twoPad(flickrun[3]) + ")");
        } // if it's showtime
       console.log(timerinc + " before");
       timerinc++;
       console.log(timerinc + " after");
       }, intToStart)); // closes timeout
      //console.log(timeoutz.length);
      //console.log("timeout set");
      //console.log(timeoutz[timeoutz.length-1]);
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
    for(var i = 1; i < totalMins; i += filmPostInterval) {
     console.log("Setting timeout for " + i + " minutes");
     timeoutz.push(setTimeout(function() {
      message.reply("**Now playing: " + flickname + "** (" + twoPad(Math.floor(timerincr / 60)) + ":" + twoPad(timerincr) + " / " + twoPad(flickrun[1]) + ":" + twoPad(flickrun[2]) + ":" + twoPad(flickrun[3]) + ")");
      if (timerincr == 1) timerincr = 0; // same as with "i" down below!
      timerincr += filmPostInterval;
      }, intToStart + 1000*60*i)); // closes timeout
     if (i == 1) i = 0; // it'll do this on minute 1 but apart from that it should be even with the increment.
     } // Set timeouts for during-film time checks.
    timeoutz.push(setTimeout(function() {
     filmOngoing = 1;
     }, intToStart)); // set timeout on setting film status to ongoing!
    } // Closes on if it detects a film command.
// date format: 25 chars w/offset
// 2018-12-14T17:41:10-05:00

   if (message.content.search(/^film title/) != -1 && (isBigBoss == 1) && film == "on") {
    flickname = message.content.substring(11,999);
    message.reply("Title set: " + flickname + " (" + twoPad(flickrun[1]) + ":" + twoPad(flickrun[2]) + ":" + twoPad(flickrun[3]) + ")");
    } // Closes on if it detects a film command.

   if (message.content.search(/^film hrs/) != -1 && (isBigBoss == 1) && film == "on") {
    massage = message.content.substring(9,99999);
    flickrun[1] = parseInt(massage.substring(0,massage.indexOf(":")));
    massage = massage.substring(massage.indexOf(":")+1, 9999);
    flickrun[2] = parseInt(massage.substring(0,massage.indexOf(":")));
    flickrun[3] = parseInt(massage.substring(massage.indexOf(":")+1, 9999));
    message.reply("Film set: " + flickname + " (" + twoPad(flickrun[1]) + ":" + twoPad(flickrun[2]) + ":" + twoPad(flickrun[3]) + ")");
    } // Closes on if it detects a film command.

   if (message.content.search(/^film mins/) != -1 && (isBigBoss == 1)) {
    massage = message.content.substring(9,99999);
    totalMinutes = parseInt(massage.substring(0,massage.indexOf(":")));
    flickrun[1] = Math.floor(totalMinutes / 60);
    flickrun[2] = totalMinutes % 60;
    flickrun[3] = parseInt(massage.substring(massage.indexOf(":")+1, 9999));
    message.reply("Film set: " + flickname + " (" + twoPad(flickrun[1]) + ":" + twoPad(flickrun[2]) + ":" + twoPad(flickrun[3]) + ")");
    } // Closes on if it detects a film command.

   if (message.content.search(/^!utc/) != -1 && (isBigBoss == 1) && film === "on") {
    message.reply("film set " + now.utc(flick).format());
    } // Closes on if it detects a fromnow command.

   if (message.content === 'ping') {
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
    antechamber.send(secrets[message.author.id] + ' : ' + message.content);
    d && console.log(secrets);
    } // closes "if the damn anonline is even turned on"

   if (message.content.search(/^listguilds/) != -1 && (isBigBoss == 1)) {
    message.reply("im gay");
    // console.log(disClient.guilds);
    for(var f = 0; f < Object.keys(allDiscos).length; f++){
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

   if (message.content.search(/^template/) != -1 && (isBigBoss == 1)) {
    message.reply("template");
    }

   if (message.content.search(/^ld reacts/) != -1 && (isBigBoss == 1)) {
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

   if (message.content.search(/^sv reacts/) != -1 && (isBigBoss == 1)) {
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

   if (message.content.search(/^rd /) != -1 && (isBigBoss == 1)) {
    var mscguild = message.content.substring(3, 21);
    var mscchannel = message.content.substring(22, 40);
    var mscmessage = message.content.substring(41, 59);
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

    }

   if (message.content.search(/^listroles/) != -1 && (isBigBoss == 1)) {
    var channelString = message.content.substring(10, 28);
    // console.log(disClient.guilds);
    for(var f = 0; f < Object.keys(allDiscos).length; f++){
     var iterator1 = allDiscos[f].guilds.keys();
     for (var i = 0; i < allDiscos[f].guilds.size; i++) {
      //console.log(i);
      //console.log(allDiscos[f].guilds.keys(i));
      serverId = iterator1.next().value;
      if (allDiscos[f].guilds.get(channelString)) {
       message.reply("``" + twoPad(allDiscos[f].guilds.get(serverId).roles.size) + "`` for ``" + allDiscos[f].user.id + "`` **\"" + allDiscos[f].user.username + "\"** on ``" + allDiscos[f].guilds.get(serverId).id + "`` **\"" + allDiscos[f].guilds.get(serverId).name + "\"**");
       var iterator2 = allDiscos[f].guilds.get(serverId).roles.keys();
       for (var fq = 0; fq < allDiscos[f].guilds.get(serverId).roles.size; fq++){
        roleId = iterator2.next().value;
        console.log(allDiscos[f].guilds.get(serverId).roles.get(roleId));
        message.reply("``" + twoPad(fq + 1) + "``: ``" + allDiscos[f].guilds.get(serverId).roles.get(roleId).id + "`` \"" + allDiscos[f].guilds.get(serverId).roles.get(roleId).name + "\"");
        } // closes loop for iterating over roles. god help our souls
       return;
       } // closes "if there's a server named it!"
      } // closes for loop
     } // closes iterator over all discos
    } // Closes on if it detects a list guilds command.

   } // closes "if !server and not itself"

  if (server == 0 && message.content.search(/^time/) != -1) {
   if (filmOngoing == 0) {
    message.reply("Film club's not in session, bonehead!");
    return;
    }
   for(var i = 0; i < 5; i++) {
    setTimeout(function() {
     intToStart = now.utc().diff(flick);
     message.reply(now.utc(intToStart).format("HH:mm:ss"));
     }, 5000 * i);
    }
   } // Closes reply to timechecks. Woo!
  // if it's a server message, i.e. in a channel somewhere
  if (server != 0 && message.author.id != disClient.user.id) {
   if (message.mentions.users.get(disClient.user.id)) {
    setTimeout(function() {message.channel.send("No one cared who I was till I compiled the source code.")}, 3000);
    }
   if (message.content === "In fact, one of them is in this very room!") {
    message.reply("You're god damn right I am, boss!")
    } // closes lol
   if (message.content === "If I break that module, will you die?") {
    setTimeout(function() {message.reply("it would be extremely painful.")}, 3000);
    } // closes lol
   if (message.content === "You're a big bot.") {
    console.log(message.channel.permissionOverwrites);
    setTimeout(function() {message.channel.send("For you.")}, 3000);
    } // closes lol
   if (message.content === "We're about to start having fun.") {
    setTimeout(function() {message.channel.send("**This isn't even my final form!**")}, 3000);
    } // closes lol
   if (message.content.search(/meow/) != -1) {
    message.react('🐈');
    // this is the unicode for a cat, it's not blank.
    // it's one character, despite taking up many spaces
    }


   if (message.content.search(/Debate me./) != -1 && configz['debate'] === "on") {
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
   var mcn = "<#" + mcid + ">";
   var mcnb = "'" + mcid + "'";
   //   console.log(mcid);
   //   console.log(disFile['bridges'][mcid]);
   //   console.log(mcnb);
   //   console.log(Object.keys(disFile['bridges']));
   //   console.log(disFile['bridges'][Object.keys(disFile['bridges'])]);
   //   console.log(disFile['bridges']);
   //   console.log(disFile['bridges'][mcnb]);
   //   console.log(disFile['bridges'][1]);     
   // left here as a monument to human idiocy. all of these commands above won't work.
   // disFile['bridges'][mcid] is the right one. -x 2k18 09 18
   if (disFile['bridges'][mcid] && disFile['bridges'][mcid]['active'] === "yes" && message.webhookID == null) {
    //console.log('detected!')
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
     'attache' : message.attachments
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
   if (mcn == homeroom) {}
   if (mcn == backroom) {}
   if (mcn == darkroom) {}
   if (disFile['anon'] === 'on') {
    if (message.content.search(/^recloak 0x/) != -1) {
     console.log("not implemented yet lol");
     } // if "recloak"
    if (message.content.search(/^0x/) != -1) {
     console.log("Message author: " + message.author.id);
     var sendto = message.content.substring(0,cloaklength);
     var sender = message.author.username;
     console.log("Sendto: " + sendto);
     console.log("Sender: " + sender);
     var sendage = message.content.substring(cloaklength + 1);
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
   if (mcn == headroom) {
    // if (message.content === 'pingas'){
    doNothing(message, isBigBoss);
    // }
    }
   console.log(disFile['appellation'] + ": " + message);
   if (message.content === "pingas") {
    message.reply('usual, i see');
    v && isBigBoss && console.log('big boss in the house');
    } // if pingas
   if (message.content === 'compingas' && isBigBoss) {
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
  if (message.content === 'writeout'){  
   v && console.log("writing out");
   message.reply("writing out to " + logFolder);
   botlog("writing out params");
   } // writeout
  if (message.content === 'dumpparams'){    
   console.log("dumping params");
   message.reply(JSON.stringify(configz)); 
   } // dump params
  if (message.content === 'rl configz'){
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
 try { fs.readFileSync(`${logFolder}/aoide.log`) } catch(e) {}
 fs.appendFileSync(`${logFolder}/aoide.log`, '\n[' + `${date()}` + "] " + message);
 } // closes botlog

function cbotlog (message) {
 var filename;
 console.log(message);
 try { fs.mkdirSync(logFolder) } catch(e) {}
 try { fs.readFileSync(`${logFolder}/aoide.log`) } catch(e) {}
 fs.appendFileSync(`${logFolder}/aoide.log`, '\n[' + `${date()}` + "] " + message);
 } // closes cbotlog

function dumblog (message) {
 var filename;
 try { fs.mkdirSync(logFolder) } catch(e) {}
 try { fs.readFileSync(`${logFolder}/sleuth.log`) } catch(e) {}
 fs.appendFileSync(`${logFolder}/sleuthery.log`, message);
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

