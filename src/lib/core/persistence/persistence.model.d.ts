import {Command} from '../command/command';
import {PersistenceStorage} from './persistence.storage';

/**
 * > Under construction
 */
export declare class PersistenceModel {
	id: string;
	storage: PersistenceStorage;
	load: Command;
	remove: Command;
	settings: object;
}
