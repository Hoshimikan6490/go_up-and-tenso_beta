const {
  Client,
  GatewayIntentBits,
  WebhookClient,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});
const prefix = "!";
const token =
  "MTA3NTAyODU1OTgyOTE0NzY3MQ.GOZBoa.1xbUA8pAGBvJbtBXmyq2vEse-bthOOT0zgi4lw";

// botが準備できれば発動され、 上から順に処理される。
client.on("ready", () => {
  // コンソールにReady!!と表示
  console.log("Ready!!");

  // ステータスを設定する
  setInterval(() => {
    client.user.setActivity({
      name: `所属サーバー数は、${client.guilds.cache.size}サーバー｜　Ping値は、${client.ws.ping}msです`,
    });
  }, 10000);
  client.channels.cache.get("889486664760721418").send("起動しました！");

  // readyイベントここまで
});

// botがメッセージを受信すると発動され、 上から順に処理される。
client.on("messageCreate", async (message) => {
  if (
    message.guild.id == "1065188153859768360" ||
    message.guild.id == "889474199704436776"
  ) {
    if (message.content.startsWith(`${prefix}about`)) {
      // メッセージの本文が about だった場合
      message.channel.send("about!!!!!!");
    } else if (message.content.startsWith(`${prefix}go_up`)) {
      message.channel
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
                "https://discord.com/channels/1065188153859768360/1065188154577010730/1074988107268636682" //top message
              )
              .setStyle(ButtonStyle.Link)
              .setLabel("上から見る")
          );

          webhookclient.send({
            username: "上にいく！",
            components: [button],
          });
        });
    }
  } else {
    //サーバーオーナーにDM
    let owner_id = message.guild.ownerId;
    let owner = client.users.fetch(owner_id);

    const button = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("サポートサーバーに参加する")
        .setURL("https://discord.gg/uYYaVRuUuJ")
    );

    (await owner).send({
      embeds: [
        {
          title: "重要なお知らせ",
          description: `本BOTをご利用いただき、ありがとうございます。\nご招待いただいたところ、大変恐縮ですが、__**このBOTが招待されたサーバー「${message.guild.name}」では、本BOTをご利用いただけません**__。\n\n本BOTはBOTの仕様上不都合がある為、導入できるサーバーを制限しております。\nご理解・ご協力、よろしくお願いします。\n\`※ご不明な点がございましたら、以下のボタンより、サポートサーバーでお尋ねください。\``,
          color: 0xff0000,
          footer: {
            text: `＜DMで失礼します。`,
            icon_url: "attachment://me.png",
          },
        },
      ],
      files: [
        {
          attachment: "./images/me.png",
          name: "me.png",
        },
      ],
      components: [button],
    });

    //退出するコード
    client.guilds.cache.get(message.guild.id).leave();
  }
});
client.login(token);
