import crypto from 'crypto';

function hashString(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

const myString = '你好';
const hashedString = hashString(myString);

console.log(hashedString);