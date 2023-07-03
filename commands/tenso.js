const {
  ApplicationCommandOptionType,
  WebhookClient,
  PermissionsBitField,
} = require("discord.js");
const { Collection } = require("@discordjs/collection");
const fs = require("fs");

module.exports = {
  data: {
    name: "tenso",
    description: "チャット履歴の転送",
    options: [
      {
        type: ApplicationCommandOptionType.Channel,
        name: "old_channel",
        description: "転送元のチャンネル",
        required: true,
      },
      {
        type: ApplicationCommandOptionType.Channel,
        name: "new_channel",
        description: "転送先のチャンネル",
        require: true,
      },
    ],
  },
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      interaction.reply({
        content: "申し訳ございません。\nこのコマンドは管理者限定です",
        ephemeral: true,
      });
    } else {
      let old_channel = interaction.options.getChannel("old_channel");
      let new_channel = interaction.options.getChannel("new_channel");
      //////////////////////////////////////////
      function array2Collection(messages) {
        return new Collection(
          messages
            .slice()
            .sort((a, b) => {
              const a_id = BigInt(a.id);
              const b_id = BigInt(b.id);
              return a_id > b_id ? 1 : a_id === b_id ? 0 : -1;
            })
            .map((e) => [e.id, e])
        );
      }

      async function fetchMany(channel, options = { limit: 50 }) {
        if ((options.limit ?? 50) <= 100) {
          return channel.messages.fetch(options);
        }

        if (typeof options.around === "string") {
          const messages = await channel.messages.fetch({
            ...options,
            limit: 100,
          });
          const limit = Math.floor((options.limit - 100) / 2);
          if (messages.size < 100) {
            return messages;
          }
          const backward = fetchMany(channel, {
            limit,
            before: messages.last().id,
          });
          const forward = fetchMany(channel, {
            limit,
            after: messages.first().id,
          });
          return array2Collection(
            [messages, ...(await Promise.all([backward, forward]))].flatMap(
              (e) => [...e.values()]
            )
          );
        }
        let temp;
        function buildParameter() {
          const req_cnt = Math.min(options.limit - messages.length, 100);
          if (typeof options.after === "string") {
            const after = temp ? temp.first().id : options.after;
            return { ...options, limit: req_cnt, after };
          }
          const before = temp ? temp.last().id : options.before;
          return { ...options, limit: req_cnt, before };
        }
        const messages = [];
        while (messages.length < options.limit) {
          const param = buildParameter();
          temp = await channel.messages.fetch(param);
          messages.push(...temp.values());
          if (param.limit > temp.size) {
            break;
          }
        }
        return array2Collection(messages);
      }
      ////////////////////////////////////
      let messages = [];
      const fetchedMessages = await fetchMany(old_channel, {
        limit: 100,
      });

      fetchedMessages.forEach((msg) => {
        var timestamp = msg.createdTimestamp;
        var date = new Date(timestamp);
        var date = date.toLocaleString("ja-jp");

        messages.push({
          user_name: msg.author.username,
          user_icon: msg.author.avatarURL(),
          content: msg.content,
          timestamp: date,
          embeds: msg.embeds,
        });
      });

      let sorted_messages = messages.reverse();
      fs.writeFileSync("data.json", JSON.stringify(messages));
      fs.writeFileSync("data_reversed.json", JSON.stringify(sorted_messages));

      interaction.reply({
        content: "送信中です…",
        ephemeral: true,
      });

      interaction.channel
        .createWebhook({
          name: "転送bot",
          avatar:
            "https://cdn.discordapp.com/attachments/980641967694311484/1078961760582762556/negate.png",
        })
        .then((webhook) => {
          let webhookclient = new WebhookClient(webhook);

          for (key in sorted_messages) {
            if (sorted_messages[key].embeds.length) {
              webhookclient.send({
                username: "転送bot",
                embeds: sorted_messages[key].embeds,
              });
            } else {
              webhookclient.send({
                username: "転送bot",
                embeds: [
                  {
                    author: {
                      name: sorted_messages[key].user_name,
                      icon_url: sorted_messages[key].user_icon,
                    },
                    description: sorted_messages[key].content,
                    footer: {
                      text: sorted_messages[key].date,
                    },
                  },
                ],
              });
            }

            //console.log(String(Number(key) + 1) == sorted_messages.length);
            if (String(Number(key) + 1) == sorted_messages.length) {
              new_channel.messages
                .fetch({ after: "0", limit: 1 })
                .then((messages) => messages.first())
                .then((m) => {
                  webhookclient.send({
                    embeds: [
                      {
                        color: 0xffff00,
                        title: "最初に飛ぶ",
                        url: m.url,
                      },
                    ],
                  });
                });
            }
          }
          //webhookclient.delete();
        });
    }
  },
};
