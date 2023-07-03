const {
  ApplicationCommandOptionType,
  WebhookClient,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: {
    name: "go_up",
    description: "⬆️上から見てねボタンの作成",
    options: [
      {
        type: ApplicationCommandOptionType.String,
        name: "url",
        description: "ジャンプする先のメッセージURLを入力",
        required: true,
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
      let url = interaction.options.getString("url");
      interaction.channel
        .createWebhook({
          name: "上にいく！",
          avatar:
            "https://cdn.discordapp.com/attachments/1012880613717590058/1075045771914780774/usa_108.png",
        })
        .then((webhook) => {
          let webhookclient = new WebhookClient(webhook);

          let button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setURL(
                url //top message
              )
              .setStyle(ButtonStyle.Link)
              .setLabel("上から見る")
          );

          webhookclient.send({
            username: "上にいく！",
            components: [button],
          });

          webhookclient.delete();
        });
      interaction.reply({
        content: "送信しました",
        ephemeral: true,
      });
    }
  },
};
