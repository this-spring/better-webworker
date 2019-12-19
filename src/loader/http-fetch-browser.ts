import { HTTPMethod, ResponseType, StatusCode, HttpFetchParam, HTTPRequestResult, HttpFetch } from './http-base.ts';

const getTime = () : number => {
  const time = new Date();
  return time.getTime();
}

export class HttpFetchBrowser implements HttpFetch {
  constructor() {

  }

  async XMLReq(url: string, param: HttpFetchParam): Promise<HTTPRequestResult> {
    const { header, body, method, timeout, responseType } = param;
    const xhr: any = new XMLHttpRequest();
    const requestTime = getTime();
    xhr.timeout = timeout ? timeout : 15;
    xhr.responseType = responseType ? responseType : 'json';
    xhr.open(method, url, true);
    Object.keys(header).forEach((key) => {
      xhr.setRequestHeader([key, header[key]]);
    });
    const p = new Promise<HTTPRequestResult>((ok, no) => {
      let headers = {};
      // let buffer: Buffer = Buffer.alloc(0);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 2) {
          if (xhr.status === 0) {
            const error = new TypeError('Failed to send');
            no(error);
            return;
          }
          if (xhr.status < 200 || xhr.status > 299) {
            const error = new TypeError(`Unexpected http status code: ${xhr.status}`);
            no(error);
            return;
          }
          const headersStr = xhr.getAllResponseHeaders();
          const arr = headersStr.trim().split(/[\r\n]+/);
          arr.forEach(function(line) {
            const parts = line.split(': ');
            const header = parts.shift();
            headers[header] = parts.join(': ');
          })
        }
      };
      xhr.onprogress = () => {
        // buffer = Buffer.concat([buffer, Buffer.from(xhr.response)]);
      };
      xhr.onerror = (event) => {
        const err = new Error('error while request');
        ok({
          data: err,
          status: StatusCode.ERROR,
          headers: headers,
          requestTime: requestTime,
          finishTime: getTime(),
        });
      };
      xhr.ontimeout = () => {
        ok({
          data: null,
          status: StatusCode.TIMEOUT,
          headers: headers,
          requestTime: requestTime,
          finishTime: getTime(),
        })
      }
      xhr.onloadend = () => {
        ok({
          data: xhr.response,
          status: StatusCode.SUCCESS,
          headers: headers,
          requestTime: requestTime,
          finishTime: getTime(),
        });
      }
    });
    xhr.send(body || '');
    return p;
  }

  // static async fetchAPI(url: string, param: HttpFetchParam): Promise<HTTPRequestResult> {
  //   const res = await fetch(url, {
  //     method: param.method,
  //     headers: param.header,
  //     body: param.body,
  //     mode: 'cors',
  //   });
  //   const requestTime = getTime();
  //   if (res.status !== 200) {
  //     console.error(`Unexpected Http StatusCode ${res.status}`);
  //   }
  //   const headers = res.headers;
  //   const body = await res.json();
  //   return {
  //     data: JSON.stringify(body),
  //     headers,
  //     body: JSON.stringify(body),
  //   };
  // }

  async fetch (url: string, param: HttpFetchParam): Promise<HTTPRequestResult> {
    let ret = null;
    ret = await this.XMLReq(url, param);
    return ret;
  }
}
