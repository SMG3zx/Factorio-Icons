# Factorio Icons Plugin for Obsidian

## Overview
The Factorio Icons plugin automatically converts Factorio item names into their corresponding icons within your Obsidian notes. This provides a more visual and immersive note-taking experience for Factorio-related content.

## Features
- Automatically converts Factorio item names to their corresponding 32px icons
- Maintains hover functionality to display item names
- Real-time conversion as you type
- Supports over 200 Factorio items
- Preserves document formatting and layout

## Installation

To install the plugin for development:

1. Clone the repository into your Obsidian plugins folder:
   ```bash
   cd YOUR_OBSIDIAN_VAULT/.obsidian/plugins/
   git clone https://github.com/YOUR_USERNAME/obsidian-factorio-icons.git
   ```

2. Install dependencies and build the project:
   ```bash
   cd obsidian-factorio-icons
   npm install
   npm run build
   ```

3. Restart Obsidian and enable the plugin in Settings > Community Plugins

### From Obsidian
1. Open Settings in Obsidian
2. Navigate to Community Plugins and disable Safe Mode
3. Click Browse and search for "Factorio Icons"
4. Install the plugin
5. Enable the plugin in your Community Plugins list

### Manual Installation
1. Download the latest release from the releases page
2. Extract the files into your `.obsidian/plugins/factorio-icons/` folder
3. Reload Obsidian
4. Enable the plugin in your Community Plugins list

## Usage
Simply type any Factorio item name in your notes, and it will automatically be converted to its corresponding icon. The plugin recognizes item names like:

- iron plate
- copper cable
- transport belt
- electronic circuit

The conversion happens automatically as you type, and hovering over any icon will display the original item name.

## Styling
The plugin includes default styling for icons, but you can customize their appearance by modifying the following CSS classes in your Obsidian theme:

```css
.factorio-item {
/ Controls the container for icons /
}
.factorio-icon {
/ Controls individual icon appearance /
}
```

## Technical Details
- Built using TypeScript and CodeMirror 6
- Uses the official Factorio Wiki as the image source
- Implements efficient text matching using regular expressions
- Handles overlapping item names by prioritizing longer matches

## Development

### Prerequisites
- Node.js
- npm or yarn
- TypeScript

### Setup
1. Clone the repository
2. Install dependencies:

```bash
npm install
```
3. Build the plugin:

```bash
npm run build
```
### Development Commands
- `npm run dev`: Starts development mode with hot reloading
- `npm run build`: Creates production build
- `npm run version`: Updates version numbers across configuration files

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Credits
- Factorio game and assets are property of Wube Software
- Icons sourced from the official Factorio Wiki
- Built for the Obsidian note-taking application

## Support
If you encounter any issues or have feature requests, please submit them through the GitHub issues page.