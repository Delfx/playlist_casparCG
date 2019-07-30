const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join('..', 'DataBase', 'filenametest'));


db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS videoFile (name TEXT,changed TEXT)");

    // const stmt = db.prepare("INSERT INTO videoFile VALUES (?, ?)");
    // for (let i = 0; i < 10; i++) {
    //     stmt.run("SECOND " + i, "1231T51");
    // }
    // stmt.finalize();
    let id = 2;
    db.run(`DELETE FROM videoFile WHERE rowid=?`, id, function(err) {
    });





    db.each("SELECT rowid AS id, name FROM videoFile", function(err, row) {
        console.log(row.id + ": " + row.name);
    });
});

db.close();

