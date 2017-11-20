// from https://coligo.io/create-url-shortener-with-node-express-mongo/

var alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
var base = alphabet.length; // base is the length of the alphabet (58 in this case)
//In fact, feel free to define your own alphabet and base since the code we're going to use for encoding and decoding are generic enough to handle any base.

// utility function to convert base 10 integer to base 58 string
function encode(num){
  var encoded = '';
  while (num){
    var remainder = num % base;
    num = Math.floor(num / base);
    encoded = alphabet[remainder].toString() + encoded;
  }
  return encoded;
}

// utility function to convert a base 58 string to base 10 integer
function decode(str){
    var decoded = 0;
    while (str){
      var index = alphabet.indexOf(str[0]);
      var power = str.length - 1;
      decoded += index * (Math.pow(base, power));
      str = str.substring(1);
    }
    return decoded;
  }
  
  module.exports.encode = encode;
  module.exports.decode = decode;

