$( document ).ready( function() { 
    $( window ).scroll( 
        function() { if ( $( this ).scrollTop() > 200 ) { 
            $( '.jcm-top' ).fadeIn(); 
        } 
        else { $( '.jcm-top' ).fadeOut(); 
    } 
} 
); 
    $( '.jcm-top' ).click( function() { $( 'html, body' ).animate( { scrollTop : 0 }, 400 ); 
        return false; } ); } ); 