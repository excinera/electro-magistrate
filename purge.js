// x. cinera 2k18 12 20

const fs = require('fs');
const disco = require('discord.js');

const purgeConfig = JSON.parse(fs.readFileSync(__dirname + '/config.json'));   

const disClient = new disco.Client();
disClient.login(purgeConfig['token']).catch(err => {console.log('Authentication failure!'); throw err});
console.log("Starting purge on " + purgeConfig['server_id']);
disClient.on('ready', () => {
 purgeConfig(
 console.log(disClient.guilds);
 disServer = disClient.guilds.get(purgeConfig['server_id']);
 console.log("im gay");
 console.log(disServer.channels);
 disChannel = disServer.channels.get(purgeConfig['purge_channel']);
 var i = 1;
 killEmAll(disChannel);

 function killEmAll(channel) {
  console.log(channel.lastMessageID);
  channel.bulkDelete(100)
   .then(messages => {
    console.log(`Bulk deleted ${messages.size} messages`)
    if (messages.size == 0) { exitProgram(channel); }
    killEmAll(channel);
    }) // What to do with the messages!
   .catch(console.error);
  // }
  } // closes killEmAll

 function exitProgram(channel) {
  channel.send(purgeConfig['message'])
   .then(function() {
    console.log("Purge complete");
    process.abort();
    }
   .catch({
    console.log("Purge complete");
    process.abort();
    });
  } // closes exitProgram

 }); // closes routine to execute when the client's ready.