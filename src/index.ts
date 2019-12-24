import { ThreadManager, ThreadManagerConfig} from './thread/thread-manager';

class BetterWorker {
  private option: any;
  private tm: ThreadManager;
  constructor(workerPaths: Array<string>) {
    
  }

  public doTask(index: Number, method: string, param: any, listener: Function) {
    
  }
}

export default BetterWorker;
