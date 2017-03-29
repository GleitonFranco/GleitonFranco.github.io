var Jogo = {
  fazerQuadrado: function(coluna,linha,cor,id) {
    var el = document.createElementNS(Util.ns, 'rect');
    el.setAttribute('id', id);
    el.setAttribute('x', String(coluna * Util.lado));
    el.setAttribute('y', String(linha * Util.lado));
    el.setAttribute('width', Util.lado);
    el.setAttribute('height', Util.lado);
    el.setAttribute('fill', cor);
    el.addEventListener('click', Ctr.clickCasa);
    Util.svg.appendChild(el);
  },
  init: function() {
    for (var i = 0; i < 8; i++) {
      for(var j = 0; j<8; j++) {
        Jogo.fazerQuadrado(
          i,j,
          (this.isCasaPreta(i,j))?this.cores.preto:this.cores.branco,
          this.notacaoAlgebrica(i,j)
        );
      }
    }
    pecas.forEach(this.initPeca);
    Ctr.init();
  },
  initPeca: function(peca) {
    var el = document.createElementNS(Util.ns, 'image');
    el.setAttribute('id', peca.id);
    el.setAttribute('x', String(peca.coluna * Util.lado));
    el.setAttribute('y', String(peca.linha * Util.lado));
    el.setAttribute('width', Util.lado);
    el.setAttribute('height', Util.lado);
    el.setAttribute('draggable', 'true');
    el.setAttributeNS(Util.xlink, 'xlink:href', peca.arq);
    el.addEventListener('click', Ctr.clickPeca);
    el.addEventListener('ondragstart', Ctr.drag);
    peca.coordenada = Jogo.notacaoAlgebrica(peca.coluna, peca.linha);
    Util.svg.appendChild(el);
  },
  moverPeca: function(peca, coluna, linha) {
    var el = document.getElementById(peca.id);
    el.setAttribute('x', String(coluna * Util.lado));
    el.setAttribute('y', String(linha * Util.lado));
    _.extend(peca, {
      linha: linha,
      coluna: coluna,
      coordenada: this.notacaoAlgebrica(coluna, linha)
    });
  },
  moverPecaHumano: function() {
    this.moverPeca(Ctr.movimento.peca, Ctr.movimento.colunaFim, Ctr.movimento.linhaFim);
  },
  desfazerLance: function() {
    this.moverPeca(Ctr.movimento.peca, Ctr.movimento.colunaIni, Ctr.movimento.linhaIni);
  },
  notacaoAlgebrica: function(coluna, linha) {
    return String.fromCharCode(97 + coluna) + String(8 - linha);
  },
  algebricaParaCartesiano: function(coordenadaAlgebrica) {
    var coluna = coordenadaAlgebrica.charCodeAt(0) - 97;
    var linha = 8 - parseInt(coordenadaAlgebrica.slice(1));
    return { coluna: coluna, linha: linha };
  },
  isCasaPreta: function(linha, coluna) {
    var soma = linha+coluna;
    return (parseInt(soma/2) != soma/2);
  },
  lancar: function() {
    this.moverPecaHumano();
    Ctr.removeCursor();
    Ctr.init();
  },
  fazRoque: function (idRei, tipo) {
    var pequenoRoque = (tipo == 'o-o');
    var brancas = (idRei.slice(0,1) == 'b');
    var rei = _.findWhere(pecas, { id: idRei });
    var torre = _.findWhere(pecas, { id: (brancas?'b':'p') + (pequenoRoque?'tr':'td') });
    var colunaRei = pequenoRoque?6:2;
    var colunaTorre = pequenoRoque?5:3;
    var linha = brancas?7:0;
    this.moverPeca(rei, colunaRei, linha);
    this.moverPeca(torre, colunaTorre, linha);
    if (brancas) {
      _.extend(Ctr.movimento, {
        roque: tipo,
        peca: rei,
        linhaIni: linha,
        colunaIni: 4,
        linhaFim: linha,
        colunaFim: colunaRei,
        coordenadaFim: Jogo.notacaoAlgebrica(colunaRei, linha)
      });
    }
    _.extend(rei, {
      coordenada: Jogo.notacaoAlgebrica(colunaRei, linha),
      linha: linha,
      coluna: colunaRei
    });
    _.extend(torre, {
      coordenada: Jogo.notacaoAlgebrica(colunaTorre, linha),
      linha: linha,
      coluna: colunaTorre
    });
  },
  cores: { preto:'#996633', branco:'#ffffff'}
};

