var DATETIME_FORMAT = "DD/MMM/YYYY:hh:mm:ss";

google.charts.load('current', {'packages':['line', 'corechart']});

  $("#drawGraph").click(function() {
    clearGraph();
    var graphData = getGraphData();
    drawGraph(graphData);
  });

  var timeRange = getTimeRangeOfData();

$( function() {
  $( "#slider-range" ).slider({
    range: true,
    min: timeRange.start.getTime(),
    max: timeRange.end.getTime(),
    values: [ timeRange.start.getTime(), timeRange.end.getTime() ],
    slide: function( event, ui ) {
      $( "#timeRangeLabel" ).text(moment(new Date(ui.values[ 0 ])).format("D/MMM/YY h:mm:ss a") + " to " + moment(new Date(ui.values[ 1 ])).format("D/MMM/YY h:mm:ss a"));
      timeRange.start = new Date(ui.values[ 0 ]);
      timeRange.end = new Date(ui.values[ 1 ]);
    }
  });
} );

  function clearGraph(){
    var canvas = $('#logGraphContainer').empty(); // or document.getElementById('canvas');
  }

  function getTimeRangeOfData(){

    var timeRange = {"start":null, "end":null};

    if(latencies.length === 0){
      return timeRange;
    }

    timeRange.start = moment(latencies[0].timestamp, DATETIME_FORMAT).toDate();
    timeRange.end = moment(latencies[latencies.length - 1].timestamp, DATETIME_FORMAT).toDate();

    return timeRange;

  }

  function getGraphData(){

    var graphData = new Array();

    var currentSecond = null;
    var totalLatencyForCurrentSecond = 0;
    var maxLatency = 0;
    var tps = 0;

    for (var i = 0; i < latencies.length; i++) {
      var second = moment(latencies[i].timestamp, DATETIME_FORMAT).toDate();

      if(second < timeRange.start){
        continue;
      }

      if(second > timeRange.end){
        break;
      }

      if(currentSecond === null){
        currentSecond = moment(latencies[i].timestamp, DATETIME_FORMAT).toDate();
      }

      if(second.getTime() === currentSecond.getTime()){
        totalLatencyForCurrentSecond = totalLatencyForCurrentSecond + latencies[i].latency;

        if(maxLatency < latencies[i].latency){
          maxLatency = latencies[i].latency;
        }

        tps++;
      }if(second.getTime() > currentSecond.getTime()){
        var avgLatency = Math.round(totalLatencyForCurrentSecond / tps);
        var datum = new Array();
        datum.push(currentSecond);
        datum.push(avgLatency);

        // TODO: Figure out presentation to plot max latency.
        //datum.push(maxLatency);

        datum.push(tps);
        graphData.push(datum);

        // Reset the data of the second.
        currentSecond = second;
        totalLatencyForCurrentSecond = latencies[i].latency;
        maxLatency = latencies[i].latency
        tps = 1;
      }
    }

    return graphData;
  }

  function drawGraph(graphData){

    var chartDiv = document.getElementById('chart_div');

      var data = new google.visualization.DataTable();
      data.addColumn('datetime', 'Time');
      data.addColumn('number', "Latency");
      data.addColumn('number', "TPS");

      data.addRows(graphData);

      var materialOptions = {
        chart: {
          title: 'Latency vs TPS'
        },
        width: 1615,
        height: 500,
        series: {
          0: {axis: 'latency'},
          1: {axis: 'tps'}
        },
        axes: {
          y: {
            latency: {label: 'Avg. Latency'},
            tps: {label: 'TPS'}
          }
        },
        legend: {position: 'top'}
      };

      var materialChart = new google.charts.Line(chartDiv);
      materialChart.draw(data, materialOptions);
  }
