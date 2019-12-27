import { ThreadManager, ThreadManagerConfig} from './thread/thread-manager';

class BetterWorker {
  private option: any;
  private tm: ThreadManager;
  constructor(workerPaths: Array<string>) {
    this.tm = new ThreadManager(workerPaths);
  }

  public doTask(index: number, method: string, param: any, listener: Function) {
    this.tm.disPatcherTask(index, method, param, listener);
  }
}

export default BetterWorker;
