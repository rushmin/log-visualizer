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

    var currentSecond = moment(latencies[0].timestamp,"DD/MMM/YYYY:hh:mm:ss").toDate()
    var totalLatencyForCurrentSecond = 0;
    var tps = 0;

    for (var i = 0; i < latencies.length; i++) {
      var second = moment(latencies[i].timestamp,"DD/MMM/YYYY:hh:mm:ss").toDate();

      if(second.getTime() === currentSecond.getTime()){
        totalLatencyForCurrentSecond = totalLatencyForCurrentSecond + latencies[i].latency;
        tps++;
      }if(second.getTime() > currentSecond.getTime()){
        var avgLatency = Math.round(totalLatencyForCurrentSecond / tps);
        var datum = new Array();
        datum.push(currentSecond);
        datum.push(avgLatency);
        datum.push(tps);
        graphData.push(datum);

        // Reset the data of the second.
        currentSecond = second;
        totalLatencyForCurrentSecond = latencies[i].latency;
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
        width: 2500,
        height: 500,
        series: {
          0: {axis: 'latency'},
          1: {axis: 'tps'}
        },
        axes: {
          y: {
            latency: {label: 'Latency'},
            tps: {label: 'TPS'}
          }
        },
        legend: {position: 'top'}
      };

      var materialChart = new google.charts.Line(chartDiv);
      materialChart.draw(data, materialOptions);
  }
