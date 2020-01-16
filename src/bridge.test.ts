/* eslint max-classes-per-file: "off" */

import Bridge from './bridge';
import Event from './interface/event';
import IncomingStream from './interface/incomingStream';
import OutgoingStream from './interface/outgoingStream';

class FakeInputStream implements IncomingStream {
  callbacks: { [key: string]: (event: Event) => void } = {};

  subscribeEvent(name: string, listener: (event: Event) => void): void {
    this.callbacks[name] = listener;
  }

  sendFakeEvent(name: string, event: Event): void {
    const callback = this.callbacks[name];
    callback(event);
  }
}

class FakeOutputStream implements OutgoingStream {
  sentEvents: Array<{ name: string, event: Event }> = [];

  async sendEvent(event: Event, name: string): Promise<void> {
    this.sentEvents.push({name, event});
  }
}

describe(Bridge, () => {
  it('can take input and output streams', () => {
    const inputStream = new FakeInputStream();
    const outputStream = new FakeOutputStream();
    const subject = new Bridge(inputStream, outputStream);

    expect(subject.incomingStream).toBe(inputStream);
    expect(subject.outgoingStream).toBe(outputStream);
  });

  it('subscribes to the input stream', () => {
    const inputStream = new FakeInputStream();
    const outputStream = new FakeOutputStream();
    const subject = new Bridge(inputStream, outputStream);
    const eventName = 'EventName';

    subject.connectEvent(eventName);

    expect(Object.keys(inputStream.callbacks))
      .toEqual([eventName]);
  });

  it('forwards events from the input stream to the output stream', async () => {
    const inputStream = new FakeInputStream();
    const outputStream = new FakeOutputStream();
    const subject = new Bridge(inputStream, outputStream);
    const fakeEvent = {
      payload: {some: 'Payload'},
      event: {
        replayId: 123,
      },
    };

    subject.connectEvent('EventName');
    inputStream.sendFakeEvent('EventName', fakeEvent);

    expect(outputStream.sentEvents).toEqual([
      {name: 'EventName', event: fakeEvent},
    ]);
  });
});
