export enum HTTPMethod {
  // Http1.0
  HEAD = 'HEAD',
  POST = 'POST',
  GET = 'GET',
  // Http1.1
  OPTIONS = 'OPTIONS',
  PUT = 'PUT',
  DELETE = 'DELETE',
  TRACE = 'TRACE',
  CONNECT = 'CONNECT',
}

export enum ResponseType {
  ARRAYBUFFER = 'arraybuffer',
  BLOB = 'blob',
  DOCUMENT = 'document',
  JSON = 'json',
  TEXT = 'text',
  MOZCHUNKEDARRAYBUFFER = 'moz-chunked-arraybuffer', // warn⚠️
  MSSTREAM = 'ms-stream', // warn⚠️
}

export enum StatusCode {
  SUCCESS = '20000', // 成功✅ 
  TIMEOUT = '20002', // 超时⚠️
  ERROR = '20001', // 错误❎
  ALLFAIL = '20003', // 所有请求失败❌
}

// 真正对外API
export type HTTPRequestParam = {
  method: HTTPMethod,
  url: any, // string: url, List<string>: [url1, url2, url3.....] 
  body?: any,
  header?: {[key: string]: string},
  responseType?: ResponseType, // 设置请求响应类型, 默认json
  mode?: string, // 设置mode,默认cors
  limitTime?: number, // 下载超过多久报警,默认10s,如果不需要改为-1
  retry?: boolean, // 是否开启重试，默认不开启
  retryCount?: number, // 重试次数，默认一次不重试
  retryWaitTime?: number, // 每次重试时间间隔, 默认为0
  timeout?: number, // 每个连接超时时间，默认15s
  ext?: any, // 拓展内容
}

// request config信息
export type HTTPRequestResult = {
  data: any,
  status: StatusCode,
  headers: any,
  requestTime: number,
  finishTime: number,
  warn ?: boolean,
  costTime ?: number,
  requestUrl ?: string,
  config ?: HTTPRequestParam,
}

// base api
export type HttpFetchParam = {
  method: HTTPMethod,
  header: {[key: string]: string},
  body: any,
  responseType: ResponseType,
  timeout ?: number,
}
export interface HttpFetch {
  fetch(url: string, param: HttpFetchParam) : Promise<HTTPRequestResult>;
}
// 对外暴露API 默认配置
export const configDefault: HTTPRequestParam = {
  method: HTTPMethod.POST,
  header: {},
  url: '',
  body: {},
  mode: 'cors',
  responseType: ResponseType.JSON,
  limitTime: 10 * 1000,
  retry: false,
  retryCount: 1,
  retryWaitTime: 0,
  timeout: 15 * 1000,
  ext: '',
}

export interface HttRequestI {
  request(config: HTTPRequestParam);
}