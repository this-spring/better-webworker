import { ThreadFactory } from './thread-factory';

export type ThreadManagerConfig = {
  inspectIntervalTime: number;
  maxWorkTime: number;
};

// const defaultConfig:ThreadManagerConfig = {
//   inspectIntervalTime: 10 * 1000,
//   maxWorkTime: 30 * 1000,
// };

export class ThreadManager {
  private maxThreadNumber: number;
  private inspectIntervalTime: number;
  private thread: Map<number, any> = new Map();
  private wps: Array<string>;

  constructor(wps: Array<string>) {
    this.wps = wps;
    this.init();
  }

  private init(): void {
    const self = this;
    for (let i = 0, len = this.wps.length; i < len; i += 1) {
      ThreadFactory.createzThread(this.wps[i]).then((res: Worker) => {
        self.thread.set(i, res);
        console.log(' thread-manager: ', self.thread);
      }).catch((res: any) => {
        console.error(res);
      });
    }
  }
}
