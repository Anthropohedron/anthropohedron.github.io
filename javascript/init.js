$(document).ready(function() {
  var game = null;
  var games = {};

  var rulesLink = $('#rulesLink');
  var gameSelect = $('#gameSelect');

  gameSelect.bind('change', function() {
    var option = gameSelect.val();
    var newGame = null;
    if (option == "none") return;
    if (games.hasOwnProperty(option)) {
      newGame = games[option];
    } else {
      newGame = eval('new '+option+'("#card_game_element", 10, 110);');
      games[option] = newGame;
    }
    if (game != newGame) {
      if (game) game.deactivate();
      game = newGame;
      game.activate();
      rulesLink.hash = option;
    }
    return true;
  });

  var dealing = document.getElementById("dealing");
  function dealFunc() {
    game.deal();
    dealing.style.visibility = "hidden";
  };

  $('#deal').bind('click', function() {
    if (game) {
      dealing.style.visibility = "visible";
      setTimeout(dealFunc, 100);
    }
  });

  function chooseSize(size) {
    size = (""+size).toUpperCase();
    switch(size) {
      case 'LARGE':
        document.body.classList.remove('SMALL');
        document.body.classList.add('LARGE');
        $('largecards').checked = true;
        break;
      case 'SMALL':
        document.body.classList.remove('LARGE');
        document.body.classList.add('SMALL');
        $('smallcards').checked = true;
        break;
    }
    if (game) game.reposition();
    var radio = $(size.toLowerCase()+'cards');
    if (radio) radio.checked = true;
    Cookies.set('size', size);
  };

  function chooseUnicode(unicode) {
    unicode = !!unicode;
    document.body.classList.toggle('UNICODE', unicode);
    $('unicode').checked = unicode;
    Cookies.set('unicode', ''+unicode);
  }

  $('#largecards').bind('click', function() { chooseSize('LARGE'); });
  $('#smallcards').bind('click', function() { chooseSize('SMALL'); });
  $('#unicode').bind('click', function() { chooseUnicode(this.checked); });
  $('#undo').bind('click', function() { if (game) game.undo(); });
  $('#redo').bind('click', function() { if (game) game.redo(); });

  chooseUnicode(Cookies.get('unicode') != 'false');
  chooseSize(Cookies.get('size') || 'LARGE');

});
