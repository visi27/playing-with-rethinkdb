
$(function() {
  function timestamp() { return (new Date).getTime() / 1000; }

  let cluster = document.querySelector("#cluster");
  cluster.toFixed = function(value, precision) {
    return Number(value).toFixed(precision);
  };

  let chart = $("#chart").epoch({
    type: "time.line",
    axes: ["left", "bottom"],
    data: [
      {label: "Writes", values: [{time: timestamp(), y: 0}]},
      {label: "Reads", values: [{time: timestamp(), y: 0}]}
    ]
  });

  let socket = io.connect();

  socket.on("stats", function(data) {
    cluster.stats = data.new_val.query_engine;
    chart.push([
      { time: timestamp(), y: cluster.stats.written_docs_per_sec },
      { time: timestamp(), y: cluster.stats.read_docs_per_sec}
    ]);
  });

  cluster.servers = [];
  socket.on("servers", function(data) {
    console.log(data.length)
    console.log(data);
    if (data.length){
      return cluster.servers = data;
    }


    if (!data.old_val){
      cluster.servers.push(data.new_val);
      return;
    }

    if (!data.new_val){
      for (let s in cluster.servers)
        if (cluster.servers[s].id == data.old_val.id)
          cluster.servers.splice(s, 1)
    }

    if(data.new_val && data.old_val) {
      for (let s in cluster.servers)
        if (cluster.servers[s].id == data.old_val.id)
          cluster.servers[s] = data.new_val;
    }

  });

  socket.on("cdr", function(data) {
    console.log(data)
  });
});
