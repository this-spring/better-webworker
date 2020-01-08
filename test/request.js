// your worker code here
// make sure eacher method reture promise
function request(api) {
  return new Promise((ok, no) => {
    fetch(api).then(res => {
      return res.json();
    }).then((res) => {
      ok(res);
    }).catch((error) => {
      no(error);
    })
  });
}

function addSum() {
  return new Promise((ok,no) => {
    let sum = 0;
    // One hundred thousand calc
    for (let i = 0, len = 100000; i < len; i += 1) {
      sum += i;
    }
    ok(sum);
  });
}

const CmdType = {
  ping: 'ping',
  pong: 'pong',
  close: 'close',
  task: 'task',
}

const MakePingCmd = () => {
  const cmd = `{
    cmd: ${CmdType.ping}
  }`;
  return cmd;
};

const MakePongCmd = () => {
  const cmd = `{
    cmd: ${CmdType.pong},
  }`;
  return cmd; 
};

const MakeCloseCmd = () => {
  const cmd = `{
    cmd: ${CmdType.close},
  }`;
  return cmd;
}

const MakeTaskCmd = (payload) => {
  const cmd = `{
    cmd: ${CmdType.task},
    payload: ${payload},
  }`;
  return cmd;
}

onmessage = function(e) {
  const cmd = e.data.cmd;
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
      eval(method)(param).then((res) => {
        const data =  {
          index,
          method,
          param,
          key,
          res
        };
        postMessage(MakeTaskCmd(data))
      }).catch((error) => {
        const data =  {
          index,
          method,
          param,
          key,
          res
        };
        postMessage(MakeTaskCmd(data));
      });
      break;
  }
}