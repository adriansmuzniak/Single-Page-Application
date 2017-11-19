/*
*spa.shell.js
*Moduł powłoki dla aplikacji SPA.
*/

/* jslint browser : true, continue : true,
        devel : true, indent : 2, maxerr : 50,
        newcap : true, nomen : true, plusplus : true,
        regexp : true, sloppy : true, varse : false,
        white : true
*/
/* global $. spa */

spa.shell = (function() {

// ---------ROZPOCZĘCIE SEKCJI ZMIENNYCH ZAKRESU MODUŁU-----------------
  var configMap = {
      anchor_schema_map: {
        chat: { open: true, closed: true }
      },
      main_html: String()
    + '<div class="spa-shell-head">'
     + '<div class="spa-shell-head-logo"></div>'
     + '<div class="spa-shell-head-acct"></div>'
     + '<div class="spa-shell-head-search"></div>'
    + '</div>'
    + '<div class="spa-shell-main">'
     + '<div class="spa-shell-main-nav"></div>'
     + '<div class="spa-shell-main-content"></div>'
    + '</div>'
    + '<div class="spa-shell-foot"></div>'
    + '<div class="spa-shell-chat"></div>'
    + '<div class="spa-shell-modal"></div>',
    chat_extend_time: 250,
    chat_retract_time: 300,
    chat_extend_height: 450,
    chat_retract_height: 15,
    chat_extended_title: "Kliknij, aby ukryć",
    chat_retracted_title: "Kliknij, aby pokazać"
    },  
    stateMap = { 
      $container: null,
      anchor_map: {},
      is_chat_retracted: true
     },
    jqueryMap = {},

    copyAnchorMap, setJqueryMap, toggleChat, changeAnchorPart, onHashChange,
    onClickChat, initModule;

  // --------ZAKOŃCZENIE SEKCJI ZMIENNYCH ZAKRESU MODUŁU----------------

  // --------ROZPOCZĘCIE SEKCJI METOD NARZĘDZIOWYCH-----------------
  // Zwraca kopię przechowywanej mapy kotwicy; minimalizuje narzut.
  copyAnchorMap = function () {
    return $.extend( true, {}, stateMap.anchor_map);
  };
  // --------ZAKOŃCZENIE SEKCJI METOD NARZĘDZIOWYCH-----------------

  // --------ROZPOCZĘCIE SEKCJI METOD DOM-------------------------------

  // Rozpoczęcie metody DOM /setJqueryMap/.
  setJqueryMap = function() {
    var $container = stateMap.$container;
    jqueryMap = { $container: $container };

    jqueryMap = {
      $container: $container,
      $chat: $container.find('.spa-shell-chat')
    };
  };
  // Zakończenie metody DOM /setJqueryMap/

  // Rozpoczęcie metody DOM /toggleChat/.
  // Cel: wysuwanie i chowanie suwaka czatu.

  //Stan: konfiguruje stateMap.is_chat_retracted;
  // *true - suwak jest zwinięty;
  // *false - suwak jest rozwinięty;
  
  // Argumenty:
  // do_extend - jeśli prawda (true) wysuwa suwak, jeśli fałsz (false), chowa;
  // *callback (wywołanie zwrotne) - opcjonalna funkcja do wykonywania na zakończenie animacji.
  // Ustawienia:
  // *chat_extended_time, chat_retract_time,
  // *chat_extend_height, chat_retract_height,
  // Zwraca wartość logiczną (boolean):
  // *true - aktywacja suwaka aktywowana;
  // *false - animacja suwaka nieaktywowana.
  //
  toggleChat = function ( do_extend, callback ) {
    var px_chat_ht = jqueryMap.$chat.height();
    is_open = px_chat_ht === configMap.chat_extend_height;
    is_closed = px_chat_ht === configMap.chat_retract_height;
    is_sliding = !is_open && !is_closed;
   
    // Unikanie sytuacji wyścigu
    if ( is_sliding ) {
      return false;
    };

    // Rozpoczęcie rozwijania suwaka czatu.
    if ( do_extend ) {
      jqueryMap.$chat.animate({ height: configMap.chat_extend_height},
        configMap.chat_extend_time, 
        function() {
          jqueryMap.$chat.attr(
            'tytuł', configMap.chat_extended_title
          );
          stateMap.is_chat_retracted = false;
          if ( callback ) { callback( jqueryMap.$chat); }
        }
      );
      return true;
    }
    // Zakończenie rozwijania suwaka czatu.

    // Rozpoczęcie zwijania suwaka czatu.
       jqueryMap.$chat.animate(
         { height: configMap.chat_retract_height },
         configMap.chat_retract_time,
         function () {
           jqueryMap.$chat.attr(
             'tytuł', configMap.chat_retracted_title
           );
           stateMap.is_chat_retracted = true;
           if ( callback ) { callback( jqueryMap.$chat); }
          }
        );
        return true;
    // Zakończenie zwijania suwaka czatu.
  };
  // Zakończenie metody DOM /toggleChat/.

  // Rozpoczęcie metody DOM /changeAnchorPart/.
  // Cel: zmiania części komponentu kotwicy URI.
  // Argumenty:
  // *arg_map - mapa opisująca, którą część kotwicy URI chcemy zmienić.
  // Zwraca: wartość logiczną boolean;
  // * true - część kotwicy adresu URI została zaktualizowana;
  // * false - części kotwicy adresu URI nie mogła zostać zaktualizowana:
  // Akcja:
  // bieżąca reprezentacja kotwicy przechowywana w stateMap.anchor_map;
  // Ta metoda:
  // *tworzy kopię mapy za pomocą metody copyAnchor();
  // *modyfikuje wartość kluczy za pomocą arg_map;
  // *zarządza rozróżnianiem pomiędzy niezależnymi i zależnymi
  // wartościami w kodowaniu;
  // *próbuje zmienić adres URI za pomocą uriAnchor;
  // *zwraca true w przypadku powodzenia oraz false jeżeli operacja się nie powiedzie.
  //
  changeAnchorPart = function ( arg_map ) {
    var anchor_map_revise = copyAnchorMap(),
        bool_return = true,
        key_name, key_name_dep;

  // Rozpoczęcie wprowadzania zmian w mapie kotwicy.
    KEYVAL:
    for ( key_name in arg_map ) {
      if ( arg_map.hasOwnProperty( key_name )) {

      // Przeskakiwanie zależnych kluczy podczas iteracji.
        if ( key_name.indexOf( '_' ) === 0 ) { continue KEYVAL; }

      // Aktualizacja niezależnej wartości klucza.
        anchor_map_revise[key_name] = arg_map[key_name];

        // Aktualizacja odpowiadającego klucza zależnego.
        key_name_dep = "_" + key_name;
        if ( arg_map[key_name_dep] ) {
          anchor_map_revise[key_name_dep] = arg_map[key_name_dep]
        }
      }
    }
  // Zakończenie wprowadzania zmian w mapie kotwicy.

  // Rozpoczęcie próby aktualizacji URI;
  // przywrócenie poprzedniego w przypadku niepowodzenia.
    try {
      $.uriAnchor.setAnchor( anchor_map_revise );
    }
    catch ( error ) {
    // Zastąpienie adresu URI stanem obecnym.
      $.uriAnchor.setAnchor( stateMap.anchor_map, null, true );
      bool_return = false;
    }
  // Zakończenie próby aktualizacji adresu URI...
    return bool_return; 
  };
  // Zakończenie metody DOM /changeAnchorPart/.
  // --------ZAKOŃCZENIE SEKCJI METOD DOM--------------------------------

  // --------ROZPOCZĘCIE SEKCJI PROCEDUR OBSŁUGI ZDARZEŃ-----------------
  // Rozpoczęcie procedury obsługi zdarzęń /onHashChange/.
  // Cel: obsługa zdarzenia hashChange.
  // Argumenty:
  // * event - obiekt zdarzeń jQuery.
  // Ustawienia: brak.
  // Zwraca: false,
  // Akcja:
  // *parsuje komponent kotwicy adresu URI;
  // *porównuje zaproponowany stan aplikacji ze stanem bieżącym;
  // *dostosowuje aplikację tylko wtedy, kiedy proponowany stan 
  // różni się od istniejącego.
  //
  onHashChange = function ( event ) {
    var anchor_map_previous = copyAnchorMap(),
    anchor_map_proposed,
    _s_chat_previous, _s_chat_proposed,
    s_chat_proposed;

  // Próba parsowania kotwicy.
    try { anchor_map_proposed = $.uriAnchor.makeAnchorMap(); }
    catch ( error ) {
      $.uriAnchor.setAnchor( anchor_map_previous, null, true);
      return false;
    }
    stateMap.anchor_map = anchor_map_proposed;
    
  // Zmienne złożone.
    _s_chat_previous = anchor_map_previous._s_chat;
    _s_chat_proposed = anchor_map_proposed._s_chat;

    // Rozpoczęcie dostosowywania komponentu czatu, jeśli został zmieniony.
    if ( !anchor_map_previous || _s_chat_previous !== _s_chat_proposed) {
      s_chat_proposed = anchor_map_proposed.chat;

      switch ( s_chat_proposed ) {
        case 'open': 
        toggleChat( true );
        break;
        case 'closed':
        toggleChat( false );
        break;
        default:
          toggleChat( false );
          delete anchor_map_proposed.chat;
          $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
      }
    }
  // Zakończenie dostosowywania komponentu czatu, jeśli został zmieniony.

  return false;
  };
  // Zakończenie procedury obsługi zdarzeń /onhashChange/




  onClickChat = function ( event ) {
   if ( toggleChat( stateMap.is_chat_retracted ) ) {
     $.uriAnchor.setAnchor({
       chat: ( stateMap.is_chat_retracted ? 'open' : 'closed' )
     });
   }
    return false;
  }
  // --------ZAKOŃCZENIE SEKCJI PROCEDUR OBŁSUGI ZDARZEŃ-----------------

  // --------ROZPOCZĘCIE SEKCJI METOD PUBLICZNYCH------------------------

  // Rozpoczęcie metody publicznej /initModule/.
  initModule = function ( $container ) {
    //Ładowanie HTML i mapowanie kolekcji jQuery.
    stateMap.$container = $container;
    $container.html( configMap.main_html );
    setJqueryMap();

    stateMap.is_chat_retracted = true;
    jqueryMap.$chat
      .attr( 'tytuł', configMap.chat_retracted_title )
      .click( onClickChat );

    // Testowanie przełączania.
    // setTimeout(function () {toggleChat(true);}, 3000);
    // setTimeout(function () {toggleChat(false);}, 8000);
  };
  // Zakończenie metody publicznej /initModule/.
  return { initModule: initModule };
// --------ZAKOŃCZENIE SEKCJI METOD PUBLICZNYCH------------------------
}());
