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