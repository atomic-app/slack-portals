// функция склонения целых числительных
// сам код стырен из Yii framework и адаптирован к нашим реалиям,
// чтобы можно было использовать с дробными и отрицательными числами
function declOfNum(number, titles) {
  var
    index = 1,
    posNumber = Math.abs(number),
    mod10 = posNumber % 10,
    mod100 = posNumber % 100;

  if ((mod10 == 1) && (mod100 != 11)) {
    index = 0;
  } else if (((mod10 >= 2) && (mod10 <= 4) && (mod10 % 1 == 0)) && ((mod100 < 12) || (mod100 > 14))) {
    index = 1;
  } else if ((mod10 == 0) || ((mod10 >= 5) && (mod10 <= 9) && (mod10 % 1 == 0)) || ((mod100 >= 11) && (mod100 <= 14) && (mod100 % 1 == 0))) {
    index = 2;
  }
  return titles[index];
}

// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
function createBookmarkLink(sUrl, sTitle) {
  if (window.sidebar) {
    // Mozilla Firefox Bookmark
    window.sidebar.addPanel(sTitle, sUrl, '');
  } else if (window.external) {
    // IE Favorite
    window.external.AddFavorite(sUrl, sTitle);
  } else if (window.opera && window.print) {
    // Opera Hotlist
    return true;
  }
}

// Проверка, что событие произошло с нажатым Ctrl (и только с Ctrl).
function isEventCtrlPressed(event) {
  return event.ctrlKey && !event.altKey && !event.shiftKey;
}

//проверка на заполненность textarea
//в случае, если textarea пустая - выводится сообщение
//с предупреждением, что textarea не должна быть пустым
function textareaCheck($link, $area) {
  var text = 'не должно быть пустым';
  $link.click(function() {
    if ($area.next().attr('class') != 'required') {
      $area.after("<span class='required'></span>");
    }
    if ($area.val() == '') {
      $area.next().text(text);
      u_reRenderPopup();
      return false;
    }
  });
}

//скрываем ссылки от индексации
function spanToLinks() {
  var $link = $('<a>');
  $('span[data-to]').each(function() {
    var
      $a = $link.clone(),
      $this = $(this),
      self = this,
      attributes = self.attributes,
      parent = self.parentNode
      child = $a[0];

    $(attributes).each(function(i) {
      var
        attrName = attributes[i].nodeName,
        attrValue = attributes[i].nodeValue;
      switch (attrName) {
        case 'data-alt':
          child.alt = attrValue;
          break;
        case 'data-title':
          child.title = attrValue;
          break;
        case 'data-to':
          child.href = attrValue;
          break;
        case 'data-target':
          child.target = attrValue;
          break;
        case 'data-text':
          child.innerHTML = attrValue;
          break;
        default:
          try {
            $a.attr(attrName, attrValue);
          } catch(e) {};
          break;
      }
    });
    if (this.innerHTML) {
      child.innerHTML = this.innerHTML;
    }
    parent.replaceChild(child, this);   
  });
  $doc.trigger('success.spanToLinks');
}

function hideText() {
  $('[data-hidden-text]').each(function() {
    var
      $this = $(this);
    $this.text($this.data('hidden-text'));
  });
}

//смена статического текста
function toggleText(text1, text2, text, $selector) {
  $selector.text(text == text2 ? text1 : text2);
}

//выводим аяксом попапы регистрации и авторизации
function showAuthPopup(selector, url, callback) {
  var $selector = $(selector);
  if (!$selector.length) {
    $.ajax({
      url: url,
      type: 'post',
      dataType: 'html',
      success: function(response) {
        $('body').prepend($(response).html());
        if ($(response).find('span[data-to]').length) {
          spanToLinks();
        }
      },
      beforeSend: function() {
        u_showLoading();
      },
      complete: function() {
        showPopup($(selector), true, {focus: 'session_email'});
        if (callback && typeof(callback) === "function") {
          callback();
        }
      }
    });
  } else {
    showPopup($selector, true, {focus: 'session_email'});
  }
}

