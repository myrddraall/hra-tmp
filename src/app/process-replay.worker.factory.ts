import { WebWorkerService } from 'angular-worker-proxy';
import { Replay } from 'replay-processor';

WebWorkerService.registerWorkerFactory(Replay, () => {
  return new Worker('./process-replay.worker', { type: "module" });
});