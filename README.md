# better-webworker
More thread in javascript, make the best of cpu. Reduce main thread pressure.  

# Run

## Start Serve
moc data in src/server/server.js  
node src/server/server.js  

## Start lib
npm run dev  

# Use  
init: 
```
const bw = new BetterWorker([
    workInWorkerJsPath,
    workInWorkerJsPath1,
    workInWorkerJsPath2,
    workInWorkerJsPath3,
]);
```
your js file of constructor will work in worker  
use bw:  
```
bw.doTask(index, method, param, (res) => {
    console.log(res);
});
......
```
index: use which worker  
method: which method in this worker  
param: input value to this method  
(res) => {}: worker return result

# Example  

```
  const api = 'http://127.0.0.1:8010/test';
  const workerPath = 'http://local.h5.com/mygithub/better-webworker/test/request.js';
  const bw = new BetterWorker([
    workerPath, // run in worker code
    workerPath,
    workerPath,
    workerPath,
  ]);
  function startBetterWorker() {
    setInterval(() => {
      bw.doTask(0, 'request', api, function(res) {
        console.log(res);
      });
      bw.doTask(1, 'addSum', '', function(res) {
        console.log(res);
      });
      bw.doTask(2, 'request', api, function(res) {
        console.log(res);
      });
      bw.doTask(3, 'addSum', '', function(res) {
        console.log(res);
      });
    }, 100);
  }
```