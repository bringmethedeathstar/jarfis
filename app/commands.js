require('dotenv').config({path: '.env'});

const Discord = require('discord.js');
const fs = require('fs');
// //const Twitter = require('twitter'); // Not currently in use
const env = process.env;

module.exports = {
  help: {
    desc: 'Lists all available commands.',
    args: '',
    execute: (client, msg) => {
      msg.delete()
        .then()
        .catch(console.error);

      let embed = new Discord.RichEmbed()
        .setColor(3447003)
        .setDescription(':information_source: here are my commands')
        .setThumbnail(client.user.avatarURL) // Bot's avatar
        .addBlankField(true);

      for (var command in module.exports) {
        if (command) {
          embed.addField(`!${command} ${module.exports[command].args}`, module.exports[command].desc);
        }
      }

      msg.channel.send({embed});
    }
  },
  name: {
    desc: 'Returns the current name of the bot.',
    args: '',
    execute: (client, msg) => {
      let bot;

      try {
        if ('guild' in msg && 'member' in msg.guild && 'user' in client && msg.guild.member(client.user).nickname) {
          bot = msg.guild.member(client.user).nickname;
        } else {
          bot = client.user.username;
        }
      } catch (e) {
        bot = 'Jarfis';
      }

      msg.channel.send(`the name's ${bot}, don't wear it out`);
    }
  },
  loc: {
    desc: 'Returns the bot\'s environment.',
    args: '',
    execute: (client, msg) => {
      msg.channel.send(`chillin' at ${env.LOC}`);
      client.user.setPresence({game: {name: `in ${env.LOC}`, type: 0}});
    }
  },
  r: {
    desc: 'Rates a meme.',
    args: '<integer between 0 and 5>',
    execute: (client, msg, args) => {
      msg.delete()
        .then()
        .catch(console.error);

      msg.channel.send(msg.member.nickname ? msg.member.nickname : msg.author.username, {
        file: `app/resources/${args[1]}.png`
      });
    }
  },
  change: {
    desc: 'Changes the name of the bot.',
    args: '<string: no spaces... for now>',
    execute: (client, msg, args) => {
      let newName = '';

      for (let i = 1; i < args.length; i++) {
        newName += args[i] + ' ';
      }

      msg.guild.member(client.user).setNickname(newName).then(function () {
        let bot = (msg.guild.member(client.user).nickname ? msg.guild.member(client.user).nickname : client.user.username);
        msg.channel.send(`just call me ${bot}`);
      }).catch(error => msg.reply(`can't do that my dude: ${error}`));
    }
  },
  reset: {
    desc: 'Resets the name of the bot.',
    args: '',
    execute: (client, msg) => {
      msg.guild.member(client.user).setNickname('Jarfis').then(function () {
        msg.channel.send(`reverting to Jarfis. Don't fuck me up again I'm a soft boy`);
      }).catch(error => msg.reply(`can't do that my dude: ${error}`));
    }
  },
  tweet: {
    desc: 'Pulls in a tweet.',
    args: '<string: URL of the tweet to pull in> <integer>',
    execute: (client, msg) => {
      /* //let tw = new Twitter({
         consumer_key: env.TWITTER_CONSUMER_KEY,
         consumer_secret: env.TWITTER_CONSUMER_SECRET,
         access_token_key: env.TWITTER_ACCESS_TOKEN_KEY,
         access_token_secret: env.TWITTER_ACCESS_TOKEN_SECRET
       });

       tw.get('favorites/list', function (error, tweets, response) {
          if(error) throw error;
         console.log('wip'); // The favorites.
          console.log(response);  // Raw response object.
       }); */

      msg.channel.send(`haha yes that was a tweet`);
    }
  },
  flip: {
    desc: 'Flip a coin.',
    args: '',
    execute: (client, msg) => { // Should be more modular and less shit
      let heads = 'https://i.gyazo.com/e380b49fc9e2b8b86571975f7df01d52.gif';
      let tails = 'https://i.gyazo.com/8697b5c1f85e43ec9580bc59727c5fcc.gif';
      let res = (Math.floor(Math.random() * 2) === 0) ? 'heads' : 'tails';
      let embed = new Discord.RichEmbed()
        .setColor((res === 'heads' ? '3232ff' : 'FFD700'))
        .setTitle(`it's ${res} motherfucker`)
        .setThumbnail((res === 'heads' ? heads : tails))
        .addBlankField(true);

      msg.channel.send({embed});
    }
  },
  rc: {
    desc: 'RaNCApS YOUR TeXt.',
    args: '<string>',
    execute: (client, msg, args) => {
      let str = '';
      let i = 0;

      for (i; i < args.length; i++) {
        if (i !== 0) {
          str += args[i] + ' ';
        }
      }

      let a = str.split('');
      let n = a.length;

      for (i = n - 1; i >= 0; i--) {
        let r = Math.floor(Math.random() * n) + 1;
        a[r] = (a[r] ? a[r].toUpperCase() : '');
      }

      msg.delete()
        .then()
        .catch(console.error);

      msg.channel.send(a.join(''));
    }
  },
  clear: {
    desc: 'Hide the edge.',
    args: '',
    execute: (client, msg) => {
      msg.delete()
        .then()
        .catch(console.error);

      msg.channel.send('.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n+--------+\n+**CLEAR**+\n+--------+');
    }
  },
  nut: {
    desc: 'Good Delicious Nut.',
    args: '',
    execute: (client, msg) => {
      msg.delete()
        .then()
        .catch(console.error);

      msg.channel.send('Let you fuck my face\nGood nutritious nut, on deck nigga');
    }
  },
  think: {
    desc: 'Shows a random thinking emoji',
    args: '',
    execute: (client, msg) => {
      let filePath = './app/resources/thinking/';

      fs.readdir(filePath, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          let r = Math.floor(Math.random() * data.length);
          let selection = filePath + data[r];

          msg.delete()
            .then()
            .catch(console.error);

          msg.channel.send({
            file: selection
          });
        }
      });
    }
  },
  echo: {
    desc: 'Get Jarfis to parrot you.',
    args: '<string>',
    execute: (client, msg, args) => {
      let str = '';

      for (let i = 0; i < args.length; i++) {
        if (i !== 0) {
          str += args[i] + ' ';
        }
      }

      msg.delete()
        .then()
        .catch(console.error);

      msg.channel.send(str);
    }
  },
  // Join: {
  //   desc: 'Summons Jarfis to your current voice channel',
  //   args: '',
  //   execute: (client, msg) => {
  //     var voice = msg.member.voiceChannel;

  //     if (voice) {
  //       voice.join()
  //       .then(conn => {
  //         conn.on('speaking', (user, speaking) => {
  //           if (speaking) {
  //             console.log(`${user} is speaking`)
  //           }
  //         });
  //       }).catch(console.error);
  //     }

  //     //this could be simplified but I'm tired as balls
  //   }
  // },
  // leave: {
  //   desc: 'Kicks Jarfis from your current voice channel',
  //   args: '',
  //   execute: (client, msg) => {
  //     var voice = msg.member.voiceChannel;

  //     if (voice) {voice.leave();}

  //     //this could be simplified but I'm tired as balls
  //   }
  // }
  addResp: {
    desc: 'Add a trigger and response to the bot',
    args: '"<Trigger:string>", "<Response:string>"',
    execute: () => {
      // Gitignore the file so local boys not overwrote
      // write trigger as key response as value to the JSON file
      // echo command successfully added and repeat what was added in an embed
    }
  },
  delResp: {
    desc: 'Delete a trigger and response from the bot',
    args: '"<Trigger:string>"', // Just the trigger needed to delete from the JSON
    execute: () => {
      // Search for trigger and delete from file
      // respond with the trigger and response deleted so canbe readded if mistake?
      // allow to delete with number in list as well as trigger?
    }
  },
  showResp: {
    desc: 'List all the triggers and responses written to the bot',
    args: '',
    execute: () => {
      // Loop over file and list all triggers and responses in a discord embed
      // maybe paginate responses a la the rythm queue
    }
  }
};

//                                              ____________
//                               --)-----------|____________|
//                                             ,'       ,'
//               -)------========            ,'  ____ ,'
//                        `.    `.         ,'  ,'__ ,'
//                          `.    `.     ,'       ,'
//                            `.    `._,'_______,'__
//                              [._ _| ^--      || |
//                      ____,...-----|__________ll_|\
//     ,.,..-------"""""     "----'                 ||
// .-""  |=========================== ______________ |
//  "-...l_______________________    |  |'      || |_]
//                               [`-.|__________ll_|
//                             ,'    ,' `.        `.
//                           ,'    ,'     `.    ____`.
//               -)---------========        `.  `.____`.
//                                            `.        `.
//                                              `.________`.
//                              --)-------------|___________|