// (function() {
  var larguraWin = window.innerWidth;
  var alturaWin = window.innerHeight;
  // if (height > larguraWin) {
    var ladoMax = Math.min(window.innerWidth, window.innerHeight);
  // }
  
  document.getElementById('svg').setAttribute('width', ladoMax);
  document.getElementById('svg').setAttribute('height', ladoMax);
// }());
var Tela = {
  larguraWin: window.innerWidth,
  alturaWin: window.innerHeigh
};


var Util = {
  svg: document.getElementById('svg'),
  width: parseInt(this.svg.getAttribute('width')),
  height: parseInt(this.svg.getAttribute('height')),
  lado: Math.floor(parseInt(this.svg.getAttribute('width'))/8),
  ns: 'http://www.w3.org/2000/svg',
  xlink: 'http://www.w3.org/1999/xlink',
  createRequest: function() {
    var req = null;
    if (window.XMLHttpRequest) {
      // FireFox, Safari, etc.
      req = new XMLHttpRequest();
      if (typeof req.overrideMimeType != 'undefined') {
        req.overrideMimeType('text/xml'); // Or anything else
      }
    } else if (window.ActiveXObject) {
      // MSIE
      req = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
      console.log("DEU PAU! Use Firefox ou Chrome");
    }
    req.onreadystatechange = function() {
      if (req.readyState != 4) return; // Not there yet
      if (req.status != 200) {
        return;// Handle request failure here...
      }
      // Request successful, read the response
      var resp = req.responseText;
      // ... and use it as needed by your app.
      Jogo.processaResposta(resp);
    };
    return req;
  },
  cliente: ''
};

var Ctr = {
  clickCasa: function(event) {
    if (!Ctr.movimento.peca) {
      alert('Selecione uma peça primeiro!');
      return;
    }
    var casa = event.target;
    var cartesiano = Jogo.algebricaParaCartesiano(casa.id);
    Ctr.movimento.coordenadaFim = casa.id;
    Ctr.movimento.linhaFim = cartesiano.linha;
    Ctr.movimento.colunaFim = cartesiano.coluna;
    console.log(event.target);
    document.getElementById('pos').
      innerText = 'Localização: ' + casa.id;
    Jogo.lancar();
  },
  clickPeca: function(event) {
    var imagem = event.target;
    var pecaSelect = _.findWhere(pecas, { id: imagem.id});
    Ctr.putCursor(pecaSelect.coluna, pecaSelect.linha);
    Ctr.movimento = {
      peca: pecaSelect,
      linhaIni: pecaSelect.linha,
      colunaIni: pecaSelect.coluna,
      capturas: []
    };
    // Jogo.lancar();
    console.log(pecaSelect);
    document.getElementById('pos').
      innerText = 'Localização: ' + Jogo.notacaoAlgebrica(pecaSelect.coluna, pecaSelect.linha);
  },
  removerBt: function(event) {
    if (!Ctr.movimento.peca) return;
    var el = document.getElementById(Ctr.movimento.peca.id);
    Util.svg.removeChild(el);
    pecasRetiradas[pecasRetiradas.length] = Ctr.movimento.peca;
    pecas = _.without(pecas, Ctr.movimento.peca);
    Ctr.removeCursor();
    Ctr.init();
  },
  initCursor: function() {
    Ctr.cursor = document.createElementNS(Util.ns, 'rect');
    Ctr.cursor.setAttribute('id', 'cursor');
    Ctr.cursor.setAttribute('width', Util.lado);
    Ctr.cursor.setAttribute('height', Util.lado);
    Ctr.cursor.setAttribute('style', 'stroke-width:5;stroke:black;stroke-dasharray:5, 5;fill-opacity:0.2')
  },
  putCursor: function (coluna,linha) {
    Ctr.cursor.setAttribute('x', coluna * Util.lado);
    Ctr.cursor.setAttribute('y', linha* Util.lado);
    Util.svg.appendChild(Ctr.cursor);
  },
  removeCursor: function () {
    if (_.contains(Util.svg.childNodes, Ctr.cursor))
      Util.svg.removeChild(Ctr.cursor);
  },
  movimento: {
    peca: undefined,
    linhaIni: undefined,
    colunaIni: undefined,
    linhaFim: undefined,
    colunaFim: undefined,
    coordenadaFim: undefined,
    capturas: undefined
  },
  init: function () {
    this.movimento = { capturas: [] };
    this.initCursor();
  }
};

