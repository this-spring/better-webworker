import { ThreadFactory } from './thread-factory';
import WorkerHandle from '../worker/worker-handle';

export type ThreadManagerConfig = {
  inspectIntervalTime: number;
  maxWorkTime: number;
};

export class ThreadManager {
  private thread: Map<number, WorkerHandle> = new Map();
  private wps: Array<string>;

  constructor(wps: Array<string>) {
    this.wps = wps;
    this.init();
  }

  public disPatcherTask(index: number, method: string, param: any, listener: Function): void {
    const workerHandle: WorkerHandle = this.thread.get(index);
    workerHandle.doTask(index, method, param, listener);
  }

  public close(): void {
    this.thread.forEach((value, key, map) => {
      value.close();
    });
    this.thread = null;
    this.wps = null;
  }

  private init(): void {
    const self = this;
    for (let i = 0, len = this.wps.length; i < len; i += 1) {
      const workerHandle = new WorkerHandle();
      self.thread.set(i, workerHandle);
      ThreadFactory.createThread(this.wps[i]).then((res: Worker) => {
        self.thread.get(i).initWorker(res);
      }).catch((res: any) => {
        throw new Error(`init webworker error: ${res}`);
      });
    }
  }
}
