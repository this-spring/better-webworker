interface ThreadManagerI {
  createThread(): ThreadManager;
};

export type ThreadManagerConfig = {
  inspectIntervalTime: number;
  maxWorkTime: number;
};

const defaultConfig:ThreadManagerConfig = {
  inspectIntervalTime: 10 * 1000,
  maxWorkTime: 30 * 1000,
};

export class ThreadManager {
  private maxThreadNumber: number;
  private inspectIntervalTime: number;
  private thread: Map<number, any>;
  private config: ThreadManagerConfig;

  constructor(config: ThreadManagerConfig, workerConfig: any) {
    this.config = config || defaultConfig;
    this.maxThreadNumber = window.navigator.hardwareConcurrency || 4;
    this.inspectIntervalTime
    this.init();
  }

  private init(): void {
    for (let i = 0, len = this.maxThreadNumber; i < len; i += 1) {

    }
  }
}
