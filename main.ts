import {
	Plugin,
} from 'obsidian';

import {
	EditorView,
	PluginValue,
	ViewUpdate,
	DecorationSet,
	Decoration,
	WidgetType,
	ViewPlugin
} from '@codemirror/view'

// Base URL for Factorio wiki images
const WIKI_BASE_URL = 'https://wiki.factorio.com';

// Dictionary mapping Factorio item names to their image URLs on the wiki
const FACTORIO_ITEMS: { [key: string]: string } = {
	'iron plate': '/images/thumb/Iron_plate.png/32px-Iron_plate.png',
	'copper plate': '/images/thumb/Copper_plate.png/32px-Copper_plate.png',
	'steel plate': '/images/thumb/Steel_plate.png/32px-Steel_plate.png',
	'iron ore': '/images/thumb/Iron_ore.png/32px-Iron_ore.png',
	'copper ore': '/images/thumb/Copper_ore.png/32px-Copper_ore.png',
	'coal': '/images/thumb/Coal.png/32px-Coal.png',
	'stone': '/images/thumb/Stone.png/32px-Stone.png',
	'wood': '/images/thumb/Wood.png/32px-Wood.png',
	'irongear': '/images/thumb/Iron_gear_wheel.png/32px-Iron_gear_wheel.png',
	'copper cable': '/images/thumb/Copper_cable.png/32px-Copper_cable.png',
	'electronic circuit': '/images/thumb/Electronic_circuit.png/32px-Electronic_circuit.png',
	'advanced circuit': '/images/thumb/Advanced_circuit.png/32px-Advanced_circuit.png',
	'processing unit	': '/images/thumb/Processing_unit.png/32px-Processing_unit.png',
};

// Widget that creates a span containing an image for a Factorio item
class FactorioIconWidget extends WidgetType {
	constructor(readonly itemName: string) {
		super();
	}

	// Creates the DOM element for the widget - a span containing an img
	toDOM() {
		const span = document.createElement('span');
		span.className = 'factorio-item';

		const img = document.createElement('img');
		img.src = WIKI_BASE_URL + FACTORIO_ITEMS[this.itemName.toLowerCase()];
		img.className = 'factorio-icon';
		img.alt = this.itemName;
		img.title = this.itemName; // Shows item name on hover

		span.appendChild(img);
		return span;
	}
}

// CodeMirror plugin that handles replacing Factorio item text with icons
class FactorioIconEditorPlugin implements PluginValue {
	decorations: DecorationSet;

	constructor(view: EditorView) {
		this.decorations = this.buildDecorations(view);
	}

	// Updates decorations when document changes or viewport scrolls
	update(update: ViewUpdate) {
		if (update.docChanged || update.viewportChanged) {
			this.decorations = this.buildDecorations(update.view);
		}
	}

	destroy() { }

	// Builds decorations by finding Factorio item names and replacing them with widgets
	buildDecorations(view: EditorView): DecorationSet {
		const widgets: any[] = [];
		const doc = view.state.doc;

		// Regular expression to match any Factorio item name from our dictionary
		const itemRegex = new RegExp(`\\b(${Object.keys(FACTORIO_ITEMS).join('|')})\\b`, 'g');

		// Iterate through each line of the document
		for (let i = 1; i <= doc.lines; i++) {
			const line = doc.line(i);
			const text = line.text;
			let match;

			// Find all matches in the current line
			while ((match = itemRegex.exec(text)) !== null) {
				const itemName = match[0];
				if (FACTORIO_ITEMS[itemName.toLowerCase()]) {
					const from = line.from + match.index;
					const to = from + itemName.length;

					// Create a decoration that replaces the text with our widget
					const deco = Decoration.replace({
						widget: new FactorioIconWidget(itemName),
					});

					widgets.push(deco.range(from, to));
				}
			}
		}

		return Decoration.set(widgets);
	}
}

// Main plugin class that integrates with Obsidian
export default class MainPlugin extends Plugin {
	async onload() {
		console.log('Loading Factorio Icons plugin');

		this.registerEditorExtension([
			ViewPlugin.fromClass(FactorioIconEditorPlugin, {
				decorations: (v) => v.decorations,
			}),
		]);
	}

	onunload() {
		console.log('Unloading Factorio Icons plugin');
	}
}