/**
 * command:
 * {
 *  cmd: 'ping', // ping, task....
 *  payload: any, // user use data
 * }
 */

export const CmdType = {
  ping: 'ping',
  pong: 'pong',
  close: 'close',
  task: 'task',
}

export const MakePingCmd = () => {
  const cmd = `{
    cmd: ${CmdType.ping},
  }`;
  return cmd;
};

export const MakePongCmd = () => {
  const cmd = `{
    cmd: ${CmdType.pong},
  }`;
  return cmd; 
};

export const MakeCloseCmd = () => {
  const cmd = `{
    cmd: ${CmdType.close},
  }`;
  return cmd;
}

export const MakeTaskCmd = (payload: any) => {
  const cmd = `{
    cmd: ${CmdType.task},
    payload: ${payload},
  }`;
  return cmd;
}