var $k = jQuery.noConflict();

//función para cambiar el color del titulo del juego, llama a colorMatchReturn para alternar entre colores.
function colorMatch(elemento){
  $k(elemento).animate({
     color: "#ffffff"
   },1000, function(){
     colorMatchReturn(elemento)
   }
 ).delay(1000)
}

function colorMatchReturn(elemento){
  $k(elemento).animate({
     color: "#DCFF0E"
   },1000, function(){
     colorMatch(elemento)
   }
  )
}

//arreglo que almacena las imagenes de los dulces.
var dulces = new Array(3);
dulces[0]="<img src='./image/1.png'>";
dulces[1]="<img src='./image/2.png'>";
dulces[2]="<img src='./image/3.png'>";
dulces[3]="<img src='./image/4.png'>";
var dulcesColumna = 7;

//genera arreglos de 7 elementos aleatoriamente y los retorna.
function imagenesAleatorias(){
  var dulcesAleatorios = [];
  for(var i = 0; i<dulcesColumna; i++){
    var index = Math.floor(Math.random() * dulces.length);
    var dulceSeleccionado = dulces[index];
    dulcesAleatorios.push(dulceSeleccionado);
  }

  return dulcesAleatorios;
}

//toma los arreglos retornados por la función anterior y los convierte en una cadena de texto.
function cargarImagenes(){
  var dulcesAleatorios = imagenesAleatorias();
  var listarDulces="";
  for(var j = 0; j < dulcesAleatorios.length; j++){
    listarDulces = listarDulces+dulcesAleatorios[j];
  }
  return listarDulces;
}

