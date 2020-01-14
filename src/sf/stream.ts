import { Connection as SFConnection } from 'jsforce'
import Event from '../interface/event';
import IncomingStream from '../interface/incomingStream';

class Stream implements IncomingStream {
    conn: SFConnection
    _fayeClient: any // Faye Client

    constructor(conn: SFConnection) {
        this.conn = conn;
        this._fayeClient = null;
    }

    subscribeEvent(name: string, listener: (event: Event) => void) {
        const channelName = `/event/${name}`;
        const client = this.getClient();
        client.subscribe(channelName, listener);
    }

    getClient(): any {
        const stream = this.conn.streaming
        return stream.createClient();
    }
}

export default Stream;
