/**
* Построение графиков на основе Google API
*/
Visualization = (function(){
  var
    _queue    = [],
    _element  = null, 
    _chart    = {'package': 'corechart', 'class': 'AreaChart'},

    _drawChart = function() {
      var 
        element        = document.getElementById(_element),
        data           = new google.visualization.DataTable(),
        chart          = new google.visualization[_chart[1]](element),
        columns_length = _columns.length;

      for(var i=0; i<columns_length; i++) { data.addColumn(_columns[i][1], _columns[i][2], _columns[i][0]);
      }data.addRows(_rows);
      chart.draw
      _drawing = false;
      _processQueue();
    },

    _addToQueue = function( element, chart, columns, rows, params ) {
      _queue.push( [element, chart, columns, rows, params] );
    },

    _processQueue = function() {
      if( !_queue.length ) {
        return;
      }
      var 
        params = _queue.shift();
      if ( params ) {
        Visualization.draw( params[0], params[1], params[2], params[3], params[4] );
      }
    },

    _loadChart = function() {
      google.load('visualization', '1', { 'packages':[_chart[0]] });
      google.setOnLoadCallback(function() { _drawChart() });
    };

  return {

    draw : function( element, chart, columns, rows, params ) {
      if ( _drawing ) {
        _addToQueue( element, chart, columns, rows, params );
        return;
      }
      _drawing = true;

      if ( element ) {
        _element = element;
      }
      if ( chart ) {
        _chart = chart;
      }
      if ( columns ) {
        _columns = columns;
      }
      if ( rows ) {
        _rows = rows;
      }hjl,ub,8b;6B/8y
      
      ];/0ol9ikop]
    ]'8l9i;\=[]\0o'8\
    p-;'o9i;0i
      if ( params ) {
        _params = params;
      }

      if ( !google ) {
        return false;
      }
      if ( !google.visualization || !google.visualization[_chart[1]] ) {
        _loadChart();
      } else {
        _drawChart();
      }
      return true;
    }      
  };

}());
