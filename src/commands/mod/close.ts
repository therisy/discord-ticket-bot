import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
  TextChannel,
} from 'discord.js';
import { Bot } from '../../util/client';
import { command } from '../../util/interfaces';

export default {
  name: 'close',
  description: 'ticket create',
  cooldown: 0,
  aliases: ['tclose', 't-close', 'kapat'],
  async execute(client: Bot, message: Message, args: string[], cmd: string) {
    const { categorys, parentID, owners, supportOfficer } = client.settings;
    if (!message.member.roles.cache.has(supportOfficer)) return;
    let channel = client.channels.cache.get(message.channel.id) as TextChannel;
    if (channel.parent.id != parentID) return;

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('ticket_close_y')
        .setLabel('Evet')
        .setStyle('SUCCESS'),

      new MessageButton()
        .setCustomId('ticket_close_x')
        .setLabel('Hayır')
        .setStyle('DANGER')
    );

    message.channel.send({
      content: 'Kanalı silmek istediğinizden eminmisiniz?',
      components: [row],
    });

    const filter = (i) =>
      ['ticket_close_y', 'ticket_close_x'].includes(i.customId);

    const collector = message.channel.createMessageComponentCollector({
      filter,
      time: 15000,
    });

    collector.on('collect', async (interaction) => {
      if (!interaction.isButton()) return;

      if (interaction.customId === 'ticket_close_y') {
        interaction.update({
          content: 'Kanal 5 saniye sonra siliniyor.',
          components: [],
        });
        setTimeout(() => {
          return message.channel.delete();
        }, 5000);
      } else if (interaction.customId === 'ticket_close_x') {
        return interaction.update({
          content: 'Kanal silinme işlemi iptal edildi.',
          components: [],
        });
      }
    });
  },
} as command;
