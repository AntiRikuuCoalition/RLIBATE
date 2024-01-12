function generateRandomString() {
  const characters = "abcdef0123456789"; // 使用する文字の範囲を指定

  function generateRandomSegment(length) {
    let segment = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      segment += characters[randomIndex];
    }
    return segment;
  }

  const segment1 = generateRandomSegment(8);
  const segment2 = generateRandomSegment(4);
  const segment3 = generateRandomSegment(4);
  const segment4 = generateRandomSegment(4);
  const segment5 = generateRandomSegment(12);

  return `${segment1}-${segment2}-${segment3}-${segment4}-${segment5}`;
}

const randomString = generateRandomString();
console.log(randomString);
var data = {};
        data.uname = 'AAAAAAAAAAAA';
        data.passwd = '1q2w3e';
        data.bid = randomString;
        data.sid = randomString;
        socket.json.emit('login', data);
