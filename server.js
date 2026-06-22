const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: "YOUR_NEON_DB_URL"
});

// register
app.post("/register", async (req,res)=>{

    const { username, password } = req.body;

    const hash = await bcrypt.hash(password,10);

    await pool.query(
        "INSERT INTO players(username,password,pp,clickpower,auto) VALUES($1,$2,0,1,0)",
        [username,hash]
    );

    res.json({ok:true});

});

// login
app.post("/login", async (req,res)=>{

    const { username, password } = req.body;

    const r = await pool.query(
        "SELECT * FROM players WHERE username=$1",
        [username]
    );

    if(r.rows.length === 0)
        return res.json({ok:false});

    const u = r.rows[0];

    const ok = await bcrypt.compare(password,u.password);

    if(!ok) return res.json({ok:false});

    res.json({
        ok:true,
        user:u
    });

});

// save
app.post("/save", async (req,res)=>{

    const { username, pp, clickpower, auto } = req.body;

    await pool.query(
        "UPDATE players SET pp=$1,clickpower=$2,auto=$3 WHERE username=$4",
        [pp,clickpower,auto,username]
    );

    res.json({ok:true});

});

app.listen(3000, ()=>console.log("running"));