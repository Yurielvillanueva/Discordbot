                                      const { EmbedBuilder, PermissionsBitField, ChannelType } = require("discord.js");
                                      const config = require("../config.json");

                                      module.exports = {
                                          say: {
                                              name: "say",
                                              description: "Send a message to a mentioned channel",
                                              usage: "!say #channel <your message>",
                                              permissions: ["MANAGE_MESSAGES"],
                                              execute: async (message, args) => {
                                                  const mentionedChannel = message.mentions.channels.first();

                                                  if (!mentionedChannel || mentionedChannel.type !== ChannelType.GuildText) {
                                                      return message.reply({
                                                          embeds: [
                                                              new EmbedBuilder()
                                                                  .setColor(config.colors.error || 0xff0000)
                                                                  .setTitle("❌ Invalid or No Channel Mentioned")
                                                                  .setDescription("Usage: `!say #channel <your message>`")
                                                                  .setTimestamp(),
                                                          ],
                                                      });
                                                  }

                                                  // Remove the channel mention from the args
                                                  const sayMessage = args.slice(1).join(" ");

                                                  if (!sayMessage) {
                                                      return message.reply({
                                                          embeds: [
                                                              new EmbedBuilder()
                                                                  .setColor(config.colors.error || 0xff0000)
                                                                  .setTitle("❌ No message provided")
                                                                  .setDescription("Usage: `!say #channel <your message>`")
                                                                  .setTimestamp(),
                                                          ],
                                                      });
                                                  }

                                                  // Delete original command (optional)
                                                  try {
                                                      if (message.deletable) await message.delete();
                                                  } catch (err) {
                                                      console.warn("Failed to delete command message:", err.message);
                                                  }

                                                  // Send message to the target channel
                                                  try {
                                                      await mentionedChannel.send(sayMessage);
                                                  } catch (error) {
                                                      console.error("Failed to send message:", error);
                                                      return message.reply("❌ Failed to send the message.");
                                                  }
                                              },
                                          },
                                      };