//онлайн смена попапов авторизации, регистрации и смены пароля
function changePopups() {
  var
    links = ['enter', 'reg', 'reset'],
    popupsID = ['login', 'auth', 'password-reset'],
    focusFields = ['session_email', 'user_profile_attributes_name', 'password_email'];

  $.each(links, function(index, value) {
    $doc.on('click', '.' + value + '.dashed-link', function() {
      closeAllPopup();
      showPopup(popupsID[index], true, {focus: focusFields[index]});
      return false;
    });
  });
}

function showToolbarPopups(url) {
  /* переименовать id */
  var
    selectors = ['.js-adb-link-reg, .js-to-do .reg-link', '.js-phone-sent-with-success .action-button, .js-toolbar-link-enter, #new_demand .dashed, .js-try-enter-link, .js-authorization-link, .js-to-do .enter-link, .js-to-do-enter, .js-enter-link'],
    popupsSelectors = ['#auth', '#login'],
    googleAnalytics = [['_trackPageview', url + '/form-registration']];

  $.each(selectors, function(index, value) {
    $doc.on('click', value, function() {
      // для корректной работы функции openStaticPopup
      $('#popup-content').empty();

      showAuthPopup(popupsSelectors[index], '/ajax/auth_popup?return_to=' + url, $(this).data('email') ? function() { $('#session_email').val($('.js-email').val()); } : null);

      if (googleAnalytics[index]) {
        _gaq.push([googleAnalytics[index]]);
      }

      return false;
    });
  });
}

//при выборе страны (или города, или области) в контактах дизайблим следующие селекты и вставляем картинку загрузки
function beforeSelectLoading(from, to) {
	var $to = $('#' + to);

	if (!$to.length) {
		return;
	}

	$to.find('select:first').prop('disabled', true);
	$to.parents(':eq(2)').addClass('loading');
}

//после успешного выбора страны (или города, или области) убираем картинку загрузки
function completeSelectLoading(from, to) {
	$('#' + to).parents(':eq(2)').removeClass('loading');
}

//смена класса у болка c visible на invisible и обратно
function flip_visible(id) {
  var el = document.getElementById(id);
  if (el) {
    if (el.className == "visible") {
      el.className="invisible";
      return false;
    }
    if (el.className == "invisible") {
      el.className="visible";
      return false;
    }
  }
  return true;
}

//сменяется один текст на другой и обратно
function flipInnerHtml(id, text1, text2) {
  var el = $('#' + id);
  if (el.length) {
    el.html((el.html() == text1) ? text2 : text1);
  }
}

//скрыть/показать сообщение
function toggleInfoMessage(senderCtrl, elId) {
  $('#' + elId)
    .css({top: (senderCtrl.offsetHeight + 2 + senderCtrl.offsetTop) + 'px',
          left: (senderCtrl.offsetWidth + senderCtrl.offsetLeft - elId.offsetWidth + 95) + 'px'})
    .toggle();
}

//скрываем и показываем блок
function showHideBox($link, $selector, text1, text2, iconClass) {
  $link.click(function() {
    $link.toggleClass(iconClass);
    $selector.toggle();
    toggleText(text2, text1, $link.text(), $link);
  });
}

//скрываем часть отзыва при превышении количества символов в таковом
function cutText(selector, param) {
  var
    $selector = selector,
    defText=[],
    newText=[],
    limit= 1000;
  $selector.each(function() {
    var
      $el = $(this),
      elText = $el.text(),
      i = $selector.index($el);
    if (elText.length > limit) {
      $el.addClass(param == 'points' ? 'points' : 'big');
      defText[i] = elText;
      newText[i]= defText[i].slice(0, limit);
      if (param=='points') {
        newText[i]= defText[i].slice(0, newText[i].lastIndexOf(' '));
      }
      $el.text(newText[i]).append('<span class="back"><a class="more" href="#"><span>далее</span></a></span>');
      /*для ie*/
      $el.find('.more').parent().before('<em></em>');
    }
  });
  $selector.find('.more').toggle(
    function() {
      var
        $toggleElem = $(this),
        $elGrandParent = $toggleElem.parent().parent(),
        i = $selector.index($elGrandParent);
      $elGrandParent.removeClass('big points');
      $elGrandParent.contents().filter(function() {
        return this.nodeType != 1;
      }).remove();
      $toggleElem.addClass('up').children().text('скрыть').parent().parent().before(defText[i]);
      /*для ie*/
      $toggleElem.parent().prev().remove();
      $doc.trigger('rewiew.toggle', $toggleElem);
      return false;
    },
    function() {
      var
        $toggleElem = $(this),
        $elGrandParent = $toggleElem.parent().parent(),
        i = $selector.index($elGrandParent);
      $elGrandParent.addClass(param == 'points' ? 'points' : 'big');
      $elGrandParent.contents().filter(function() {
        return this.nodeType != 1;
      }).remove();
      $toggleElem.removeClass('up').children().text('далее').parent().parent().before(newText[i]);
      /*для ie*/
      $toggleElem.parent().before('<em></em>');
      $doc.trigger('rewiew.toggle', $toggleElem);
      return false;
    }
  );
}

