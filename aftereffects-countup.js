/* eslint-disable */
// [num];

var num = effect("Slider Control")("Slider");
num = Comma(num);

function Comma (n) {
  var number = '' + Math.round(n);
  if (number.length > 3) {
    var mod = number.length % 3;
    var output = (mod > 0 ? (number.substring(0,mod)) : '');
    for (var i = 0 ; i < Math.floor(number.length / 3); i++) {
      if ((mod == 0) && (i == 0)) {
        output += number.substring(mod + 3 * i, mod + 3 * i + 3);
      }
      else {
        output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
      }
    }
    return ('$' + output);
  }
  else {
    return ('$' + number);
  }
}
