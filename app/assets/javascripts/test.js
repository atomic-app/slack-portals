// Модуль отвечает за сохранение данных на сервер

app.modules.saveControl = function(self) {
  var
    _queue = [],
    _config = {
      url: {
        job: app.config.urlJob,
        save: app.config.urlSaveEti
      },
      interval: {
        poll: 500,
        save: 300
      },
      timerId: 0
    },
    _wait = false;

  function _succeeded(response) {
    if ($.isEmptyObject(response.error)) {
      $doc.trigger('succeededSaveControl:Eti');
    } else {
      $doc.trigger('validateErrorSaveControl:Eti', [response]);
    }
    _wait = false;
    _start();
  }

  function _error(data) {
    $doc.trigger('errorSaveControl:Eti', [data]);
  }

  function _poll(pid, data) {
    $.ajax({
      url: _config.url.job + '/' + pid,
      dataType: 'json',
      success: function(response) {
        if (response.succeeded || response.failed) {
          response.succeeded && _succeeded(response.payload);
          response.failed && _error(data);
        } else {
          setTimeout(function() {
            _poll(pid, data);
          }, _config.interval.poll);
        }
      },
      error: function() {
        _error(data);
      }
    });
  }

  function _save(data) {
    if (!Object.keys(data).length) {
      _wait = false;
      return false;
    }
    $doc.trigger('savedSaveControl:Eti');
    $.ajax({
      url: _config.url.save,
      data: {'bind_data': data},
      type: 'POST',
      dataType: 'json',
      success: function(response) {
        _poll(response.job_id, data);
      },
      error: function() {
        _error(data);
      }
    });
  }

  function _group() {
    var data = {};
    $.each(_queue, function(index, value) {
      var key = Object.keys(value)[0];
      data[key] = $.extend(data[key], value[key]);
    });
    _queue = [];
    return data;
  }

  function _ungroup(data) {
    var id, field;
    for (id in data) {
      for (field in data[id]) {
        var
          object = {},
          value = {};

        value[field] = data[id][field];
        object[id] = value;
        _queue.unshift(object);
      }
    }
  }

  function _start() {
    clearInterval(_config.timerId);
    _config.timerId = setTimeout(function() {
      _wait = true;
      _save(_group());
    }, _config.interval.save);
  }

  function _listener() {
    $doc
      .on('changeTable:Eti', function(event, data) {
        _queue.push(data);
        !_wait && _start();
      })
      .on('click', '.js-repeat-save', function() {
        _ungroup($(this).data());
        _wait = false;
        _start();
        return false;
      });
    $win.on('beforeunload', function() {
      if (_queue.length || _wait) {
        return 'Информация, введенная на странице, будет потеряна. Для сохранения изменений нажмите кнопку "Остаться на этой странице"';
      }
    });
  }

  self.start = function() {
    _wait = false;
    _start();
  };

  self.stop = function() {
    clearInterval(_config.timerId);
    _wait = true;
  };

  self.restart = function(data) {
    _ungroup(data);
    self.start();
  };

  self.load = function() {
    _listener();
  };

  return self;
}(app.modules.saveControl || {});
