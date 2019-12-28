interface ThreadFactoryI {
  // createThread(): 
}

const workerTemplate = `onmessage = function(e) {
  const index = e.data.index;
  const method = e.data.method;
  const param = e.data.param;
  eval(method)(param).then((res) => {
    postMessage({
      index,
      method,
      param,
      res
    })
  }).catch((error) => {
    postMessage(error);
  })
}`

export class ThreadFactory implements ThreadFactoryI {
  static createzThread(url: string): Promise<Worker> {
    return new Promise<Worker>((ok, no) => {
      window.fetch(url).then(response => response.text()).then(res => {
        res += workerTemplate;
        const worker = new window.Worker(window.URL.createObjectURL(new window.Blob([res])));
        ok(worker);
      }).then(error => {
        no(error);
      });
    });
  }
}