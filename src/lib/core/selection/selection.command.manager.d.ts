import {CompositeCommandManager} from '../command/composite.command.manager';
import {CommandManager} from '../command/command.manager';
import {Model} from '../infrastructure/model';

export class SelectionCommandManager extends CompositeCommandManager {
	constructor(model: Model, manager: CommandManager);
}
