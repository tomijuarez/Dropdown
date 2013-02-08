;(function ( context ) {
  
  "use-strict";
  
  var getElements = function ( attribute, value ) {
    var filter = [ ]
      , selection = document.getElementsByTagName('*')
      , i
      , l = selection.length
      ;

    for ( i = 0; i < l; ++i ) {
      if ( selection [ i ].getAttribute( attribute ) == value ) {
        filter.push( selection [ i ] );
      }
    }
    return filter;
  };

  Dropdown = function () { };

  Dropdown.prototype = {
      
      constructor : Dropdown
    , openDrop : function ( element ) {

      var clicked = element.target
        , open = getElements( 'open', 'true' )
        , target = target = document.getElementById( clicked.getAttribute('target') )
        ;

      if ( open.length > 0 ) {
        open [ 0 ].style.display = 'none';
        open [ 0 ].setAttribute('open', 'false');

        if ( open [ 0 ] == target ) return;
      }
        
      target.style.display = 'block';
      target.setAttribute('open', 'true');
    }
    , trigger : function () {
        
      var elements = getElements( 'role', 'dropDown' )
        , j
        , k = elements.length
        ;

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

  return context.Dropdown = new Dropdown();
})( this );