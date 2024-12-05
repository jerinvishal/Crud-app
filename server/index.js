const express = require("express");
const users = require("./db.json");
const app = express();
const fs = require("fs");
const PORT = 8000;
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/users", (req, res) => {
    return res.json(users);
});

app.delete("/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const filteredUsers = users.filter((user) => user.id !== id);

    fs.writeFile("./db.json", JSON.stringify(filteredUsers), (err) => {
        if (err) {
            console.error("Error writing to file:", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        return res.json(filteredUsers);
    });
});

app.post("/users", (req, res) => {
    const { name, age, city } = req.body;
    if (!name || !age || !city) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const id = Date.now();
    const newUser = { id, name, age, city };
    const updatedUsers = [...users, newUser];

    fs.writeFile("./db.json", JSON.stringify(updatedUsers), (err) => {
        if (err) {
            console.error("Error writing to file:", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        return res.json({ message: "User data added successfully", user: newUser });
    });
});

app.patch("/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const { name, age, city } = req.body;
    if (!name || !age || !city) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    const updatedUsers = [...users];
    updatedUsers[index] = { ...updatedUsers[index], name, age, city };

    fs.writeFile("./db.json", JSON.stringify(updatedUsers), (err) => {
        if (err) {
            console.error("Error writing to file:", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        return res.json({ message: "User data updated successfully", user: updatedUsers[index] });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
