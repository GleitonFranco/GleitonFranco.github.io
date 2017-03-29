var operacaoFactory = function(opChar, numParcelas, numDigitos1, numDigitos2) {
  var parcelas = [];
  parcelas[0] = parseInt(Math.pow(10, numDigitos1-1) + Math.random()*(Math.pow(10, numDigitos1)-Math.pow(10, numDigitos1-1)-1));
  for (var i = 1; i < numParcelas; i++) {
    parcelas[i] = parseInt(Math.pow(10, numDigitos2-1) + Math.random()*(Math.pow(10, numDigitos2)-Math.pow(10, numDigitos2-1)-1));
  }
  if (opChar == '-') {
    parcelas = parcelas.sort().reverse();
  }
  var resultado = parcelas.reduce( function (prev, curr, index, array) {
    if (opChar == '+') {
      return prev + curr;
    }
    if (opChar == '-') {
      return prev - curr;
    }
  });
  
  return {
    operacao: opChar,
    parcelas: parcelas,
    resultado: resultado
  };

}

var formataInt = function(n) {
  var ns = n.toString();
  if (ns.length < 3) {
    return ns;
  }
  var nform = '';
  while (ns.length>0) {
    nform = '.' + ns.slice(-3) + nform;

    ns = ns.substring(0, ns.length - 3);
  }
  nform = nform.slice(1);
  return nform;
};
