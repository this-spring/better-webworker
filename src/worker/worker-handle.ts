import { MakePingCmd, MakeTaskCmd, MakeCloseCmd, CmdType } from './command';

class WorkerHandle {
  private worker: Worker = null;
  private key: number = 0;
  private ready: boolean = false;
  private taskQueue: Array<any> = [];
  private taskCb: Map<number, Array<Function>> = new Map();

  public initWorker(worker: Worker): void {
    this.worker = worker;
    this.worker.onmessage = this.doTaskListener.bind(this);
    // https://developer.mozilla.org/zh-CN/docs/Web/API/AbstractWorker/onerror
    this.worker.onerror = this.doError.bind(this);
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Worker/onmessageerror
    // this.worker.onmessageerror = this.doMessageError.bind(this);
    this.ready = true;
    this.startTask();
  }

  public close(): void {
    this.worker.postMessage(MakeCloseCmd());
  }

  public doTask(index: number, method: string, param: any, listener: Function): void {
    this.taskQueue.push({
      index,
      method,
      param,
      listener,
    });
    this.startTask();
  }

  public doTaskListener(e): void {
    const cmd = e.data.cmd;
    switch(cmd) {
      case CmdType.pong:
        // this.calPPavg();
        break;
      case CmdType.task:
        this.noticeListener(e.data.payload);
        break;
    } 
  }

  private noticeListener(paylod: any): void {
    const index = paylod.index;
    const param = paylod.param;
    const method = paylod.method;
    const key = paylod.key;
    const res = paylod.res;
    const costTime = Date.now() - paylod.startTime;
    const cb = this.taskCb.get(key);
    cb[0]({
      index,
      param,
      method,
      data: res,
      costTime,
    })
  }
  
  private doError(e): void {

  }

  private startTask(): void {
    if (this.ready) {
      for (let i = 0, len = this.taskQueue.length; i < len; i += 1) {
        const currentTask = this.taskQueue.shift();
        const { index, method, param, listener } = currentTask;
        // make sign to each task
        this.key += 1;
        const postDataSign = {
          index,
          method,
          param,
          key: this.key,
          startTime: Date.now(),
        };
        const cb = [listener, currentTask.errorListener];
        const command = MakeTaskCmd(postDataSign);
        this.taskCb.set(this.key, cb);
        this.worker.postMessage(command);
      }
    }
  }

  // private doMessageError(): void {

  // }

  private ping(): void {
    this.worker.postMessage(MakePingCmd);
  }
}

export default WorkerHandle;
