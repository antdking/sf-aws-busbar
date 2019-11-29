import SQS from 'aws-sdk/clients/sqs';
import Event from '../interface/event';
import { resolve } from 'dns';

export default class Client {
    sqs: SQS
    queueUrl: string

    constructor(queueUrl: string) {
        this.sqs = new SQS({
            httpOptions: { timeout: 5000 }
        });
        this.queueUrl = queueUrl;
    }

    async sendEvent(event: Event, name: string) {
        console.log(`event received: ${name}: ${JSON.stringify(event)}`);
        return new Promise((resolve) => {
            this.sqs.sendMessage({
                QueueUrl: this.queueUrl,
                MessageGroupId: 'sf-aws-busbar',
                MessageDeduplicationId: `sf-aws-busbar_${name}_${event.event.replayId}`,
                MessageBody: JSON.stringify({
                    name: name,
                    message: event,
                })
            }, (error, data) => {
                console.log(`event finished: ${name}: ${event.event.replayId}`);
                resolve();
            });
        })
    }
}
