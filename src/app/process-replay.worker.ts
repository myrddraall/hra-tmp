/// <reference lib="webworker" />

import { WebWorkerService } from "angular-worker-proxy";
import { Replay } from 'replay-processor';

WebWorkerService.runWorker(Replay);
