import { ThreadManager, ThreadManagerConfig} from './thread/thread-manager';

class BetterWorker {
  private option: any;
  private tm: ThreadManager;
  public doTask(option: any) {
    this.option = option;
    this.tm = new ThreadManager(option.threadConfig, option.workerConfig);
  }

  public close(): void {

  }

  public destory(): void {

  }
}

export default BetterWorker;
