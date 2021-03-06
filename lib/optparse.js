var toString$ = {}.toString;
module.exports = function(flags, args, options){
  var MULTI, res$, name, ref$, desc, arg, abbr, FLAG, unknowns, i, len, i$, len$, a, j$, len1$, flag, value, key$, ref1$;
  args || (args = process.argv.slice(2));
  options || (options = {});
  if (toString$.call(flags).slice(8, -1) !== 'Array') {
    MULTI = /[*+]/;
    res$ = [];
    for (name in flags) {
      ref$ = [].concat(flags[name]), desc = ref$[0], arg = ref$[1], abbr = ref$[2];
      res$.push({
        name: name,
        desc: desc,
        arg: arg,
        abbr: abbr,
        long: '--' + name,
        short: abbr !== 0 && ("-" + (abbr || name)).slice(0, 2),
        multi: !!arg && MULTI.test(arg)
      });
    }
    flags = res$;
  }
  FLAG = /^-[-\w]+$/;
  unknowns = [];
  i = 0;
  len = args.length;
  ARGS: for (; i < len; i++) {
    arg = args[i];
    if (arg === '--') {
      ++i;
      break;
    }
    ARG: for (i$ = 0, len$ = (ref$ = expand(arg)).length; i$ < len$; ++i$) {
      a = ref$[i$];
      for (j$ = 0, len1$ = flags.length; j$ < len1$; ++j$) {
        flag = flags[j$];
        if (a !== flag['short'] && a !== flag['long']) {
          continue;
        }
        value = flag.arg ? args[++i] : true;
        if (flag.multi) {
          ((ref1$ = options[key$ = flag.name]) != null
            ? ref1$
            : options[key$] = []).push(value);
        } else {
          options[flag.name] = value;
        }
        continue ARG;
      }
      if (FLAG.test(a)) {
        unknowns.push(a);
      } else {
        break ARGS;
      }
    }
  }
  return options.$flags = flags, options.$args = args.slice(i), options.$unknowns = unknowns, options.toString = help, options;
};
function expand(it){
  if (/^-\w{2,}/.test(it)) {
    return [].map.call(it.slice(1), function(it){
      return "-" + it;
    });
  } else {
    return [it];
  }
}
function help(){
  var longs, width, pad;
  longs = this.$flags.map(function(it){
    var that;
    return it.long + ((that = it.arg) ? ' ' + that : '');
  });
  width = Math.max.apply(Math, longs.map(function(it){
    return it.length;
  }));
  pad = repeatString$(' ', width);
  return this.$flags.map(function(flag, i){
    var sf, that, lf;
    sf = (that = flag.short) ? that + ',' : '   ';
    lf = (longs[i] + pad).slice(0, width);
    return "  " + sf + " " + lf + "  " + flag.desc;
  }).join('\n');
}
function repeatString$(str, n){
  for (var r = ''; n > 0; (n >>= 1) && (str += str)) if (n & 1) r += str;
  return r;
}