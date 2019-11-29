const SalesforceConnection = require('./dist').SalesforceConnection;
const Bridge = require('./dist').Bridge;
const SQSClient = require('./dist').SQSClient;


const USER = process.env['SALESFORCE_USERNAME']
const PASS = process.env['SALESFORCE_PASSWORD']
const TOKEN = process.env['SALESFORCE_TOKEN']
const SQS_URL = process.env['AWS_SQS_URL']
const EVENT_NAMES = [
    'streaming_test__e',
]


async function main() {
    const conn = new SalesforceConnection(sandbox = true);
    const sqs = new SQSClient(SQS_URL)
    const userInfo = await conn.login(USER, PASS, TOKEN);
    console.log(`User ID: ${userInfo.id}`);
    console.log(`Org ID: ${userInfo.organizationId}`);

    const bridge = new Bridge(conn.getStream(), sqs);
    EVENT_NAMES.forEach(async (event_name) => {
        await bridge.connectEvent(event_name)
    });
    await runForever(conn);
};

async function sleep(time = 1000) {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    });
}

async function runForever(conn) {
    let keepGoing = true;
    while (keepGoing) {
        await sleep(5000);
    }

}

main().then(() => {
    console.log("Process ended successfully, bailing out. Good bye :)");
}).catch((error) => {
    console.error(error);
    console.error("Stuff caught fire. Run away!");
});
