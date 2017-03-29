var sorobanFactory = function(x,y,canvas,colunas,valor) {
  var xo = x;
  var yo = y;
  var larguraFrame = canvas.width;
  var alturaFrame = canvas.height;
  var colunas = colunas;
  var valor = valor;

  var ctx = canvas.getContext('2d');
  var larguraColuna = 30;
  var margem = 3;
  var altBeam = 7;
  var altLinha = (alturaFrame - altBeam)/5;
  var altConta = (alturaFrame - altBeam)/5;
  var largConta = larguraColuna -2*margem;
  var largBaseConta = largConta/3;
  var cores = ['black', '#411919', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'grey', 'white'];

  var desenhaConta = function(x,y,cor) {
    ctx.beginPath();
    ctx.save();
    ctx.translate(x,y);
    ctx.moveTo((largConta-largBaseConta)/2,0);
    ctx.lineTo((largConta+largBaseConta)/2,0);
    ctx.lineTo(largConta, altConta/2);
    ctx.lineTo((largConta+largBaseConta)/2, altConta);
    ctx.lineTo((largConta-largBaseConta)/2, altConta);
    ctx.lineTo(0, altConta/2);
    ctx.lineTo((largConta-largBaseConta)/2,0);
    ctx.fillStyle = cor;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  var desenhaHaste = function(x,y) {
    // ctx.beginPath();
    ctx.save();
    ctx.translate(x,y);
    ctx.fillRect(largConta/2 -1,0,3,altConta);
    ctx.fillRect(largConta/2 -1,altConta + altBeam,3,altConta*4);
    ctx.restore();
  }

  var desenhaAlgarismo = function(x,y,valorAlgarismo) {
    var cor = cores[valorAlgarismo];
    desenhaHaste(x,y);
    if (valorAlgarismo > 4) {
      valorAlgarismo -= 5;
      desenhaConta(x, y, cor);
    }
    for(var i=0; i<valorAlgarismo; i++) {
      desenhaConta(x, y + altConta + altBeam + i*altConta, cor);
    }
  };


  return {

    desenhaFrame: function() {
      ctx.strokeRect(xo,yo,larguraFrame,alturaFrame);
      ctx.strokeRect(xo,yo+altConta,larguraFrame,altBeam);
      for (var ix=xo+larguraColuna*5/2; ix<xo+larguraFrame; ix+=3*larguraColuna) {
        ctx.fillRect(ix-2,yo+altConta+2, 4, 4);
      }
    },

    desenhaNumero: function() {
      var valorNumero = valor;
      var algarismos = [];
      var casa = 0;
      while (valorNumero >= 10) {
        algarismos[casa++] = valorNumero % 10;
        valorNumero = parseInt(valorNumero/10);
      }
      algarismos[casa++] = valorNumero;
      while (casa < colunas) {
        algarismos[casa++] = 0;
      }
      algarismos = algarismos.reverse();
      for (var i = 0; i<algarismos.length; i++) {
        desenhaAlgarismo(xo+ i*(larguraColuna)+margem,yo,algarismos[i]);
      }
    }

  }

}