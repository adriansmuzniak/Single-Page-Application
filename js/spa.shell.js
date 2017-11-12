/*
*spa.shell.js
*Moduł powłoki dla aplikacji SPA.
*/

/*jslint browser : true, continue : true,
        devel : true, indent : 2, maxerr : 50,
        newcap : true, nomen : true, plusplus : true,
        regexp : true, sloppy : true, varse : false,
        white : true
*/
/*global $. spa*/

spa.shell = (function() {
//---------ROZPOCZĘCIE SEKCJI ZMIENNYCH ZAKRESU MODUŁU-----------------
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
    + '<div class="spa-shell-modal"></div>'
},
stateMap = { $container: null},
jqueryMap = {}, 
setJqueryMap, initModule;
//--------ZAKOŃCZENIE SEKCJI ZMIENNYCH ZAKRESU MODUŁU----------------

//--------ROZPOCZĘCIE SEKCJI METOD NARZĘDZIOWYCH-----------------
//--------ZAKOŃCZENIE SEKCJI METOD NARZĘDZIOWYCH-----------------

//--------ROZPOCZĘCIE SEKCJI METOD DOM-------------------------------
//Rozpoczęcie metody DOM /setJqueryMap/.
setJqueryMap = function() {
    var container = stateMap.$container;
    jqueryMap = {$container: $container};
};
//Zakończenie metody DOM /setJqueryMap/
//--------ZAKOŃCZENIE SEKCJI METOD DOM--------------------------------

//--------ROZPOCZĘCIE SEKCJI PROCEDUR OBSŁUGI ZDARZEŃ-----------------
//--------ZAKOŃCZENIE SEKCJI PROCEDUR OBŁSUGI ZDARZEŃ-----------------

//--------ROZPOCZĘCIE SEKCJI METOD PUBLICZNYCH------------------------
//Rozpoczęcie metody publicznej /initModule/.
initModule = function($container) {
    stateMap.$container = $container;
    $container.html(configMap.main_html);
    setJqueryMap();
};
//Zakończenie metody publicznej /initModule/.
return {initModule:initModule};
//--------ZAKOŃCZENIE SEKCJI METOD PUBLICZNYCH------------------------
}());