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
    }
  ; 
  Object.prototype.applyStyle = function ( attribute, value ) {
    this.style [ attribute ] = value;
    return this;  
  };

  Dropdown = function () { };

  Dropdown.prototype = {
      
      /**
       * El constructor fija el punto en la clase misma,
       * para evitar conflictos en caso de implementar herencias.
       */
      constructor : Dropdown

    , closeElements : function ( opened ) {
        opened
          .applyStyle('display', 'none')
          .setAttribute('open', 'false')
        ;  
      }
      
    , openDrop : function ( element, keyPress ) {

      var clicked = element.target
        , open = getElements( 'open', 'true' )
        , targetElement = document.getElementById( clicked.getAttribute('target') )
        , clickFunction = function ( e ) {
            if ( e.target == clicked ) {
              Dropdown.closeElements( targetElement );
            }
          }
        ;
      

      if ( keyPress ) {
        Dropdown.closeElements( open [ 0 ] );
        return;
      }

      //Si hay Dropdowns activos, se cierran y se da el atributo [open="false"].
      //Si el "target" del elemento clickeado esta activo, simplemente se cierra, si no, se abre.
      if ( !!open.length ) {
        dropDownActive = open [ 0 ];
        
        Dropdown.closeElements( dropDownActive );

        document.documentElement.addEventListener(
           'click' 
          , function ( e ) {

              clickFunction( e );
              this.removeEventListener(
                 'click'
                  /**
                   * Warning: The 5th edition of ECMAScript forbids use of arguments.callee() in strict mode.
                   */
                , arguments.callee
                , false 
              );
            }
          , false
        );

        if ( Dropdown == targetElement ) return;
      }
        

      targetElement
        .applyStyle('display', 'block')
        .setAttribute('open', 'true')
      ;
    }
    /**
     * Inicialización de la clase, este método activa los eventos "click" 
     * en cada elemento con el atributo [role="Dropdown"]
     */
    , trigger : function () {
     
      var elements = getElements( 'role', 'dropdown' )
        , j
        , k = elements.length
        , keysCode = { 
             "escape" : 27 
            , "up"    : 38
            , "down"  : 40
            , "enter" : 13
          }
        , keysPressed = function ( keyObject, callback ) {

            var keysList = Array.prototype.slice.call( keyObject.expect )
              , direction
              , pressed = keyObject.pressed
              ;

            keysList.forEach( function ( each ) {
              if ( pressed == each ) {

                direction = ( pressed == keysCode.up ) ? 'up' : 'down';
                
                return callback( direction );
              }
            });
          }
        , targetElement
        , getListItems = function ( parent, finder ) {
            var children
              , v
              , childs = [ ]
              ;

            if ( parent.hasChildNodes() ) {
              children = parent.childNodes;
  
              for ( v = 0; v < children.length; ++v ) {
                if ( children [ v ].tagName == finder.toUpperCase()  ) {
                  childs.push( children [ v ] );     
                }
              }
            }
            return childs;
          }
        , listItems
        , activeItem = 1
        , activeToDown = 0
        , selected
        ;

      //Para cada elemento con tal atributo, se añade un "listener".
      //Cuando es clickeado, se abre o se cierra el <div id="target"></div>
      for ( j = 0; j < k; ++j ) {
        elements [ j ].addEventListener(
           'click'
          , function ( elementClicked ) {
              Dropdown.openDrop( elementClicked, false );

              targetElement = document.getElementById( elementClicked.target.getAttribute('target') )
              listItems = getListItems( targetElement, 'li' );

              var pressCaller
                , link
                ;

              window.addEventListener(
                  'keydown'
                , function ( a ) {
                    pressCaller = arguments.callee;
                    keysPressed(
                        { 
                            "pressed"   : a.keyCode
                          , "expect"    : [ keysCode.enter ]
                        }
                      , function () {
                          console.log('parado en : ' + selected);
                          link = getListItems( listItems [ selected ], 'a' ) [ 0 ].href;
                          this.removeEventListener('keydown', pressCaller, false);

                          return window.location = link;
                      }
                    );
                  }
                , false
              ); 

              window.addEventListener(
                  'keydown'
                , function ( a ) {
                    var caller = arguments.callee
                      , items = listItems.length
                      ;

                    if ( selected >= 0 )
                      listItems [ selected ].applyStyle ( 'backgroundColor', 'transparent' );                       

                    keysPressed(
                        {
                             "pressed" : a.keyCode
                           , "expect"  : [ keysCode.up, keysCode.down ]
                        }
                      , function ( direction ) {

                          if ( direction == 'up' ) {
                            if ( activeItem == 1 ) 
                              activeItem = items;
                            else 
                              activeItem--;
                            selected = activeItem;
                          }
                          else {
                            if ( activeToDown == items ) 
                              activeToDown = selected = 1;
                            else 
                              selected = ++activeToDown;
                          }

                          listItems [ --selected ].applyStyle ( 'backgroundColor', '#09F' );
                                                  
                        }
                      , false
                    );
                    
                    keysPressed(
                        { 
                            "pressed"   : a.keyCode
                          , "expect"    : [ keysCode.escape ]
                        }
                      , function () {
                          Dropdown.openDrop( elementClicked, true );

                          return window.removeEventListener( 'keydown', caller, false ); 
                      }
                    );
                  }
                , false 
              );
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
