google.charts.load('current', {'packages':['line', 'corechart']});

  $("#drawGraph").click(function() {
    clearGraph();
    var graphData = getGraphData();
    drawGraph(graphData);
  });

  function clearGraph(){
    var canvas = $('#logGraphContainer').empty(); // or document.getElementById('canvas');
  }

  function getGraphData(){

    var graphData = new Array();

    for (var i = 0; i < latencies.length; i++) {
      var datum = new Array();
      datum.push(moment(latencies[i].timestamp,"DD/MMM/YYYY:hh:mm:ss").toDate());
      datum.push(latencies[i].latency);
      graphData.push(datum);
    }

    return graphData;
  }

  function drawGraph(graphData){

    var chartDiv = document.getElementById('chart_div');

      var data = new google.visualization.DataTable();
      data.addColumn('datetime', 'Time');
      data.addColumn('number', "Latency");

      data.addRows(graphData);

      var materialOptions = {
        chart: {
          title: 'Latencies'
        },
        width: 2000,
        height: 500
      };

      var materialChart = new google.charts.Line(chartDiv);
      materialChart.draw(data, materialOptions);
  }
