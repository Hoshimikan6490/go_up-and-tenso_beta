const {
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: {
    name: "help",
    description: "❔全コマンドのヘルプを表示します",
    options: [
      {
        type: ApplicationCommandOptionType.String,
        name: "commands",
        description: "詳細を表示するコマンドを指定します",
        required: true,
        choices: [
          { name: "help", value: "help" },
          { name: "go_up", value: "go_up" },
        ],
      },
    ],
  },
  async execute(interaction) {
    if (interaction.options.getString("commands") === "help") {
      const button = new ActionRowBuilder().setComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel("サポートサーバーに参加する")
          .setURL("https://discord.gg/uYYaVRuUuJ")
      );

      await interaction.reply({
        embeds: [
          {
            title: "helpコマンドの説明",
            description:
              "このメッセージを送信します。\n\nこのBOTは「上から見る」の機能のみ搭載しています。また、利用できるサーバーを限定しています。詳しくは、サポートサーバーでお尋ねください。",
            color: 4303284,
            timestamp: new Date(),
          },
        ],
        components: [button],
        ephemeral: true,
      });
    } else if (
      interaction.options.getString("commands") === "go_up"
    ) {
      await interaction.reply({
        embeds: [
          {
            title: "go_upコマンドのヘルプ",
            description: "「url」のパラメーターにジャンプしたい先のメッセージURLを入力してください。\nサーバー管理権限がある者のみが実行できます。",
            color: 4303284,
            timestamp: new Date(),
          },
        ],
        ephemeral: true,
      });
    }
  },
};
