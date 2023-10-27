const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.resolve(__dirname, '../users.db'), sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
      } else {
        console.log('Connected to the database.');
        
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
          if (err) {
            console.error(err.message);
          } else if (!row) {
            db.run(`
              CREATE TABLE users (
                id INTEGER PRIMARY KEY,
                firstname TEXT,
                lastname TEXT,
                date TEXT,
                address TEXT
              )
            `, (err) => {
              if (err) {
                console.error('Error creating table:', err.message);
              } else {
                console.log('Table "users" created successfully.');
              }
            });
          } else {
            console.log('The "users" table is already created.');
          }
        });
      }
});

const saveUser = async(req,res) => {
    try {
        const { firstname, lastname, date, address } = req.body;
        db.run(
            `INSERT INTO users(firstname, lastname, date, address)
            VALUES (?, ?, ?, ?)`,
            [firstname, lastname, date, address],
            function (err) {
                if (err) {
                  res.status(404)
                  .send({message:"Error in inserting data"});
                } else {
                  res.status(200)
                  .send({message:"Data inserted Successfully"});
                }
            }
        )
    } catch (error) {
        res.status(400)
        .send({message: "Something went wrong"})
    }
}

const loadData = async(req,res) => {
    try {
         db.all(
            `SELECT * FROM users`,
            [],
            (err, rows)=>{
                if(err) {
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
                res.json(rows);
            }
        )
    } catch (error) {
        res.status(400)
        .send({message: "Something went wrong"}) 
    }
}

const loadUser = async(req,res) => {
    try {
        const id = req.query.id;
        db.get(
            `SELECT * FROM users WHERE users.id=${id}`,
            [],
            (err, rows)=>{
                if(err) {
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
                res.json(rows);
            }
        )
    } catch (error) {
        res.status(400)
        .send({message: "Something went wrong"}) 
    }
}

const updateuser = async(req,res) => {
    try {
        const id = Number(req.query.id);
        db.run(`UPDATE users
        SET firstname = ?, lastname = ?, date = ?, address = ?
        WHERE id = ?`, 
        [req.body.firstname,req.body.lastname,req.body.date,req.body.address,id],
        function (err) {
          if (err) {
            console.log(err);
            res.status(404)
            .send({message:"Failed in updating user"})
          }
          res.status(200)
          .send({message:"User updated successfull"})
        });
    } catch (error) {
        res.status(400)
        .send({message: "Something went wrong"}) 
    }
}

const deleteUser = async(req,res) => {
    try {
        const id = Number(req.query.id);
        db.run(`DELETE FROM users WHERE id = ?`, 
        id,
        function (err) {
          if (err) {
            console.log(err);
            res.status(404)
            .send({message:"Failed in Deleting user"})
          }
          res.status(200)
          .send({message:"User Deleted successfull"})
        });
    } catch (error) {
        res.status(400)
        .send({message: "Something went wrong"}) 
    }
}



module.exports = {
    saveUser,
    loadData,
    loadUser,
    updateuser,
    deleteUser
}