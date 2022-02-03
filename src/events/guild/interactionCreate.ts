import { Bot } from '../../util/client';

export default async (client: Bot, interaction) => {
	const { supportOfficer } = client.settings

  if (interaction.customId === 'ticket_type') {
    if (!interaction.isSelectMenu()) return;
	
    interaction.channel.permissionOverwrites.edit(interaction.user.id, { SEND_MESSAGES: true });

    interaction.channel.setName(
      `${interaction.values[0]}-${interaction.user.username}`
    );
    return interaction.update({
      content: `${interaction.user}, **${
        interaction.values[0].charAt(0).toUpperCase() +
        interaction.values[0].slice(1)
      }** Seçildi. \n<@&${
        supportOfficer
      }> Rolündeki yetkililer seninle ilgilencektir.`,
      components: [],
    });
  }
};
