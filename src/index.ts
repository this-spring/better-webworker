import { ThreadManager, ThreadManagerConfig} from './thread/thread-manager';

const v = '1.1.0';
class BetterWorker {
  static MaxThread: number = (navigator.hardwareConcurrency || 4) + 2;
  static VERSION: string = v;
  private option: any;
  private tm: ThreadManager;
  constructor(workerPaths: Array<string>) {
    if (workerPaths.length > BetterWorker.MaxThread) {
      throw new Error(`init fail, max thread count is:${BetterWorker.MaxThread}`);
    }
    this.tm = new ThreadManager(workerPaths);
  }

  public doTask(index: number, method: string, param: any, listener: Function) {
    if (!this.tm) {
      throw new Error('better worker has destory');
    };
    this.tm.disPatcherTask(index, method, param, listener);
  }

  public close(): void {
    this.tm.close();
    this.tm = null;
  }
}

export default BetterWorker;