//asigna los eventos sortable y droppable para las columnas e imagenes respectivamente.
function asignarEventos(){
  addClassElemento();
  for(var i=1; i<8; i++){
    for(var j=1; j<8; j++){
      if(i==1){
        numColNext = i+1;
        $k('.col-'+i).sortable({
          update: function(){
            actualizarMovimientos();
            asignarEventos();
            borrarDulces();
          }
        });
        $k('.col-'+i+' img:nth-child('+j+')').droppable({
          accept: '.col-'+numColNext+' img:nth-child('+j+')',
          drop: intercambiarDulces
        });
      } else if(i>1 && i<7){
        numColPrev = i-1;
        numColNext = i+1;
        //asigna a cada imagen una clase que le indica sobre cuales imagenes puede ser arrastrada.
        $k('.col-'+numColPrev+' img:nth-child('+j+')').addClass('item'+i+j);
        $k('.col-'+numColNext+' img:nth-child('+j+')').addClass('item'+i+j);
        $k('.col-'+i).sortable({
          update: function(){
            actualizarMovimientos();
            asignarEventos();
            borrarDulces();
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
            actualizarMovimientos();
            asignarEventos();
            borrarDulces();
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

//habilita los metodos de sortable y droppable de las imagenes.
function habilitarSorDrop(){
  for(var i=1; i<8; i++){
    $k('.col-'+i).sortable('enable');
  }
  $k('img').droppable('enable');
}

//deshabilita los metodos de sortable y droppable de las imagenes.
function deshabilitarSorDrop(){
  for(var i=1; i<8; i++){
    $k('.col-'+i).sortable('disable');
  }
  $k('img').droppable('disable');
}

//función que almacena todos los dulces en una matriz para ser recorrida por las funciones de validación.
function generarMatrizDulces(){
  var matrizDulces = [];

  for(var i=1; i<8; i++){
    var colDulces = $k('.col-'+i).children();
    matrizDulces.push(colDulces);
  }
  return matrizDulces;
}

//recorre la matriz de dulces por columnas para encontrar combinaciones de dulces.
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

//recorre la matriz de dulces por filas para encontrar combinaciones de dulces.
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

//toma las combinaciones encontradas y las marca con la clase "borrar" para eliminar posteriormente los dulces.
function marcarDulces(totalDulces){
  for(i=0; i<totalDulces.length; i++){
    totalDulces[i].addClass('borrar');
  }
}

//función que lllama las funciones que buscan y marcan las combinaciones de dulces y los elimina.
function borrarDulces(){
  validarColumnas();
  validarFilas();
  if($k('.borrar').length != 0){
  deshabilitarSorDrop(); //deshabilita el sortable y el droppable mientras se eliminan los dulces.
    $k('.borrar').effect({
      effect: 'pulsate',
      duration: 1000,
      complete: function(){
        $k(this).remove();
        asignarEventos();
      }
    });

    setTimeout(function(){ //llama la función que reemplaza los dulces eliminados.
      reeplazarDulces();
    },1500);
  }
}

//función que carga inicialmente el tablero y llama las funciones correspondientes de asignarEventos y borrarDulces.
function cargarTablero(){
  for(var i=1; i<8; i++){
    $k('.panel-tablero div:nth-child('+i+')').html(cargarImagenes());
  }
  $k('.panel-tablero div').disableSelection();
  $k('#score-text').text('0');
  addClassElemento();
  asignarEventos();
  borrarDulces();
}

//función que suma los puntos dependiendo de la cantidad de dulces encontrados en linea.
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

//función que reemplaza los dulces eliminados.
function reeplazarDulces(){
  for(var i=1; i<8; i++){
    var colDulces = $k('.col-'+i);
    var countDulces = colDulces.children().length;
    var faltantes = dulcesColumna-countDulces;
    for(var j=0; j<faltantes; j++){
      var index = Math.floor(Math.random() * dulces.length);
      var dulceSeleccionado = dulces[index];
      if(j == 0 && countDulces < 1){
        $k(colDulces).append(dulceSeleccionado);
      } else {
        $k(colDulces).find('img:eq(0)').before(dulceSeleccionado);
      }
    }
  }
  asignarEventos();
  borrarDulces();
}

//función que se ejecuta activarse el evento droppable de las imagenes.
function intercambiarDulces(event, imgDrag){
  var imgDrag = $k(imgDrag.draggable);
  var rutaImgDrag = imgDrag.attr('src');
  var imgDrop = $k(this);
  var rutaImgDrop = imgDrop.attr('src');
  imgDrag.attr('src', rutaImgDrop);
  imgDrop.attr('src', rutaImgDrag);
  actualizarMovimientos();
  setTimeout(function(){
    reeplazarDulces();
  },500);
}

//reinicia todas las clases de las imagenes y reasigna la clase elemento para que no pierdan la forma.
function addClassElemento(){
  $k('.panel-tablero div').children().removeClass().addClass('elemento');
}

//suma un movimiento con cada interacción del usuario.
function actualizarMovimientos(){
  var totalMovimientos = Number($k('#movimientos-text').text());
  totalMovimientos++;
  $k('#movimientos-text').text(totalMovimientos);
}

//inicializa el juego cargando el tablero y personalizando el temporizador.
function iniciarJuego(){
  cargarTablero();
  $k('.jst-hours').hide();
  $k('#timer').css({
    'text-align': 'center',
    'display': 'flex',
    'justify-content': 'center'
  });
  $k('.jst-minutes').css('float', 'left');
  $k('.jst-seconds').css('float', 'left');
}

//función que modifica el juego al acabarse el tiempo ocultando el tablero y dejando puntaje y movimientos totales.
function terminarJuego(){
  $k('.time').remove();
  $k('.panel-tablero').hide('slide', function(){
    $k('.panel-score').animate({
      width: "+=75%"
    }, 1000)
  });
  $k('div.score').before('<h1 class="main-titulo titulo-over">Juego Terminado</h1>');
}

//Inicialmente se carga la animación del titulo y el evento click del botón de inicio.
$k(function(){
  colorMatch($k(".main-titulo"));
  $k('.btn-reinicio').click(function () {
		if ($k(this).text() === 'Reiniciar') {
			location.reload(true);
		}
		$k(this).text('Reiniciar');
		$k('#timer').startTimer({
			onComplete: terminarJuego
		})
    iniciarJuego();
	});
})
