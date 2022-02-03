import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} from 'discord.js';
import { Bot } from '../../util/client';
import { command } from '../../util/interfaces';

export default {
  name: 'ticket',
  description: 'ticket create',
  cooldown: 0,
  aliases: ['t'],
  async execute(client: Bot, message: Message, args: string[], cmd: string) {
    const { categorys, parentID, owners, supportOfficer } = client.settings;
    if (!owners.includes(message.author.id)) return;

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('ticket_create')
        .setLabel('Create')
        .setStyle('SUCCESS')
    );
    message.channel.send({
      content: 'Ticket Oluştur',
      components: [row],
    });

    const filter = (i) => i.customId === 'ticket_create';

    const collector = message.channel.createMessageComponentCollector({
      filter,
    });

    const selectMenu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId('ticket_type')
        .setPlaceholder('Bir şeyler seçiniz.')
        .setMaxValues(1)
        .addOptions(
          categorys.map((_v) => {
            return {
              label: `${_v}`,
              description: `${_v} ile ilgili sorunlar için!`,
              value: _v.toLowerCase(),
            };
          })
        )
    );

    collector.on('collect', async (interaction) => {
      if (!interaction.isButton()) return;

      if (interaction.customId === 'ticket_create') {
        const userChannel = message.guild.channels.cache.find(
          (a) =>
            a.isText() &&
            a.parent.id == parentID &&
            a.name.endsWith(interaction.user.username.toLowerCase())
        );

        if (userChannel)
          return interaction.reply({
            content: `Şuan zaten destek kanalın açık, ${userChannel}`,
            ephemeral: true,
          });

        await interaction.guild.channels
          .create(`destek-${interaction.user.username}`, {
            type: 'GUILD_TEXT',
            parent: parentID,
            permissionOverwrites: [
              {
                id: interaction.user.id,
                allow: ['VIEW_CHANNEL'],
              },
              {
                id: supportOfficer,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
              },
              {
                id: interaction.guild.roles.everyone,
                deny: ['VIEW_CHANNEL'],
              },
            ],
          })
          .then(async (_channel) => {
            interaction.reply({
              content: `Kanal oluşturuldu, Sorununu yazmaya başla!\n${_channel}`,
              ephemeral: true,
            });

            return _channel.send({
              content: 'Lütfen sorunun tipini seçiniz.',
              components: [selectMenu],
            });
          });
      }
    });
  },
} as command;
