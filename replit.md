# Orbit Discord Bot

## Overview

Orbit is a Discord bot built with Node.js and Discord.js v14. It's a multi-purpose Discord bot that provides moderation, fun, and utility commands for Discord servers. The bot uses a file-based JSON storage system for data persistence and follows a modular command architecture.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Core Framework
- **Platform**: Node.js runtime environment
- **Library**: Discord.js v14 for Discord API interactions
- **Configuration**: JSON-based configuration system with centralized settings
- **Data Storage**: File-based JSON storage (no external database required)

### Bot Architecture
The bot follows a modular, event-driven architecture:
- **Main Entry Point**: `index.js` handles client initialization, event listeners, and dynamic command loading
- **Command System**: Modular command files with automatic discovery and loading
- **Configuration Management**: Centralized config file for bot settings, colors, and cooldowns
- **Permission System**: Multi-layer permission checking with owner and administrator overrides

## Key Components

### Command Structure
Commands are organized into three main categories with specific purposes:

1. **Moderation Commands** (`commands/moderation.js`)
   - Role management: add, remove, and temporary role assignment
   - Permission-based access control with automatic cleanup
   - Bot permission validation before execution

2. **Fun Commands** (`commands/fun.js`)
   - Interactive entertainment: magic 8-ball, jokes, coin flip, dice rolling
   - Rock-paper-scissors game functionality
   - Randomized response systems

3. **Utility Commands** (`commands/utility.js`)
   - Dynamic help system with command discovery
   - Anonymous confession system with data persistence
   - Bot status and ping utilities

### Data Management
- **Storage Type**: JSON files in `/data` directory for persistence
- **Temporary Roles**: Tracked in `tempRoles.json` with expiration timestamps and automatic cleanup
- **Confessions**: Anonymous submissions stored in `confessions.json` with metadata
- **Database Initialization**: Automatic directory and file creation on startup

### Permission System
The bot implements a robust multi-layer permission system:
- **Bot Owner Override**: Complete access bypass for configured owner
- **Administrator Bypass**: Server administrators get full command access
- **Granular Permissions**: Command-specific permission requirements
- **Bot Permission Validation**: Automatic checking of bot's own permissions before execution

## Data Flow

1. **Message Processing**: Bot receives messages, filters by prefix, and routes to appropriate commands
2. **Permission Validation**: Multi-layer permission checking before command execution
3. **Command Execution**: Modular command handlers process requests with error handling
4. **Data Persistence**: JSON file operations for temporary roles and confessions
5. **Response Generation**: Rich embed responses with consistent styling and error handling

## External Dependencies

### Core Dependencies
- **discord.js**: Primary Discord API wrapper (v14.21.0)
- **Node.js Built-ins**: File system operations, path handling, and JSON processing

### Discord API Integration
- **Gateway Intents**: Guilds, Messages, Message Content, and Guild Members
- **Permission System**: Integration with Discord's permission flags
- **Rich Embeds**: Consistent styling with configurable color schemes

## Deployment Strategy

### Environment Requirements
- Node.js 16.11.0 or higher (required by Discord.js v14)
- File system write access for data persistence
- Discord bot token configuration

### Configuration Setup
1. **Bot Token**: Environment variable or direct configuration
2. **Owner ID**: Configured in `config.json` for administrative access
3. **Prefix**: Customizable command prefix (default: "!")
4. **Cooldowns**: Per-command rate limiting configuration

### Data Persistence
- **File Structure**: Automatic creation of `/data` directory on startup
- **Error Handling**: Graceful fallbacks for missing files or directories
- **Cleanup Tasks**: Automatic removal of expired temporary roles via intervals

### Monitoring and Logging
- **Startup Logging**: Connection status and guild count reporting
- **Error Handling**: Console warnings for duplicate commands and permission issues
- **Activity Status**: Dynamic bot presence with help command information