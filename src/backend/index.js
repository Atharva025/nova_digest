import express from 'express';
import "./connection.js";

const app = express();
const PORT = 3000;
app.use(express.json());
import Users from './user.js';
import cors from "cors";

app.use(express.json());
app.use(cors());

app.post("/sign_up", async (req, res) => {
    let user = new Users(req.body);
    try {
        let result = await user.save();
        res.send(result);
    } catch (error) {
        console.error('Error saving user', error);
        res.status(500).send('Error saving user');
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await Users.findOne({ username });
        if (!user) {
            alert("User does not exist");
            res.status(400).send('User does not exist');

        } else if (password !== user.password) { 
            alert("User does not exist");
            res.status(400).send('Invalid password');

        } else {
            res.send({ message: 'Login successful', user });
        }
    } catch (error) {
        console.error('Error logging in', error);
        res.status(500).send('Error logging in');
    }
});

app.post("/home", async (req, res) => {
    const { username } = req.body;
    try {
        let user = await Users.findOne({ username });
        if (!user) {
            res.status(400).send('User does not exist');
        }

    } catch (error) {
        console.error('Error logging in', error);
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});