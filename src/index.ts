import { ThreadManager, ThreadManagerConfig} from './thread/thread-manager';

class BetterWorker {
  static MaxThread: number = (navigator.hardwareConcurrency || 4) + 2;
  private option: any;
  private tm: ThreadManager;
  constructor(workerPaths: Array<string>) {
    if (workerPaths.length > BetterWorker.MaxThread) {
      throw new Error(`init fail, max thread count is:${BetterWorker.MaxThread}`);
    }
    this.tm = new ThreadManager(workerPaths);
  }

  public doTask(index: number, method: string, param: any, listener: Function) {
    this.tm.disPatcherTask(index, method, param, listener);
  }
}

export default BetterWorker;
