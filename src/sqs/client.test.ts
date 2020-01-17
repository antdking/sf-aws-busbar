/* eslint-disable no-lone-blocks */
import SQS from 'aws-sdk/clients/sqs';

import Client from './client';

describe(Client, () => {
  it('can be initialised with a Queue', () => {
    const queueUrl = 'url';

    const client = new Client(queueUrl);

    expect(client.queueUrl).toEqual(queueUrl);
  });

  it('can be initialised with an SQS client', () => {
    const sqs = new SQS();

    const client = new Client('url', sqs);

    expect(client.sqs).toBe(sqs);
  });

  it('sends events to SQS', async () => {
    const queueUrl = 'url';
    const eventName = 'dsfv';
    const event = {
      payload: {},
      event: {
        replayId: 123,
      },
    };
    const SQSFake = {
      sendMessage: jest.fn(() => ({
        promise: jest.fn(async () => { }),
      })),
    };

    const client = new Client(queueUrl, SQSFake as unknown as SQS);
    await client.sendEvent(event, eventName);

    expect(SQSFake.sendMessage.mock.calls.length).toEqual(1);
    expect(SQSFake.sendMessage.mock.calls[0]).toEqual([{
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify({name: eventName, message: event}),
      MessageGroupId: 'sf-aws-busbar',
      MessageDeduplicationId: `sf-aws-busbar_${eventName}_${event.event.replayId}`,
    }]);
    console.log(SQSFake.sendMessage.mock.calls[0]);
  });
});
