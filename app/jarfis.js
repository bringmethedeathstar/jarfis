require('dotenv').config({ path: '.env' });

const changelog = require('changelog-parser');
const commands = require('./commands.js');
const pkg = require('../package.json');
const Discord = require('discord.js');
const Level = require('enmap-level');
const client = new Discord.Client({ forceFetchUsers: true });
const express = require('express');
const core = require('./core.js');
const Enmap = require('enmap');
const env = process.env;
const app = express();

app.get('/', (request, response) => {
  console.log(getDateTime() + ' Ping Received');
  response.sendStatus(200);
});
app.listen(env.PORT);

client.on('error', e => console.error(e));
client.on('warn', e => console.warn(e));
client.on('debug', e => console.info(e));

client.on('ready', () => {
  client.servers = new Enmap({ provider: new Level({ name: 'servers' }) });
  client.losers = new Enmap({ provider: new Level({ name: 'losers' }) });
  client.jarfis = new Enmap({ provider: new Level({ name: 'jarfis' }) });

  client.user.setPresence({ game: { name: `in ${env.LOC}`, type: 0 } });

  console.log('meme machine is online');

  if (env.ENV === 'dev') return;

  client.jarfis.defer.then(() => {
    let { version } = client.jarfis.get('jarfis');

    changelog('./CHANGELOG.md')
      .then(log => {
        let changes = '';

        log.versions
          .filter(entry => entry.version > version)
          .forEach(change => {
            if (change.body.length) {
              changes =
                changes +
                `\n## Version ${change.version}\n\n${change.body.replace(
                  /\(\[.*\]\(.*\)\)/gm,
                  ''
                )}\n`;
            }
          });

        client.servers.defer.then(() => {
          // all data is loaded now.
          client.guilds.map(guild => {
            core.server.get(client, guild, s => {
              console.log(s.restart);
              if (!s.restart) return;

              const markdown = changes.length
                ? '\n\n' + '```markdown' + changes + '```'
                : '';

              const whattup = `What up pimps! It's me, ya boy, coming at you with a fresh new instance `;
              const dab = '<:dab:355643174628229120>';

              client.channels
                .get(s.default)
                .send(whattup + dab + markdown)
                .catch(console.error);
            });
          });
        });

        client.jarfis.set('jarfis', { version: pkg.version });
      })
      .catch(console.error);
  });

  // setTimeout(self.insult, 600000);
});

client.on('message', msg => {
  if (msg.author.bot || !msg.guild) return;

  let id = msg.guild.id || 0;

  if (
    (env.ENV === 'dev' && id === env.DEV_ID) ||
    (env.ENV !== 'dev' && id !== env.DEV_ID)
  ) {
    listen(client, msg);
  }
});

// Create server shit when Jarfis joins a server
client.on('guildCreate', guild => {
  core.server.new(client, guild, options => {
    let id = options.default,
      pf = options.prefix;

    client.channels
      .get(id)
      .send(
        `What up pimps! My prefix is \`${pf}\` and your default channel is <#${id}>. Hit dat fatty \`${pf}help\` to change shit`
      );
  });
});

// Pin Announcements
client.on('channelPinsUpdate', (channel, time) => {
  let id = channel.guild.id || 0;

  if (
    (env.ENV === 'dev' && id === env.DEV_ID) ||
    (env.ENV !== 'dev' && id !== env.DEV_ID)
  ) {
    core.newPin(channel);
  }
});

client.login(env.TOKEN);

// Loop through the commands module if msg starts with prefix
function listen(client, msg) {
  let guild = core.server.get(client, msg.guild),
    user = core.user.get(client, msg.author.id);

  if (msg.content.startsWith(guild.prefix)) {
    if (user.banned) return msg.channel.send('Nah soz mate!');

    let message = msg.content.split(/^(?:!(\w+))/);

    let cmd = message[1];
    if (message[2]) {
      var args = message[2].split(/ \| /);
      args = args.map(str => (str = str.trim()));
    }
    if (cmd in commands) {
      commands[cmd].execute(client, msg, args);
    }
  } else if (
    Object.prototype.hasOwnProperty.call(
      guild.responses,
      msg.content.toLowerCase()
    )
  ) {
    msg.channel.send(guild.responses[msg.content.toLowerCase()].response);
  }
}

function insult() {
  // haha dead code
  console.log('insult time :wehehehe:');
  // let users = client.users.array();
  // let losers = [];
  // let minTrig = 10800000; // Triggers between 3 and 6 hours
  // let maxTrig = 21600000;
  // let randTime = 0;
  // let date = new Date();
  // let insults = fs
  //   .readFileSync(`${__dirname}/data/insults.txt`)
  //   .toString()
  //   .split('\n');

  // if (date.getDay() > 0 && date.getDay() < 6 && date.getHours() >= 9) {
  //   for (var i = users.length - 1; i >= 0; i--) {
  //     if (!users[i].bot && users[i] instanceof Discord.User) {
  //       losers.push(users[i]);
  //     }
  //   }

  //   client.channels
  //     .get('415900255691866122')
  //     .send(
  //       `<@${losers[Math.floor(Math.random() * losers.length)].id}> you ${
  //         insults[Math.floor(Math.random() * insults.length)]
  //       }`
  //     );
  // }

  // randTime = Math.floor(Math.random() * (maxTrig - minTrig)) + minTrig;
  // setTimeout(insult, randTime);
}

function getDateTime() {
  let date = new Date(),
    dateTime =
      [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/') +
      ' ' +
      [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
  return dateTime;
}

//       _             _
//      //             \\
//     /'               `\
//    /,'     ..-..     `.\
//   /,'   .''     ``.   `.\
//  /,'   :   .---.   :   `.\
// I I   :  .'\   /`.  :   I I
// I b__:   . .`~'. .   :__d I
// I p~~:   . `._.' .   :~~q I
// I I   :   ./   \.   :   I I
//  \`.   :   `---'   :   ,'/
//   \`.   `..     ..'   ,'/
//    \`.     ``~''     ,'/
//     \`               '/
//      \\             //
//       ~             ~
