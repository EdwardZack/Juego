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
  for(var i=1; i<8; i++){
    for(var j=1; j<8; j++){
      if(i==1){
        numColNext = i+1;
        $k('.col-'+i).sortable({
          update: function(){
            addClassElemento();
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
            addClassElemento();
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
            addClassElemento();
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
}


function cargarTablero(){
  for(var i = 1; i<8; i++){
    $k('.panel-tablero div:nth-child('+i+')').html(cargarImagenes());
  }
  addClassElemento();
  asignarEventos();


$k('.panel-tablero div').disableSelection();



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

function mostrarFilas(){
  var filas = [$k('.col-1 img:nth-child(1)'), $k('.col-2 img:nth-child(1)')];
}

$k(function(){
  colorMatch($k(".main-titulo"));
  cargarTablero();
  $k('.btn-reinicio').click(function(){
    $k('#timer').startTimer();
  });
  mostrarFilas();
})
