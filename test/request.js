function request(api) {
  fetch(api).then(res => {
    return res.json();
  }).then((res) => {
    console.log(res);
  });
}