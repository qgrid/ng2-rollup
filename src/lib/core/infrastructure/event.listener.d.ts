import { EventManager } from './event.manager';

export declare class EventListener {
	constructor(element: Element, manager: EventManager);

	on(name: string, f: (arg: any) => void, settings?: any): () => void;
	off(): void;
}
