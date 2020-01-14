import SQS from 'aws-sdk/clients/sqs';
import Event from '../interface/event';
import OutgoingStream from '../interface/outgoingStream';

export default class Client implements OutgoingStream {
    sqs: SQS
    queueUrl: string

    constructor(queueUrl: string) {
        this.sqs = new SQS({
            httpOptions: { timeout: 5000 }
        });
        this.queueUrl = queueUrl;
    }

    async sendEvent(event: Event, name: string): Promise<void> {
        console.log(`event received: ${name}: ${JSON.stringify(event)}`);

        await this.sqs.sendMessage({
            QueueUrl: this.queueUrl,
            MessageGroupId: 'sf-aws-busbar',
            MessageDeduplicationId: `sf-aws-busbar_${name}_${event.event.replayId}`,
            MessageBody: JSON.stringify({
                name: name,
                message: event,
            })
        }).promise();
        console.log(`event finished: ${name}: ${event.event.replayId}`);
    }
}
