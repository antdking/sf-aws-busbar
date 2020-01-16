import Event from './event';

export default interface IncomingStream {
  subscribeEvent(name: string, listener: (event: Event) => void): void;
}
