# BetterWorker  
前言：JavaScript是单线程语言，一些复杂的运算不适合在主线程进行，否则可能导致主线程UI渲染卡顿。例如：我们在工程实践中把音视频编解码部分代码放在主线程中就会导致界面渲染非常卡顿，表现就是视频卡住了。为了解决这个问题通常采用开启webworker和GPU来进行运算。本文是一个webworker的库让你不用关心worker的具体细节轻送让代码在worker中运算。  

# 使用  
## 创建BetterWorker  
```
const bw = new BetterWorker([
    path1,
    path2,
    .....
]);
```
BetterWorker接受一个Array\<String\>，path1、path.....就是你要运行在webworker中的代码，现在就已经把worker创建成功了。  
## 调用  
```
bw.doTask(index, method, param, function(res) {
console.log(res);
});
```  
获取bw对象后它提供了doTask方法，该方法传入参数实际上是为了确定你要调用哪个worker里面的哪个函数。所以参数依次代表:  
index: use which worker  
method: which method in this worker  
param: input value to this method  
(res) => {}: worker return result   
以上就是betterworker库是如何使用的，可以直接用在工程中，优化你的工程，相信决定会有性能上的提升。  

# 设计  

## 加载worker  
构建thread-factory.ts:  
```
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
```  
这里由于如果通过new Worker('./yourworker.js')这种方式创建的worker只能创建同域下的worker，但是往往我们静态代码可能都是部署在cdn上的，因此这种方法有局限性，采用URL.createObjectURL(new window.Blob([res])这种方式创建更加灵活。  
你可能发现workerTemplate这个参数，它的作用实际上是为了让开发者不需要感知worker完成任务后调用postMessage返回给主线程，它的代码如下：  
```
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
}
```  
这段代码实际上会拼到你的工作在worker中的代码。举个例子：  
yourWorker.js代码如下：  
```
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
```  
这样写worker完成后返回值我们没办法通知给主线程，为了不让开发者尽量少关心worker的工作细节，因此我们在加载yourWorker.js同时还会把postMessage给添加进去，因此它实际上是这个样子：  
```
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
onmessage = function(e) {
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
}
```
eval(method)(param)这段代码实际上是在调用worker中的你调用的方法。  
以上就是整个worker的加载过程。  

## 实现细节  
该库通过维护两个Map。  
```
  private thread: Map<number, Worker> = new Map();
  private taskCb: Map<string, Function> = new Map();
```  
thread: 维护new BetterWorker([
    path1,
    path2,
    .....
])的时候索引和worker的关系，目的是你调用时候bw.doTask(index, method, param, function(res) {
console.log(res);
})根据index找出你要使用哪个worker。  
```
for (let i = 0, len = this.wps.length; i < len; i += 1) {
      ThreadFactory.createThread(this.wps[i]).then((res: Worker) => {
        self.thread.set(i, res);
        res.onmessage = self.doTaskListener.bind(this);
        count += 1;
        if (count === self.wps.length) {
          self.allWorkerReady = true;
          this.doTask();
        }
      }).catch((res: any) => {
        console.error(res);
      });
    }
```
taskCb：目的根据函数签名确定回调函数。当调用的时候会在这个map把index,method,param转成字符串作为key，value就是function(res) {console.log(res)}。  
调用该库时候注册：  
```
this.taskCb.set(`${index}${method}${param}`, listener)
```  
worker处理完数据后触发：  
```
const cb = this.taskCb.get(`${index}${method}${param}`);
cb(res)
```  

# 关于项目  
github地址: <a href="https://github.com/this-spring/better-webworker">betterworker</a>  
里面有MD具体怎么跑这个项目可以试一试。当然要是感觉不错欢迎给个star。

后期还会继续优化方向：  
1. 初始化时worker个数限制  
2. 每个worker提供出每个task消耗时间以及心跳、销毁等功能