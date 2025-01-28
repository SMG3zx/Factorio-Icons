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
const FACTORIO_ITEMS_32px: { [key: string]: string } = {
	'wooden chest': '/images/thumb/Wooden_chest.png/32px-Wooden_chest.png',
	'iron chest': '/images/thumb/Iron_chest.png/32px-Iron_chest.png',
	'steel chest': '/images/thumb/Steel_chest.png/32px-Steel_chest.png',
	'storage tank': '/images/thumb/Storage_tank.png/32px-Storage_tank.png',
	'transport belt': '/images/thumb/Transport_belt.png/32px-Transport_belt.png',
	'fast transport belt': '/images/thumb/Fast_transport_belt.png/32px-Fast_transport_belt.png',
	'express transport belt': '/images/thumb/Express_transport_belt.png/32px-Express_transport_belt.png',
	'turbo transport belt': '/images/thumb/Turbo_transport_belt.png/32px-Turbo_transport_belt.png',
	'underground belt': '/images/thumb/Underground_belt.png/32px-Underground_belt.png',
	'fast underground belt': '/images/thumb/Fast_underground_belt.png/32px-Fast_underground_belt.png',
	'express underground belt': '/images/thumb/Express_underground_belt.png/32px-Express_underground_belt.png',
	'turbo underground belt': '/images/thumb/Turbo_underground_belt.png/32px-Turbo_underground_belt.png',
	'splitter': '/images/thumb/Splitter.png/32px-Splitter.png',
	'fast splitter': '/images/thumb/Fast_splitter.png/32px-Fast_splitter.png',
	'express splitter': '/images/thumb/Express_splitter.png/32px-Express_splitter.png',
	'turbo splitter': '/images/thumb/Turbo_splitter.png/32px-Turbo_splitter.png',
	'burner inserter': '/images/thumb/Burner_inserter.png/32px-Burner_inserter.png',
	'inserter': '/images/thumb/Inserter.png/32px-Inserter.png',
	'long handed inserter': '/images/thumb/Long-handed_inserter.png/32px-Long-handed_inserter.png',
	'fast inserter': '/images/thumb/Fast_inserter.png/32px-Fast_inserter.png',
	'bulk inserter': '/images/thumb/Bulk_inserter.png/32px-Bulk_inserter.png',
	'stack inserter': '/images/thumb/Stack_inserter.png/32px-Stack_inserter.png',
	'small electric pole': '/images/thumb/Small_electric_pole.png/32px-Small_electric_pole.png',
	'medium electric pole': '/images/thumb/Medium_electric_pole.png/32px-Medium_electric_pole.png',
	'big electric pole': '/images/thumb/Big_electric_pole.png/32px-Big_electric_pole.png',
	'substation': '/images/thumb/Substation.png/32px-Substation.png',
	'pipe': '/images/thumb/Pipe.png/32px-Pipe.png',
	'pipe to ground': '/images/thumb/Pipe_to_ground.png/32px-Pipe_to_ground.png',
	'pump': '/images/thumb/Pump.png/32px-Pump.png',
	'rail': '/images/thumb/Straight_rail.png/32px-Straight_rail.png',
	'rail ramp': '/images/thumb/Rail_ramp.png/32px-Rail_ramp.png',
	'rail support': '/images/thumb/Rail_support.png/32px-Rail_support.png',
	'train stop': '/images/thumb/Train_stop.png/32px-Train_stop.png',
	'rail signal': '/images/thumb/Rail_signal.png/32px-Rail_signal.png',
	'rail chain signal': '/images/thumb/Rail_chain_signal.png/32px-Rail_chain_signal.png',
	'locomotive': '/images/thumb/Locomotive.png/32px-Locomotive.png',
	'cargo wagon': '/images/thumb/Cargo_wagon.png/32px-Cargo_wagon.png',
	'fluid wagon': '/images/thumb/Fluid_wagon.png/32px-Fluid_wagon.png',
	'artillery wagon': '/images/thumb/Artillery_wagon.png/32px-Artillery_wagon.png',
	'car': '/images/thumb/Car.png/32px-Car.png',
	'tank': '/images/thumb/Tank.png/32px-Tank.png',
	'spidertron': '/images/thumb/Spidertron.png/32px-Spidertron.png',
	'spidertron remote': '/images/thumb/Spidertron_remote.png/32px-Spidertron_remote.png',
	'logistic robot': '/images/thumb/Logistic_robot.png/32px-Logistic_robot.png',
	'construction robot': '/images/thumb/Construction_robot.png/32px-Construction_robot.png',
	'active provider chest': '/images/thumb/Active_provider_chest.png/32px-Active_provider_chest.png',
	'passive provider chest': '/images/thumb/Passive_provider_chest.png/32px-Passive_provider_chest.png',
	'storage chest': '/images/thumb/Storage_chest.png/32px-Storage_chest.png',
	'buffer chest': '/images/thumb/Buffer_chest.png/32px-Buffer_chest.png',
	'requester chest': '/images/thumb/Requester_chest.png/32px-Requester_chest.png',
	'roboport': '/images/thumb/Roboport.png/32px-Roboport.png',
	'lamp': '/images/thumb/Lamp.png/32px-Lamp.png',
	'red wire': '/images/thumb/Red_wire.png/32px-Red_wire.png',
	'green wire': '/images/thumb/Green_wire.png/32px-Green_wire.png',
	'arithmetic combinator': '/images/thumb/Arithmetic_combinator.png/32px-Arithmetic_combinator.png',
	'decider combinator': '/images/thumb/Decider_combinator.png/32px-Decider_combinator.png',
	'selector combinator': '/images/thumb/Selector_combinator.png/32px-Selector_combinator.png',
	'constant combinator': '/images/thumb/Constant_combinator.png/32px-Constant_combinator.png',
	'power switch': '/images/thumb/Power_switch.png/32px-Power_switch.png',
	'programmable speaker': '/images/thumb/Programmable_speaker.png/32px-Programmable_speaker.png',
	'display panel': '/images/thumb/Display_panel.png/32px-Display_panel.png',
	'stone brick': '/images/thumb/Stone_brick.png/32px-Stone_brick.png',
	'concrete': '/images/thumb/Concrete.png/32px-Concrete.png',
	'hazard concrete': '/images/thumb/Hazard_concrete.png/32px-Hazard_concrete.png',
	'refined concrete': '/images/thumb/Refined_concrete.png/32px-Refined_concrete.png',
	'refined hazard concrete': '/images/thumb/Refined_hazard_concrete.png/32px-Refined_hazard_concrete.png',
	'landfill': '/images/thumb/Landfill.png/32px-Landfill.png',
	'artificial yumako soil': '/images/thumb/Artificial_yumako_soil.png/32px-Artificial_yumako_soil.png',
	'overgrowth yumako soil': '/images/thumb/Overgrowth_yumako_soil.png/32px-Overgrowth_yumako_soil.png',
	'artificial jellynut soil': '/images/thumb/Artificial_jellynut_soil.png/32px-Artificial_jellynut_soil.png',
	'overgrowth jellynut soil': '/images/thumb/Overgrowth_jellynut_soil.png/32px-Overgrowth_jellynut_soil.png',
	'ice platform': '/images/thumb/Ice_platform.png/32px-Ice_platform.png',
	'foundation': '/images/thumb/Foundation.png/32px-Foundation.png',
	'cliff explosives': '/images/thumb/Cliff_explosives.png/32px-Cliff_explosives.png',
	'repair pack': '/images/thumb/Repair_pack.png/32px-Repair_pack.png',
	'blueprint': '/images/thumb/Blueprint.png/32px-Blueprint.png',
	'deconstruction planner': '/images/thumb/Deconstruction_planner.png/32px-Deconstruction_planner.png',
	'upgrade planner': '/images/thumb/Upgrade_planner.png/32px-Upgrade_planner.png',
	'blueprint book': '/images/thumb/Blueprint_book.png/32px-Blueprint_book.png',
	'boiler': '/images/thumb/Boiler.png/32px-Boiler.png',
	'steam engine': '/images/thumb/Steam_engine.png/32px-Steam_engine.png',
	'solar panel': '/images/thumb/Solar_panel.png/32px-Solar_panel.png',
	'accumulator': '/images/thumb/Accumulator.png/32px-Accumulator.png',
	'nuclear reactor': '/images/thumb/Nuclear_reactor.png/32px-Nuclear_reactor.png',
	'heat pipe': '/images/thumb/Heat_pipe.png/32px-Heat_pipe.png',
	'heat exchanger': '/images/thumb/Heat_exchanger.png/32px-Heat_exchanger.png',
	'steam turbine': '/images/thumb/Steam_turbine.png/32px-Steam_turbine.png',
	'fusion reactor': '/images/thumb/Fusion_reactor.png/32px-Fusion_reactor.png',
	'fusion generator': '/images/thumb/Fusion_generator.png/32px-Fusion_generator.png',
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
	'processing unit': '/images/thumb/Processing_unit.png/32px-Processing_unit.png',
	'engine unit': '/images/thumb/Engine_unit.png/32px-Engine_unit.png',
	'electric engine unit': '/images/thumb/Electric_engine_unit.png/32px-Electric_engine_unit.png',
	'flying robot frame': '/images/thumb/Flying_robot_frame.png/32px-Flying_robot_frame.png',
	'low density structure': '/images/thumb/Low_density_structure.png/32px-Low_density_structure.png',
	'rocket fuel': '/images/thumb/Rocket_fuel.png/32px-Rocket_fuel.png',
	'rocket part': '/images/thumb/Rocket_part.png/32px-Rocket_part.png',
	'burning mining drill': '/images/thumb/Burning_mining_drill.png/32px-Burning_mining_drill.png',
	'electric mining drill': '/images/thumb/Electric_mining_drill.png/32px-Electric_mining_drill.png',
	'big mining drill': '/images/thumb/Big_mining_drill.png/32px-Big_mining_drill.png',
	'offshore pump': '/images/thumb/Offshore_pump.png/32px-Offshore_pump.png',
	'pumpjack': '/images/thumb/Pumpjack.png/32px-Pumpjack.png',
	'stone furnace': '/images/thumb/Stone_furnace.png/32px-Stone_furnace.png',
	'steel furnace': '/images/thumb/Steel_furnace.png/32px-Steel_furnace.png',
	'electric furnace': '/images/thumb/Electric_furnace.png/32px-Electric_furnace.png',
	'foundry': '/images/thumb/Foundry.png/32px-Foundry.png',
	'recycler': '/images/thumb/Recycler.png/32px-Recycler.png',
	'agricultural tower': '/images/thumb/Agricultural_tower.png/32px-Agricultural_tower.png',
	'biochamber': '/images/thumb/Biochamber.png/32px-Biochamber.png',
	'captive biter spawner': '/images/thumb/Captive_biter_spawner.png/32px-Captive_biter_spawner.png',
	'assembling machine 1': '/images/thumb/Assembling_machine_1.png/32px-Assembling_machine_1.png',
	'assembling machine 2': '/images/thumb/Assembling_machine_2.png/32px-Assembling_machine_2.png',
	'assembling machine 3': '/images/thumb/Assembling_machine_3.png/32px-Assembling_machine_3.png',
	'oil refinery': '/images/thumb/Oil_refinery.png/32px-Oil_refinery.png',
	'chemical plant': '/images/thumb/Chemical_plant.png/32px-Chemical_plant.png',
	'centrifuge': '/images/thumb/Centrifuge.png/32px-Centrifuge.png',
	'electromagnetic plant': '/images/thumb/Electromagnetic_plant.png/32px-Electromagnetic_plant.png',
	'cryogenic plant': '/images/thumb/Cryogenic_plant.png/32px-Cryogenic_plant.png',
	'lab': '/images/thumb/Lab.png/32px-Lab.png',
	'biolab': '/images/thumb/Biolab.png/32px-Biolab.png',
	'lightning rod': '/images/thumb/Lightning_rod.png/32px-Lightning_rod.png',
	'lightning collector': '/images/thumb/Lightning_collector.png/32px-Lightning_collector.png',
	'heating tower': '/images/thumb/Heating_tower.png/32px-Heating_tower.png',
	'beacon': '/images/thumb/Beacon.png/32px-Beacon.png',
	'speed module': '/images/thumb/Speed_module.png/32px-Speed_module.png',
	'speed module 2': '/images/thumb/Speed_module_2.png/32px-Speed_module_2.png',
	'speed module 3': '/images/thumb/Speed_module_3.png/32px-Speed_module_3.png',
	'efficiency module': '/images/thumb/Efficiency_module.png/32px-Efficiency_module.png',
	'efficiency module 2': '/images/thumb/Efficiency_module_2.png/32px-Efficiency_module_2.png',
	'efficiency module 3': '/images/thumb/Efficiency_module_3.png/32px-Efficiency_module_3.png',
	'productivity module': '/images/thumb/Productivity_module.png/32px-Productivity_module.png',
	'productivity module 2': '/images/thumb/Productivity_module_2.png/32px-Productivity_module_2.png',
	'productivity module 3': '/images/thumb/Productivity_module_3.png/32px-Productivity_module_3.png',
	'quality module': '/images/thumb/Quality_module.png/32px-Quality_module.png',
	'quality module 2': '/images/thumb/Quality_module_2.png/32px-Quality_module_2.png',
	'quality module 3': '/images/thumb/Quality_module_3.png/32px-Quality_module_3.png',
	'water': '/images/thumb/Water.png/32px-Water.png',
	'steam': '/images/thumb/Steam.png/32px-Steam.png',
	'crude oil': '/images/thumb/Crude_oil.png/32px-Crude_oil.png',
	'heavy oil': '/images/thumb/Heavy_oil.png/32px-Heavy_oil.png',
	'light oil': '/images/thumb/Light_oil.png/32px-Light_oil.png',
	'lubricant': '/images/thumb/Lubricant.png/32px-Lubricant.png',
	'petroleum gas': '/images/thumb/Petroleum_gas.png/32px-Petroleum_gas.png',
	'sulfuric acid': '/images/thumb/Sulfuric_acid.png/32px-Sulfuric_acid.png',
	'thruster fuel': '/images/thumb/Thruster_fuel.png/32px-Thruster_fuel.png',
	'thruster oxidizer': '/images/thumb/Thruster_oxidizer.png/32px-Thruster_oxidizer.png',
	'lava': '/images/thumb/Lava.png/32px-Lava.png',
	'molten iron': '/images/thumb/Molten_iron.png/32px-Molten_iron.png',
	'molten copper': '/images/thumb/Molten_copper.png/32px-Molten_copper.png',
	'holmium solution': '/images/thumb/Holmium_solution.png/32px-Holmium_solution.png',
	'electrolyte': '/images/thumb/Electrolyte.png/32px-Electrolyte.png',
	'ammoniacal solution': '/images/thumb/Ammoniacal_solution.png/32px-Ammoniacal_solution.png',
	'ammonia': '/images/thumb/Ammonia.png/32px-Ammonia.png',
	'fluorine': '/images/thumb/Fluorine.png/32px-Fluorine.png',
	'fluoroketone hot': '/images/thumb/Fluoroketone_(hot).png/32px-Fluoroketone_(hot).png',
	'fluoroketone cold': '/images/thumb/Fluoroketone_(cold).png/32px-Fluoroketone_(cold).png',
	'lithium brine': '/images/thumb/Lithium_brine.png/32px-Lithium_brine.png',
	'plasma': '/images/thumb/Plasma.png/32px-Plasma.png',
	'uranium ore': '/images/thumb/Uranium_ore.png/32px-Uranium_ore.png',
	'raw fish': '/images/thumb/Raw_fish.png/32px-Raw_fish.png',
	'ice': '/images/thumb/Ice.png/32px-Ice.png',
	'carbon': '/images/thumb/Carbon.png/32px-Carbon.png',
	'coal synthesis': '/images/thumb/Coal_synthesis.png/32px-Coal_synthesis.png',
	'water barrel': '/images/thumb/Water_barrel.png/32px-Water_barrel.png',
	'crude oil barrel': '/images/thumb/Crude_oil_barrel.png/32px-Crude_oil_barrel.png',
	'petroleum gas barrel': '/images/thumb/Petroleum_gas_barrel.png/32px-Petroleum_gas_barrel.png',
	'light oil barrel': '/images/thumb/Light_oil_barrel.png/32px-Light_oil_barrel.png',
	'heavy oil barrel': '/images/thumb/Heavy_oil_barrel.png/32px-Heavy_oil_barrel.png',
	'lubricant barrel': '/images/thumb/Lubricant_barrel.png/32px-Lubricant_barrel.png',
	'sulfuric acid barrel': '/images/thumb/Sulfuric_acid_barrel.png/32px-Sulfuric_acid_barrel.png',
	'fluoroketone hot barrel': '/images/thumb/Fluoroketone_(hot)_barrel.png/32px-Fluoroketone_(hot)_barrel.png',
	'fluoroketone cold barrel': '/images/thumb/Fluoroketone_(cold)_barrel.png/32px-Fluoroketone_(cold)_barrel.png',
	'iron stick': '/images/thumb/Iron_stick.png/32px-Iron_stick.png',
	'barrel': '/images/thumb/Barrel.png/32px-Barrel.png',
	'nuclear fuel': '/images/thumb/Nuclear_fuel.png/32px-Nuclear_fuel.png',
	'uranium processing': '/images/thumb/Uranium_processing.png/32px-Uranium_processing.png',
	'nuclear fuel reprocessing': '/images/thumb/Nuclear_fuel_reprocessing.png/32px-Nuclear_fuel_reprocessing.png',
	'kovarex enrichment process': '/images/thumb/Kovarex_enrichment_process.png/32px-Kovarex_enrichment_process.png',
	'calcite': '/images/thumb/Calcite.png/32px-Calcite.png',
	'tungsten ore': '/images/thumb/Tungsten_ore.png/32px-Tungsten_ore.png',
	'tungsten carbine': '/images/thumb/Tungsten_carbine.png/32px-Tungsten_carbine.png',
	'tungsten plate': '/images/thumb/Tungsten_plate.png/32px-Tungsten_plate.png',
	'scrap': '/images/thumb/Scrap.png/32px-Scrap.png',
	'holmium ore': '/images/thumb/Holmium_ore.png/32px-Holmium_ore.png',
	'holmium plate': '/images/thumb/Holmium_plate.png/32px-Holmium_plate.png',
	'superconductor': '/images/thumb/Superconductor.png/32px-Superconductor.png',
	'supercapacitor': '/images/thumb/Supercapacitor.png/32px-Supercapacitor.png',
	'yumako seed': '/images/thumb/Yumako_seed.png/32px-Yumako_seed.png',
	'jellynut seed': '/images/thumb/Jellynut_seed.png/32px-Jellynut_seed.png',
	'tree seed': '/images/thumb/Tree_seed.png/32px-Tree_seed.png',
	'yumako': '/images/thumb/Yumako.png/32px-Yumako.png',
	'jellynut': '/images/thumb/Jellynut.png/32px-Jellynut.png',
	'iron bacteria': '/images/thumb/Iron_bacteria.png/32px-Iron_bacteria.png',
	'copper bacteria': '/images/thumb/Copper_bacteria.png/32px-Copper_bacteria.png',
	'spoilage': '/images/thumb/Spoilage.png/32px-Spoilage.png',
	'nutrients': '/images/thumb/Nutrients.png/32px-Nutrients.png',
	'bioflux': '/images/thumb/Bioflux.png/32px-Bioflux.png',
	'yumako mash': '/images/thumb/Yumako_mash.png/32px-Yumako_mash.png',
	'jelly': '/images/thumb/Jelly.png/32px-Jelly.png',
	'carbon fiber': '/images/thumb/Carbon_fiber.png/32px-Carbon_fiber.png',
	'biter egg': '/images/thumb/Biter_egg.png/32px-Biter_egg.png',
	'pentapod egg': '/images/thumb/Pentapod_egg.png/32px-Pentapod_egg.png',
	'lithium': '/images/thumb/Lithium.png/32px-Lithium.png',
	'lithium plate': '/images/thumb/Lithium_plate.png/32px-Lithium_plate.png',
	'quantum processor': '/images/thumb/Quantum_processor.png/32px-Quantum_processor.png',
	'fusion power cell': '/images/thumb/Fusion_power_cell.png/32px-Fusion_power_cell.png',
	'automation science pack': '/images/thumb/Automation_science_pack.png/32px-Automation_science_pack.png',
	'logistic science pack': '/images/thumb/Logistic_science_pack.png/32px-Logistic_science_pack.png',
	'military science pack': '/images/thumb/Military_science_pack.png/32px-Military_science_pack.png',
	'chemical science pack': '/images/thumb/Chemical_science_pack.png/32px-Chemical_science_pack.png',
	'production science pack': '/images/thumb/Production_science_pack.png/32px-Production_science_pack.png',
	'utility science pack': '/images/thumb/Utility_science_pack.png/32px-Utility_science_pack.png',
	'space science pack': '/images/thumb/Space_science_pack.png/32px-Space_science_pack.png',
	'metallurgic science pack': '/images/thumb/Metallurgic_science_pack.png/32px-Metallurgic_science_pack.png',
	'electromagnetic science pack': '/images/thumb/Electromagnetic_science_pack.png/32px-Electromagnetic_science_pack.png',
	'agricultural science pack': '/images/thumb/Agricultural_science_pack.png/32px-Agricultural_science_pack.png',
	'cryogenic science pack': '/images/thumb/Cryogenic_science_pack.png/32px-Cryogenic_science_pack.png',
	'promethium science pack': '/images/thumb/Promethium_science_pack.png/32px-Promethium_science_pack.png',
	'rocket silo': '/images/thumb/Rocket_silo.png/32px-Rocket_silo.png',
	'cargo landing pad': '/images/thumb/Cargo_landing_pad.png/32px-Cargo_landing_pad.png',
	'space platform foundation': '/images/thumb/Space_platform_foundation.png/32px-Space_platform_foundation.png',
	'cargo bay': '/images/thumb/Cargo_bay.png/32px-Cargo_bay.png',
	'asteroid collector': '/images/thumb/Asteroid_collector.png/32px-Asteroid_collector.png',
	'crusher': '/images/thumb/Crusher.png/32px-Crusher.png',
	'thruster': '/images/thumb/Thruster.png/32px-Thruster.png',
	'space platform hub': '/images/thumb/Space_platform_hub.png/32px-Space_platform_hub.png',
	'satellite': '/images/thumb/Satellite.png/32px-Satellite.png',
	'space platform starter pack': '/images/thumb/Space_platform_hub.png/32px-Space_platform_hub.png',
	'metallic asteroid chunk': '/images/thumb/Metallic_asteroid_chunk.png/32px-Metallic_asteroid_chunk.png',
	'carbonic asteroid chunk': '/images/thumb/Carbonic_asteroid_chunk.png/32px-Carbonic_asteroid_chunk.png',
	'oxide asteroid chunk': '/images/thumb/Oxide_asteroid_chunk.png/32px-Oxide_asteroid_chunk.png',
	'promethium asteroid chunk': '/images/thumb/Promethium_asteroid_chunk.png/32px-Promethium_asteroid_chunk.png',
	'nauvis': '/images/thumb/Nauvis.png/32px-Nauvis.png',
	'vulcanus': '/images/thumb/Vulcanus.png/32px-Vulcanus.png',
	'gleba': '/images/thumb/Gleba.png/32px-Gleba.png',
	'fulgora': '/images/thumb/Fulgora.png/32px-Fulgora.png',
	'aquilo': '/images/thumb/Aquilo.png/32px-Aquilo.png',
	'solar system edge': '/images/thumb/Solar_system_edge.png/32px-Solar_system_edge.png',
	'shattered planet': '/images/thumb/Shattered_planet.png/32px-Shattered_planet.png'
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
		img.src = WIKI_BASE_URL + FACTORIO_ITEMS_32px[this.itemName.toLowerCase()];
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

	destroy() {
		// Remove any remaining factorio-item spans and factorio-icon images from the DOM
		const factorioItems = document.querySelectorAll('.factorio-item');
		factorioItems.forEach(item => item.remove());
	}

	// Builds decorations by finding Factorio item names and replacing them with widgets
	buildDecorations(view: EditorView): DecorationSet {
		const widgets: any[] = [];
		const doc = view.state.doc;

		// Sort item names by length (longest first) to handle overlapping matches
		const sortedItemNames = Object.keys(FACTORIO_ITEMS_32px).sort((a, b) => b.length - a.length);

		// Regular expression to match any Factorio item name from our dictionary
		const itemRegex = new RegExp(`\\b(${sortedItemNames.join('|')})\\b`, 'g');

		// Iterate through each line of the document
		for (let i = 1; i <= doc.lines; i++) {
			const line = doc.line(i);
			const text = line.text;
			let match;

			// Find all matches in the current line
			while ((match = itemRegex.exec(text)) !== null) {
				const itemName = match[0];
				if (FACTORIO_ITEMS_32px[itemName.toLowerCase()]) {
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