var $k = jQuery.noConflict();

function colorMatch(elemento){
  $k(elemento).animate({
     color: "#ffffff"
   },1000, function(){
     colorMatchReturn(elemento)
   }
  )
}

function colorMatchReturn(elemento){
  $k(elemento).animate({
     color: "#DCFF0E"
   },1000, function(){
     colorMatch(elemento)
   }
  )
}

var dulces = new Array(3);
dulces[0]="<img src='./image/1.png'>";
dulces[1]="<img src='./image/2.png'>";
dulces[2]="<img src='./image/3.png'>";
dulces[3]="<img src='./image/4.png'>";
var dulcesColumna = 7;

function imagenesAleatorias(){
  var dulcesAleatorios = [];
  for(var i = 0; i<dulcesColumna; i++){
    var index = Math.floor(Math.random() * dulces.length);
    var dulceSeleccionado = dulces[index];
    dulcesAleatorios.push(dulceSeleccionado);
  }

  return dulcesAleatorios;
}

function cargarImagenes(){
  var dulcesAleatorios = imagenesAleatorias();
  var listarDulces="";
  for(var j = 0; j < dulcesAleatorios.length; j++){
    listarDulces = listarDulces+dulcesAleatorios[j];
  }
  return listarDulces;
}

function asignarEventos(){
  addClassElemento();
  for(var i=1; i<8; i++){
    for(var j=1; j<8; j++){
      if(i==1){
        numColNext = i+1;
        $k('.col-'+i).sortable({
          update: function(){
            asignarEventos();
          }
        });
        $k('.col-'+i+' img:nth-child('+j+')').droppable({
          accept: '.col-'+numColNext+' img:nth-child('+j+')',
          drop: intercambiarDulces
        });
      } else if(i>1 && i<7){
        numColPrev = i-1;
        numColNext = i+1;
        $k('.col-'+numColPrev+' img:nth-child('+j+')').addClass('item'+i+j);
        $k('.col-'+numColNext+' img:nth-child('+j+')').addClass('item'+i+j);
        $k('.col-'+i).sortable({
          update: function(){
            asignarEventos();
          }
        });
        $k('.col-'+i+' img:nth-child('+j+')').droppable({
          accept: '.item'+i+j,
          drop: intercambiarDulces
        })
      } else {
        numColPrev = i-1;
        $k('.col-'+i).sortable({
          update: function(){
            asignarEventos();
          }
        });
        $k('.col-'+i+' img:nth-child('+j+')').droppable({
          accept: '.col-'+numColPrev+' img:nth-child('+j+')',
          drop: intercambiarDulces
        });
      }
    }
  }
  habilitarSorDrop();
}

function habilitarSorDrop(){
  for(var i=1; i<8; i++){
    $k('.col-'+i).sortable('enable');
  }
  $k('img').droppable('enable');
}

function deshabilitarSorDrop(){
  for(var i=1; i<8; i++){
    $k('.col-'+i).sortable('disable');
  }
  $k('img').droppable('disable');
}

function generarMatrizDulces(){
  var matrizDulces = [];

  for(var i=1; i<8; i++){
    var colDulces = $k('.col-'+i).children();
    matrizDulces.push(colDulces);
  }
  return matrizDulces;
}

function validarColumnas(){
  var totalColDulces = [];
  for(var i=0; i<7; i++){
    var contadorCol = 0;
    var firstColMatch = [];
    var secondColMatch = [];
    var matrizDulces = generarMatrizDulces();
    var colDulceSelect = [];
    var colDulceNextSelect = [];
    var continueCol = false;
    for (var j=1; j<7; j++){
      if(colDulceSelect.length == 0){
        colDulceSelect = matrizDulces[i].eq(0);
        rowDulceSelect = matrizDulces[0].eq(j);

      };
    var colDulceNextSelect = matrizDulces[i].eq(j);
    var srcColInicial = colDulceSelect.attr('src');
    var srcColDulceNextSelect = colDulceNextSelect.attr('src');

    if(srcColInicial != srcColDulceNextSelect){
      if(firstColMatch.length >= 3){
        continueCol = true;
      } else {
        firstColMatch = [];
      }
      contadorCol = 0;
    }else {
      if(contadorCol == 0){
        if(!continueCol){
          firstColMatch.push(colDulceSelect);
        } else {
          secondColMatch.push(colDulceSelect);
        }
      }
      if(!continueCol){
        firstColMatch.push(colDulceNextSelect);
      } else {
        secondColMatch.push(colDulceNextSelect);
      }
      contadorCol++;
    }
    colDulceSelect = matrizDulces[i].eq(j);
  }
  if (secondColMatch.length > 2){
    firstColMatch = $k.merge(firstColMatch, secondColMatch);
  }
  if(firstColMatch.length <= 2){
    firstColMatch = [];
  }
  if(firstColMatch.length >=3){
    sumarPuntos(firstColMatch);
  }
  totalColDulces = $k.merge(totalColDulces, firstColMatch);
  }
  if(totalColDulces.length >= 3){
    marcarDulces(totalColDulces);
  }
}

