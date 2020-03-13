import { WebWorkerService } from 'angular-worker-proxy';
import { ReplayWorker } from 'replay-processor';

WebWorkerService.registerWorkerFactory(ReplayWorker, () => {
  return new Worker('./process-replay.worker', { type: "module" });
});