//устанавливаем первую букву в названии компании большой
function makeBigLetter($link) {
  var text = $link.val().replace(/^./, function(letter) { return letter.toUpperCase(); });
  $link.val(text);
}

//заменяем url-текст на url-ссылку
function injectInternalUrls(text) {
  var
    exp = new RegExp("(\\b(https?|ftp|file):\\/\\/.+?(" + (mainHost.replace('www.', '') + '|' + shortHost.replace('www.', '')).replace(/\\./g, '\\$&') + ").*?(\\s|$))", "ig");
  return text.replace(exp, '<a href="$1">$1</a>');
}

// создаем нестандартный placeholder для textarea
function makeTextareaPlaceHolder(obj) {
  var
    $textarea = obj && obj.$selector || $('.js-with-placeholder'),
    $textareaWrapper = $textarea.parent(),
    $placeholder = obj && obj.$placeholder || $('<div>').addClass('textarea-placeholder'),
    html = obj && obj.html || '',
    showPlaceHolder = function() {
      var
        length = $.trim($textarea.val()).length;

      if (!length && !$textareaWrapper.find($placeholder).length) {
        $textareaWrapper.prepend($placeholder.html(html).show());
      } else {if (!length) {$placeholder.show();
        }
 }
    };

  showPlaceHolder();

  $textarea.on('focus', function() {
    $placeholder.hide();
  });

  $placeholder.click(function() {
    $(this).hide();
    $textarea.trigger('focus');
  });

  $textarea.focusout(function() {
    showPlaceHolder();
  });
}


/* Создаем placeholder */
function makePlaceholder(input, id, className, isCommon) {var
    $label,
    $input = typeof input === 'object' ? input : $(input),
    text = $input.attr(isCommon ? 'data-placeholder' : 'placeholder'),
    label = "<label class=" + className + " for =" + id + ">" + text + "</label>",
    $label = $input.next('label');

  if ($label.length) {
    $label.remove();
  }

  $input.attr('id', id).after(label);

  $label = $input.next('label').hide();

  if(!$input.val()) {
    $label.show();
  }

  $input
    .on('reset focusout', function() {
      if(!$(this).val()) {
   $label.show();
      }
    })
    .on('change focus', function() {
      $label.hide();
    });
}

app.modules.coreApplicationBase = app.modules.coreApplicationBase || {};
app.modules.coreApplicationBase.load = function() {

  // Прикручиваем на Ctrl+Enter отправку форм.
  $doc.bind('keydown', function(event) {
  if ((event.which == 13) && isEventCtrlPressed(event)) {
    var target = event.target;
    if (target && target.form) {
      event.preventDefault();
      $(target.form).submit();
    }
  }
  });

  showToolbarPopups(areAllIE ? location.href.replace(location.hostname, punycode.toASCII(location.hostname)) : location.href.replace(location.pathname, escape(location.pathname)));
  changePopups();

  $.ajaxPrefilter(function(options) {
    if (options.crossDomain) {
      var
        originalUrl = options.url,
   hostName = options.url.match(/^http:\/\/.[^\/]*/gi)[0];

      options.url = punycode.toUnicode(hostName) + options.url.replace(hostName, '');
      if (originalUrl != options.url) {
        options.crossDomain = false;
      }
    }
  }); 

  spanToLinks();
  hideText();

};
