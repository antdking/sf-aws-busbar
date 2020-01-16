import * as AWSMock from "aws-sdk-mock";
import SQS from 'aws-sdk/clients/sqs';

import Client from "./client";

afterEach(() => {
    AWSMock.restore();
})

describe(Client, () => {
    it("can be initialised with a Queue", () => {
        AWSMock.mock('SQS', 'sendMessage', '');
        const queueUrl = 'url';

        let client = new Client(queueUrl);

        expect(client.queueUrl).toEqual(queueUrl);
    });

    it("can be initialised with an SQS client", () => {
        AWSMock.mock('SQS', 'sendMessage', '');
        const sqs = new SQS();

        let client = new Client('url', sqs);

        expect(client.sqs).toBe(sqs);
    });

});
