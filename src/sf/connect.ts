import { Connection as SFConnection, Streaming as SFStreaming } from 'jsforce'
import Stream from './stream';

class Connection {
    conn: SFConnection

    constructor(sandbox: boolean = true) {
        this.conn = new SFConnection({
            loginUrl: sandbox ? "https://test.salesforce.com" : "https://login.salesforce.com"
        })
    }

    async login(username: string, password: string, token: string) {
        return this.conn.login(username, `${password}${token}`);
    }

    getStream(): Stream {
        return new Stream(this.conn);
    }
}

export default Connection;
