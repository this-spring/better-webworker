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

export function MakePingCmd() {
  const cmd = {
    cmd: CmdType.ping,
  };
  return cmd;
};

export function MakePongCmd() {
  const cmd = {
    cmd: CmdType.pong,
  };
  return cmd; 
};

export function MakeCloseCmd() {
  const cmd = {
    cmd: CmdType.close,
  };
  return cmd;
}

export function MakeTaskCmd(payload) {
  const cmd = {
    cmd: CmdType.task,
    payload: payload,
  };
  return cmd;
}