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
  console.log(method, param);
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