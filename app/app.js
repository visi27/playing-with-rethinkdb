
const express = require("express");
const sockio = require("socket.io");
const r = require("rethinkdb");
const config = require('./config.json')
const db = Object.assign(config.rethinkdb, {db: 'rethinkdb'})
const app = express();
app.use(express.static(__dirname + "/public"));

const io = sockio.listen(app.listen(8099), {log: false});
console.log("Server started on port " + 8099);

r.connect(db).then(function(c) {
  r.table("stats").get(["cluster"]).changes().run(c)
    .then(function(cursor) {
      cursor.each(function(err, item) {
        io.sockets.emit("stats", item);
      });
    });

  r.table("server_status").changes().run(c)
    .then(function(cursor) {
      cursor.each(function(err, item) {
        io.sockets.emit("servers", item);
      });
    });

  r.db("test").table("cdr_billing").changes().run(c)
    .then(function (cursor) {
      cursor.each(function (err, item) {
        io.sockets.emit("cdr", item);
      })
    })
});

io.sockets.on("connection", function(socket) {
  let conn;
  r.connect(db).then(function(c) {
    conn = c;
    return r.table("server_status").run(conn);
  })
  .then(function(cursor) { return cursor.toArray(); })
  .then(function(result) {
    socket.emit("servers", result);
  })
  .error(function(err) { console.log("Failure:", err); })
  .finally(function() {
    if (conn)
      conn.close();
  });
});
