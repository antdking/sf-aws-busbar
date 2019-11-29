import EventStream from './sf/stream';
import SQSClient from './sqs/client';
import Event from './interface/event';


class Bridge {
    incomingStream: EventStream
    outgoingStream: SQSClient


    constructor(incomingStream: EventStream, outgoingStream: SQSClient) {
        this.incomingStream = incomingStream
        this.outgoingStream = outgoingStream
    }

    async connectEvent(name: string) {
        console.log(`subscribing to ${name}`);

        this.incomingStream.subscribeEvent(name, async (message: Event) => {
            await this.outgoingStream.sendEvent(message, name);
        });
        console.log("subscribed");
    }
}

export default Bridge;
