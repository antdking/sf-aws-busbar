const {SalesforceConnection} = require('./dist');
const {Bridge} = require('./dist');
const {SQSClient} = require('./dist');


const USER = process.env.SALESFORCE_USERNAME;
const PASS = process.env.SALESFORCE_PASSWORD;
const TOKEN = process.env.SALESFORCE_TOKEN;
const SQS_URL = process.env.AWS_SQS_URL;
const EVENT_NAMES = [
  'streaming_test__e',
];


async function main() {
  const conn = new SalesforceConnection(/* sandbox = */ true);
  const sqs = new SQSClient(SQS_URL);
  const userInfo = await conn.login(USER, PASS, TOKEN);
  console.log(`User ID: ${userInfo.id}`);
  console.log(`Org ID: ${userInfo.organizationId}`);

  const bridge = new Bridge(conn.getStream(), sqs);
  EVENT_NAMES.forEach(async (eventName) => {
    await bridge.connectEvent(eventName);
  });
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  await runForever(conn);
}

async function sleep(time = 1000) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function runForever(conn) {
  const keepGoing = true;
  while (keepGoing) {
    // eslint-disable-next-line no-await-in-loop
    await sleep(5000);
  }
}

main().then(() => {
  console.log('Process ended successfully, bailing out. Good bye :)');
}).catch((error) => {
  console.error(error);
  console.error('Stuff caught fire. Run away!');
});
