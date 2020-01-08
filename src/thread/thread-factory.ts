import { CmdType, MakePongCmd, MakeTaskCmd } from '../worker/command';

// const CmdType = {
//   ping: 'ping',
//   pong: 'pong',
//   close: 'close',
//   task: 'task',
// }

// const MakePongCmd = () => {
//   const cmd = {
//     cmd: CmdType.pong,
//   };
//   return cmd; 
// };

// const MakeTaskCmd = (payload) => {
//   const cmd = {
//     cmd: CmdType.task,
//     payload: payload,
//   };
//   return cmd;
// }

const workerTemplate = `
CmdType = {
  ping: 'ping',
  pong: 'pong',
  close: 'close',
  task: 'task',
};
function MakePongCmd() {
  const cmd = {
    cmd: CmdType.pong,
  };
  return cmd; 
};
function MakeTaskCmd(payload) {
  const cmd = {
    cmd: CmdType.task,
    payload: payload,
  };
  return cmd;
};
onmessage = function(e) {
  const cmd = e.data.cmd;
  // console.error(e.data);
  switch(cmd) {
    case CmdType.ping: 
     postMessage(MakePongCmd());
      break;
    case CmdType.close:
      close();
      break;
    case CmdType.task:
      const payload = e.data.payload;
      const index = payload.index;
      const method = payload.method;
      const param = payload.param;
      const key = payload.key;
      const startTime = payload.startTime;
      eval(method)(param).then((res) => {
        const data =  {
          index,
          method,
          param,
          key,
          startTime,
          res
        };
        postMessage(MakeTaskCmd(data))
      }).catch((error) => {
        const data =  {
          index,
          method,
          param,
          key,
          startTime,
          res
        };
        postMessage(MakeTaskCmd(data));
      });
      break;
  }
}`

// const workerTemplate = '';

export class ThreadFactory {
  static createThread(url: string): Promise<Worker> {
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