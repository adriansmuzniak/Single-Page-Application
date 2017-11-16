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
    chat_extend_time: 1000,
    chat_retract_time: 300,
    chat_extend_height: 450,
    chat_retract_height: 15
    },
    stateMap = { $container: null },
    jqueryMap = {},
    setJqueryMap, toggleChat, initModule;
  // --------ZAKOŃCZENIE SEKCJI ZMIENNYCH ZAKRESU MODUŁU----------------

  // --------ROZPOCZĘCIE SEKCJI METOD NARZĘDZIOWYCH-----------------
  // --------ZAKOŃCZENIE SEKCJI METOD NARZĘDZIOWYCH-----------------

  // --------ROZPOCZĘCIE SEKCJI METOD DOM-------------------------------
  // Rozpoczęcie metody DOM /setJqueryMap/.
  setJqueryMap = function() {
    var container = stateMap.$container;
    jqueryMap = { $container: $container };

    jqueryMap = {
      $container: $container,
      $chat: $container.find('spa-shell-chat')
    };
  };
  // Zakończenie metody DOM /setJqueryMap/
  // Rozpoczęcie metody DOM /toggleChat/.
  // Cel: wysuwanie i chowanie suwaka czatu.
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
    var px_chat_ht = jqueryMap.$chat.height(),
    is_open = px_chat_ht === configMap.chat_extend_height,
    is_closed = px_chat_ht === configMap.chat_retract_height,
    is_sliding = !is_open && !is_closed;

    // Unikanie sytuacji wyścigu
    if ( is_sliding ) {
      return false;
    };

    // Rozpoczęcie rozwijania suwaka czatu.
    if ( do_extend ) {
      jqueryMap.$chat.animate(
        { height: configMap.chat_extend_height },
        configMap.chat_extend_time,
        function () {
          if ( callback ) { callback( jqueryMap.$chat); }
        }
      );
      return true;
    }
    // Zakończenie rozwijania suwaka czatu.

    // Rozpoczęcie zwijania suwaka czatu.
    jqueryMap.$chat.animate(
      { height: configMap.chat_retract_time },
      configMap.chat_retract_time,
      function () {
        if ( callback ) { callback( jqueryMap.$chat); }
      }
    );
    return true;
    // Zakończenie zwijania suwaka czatu.
    
  };
  // Zakończenie metody DOM /toggleChat/.
  // --------ZAKOŃCZENIE SEKCJI METOD DOM--------------------------------

  // --------ROZPOCZĘCIE SEKCJI PROCEDUR OBSŁUGI ZDARZEŃ-----------------
  // --------ZAKOŃCZENIE SEKCJI PROCEDUR OBŁSUGI ZDARZEŃ-----------------

  // --------ROZPOCZĘCIE SEKCJI METOD PUBLICZNYCH------------------------
  // Rozpoczęcie metody publicznej /initModule/.
  initModule = function($container) {
    stateMap.$container = $container;
    $container.html(configMap.main_html);
    setJqueryMap();
  };
  // Zakończenie metody publicznej /initModule/.
  return { initModule: initModule };
// --------ZAKOŃCZENIE SEKCJI METOD PUBLICZNYCH------------------------
}());