function validarFilas(){
  var totalRowDulces = [];
  for(var i=0; i<7; i++){
    var contadorRow = 0;
    var firstRowMatch = [];
    var secondRowMatch = [];
    var matrizDulces = generarMatrizDulces();
    var rowDulceSelect = [];
    var rowDulceNextSelect = [];
    var continueRow = false;
    for (var j=1; j<7; j++){
      if(rowDulceSelect.length == 0){
        rowDulceSelect = matrizDulces[0].eq(i);
      };
    var rowDulceNextSelect = matrizDulces[j].eq(i);
    var srcRowInicial = rowDulceSelect.attr('src');
    var srcRowDulceNextSelect = rowDulceNextSelect.attr('src');

    if(srcRowInicial != srcRowDulceNextSelect){
      if(firstRowMatch.length >= 3){
        continueRow = true;
      } else {
        firstRowMatch = [];
      }
      contadorRow = 0;
    }else {
      if(contadorRow == 0){
        if(!continueRow){
          firstRowMatch.push(rowDulceSelect);
        } else {
          secondRowMatch.push(rowDulceSelect);
        }
      }
      if(!continueRow){
        firstRowMatch.push(rowDulceNextSelect);
      } else {
        secondRowMatch.push(rowDulceNextSelect);
      }
      contadorRow++;
    }
    rowDulceSelect = matrizDulces[j].eq(i);
  }
  if (secondRowMatch.length > 2){
    firstRowMatch = $k.merge(firstRowMatch, secondRowMatch);
  }
  if(firstRowMatch.length <= 2){
    firstRowMatch = [];
  }
  if(firstRowMatch.length >= 3){
    sumarPuntos(firstRowMatch);
  }
  totalRowDulces = $k.merge(totalRowDulces, firstRowMatch);
  }
  if(totalRowDulces.length >= 3){
    marcarDulces(totalRowDulces);
  }
}

function sumarPuntos(totalDulces){
  var totalLinea = totalDulces.length;
  var totalPuntos = Number($k('#score-text').text());
  switch (totalLinea) {
    case 3:
      totalPuntos += 15;
      break;
    case 4:
      totalPuntos += 40;
      break;
    case 5:
      totalPuntos += 75;
      break;
    case 6:
      totalPuntos += 120;
      break;
    case 7:
      totalPuntos += 175;
  }
  $k('#score-text').text(totalPuntos);
}

function marcarDulces(totalDulces){
  for(i=0; i<totalDulces.length; i++){
    totalDulces[i].addClass('borrar');
  }
}

function borrarDulces(){
  validarColumnas();
  validarFilas();
  if($k('.borrar').length !=0){
    $k('.borrar').remove();
    asignarEventos();
  }
}

function cargarTablero(){
  for(var i = 1; i<8; i++){
    $k('.panel-tablero div:nth-child('+i+')').html(cargarImagenes());
  }
  $k('.panel-tablero div').disableSelection();
  $k('#score-text').text('0');
  addClassElemento();
  asignarEventos();
}

function intercambiarDulces(event, imgDrag){
  var imgDrag = $k(imgDrag.draggable);
  var rutaImgDrag = imgDrag.attr('src');
  var imgDrop = $k(this);
  var rutaImgDrop = imgDrop.attr('src');
  imgDrag.attr('src', rutaImgDrop);
  imgDrop.attr('src', rutaImgDrag);
}

function addClassElemento(){
  $k('.panel-tablero div').children().removeClass().addClass('elemento');
}

$k(function(){
  colorMatch($k(".main-titulo"));
  cargarTablero();
  borrarDulces();
  $k('.btn-reinicio').click(function(){
    $k('#timer').startTimer();
  });
})
