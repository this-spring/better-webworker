interface ThreadFactoryI {
  // createThread(): 
}

export class ThreadFactory implements ThreadFactoryI {
  static createzThread(url: string): Promise<Worker> {
    return new Promise<Worker>((ok, no) => {
      window.fetch(url).then(response => response.text()).then(res => {
        const worker = new window.Worker(window.URL.createObjectURL(new window.Blob([res])));
        ok(worker);
      }).then(error => {
        no(error);
      });
    });
  }
}