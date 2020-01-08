import { ThreadFactory } from './thread-factory';
import WorkerHandle from '../worker/worker-handle';

export type ThreadManagerConfig = {
  inspectIntervalTime: number;
  maxWorkTime: number;
};

// const defaultConfig:ThreadManagerConfig = {
//   inspectIntervalTime: 10 * 1000,
//   maxWorkTime: 30 * 1000,
// };
// type WorkerObj = {
//   worker: Worker;
//   // state:
// }

export class ThreadManager {
  private maxThreadNumber: number;
  private inspectIntervalTime: number;
  private thread: Map<number, WorkerHandle> = new Map();
  private taskCb: Map<string, Function> = new Map();
  private wps: Array<string>;
  private taskQueue: Array<any> = [];
  private allWorkerReady: boolean = false;

  constructor(wps: Array<string>) {
    this.wps = wps;
    this.init();
  }

  public disPatcherTask(index: number, method: string, param: any, listener: Function, errorListener: Function): void {
    // this.taskQueue.push({
    //   index,
    //   method,
    //   param,
    //   listener,
    // });
    // if (this.allWorkerReady) this.doTask();
    const workerHandle: WorkerHandle = this.thread.get(index);
    workerHandle.doTask(index, method, param, listener, errorListener);
  }

  // private doTask(): void {
  //   for (let i = 0, len = this.taskQueue.length; i < len; i += 1) {
  //     const currentTask = this.taskQueue.shift();
  //     const { index, method, param, listener } = currentTask;
  //     const taskWorker = this.thread.get(index);
  //     const postDataSign: SignFun = {
  //       index,
  //       method,
  //       param,
  //     };
  //     this.taskCb.set(`${index}${method}${param}`, listener);
  //     taskWorker.postMessage(postDataSign);
  //   }
  // }

  private init(): void {
    const self = this;
    let count = 0;
    for (let i = 0, len = this.wps.length; i < len; i += 1) {
      ThreadFactory.createThread(this.wps[i]).then((res: Worker) => {
        const workerHandle = new WorkerHandle(res);
        self.thread.set(i, workerHandle);
      }).catch((res: any) => {
        throw new Error(`init webworker error: ${res}`);
      });
    }
  }

  private doTaskListener(e): void {
    const index = e.data.index;
    const param = e.data.param;
    const method = e.data.method;
    const res = e.data.res;
    // const signKey: SignFun = {
    //   index,
    //   method,
    //   param,
    // };
    const cb = this.taskCb.get(`${index}${method}${param}`);
    cb(res);
  }
}