var pecas = [
  {id:'ptd',  linha: 0, coluna:0, arq:'pt.svg'},
  {id:'ptr',  linha: 0, coluna:7, arq:'pt.svg'},
  {id:'pcd',  linha: 0, coluna:1, arq:'pc.svg'},
  {id:'pcr',  linha: 0, coluna:6, arq:'pc.svg'},
  {id:'pbd',  linha: 0, coluna:2, arq:'pb.svg'},
  {id:'pbr',  linha: 0, coluna:5, arq:'pb.svg'},
  {id:'pd',   linha: 0, coluna:3, arq:'pd.svg'},
  {id:'pr',   linha: 0, coluna:4, arq:'pr.svg'},
  {id:'pptd', linha: 1, coluna:0, arq:'pp.svg'},
  {id:'pptr', linha: 1, coluna:7, arq:'pp.svg'},
  {id:'ppcd', linha: 1, coluna:1, arq:'pp.svg'},
  {id:'ppcr', linha: 1, coluna:6, arq:'pp.svg'},
  {id:'ppbd', linha: 1, coluna:2, arq:'pp.svg'},
  {id:'ppbr', linha: 1, coluna:5, arq:'pp.svg'},
  {id:'ppd',  linha: 1, coluna:3, arq:'pp.svg'},
  {id:'ppr',  linha: 1, coluna:4, arq:'pp.svg'}
  ,
  {id:'btd',  linha: 7, coluna:0, arq:'bt.svg'},
  {id:'btr',  linha: 7, coluna:7, arq:'bt.svg'},
  {id:'bcd',  linha: 7, coluna:1, arq:'bc.svg'},
  {id:'bcr',  linha: 7, coluna:6, arq:'bc.svg'},
  {id:'bbd',  linha: 7, coluna:2, arq:'bb.svg'},
  {id:'bbr',  linha: 7, coluna:5, arq:'bb.svg'},
  {id:'bd',   linha: 7, coluna:3, arq:'bd.svg'},
  {id:'br',   linha: 7, coluna:4, arq:'br.svg'},
  {id:'bptd', linha: 6, coluna:0, arq:'bp.svg'},
  {id:'bptr', linha: 6, coluna:7, arq:'bp.svg'},
  {id:'bpcd', linha: 6, coluna:1, arq:'bp.svg'},
  {id:'bpcr', linha: 6, coluna:6, arq:'bp.svg'},
  {id:'bpbd', linha: 6, coluna:2, arq:'bp.svg'},
  {id:'bpbr', linha: 6, coluna:5, arq:'bp.svg'},
  {id:'bpd',  linha: 6, coluna:3, arq:'bp.svg'},
  {id:'bpr',  linha: 6, coluna:4, arq:'bp.svg'}
];

var pecasRetiradas = [];

Jogo.init();
// alert(window.innerWidth+' , '+window.innerHeight);