import Event from './event';

export default interface OutgoingStream {
  sendEvent(event: Event, name: string): Promise<void>;
}
