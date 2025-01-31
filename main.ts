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
const WIKI_BASE_URL = 'https://wiki.factorio.com/images/thumb/';

// Dictionary mapping Factorio item names to their image URLs on the wiki
const FACTORIO_ITEMS_32px: { [key: string]: string } = {
	'wooden chest': 'Wooden_chest.png/32px-Wooden_chest.png',
	'iron chest': 'Iron_chest.png/32px-Iron_chest.png',
	'steel chest': 'Steel_chest.png/32px-Steel_chest.png',
	'storage tank': 'Storage_tank.png/32px-Storage_tank.png',
	'transport belt': 'Transport_belt.png/32px-Transport_belt.png',
	'fast transport belt': 'Fast_transport_belt.png/32px-Fast_transport_belt.png',
	'express transport belt': 'Express_transport_belt.png/32px-Express_transport_belt.png',
	'turbo transport belt': 'Turbo_transport_belt.png/32px-Turbo_transport_belt.png',
	'underground belt': 'Underground_belt.png/32px-Underground_belt.png',
	'fast underground belt': 'Fast_underground_belt.png/32px-Fast_underground_belt.png',
	'express underground belt': 'Express_underground_belt.png/32px-Express_underground_belt.png',
	'turbo underground belt': 'Turbo_underground_belt.png/32px-Turbo_underground_belt.png',
	'splitter': 'Splitter.png/32px-Splitter.png',
	'fast splitter': 'Fast_splitter.png/32px-Fast_splitter.png',
	'express splitter': 'Express_splitter.png/32px-Express_splitter.png',
	'turbo splitter': 'Turbo_splitter.png/32px-Turbo_splitter.png',
	'burner inserter': 'Burner_inserter.png/32px-Burner_inserter.png',
	'inserter': 'Inserter.png/32px-Inserter.png',
	'long handed inserter': 'Long-handed_inserter.png/32px-Long-handed_inserter.png',
	'fast inserter': 'Fast_inserter.png/32px-Fast_inserter.png',
	'bulk inserter': 'Bulk_inserter.png/32px-Bulk_inserter.png',
	'stack inserter': 'Stack_inserter.png/32px-Stack_inserter.png',
	'small electric pole': 'Small_electric_pole.png/32px-Small_electric_pole.png',
	'medium electric pole': 'Medium_electric_pole.png/32px-Medium_electric_pole.png',
	'big electric pole': 'Big_electric_pole.png/32px-Big_electric_pole.png',
	'substation': 'Substation.png/32px-Substation.png',
	'pipe': 'Pipe.png/32px-Pipe.png',
	'pipe to ground': 'Pipe_to_ground.png/32px-Pipe_to_ground.png',
	'pump': 'Pump.png/32px-Pump.png',
	'rail': 'Straight_rail.png/32px-Straight_rail.png',
	'rail ramp': 'Rail_ramp.png/32px-Rail_ramp.png',
	'rail support': 'Rail_support.png/32px-Rail_support.png',
	'train stop': 'Train_stop.png/32px-Train_stop.png',
	'rail signal': 'Rail_signal.png/32px-Rail_signal.png',
	'rail chain signal': 'Rail_chain_signal.png/32px-Rail_chain_signal.png',
	'locomotive': 'Locomotive.png/32px-Locomotive.png',
	'cargo wagon': 'Cargo_wagon.png/32px-Cargo_wagon.png',
	'fluid wagon': 'Fluid_wagon.png/32px-Fluid_wagon.png',
	'artillery wagon': 'Artillery_wagon.png/32px-Artillery_wagon.png',
	'car': 'Car.png/32px-Car.png',
	'tank': 'Tank.png/32px-Tank.png',
	'spidertron': 'Spidertron.png/32px-Spidertron.png',
	'spidertron remote': 'Spidertron_remote.png/32px-Spidertron_remote.png',
	'logistic robot': 'Logistic_robot.png/32px-Logistic_robot.png',
	'construction robot': 'Construction_robot.png/32px-Construction_robot.png',
	'active provider chest': 'Active_provider_chest.png/32px-Active_provider_chest.png',
	'passive provider chest': 'Passive_provider_chest.png/32px-Passive_provider_chest.png',
	'storage chest': 'Storage_chest.png/32px-Storage_chest.png',
	'buffer chest': 'Buffer_chest.png/32px-Buffer_chest.png',
	'requester chest': 'Requester_chest.png/32px-Requester_chest.png',
	'roboport': 'Roboport.png/32px-Roboport.png',
	'lamp': 'Lamp.png/32px-Lamp.png',
	'red wire': 'Red_wire.png/32px-Red_wire.png',
	'green wire': 'Green_wire.png/32px-Green_wire.png',
	'arithmetic combinator': 'Arithmetic_combinator.png/32px-Arithmetic_combinator.png',
	'decider combinator': 'Decider_combinator.png/32px-Decider_combinator.png',
	'selector combinator': 'Selector_combinator.png/32px-Selector_combinator.png',
	'constant combinator': 'Constant_combinator.png/32px-Constant_combinator.png',
	'power switch': 'Power_switch.png/32px-Power_switch.png',
	'programmable speaker': 'Programmable_speaker.png/32px-Programmable_speaker.png',
	'display panel': 'Display_panel.png/32px-Display_panel.png',
	'stone brick': 'Stone_brick.png/32px-Stone_brick.png',
	'concrete': 'Concrete.png/32px-Concrete.png',
	'hazard concrete': 'Hazard_concrete.png/32px-Hazard_concrete.png',
	'refined concrete': 'Refined_concrete.png/32px-Refined_concrete.png',
	'refined hazard concrete': 'Refined_hazard_concrete.png/32px-Refined_hazard_concrete.png',
	'landfill': 'Landfill.png/32px-Landfill.png',
	'artificial yumako soil': 'Artificial_yumako_soil.png/32px-Artificial_yumako_soil.png',
	'overgrowth yumako soil': 'Overgrowth_yumako_soil.png/32px-Overgrowth_yumako_soil.png',
	'artificial jellynut soil': 'Artificial_jellynut_soil.png/32px-Artificial_jellynut_soil.png',
	'overgrowth jellynut soil': 'Overgrowth_jellynut_soil.png/32px-Overgrowth_jellynut_soil.png',
	'ice platform': 'Ice_platform.png/32px-Ice_platform.png',
	'foundation': 'Foundation.png/32px-Foundation.png',
	'cliff explosives': 'Cliff_explosives.png/32px-Cliff_explosives.png',
	'repair pack': 'Repair_pack.png/32px-Repair_pack.png',
	'blueprint': 'Blueprint.png/32px-Blueprint.png',
	'deconstruction planner': 'Deconstruction_planner.png/32px-Deconstruction_planner.png',
	'upgrade planner': 'Upgrade_planner.png/32px-Upgrade_planner.png',
	'blueprint book': 'Blueprint_book.png/32px-Blueprint_book.png',
	'boiler': 'Boiler.png/32px-Boiler.png',
	'steam engine': 'Steam_engine.png/32px-Steam_engine.png',
	'solar panel': 'Solar_panel.png/32px-Solar_panel.png',
	'accumulator': 'Accumulator.png/32px-Accumulator.png',
	'nuclear reactor': 'Nuclear_reactor.png/32px-Nuclear_reactor.png',
	'heat pipe': 'Heat_pipe.png/32px-Heat_pipe.png',
	'heat exchanger': 'Heat_exchanger.png/32px-Heat_exchanger.png',
	'steam turbine': 'Steam_turbine.png/32px-Steam_turbine.png',
	'fusion reactor': 'Fusion_reactor.png/32px-Fusion_reactor.png',
	'fusion generator': 'Fusion_generator.png/32px-Fusion_generator.png',
	'iron plate': 'Iron_plate.png/32px-Iron_plate.png',
	'copper plate': 'Copper_plate.png/32px-Copper_plate.png',
	'steel plate': 'Steel_plate.png/32px-Steel_plate.png',
	'iron ore': 'Iron_ore.png/32px-Iron_ore.png',
	'copper ore': 'Copper_ore.png/32px-Copper_ore.png',
	'coal': 'Coal.png/32px-Coal.png',
	'stone': 'Stone.png/32px-Stone.png',
	'wood': 'Wood.png/32px-Wood.png',
	'irongear': 'Iron_gear_wheel.png/32px-Iron_gear_wheel.png',
	'copper cable': 'Copper_cable.png/32px-Copper_cable.png',
	'electronic circuit': 'Electronic_circuit.png/32px-Electronic_circuit.png',
	'advanced circuit': 'Advanced_circuit.png/32px-Advanced_circuit.png',
	'processing unit': 'Processing_unit.png/32px-Processing_unit.png',
	'engine unit': 'Engine_unit.png/32px-Engine_unit.png',
	'electric engine unit': 'Electric_engine_unit.png/32px-Electric_engine_unit.png',
	'flying robot frame': 'Flying_robot_frame.png/32px-Flying_robot_frame.png',
	'low density structure': 'Low_density_structure.png/32px-Low_density_structure.png',
	'rocket fuel': 'Rocket_fuel.png/32px-Rocket_fuel.png',
	'rocket part': 'Rocket_part.png/32px-Rocket_part.png',
	'burner mining drill': 'Burner_mining_drill.png/32px-Burner_mining_drill.png',
	'electric mining drill': 'Electric_mining_drill.png/32px-Electric_mining_drill.png',
	'big mining drill': 'Big_mining_drill.png/32px-Big_mining_drill.png',
	'offshore pump': 'Offshore_pump.png/32px-Offshore_pump.png',
	'pumpjack': 'Pumpjack.png/32px-Pumpjack.png',
	'stone furnace': 'Stone_furnace.png/32px-Stone_furnace.png',
	'steel furnace': 'Steel_furnace.png/32px-Steel_furnace.png',
	'electric furnace': 'Electric_furnace.png/32px-Electric_furnace.png',
	'foundry': 'Foundry.png/32px-Foundry.png',
	'recycler': 'Recycler.png/32px-Recycler.png',
	'agricultural tower': 'Agricultural_tower.png/32px-Agricultural_tower.png',
	'biochamber': 'Biochamber.png/32px-Biochamber.png',
	'captive biter spawner': 'Captive_biter_spawner.png/32px-Captive_biter_spawner.png',
	'assembling machine 1': 'Assembling_machine_1.png/32px-Assembling_machine_1.png',
	'assembling machine 2': 'Assembling_machine_2.png/32px-Assembling_machine_2.png',
	'assembling machine 3': 'Assembling_machine_3.png/32px-Assembling_machine_3.png',
	'oil refinery': 'Oil_refinery.png/32px-Oil_refinery.png',
	'chemical plant': 'Chemical_plant.png/32px-Chemical_plant.png',
	'centrifuge': 'Centrifuge.png/32px-Centrifuge.png',
	'electromagnetic plant': 'Electromagnetic_plant.png/32px-Electromagnetic_plant.png',
	'cryogenic plant': 'Cryogenic_plant.png/32px-Cryogenic_plant.png',
	'lab': 'Lab.png/32px-Lab.png',
	'biolab': 'Biolab.png/32px-Biolab.png',
	'lightning rod': 'Lightning_rod.png/32px-Lightning_rod.png',
	'lightning collector': 'Lightning_collector.png/32px-Lightning_collector.png',
	'heating tower': 'Heating_tower.png/32px-Heating_tower.png',
	'beacon': 'Beacon.png/32px-Beacon.png',
	'speed module': 'Speed_module.png/32px-Speed_module.png',
	'speed module 2': 'Speed_module_2.png/32px-Speed_module_2.png',
	'speed module 3': 'Speed_module_3.png/32px-Speed_module_3.png',
	'efficiency module': 'Efficiency_module.png/32px-Efficiency_module.png',
	'efficiency module 2': 'Efficiency_module_2.png/32px-Efficiency_module_2.png',
	'efficiency module 3': 'Efficiency_module_3.png/32px-Efficiency_module_3.png',
	'productivity module': 'Productivity_module.png/32px-Productivity_module.png',
	'productivity module 2': 'Productivity_module_2.png/32px-Productivity_module_2.png',
	'productivity module 3': 'Productivity_module_3.png/32px-Productivity_module_3.png',
	'quality module': 'Quality_module.png/32px-Quality_module.png',
	'quality module 2': 'Quality_module_2.png/32px-Quality_module_2.png',
	'quality module 3': 'Quality_module_3.png/32px-Quality_module_3.png',
	'water': 'Water.png/32px-Water.png',
	'steam': 'Steam.png/32px-Steam.png',
	'crude oil': 'Crude_oil.png/32px-Crude_oil.png',
	'heavy oil': 'Heavy_oil.png/32px-Heavy_oil.png',
	'light oil': 'Light_oil.png/32px-Light_oil.png',
	'lubricant': 'Lubricant.png/32px-Lubricant.png',
	'petroleum gas': 'Petroleum_gas.png/32px-Petroleum_gas.png',
	'sulfuric acid': 'Sulfuric_acid.png/32px-Sulfuric_acid.png',
	'thruster fuel': 'Thruster_fuel.png/32px-Thruster_fuel.png',
	'thruster oxidizer': 'Thruster_oxidizer.png/32px-Thruster_oxidizer.png',
	'lava': 'Lava.png/32px-Lava.png',
	'molten iron': 'Molten_iron.png/32px-Molten_iron.png',
	'molten copper': 'Molten_copper.png/32px-Molten_copper.png',
	'holmium solution': 'Holmium_solution.png/32px-Holmium_solution.png',
	'electrolyte': 'Electrolyte.png/32px-Electrolyte.png',
	'ammoniacal solution': 'Ammoniacal_solution.png/32px-Ammoniacal_solution.png',
	'ammonia': 'Ammonia.png/32px-Ammonia.png',
	'fluorine': 'Fluorine.png/32px-Fluorine.png',
	'fluoroketone hot': 'Fluoroketone_(hot).png/32px-Fluoroketone_(hot).png',
	'fluoroketone cold': 'Fluoroketone_(cold).png/32px-Fluoroketone_(cold).png',
	'lithium brine': 'Lithium_brine.png/32px-Lithium_brine.png',
	'plasma': 'Plasma.png/32px-Plasma.png',
	'uranium ore': 'Uranium_ore.png/32px-Uranium_ore.png',
	'raw fish': 'Raw_fish.png/32px-Raw_fish.png',
	'ice': 'Ice.png/32px-Ice.png',
	'carbon': 'Carbon.png/32px-Carbon.png',
	'coal synthesis': 'Coal_synthesis.png/32px-Coal_synthesis.png',
	'water barrel': 'Water_barrel.png/32px-Water_barrel.png',
	'crude oil barrel': 'Crude_oil_barrel.png/32px-Crude_oil_barrel.png',
	'petroleum gas barrel': 'Petroleum_gas_barrel.png/32px-Petroleum_gas_barrel.png',
	'light oil barrel': 'Light_oil_barrel.png/32px-Light_oil_barrel.png',
	'heavy oil barrel': 'Heavy_oil_barrel.png/32px-Heavy_oil_barrel.png',
	'lubricant barrel': 'Lubricant_barrel.png/32px-Lubricant_barrel.png',
	'sulfuric acid barrel': 'Sulfuric_acid_barrel.png/32px-Sulfuric_acid_barrel.png',
	'fluoroketone hot barrel': 'Fluoroketone_(hot)_barrel.png/32px-Fluoroketone_(hot)_barrel.png',
	'fluoroketone cold barrel': 'Fluoroketone_(cold)_barrel.png/32px-Fluoroketone_(cold)_barrel.png',
	'iron stick': 'Iron_stick.png/32px-Iron_stick.png',
	'barrel': 'Barrel.png/32px-Barrel.png',
	'nuclear fuel': 'Nuclear_fuel.png/32px-Nuclear_fuel.png',
	'uranium processing': 'Uranium_processing.png/32px-Uranium_processing.png',
	'nuclear fuel reprocessing': 'Nuclear_fuel_reprocessing.png/32px-Nuclear_fuel_reprocessing.png',
	'kovarex enrichment process': 'Kovarex_enrichment_process.png/32px-Kovarex_enrichment_process.png',
	'calcite': 'Calcite.png/32px-Calcite.png',
	'tungsten ore': 'Tungsten_ore.png/32px-Tungsten_ore.png',
	'tungsten carbide': 'Tungsten_carbide.png/32px-Tungsten_carbide.png',
	'tungsten plate': 'Tungsten_plate.png/32px-Tungsten_plate.png',
	'scrap': 'Scrap.png/32px-Scrap.png',
	'holmium ore': 'Holmium_ore.png/32px-Holmium_ore.png',
	'holmium plate': 'Holmium_plate.png/32px-Holmium_plate.png',
	'superconductor': 'Superconductor.png/32px-Superconductor.png',
	'supercapacitor': 'Supercapacitor.png/32px-Supercapacitor.png',
	'yumako seed': 'Yumako_seed.png/32px-Yumako_seed.png',
	'jellynut seed': 'Jellynut_seed.png/32px-Jellynut_seed.png',
	'tree seed': 'Tree_seed.png/32px-Tree_seed.png',
	'yumako': 'Yumako.png/32px-Yumako.png',
	'jellynut': 'Jellynut.png/32px-Jellynut.png',
	'iron bacteria': 'Iron_bacteria.png/32px-Iron_bacteria.png',
	'copper bacteria': 'Copper_bacteria.png/32px-Copper_bacteria.png',
	'spoilage': 'Spoilage.png/32px-Spoilage.png',
	'nutrients': 'Nutrients.png/32px-Nutrients.png',
	'bioflux': 'Bioflux.png/32px-Bioflux.png',
	'yumako mash': 'Yumako_mash.png/32px-Yumako_mash.png',
	'jelly': 'Jelly.png/32px-Jelly.png',
	'carbon fiber': 'Carbon_fiber.png/32px-Carbon_fiber.png',
	'biter egg': 'Biter_egg.png/32px-Biter_egg.png',
	'pentapod egg': 'Pentapod_egg.png/32px-Pentapod_egg.png',
	'lithium': 'Lithium.png/32px-Lithium.png',
	'lithium plate': 'Lithium_plate.png/32px-Lithium_plate.png',
	'quantum processor': 'Quantum_processor.png/32px-Quantum_processor.png',
	'fusion power cell': 'Fusion_power_cell.png/32px-Fusion_power_cell.png',
	'automation science pack': 'Automation_science_pack.png/32px-Automation_science_pack.png',
	'logistic science pack': 'Logistic_science_pack.png/32px-Logistic_science_pack.png',
	'military science pack': 'Military_science_pack.png/32px-Military_science_pack.png',
	'chemical science pack': 'Chemical_science_pack.png/32px-Chemical_science_pack.png',
	'production science pack': 'Production_science_pack.png/32px-Production_science_pack.png',
	'utility science pack': 'Utility_science_pack.png/32px-Utility_science_pack.png',
	'space science pack': 'Space_science_pack.png/32px-Space_science_pack.png',
	'metallurgic science pack': 'Metallurgic_science_pack.png/32px-Metallurgic_science_pack.png',
	'electromagnetic science pack': 'Electromagnetic_science_pack.png/32px-Electromagnetic_science_pack.png',
	'agricultural science pack': 'Agricultural_science_pack.png/32px-Agricultural_science_pack.png',
	'cryogenic science pack': 'Cryogenic_science_pack.png/32px-Cryogenic_science_pack.png',
	'promethium science pack': 'Promethium_science_pack.png/32px-Promethium_science_pack.png',
	'rocket silo': 'Rocket_silo.png/32px-Rocket_silo.png',
	'cargo landing pad': 'Cargo_landing_pad.png/32px-Cargo_landing_pad.png',
	'space platform foundation': 'Space_platform_foundation.png/32px-Space_platform_foundation.png',
	'cargo bay': 'Cargo_bay.png/32px-Cargo_bay.png',
	'asteroid collector': 'Asteroid_collector.png/32px-Asteroid_collector.png',
	'crusher': 'Crusher.png/32px-Crusher.png',
	'thruster': 'Thruster.png/32px-Thruster.png',
	'space platform hub': 'Space_platform_hub.png/32px-Space_platform_hub.png',
	'satellite': 'Satellite.png/32px-Satellite.png',
	'space platform starter pack': 'Space_platform_hub.png/32px-Space_platform_hub.png',
	'metallic asteroid chunk': 'Metallic_asteroid_chunk.png/32px-Metallic_asteroid_chunk.png',
	'carbonic asteroid chunk': 'Carbonic_asteroid_chunk.png/32px-Carbonic_asteroid_chunk.png',
	'oxide asteroid chunk': 'Oxide_asteroid_chunk.png/32px-Oxide_asteroid_chunk.png',
	'promethium asteroid chunk': 'Promethium_asteroid_chunk.png/32px-Promethium_asteroid_chunk.png',
	'nauvis': 'Nauvis.png/32px-Nauvis.png',
	'vulcanus': 'Vulcanus.png/32px-Vulcanus.png',
	'gleba': 'Gleba.png/32px-Gleba.png',
	'fulgora': 'Fulgora.png/32px-Fulgora.png',
	'aquilo': 'Aquilo.png/32px-Aquilo.png',
	'solar system edge': 'Solar_system_edge.png/32px-Solar_system_edge.png',
	'shattered planet': 'Shattered_planet.png/32px-Shattered_planet.png',
	'pistol': 'Pistol.png/32px-Pistol.png',
	'submachine gun': 'Submachine_gun.png/32px-Submachine_gun.png',
	'railgun': 'Railgun.png/32px-Railgun.png',
	'tesla gun': 'Tesla_gun.png/32px-Tesla_gun.png',
	'shotgun': 'Shotgun.png/32px-Shotgun.png',
	'combat shotgun': 'Combat_shotgun.png/32px-Combat_shotgun.png',
	'rocket launcher': 'Rocket_launcher.png/32px-Rocket_launcher.png',
	'flamethrower': 'Flamethrower.png/32px-Flamethrower.png',
	'firearm magazine': 'Firearm_magazine.png/32px-Firearm_magazine.png',
	'piercing rounds magazine': 'Piercing_rounds_magazine.png/32px-Piercing_rounds_magazine.png',
	'uranium rounds magazine': 'Uranium_rounds_magazine.png/32px-Uranium_rounds_magazine.png',
	'shotgun shells': 'Shotgun_shells.png/32px-Shotgun_shells.png',
	'piercing shotgun shells': 'Piercing_shotgun_shells.png/32px-Piercing_shotgun_shells.png',
	'cannon shell': 'Cannon_shell.png/32px-Cannon_shell.png',
	'explosive cannon shell': 'Explosive_cannon_shell.png/32px-Explosive_cannon_shell.png',
	'uranium cannon shell': 'Uranium_cannon_shell.png/32px-Uranium_cannon_shell.png',
	'explosive uranium cannon shell': 'Explosive_uranium_cannon_shell.png/32px-Explosive_uranium_cannon_shell.png',
	'artillery shell': 'Artillery_shell.png/32px-Artillery_shell.png',
	'rocket': 'Rocket.png/32px-Rocket.png',
	'explosive rocket': 'Explosive_rocket.png/32px-Explosive_rocket.png',
	'atomic bomb': 'Atomic_bomb.png/32px-Atomic_bomb.png',
	'capture bot rocket': 'Capture_bot_rocket.png/32px-Capture_bot_rocket.png',
	'flamethrower ammo': 'Flamethrower_ammo.png/32px-Flamethrower_ammo.png',
	'railgun ammo': 'Railgun_ammo.png/32px-Railgun_ammo.png',
	'tesla ammo': 'Tesla_ammo.png/32px-Tesla_ammo.png',
	'grenade': 'Grenade.png/32px-Grenade.png',
	'cluster grenade': 'Cluster_grenade.png/32px-Cluster_grenade.png',
	'poison capsule': 'Poison_capsule.png/32px-Poison_capsule.png',
	'slowdown capsule': 'Slowdown_capsule.png/32px-Slowdown_capsule.png',
	'defender capsule': 'Defender_capsule.png/32px-Defender_capsule.png',
	'distractor capsule': 'Distractor_capsule.png/32px-Distractor_capsule.png',
	'destroyer capsule': 'Destroyer_capsule.png/32px-Destroyer_capsule.png',
	'light armor': 'Light_armor.png/32px-Light_armor.png',
	'heavy armor': 'Heavy_armor.png/32px-Heavy_armor.png',
	'modular armor': 'Modular_armor.png/32px-Modular_armor.png',
	'power armor': 'Power_armor.png/32px-Power_armor.png',
	'power armor mk 2': 'Power_armor_MK2.png/32px-Power_armor_MK2.png',
	'mech armor': 'Mech_armor.png/32px-Mech_armor.png',
	'portable solar panel': 'Portable_solar_panel.png/32px-Portable_solar_panel.png',
	'portable fission reactor': 'Portable_fission_reactor.png/32px-Portable_fission_reactor.png',
	'portable fusion reactor': 'Portable_fusion_reactor.png/32px-Portable_fusion_reactor.png',
	'personal battery': 'Personal_battery.png/32px-Personal_battery.png',
	'personal battery mk 2': 'Personal_battery_MK2.png/32px-Personal_battery_MK2.png',
	'personal battery mk 3': 'Personal_battery_MK3.png/32px-Personal_battery_MK3.png',
	'belt immunity equipment': 'Belt_immunity_equipment.png/32px-Belt_immunity_equipment.png',
	'exoskeleton': 'Exoskeleton.png/32px-Exoskeleton.png',
	'personal roboport': 'Personal_roboport.png/32px-Personal_roboport.png',
	'personal roboport mk 2': 'Personal_roboport_MK2.png/32px-Personal_roboport_MK2.png',
	'nightvision': 'Nightvision.png/32px-Nightvision.png',
	'toolbelt equipment': 'Toolbelt_equipment.png/32px-Toolbelt_equipment.png',
	'energy shield': 'Energy_shield.png/32px-Energy_shield.png',
	'energy shield mk 2': 'Energy_shield_MK2.png/32px-Energy_shield_MK2.png',
	'personal laser defense': 'Personal_laser_defense.png/32px-Personal_laser_defense.png',
	'discharge defense': 'Discharge_defense.png/32px-Discharge_defense.png',
	'discharge defense remote': 'Discharge_defense_remote.png/32px-Discharge_defense_remote.png',
	'wall': 'Wall.png/32px-Wall.png',
	'gate': 'Gate.png/32px-Gate.png',
	'radar': 'Radar.png/32px-Radar.png',
	'land mine': 'Land_mine.png/32px-Land_mine.png',
	'gun turret': 'Gun_turret.png/32px-Gun_turret.png',
	'laser turret': 'Laser_turret.png/32px-Laser_turret.png',
	'flamethrower turret': 'Flamethrower_turret.png/32px-Flamethrower_turret.png',
	'artillery turret': 'Artillery_turret.png/32px-Artillery_turret.png',
	'artillery targeting remote': 'Artillery_targeting_remote.png/32px-Artillery_targeting_remote.png',
	'rocket turret': 'Rocket_turret.png/32px-Rocket_turret.png',
	'tesla turret': 'Tesla_turret.png/32px-Tesla_turret.png',
	'railgun turret': 'Railgun_turret.png/32px-Railgun_turret.png'
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