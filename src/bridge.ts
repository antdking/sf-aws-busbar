import IncomingStream from './interface/incomingStream';
import OutgoingStream from './interface/outgoingStream';
import Event from './interface/event';


export default class Bridge {
  incomingStream: IncomingStream;

  outgoingStream: OutgoingStream;

  constructor(incomingStream: IncomingStream, outgoingStream: OutgoingStream) {
    this.incomingStream = incomingStream;
    this.outgoingStream = outgoingStream;
  }

  async connectEvent(name: string) {
    console.log(`subscribing to ${name}`);

    this.incomingStream.subscribeEvent(name, async (message: Event) => {
      await this.outgoingStream.sendEvent(message, name);
    });
    console.log('subscribed');
  }
}
