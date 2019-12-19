import { ThreadManager } from './thread/thread-manager';

class BetterWorker {
  private option: any;
  private tm: ThreadManager;
  public doTask(option: any) {
    this.option = option;
    this.tm = new ThreadManager();
  }

  public close(): void {

  }

  public destory(): void {

  }
}

export default BetterWorker;
