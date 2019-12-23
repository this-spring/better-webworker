interface ThreadFactoryI {
  // createThread(): 
}

export class ThreadFactory implements ThreadFactoryI {
  public createzThread(url: string) {
    window.fetch(url).then(response => response.text()).then((res) => {
      // this._worker = new global.·(window.URL.createObjectURL(new window.Blob([res])));
      // this._worker.onmessage = this._onWorkerMessage.bind(this);
  }
}