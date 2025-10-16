import listenToPing from './listeners/ping.listener';
import listenToTasks from './listeners/task.listener';
import {redis} from "./redis";
import {Queue} from "bullmq";

listenToPing().then(() => {
  console.log('Ping listener started...');
});

listenToTasks().then(() => {
  console.log('Task listener started...');
});

const ping = new Queue('ping', {connection: redis});

ping.add('ping', {}).then(() => {
  console.log('Ping job added...');
});
