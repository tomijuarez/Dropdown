;(function ( context ) {
  
  "use-strict";
  
  /**
   * Obtiene todos los elementos por el valor de un determinado atributo.
   */
  var getElements = function ( attribute, value ) {
    var filter = [ ]
        //Todos los elementos del documento HTML.
      , selection = document.getElementsByTagName('*')
      , i
      , l = selection.length
      ;

    for ( i = 0; i < l; ++i ) {
      //Si el elemento tiene el atributo pasado y concuerda con el valor dado(...)
      if ( selection [ i ].getAttribute( attribute ) == value ) {
        filter.push( selection [ i ] );
      }
    }
    //Retorna los elementos que concuerden con la busqueda.
    return filter;
  };

  Dropdown = function () { };

  Dropdown.prototype = {
      
      /**
       * El constructor fija el punto en la clase misma,
       * para evitar conflictos en caso de implementar herencias.
       */
      constructor : Dropdown
      
    , openDrop : function ( element ) {

      var clicked = element.target
        , open = getElements( 'open', 'true' )
        , target = document.getElementById( clicked.getAttribute('target') )
        ;

      //Si hay Dropdowns activos, se cierran y se da el atributo [open="false"].
      //Si el "target" del elemento clickeado esta activo, simplemente se cierra, si no, se abre.
      if ( open.length > 0 ) {
        open [ 0 ].style.display = 'none';
        open [ 0 ].setAttribute('open', 'false');

        if ( open [ 0 ] == target ) return;
      }
        
      target.style.display = 'block';
      target.setAttribute('open', 'true');
    }
    /**
     * Inicialización de la clase, este método activa los eventos "click" 
     * en cada elemento con el atributo [role="Dropdown"]
     */
    , trigger : function () {
        
      var elements = getElements( 'role', 'dropDown' )
        , j
        , k = elements.length
        ;

      //Para cada elemento con tal atributo, se añade un "listener".
      //Cuando es clickeado, se abre o se cierra el <div id="target"></div>
      for ( j = 0; j < k; ++j ) {
        elements [ j ].addEventListener(
           'click'
          , function ( elementClicked ) {
              return Dropdown.openDrop( elementClicked );
            }
          , false
        );
      }	
    }
  };

  /**
   * Retorna la clase, agregandola al contecto, por defecto this->window,
   * pero varía dependiendo en el contexto en cual se ejecute.
   */
  return context.Dropdown = new Dropdown();
})( this );
