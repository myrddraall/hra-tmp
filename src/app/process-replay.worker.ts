/// <reference lib="webworker" />

import { WebWorkerService } from "angular-worker-proxy";
import { ReplayWorker } from 'replay-processor';

WebWorkerService.runWorker(ReplayWorker);
