require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const llmSchema = new mongoose.Schema({
    name: String,
    provider: String,
    category: String,
    description: String,
    exampleCode: String,
    useCases: [String],
    tryItLink: String,
});

const LLModel = mongoose.model('LLModel', llmSchema);

app.post('/api/llms', async (req, res) => {
    const newLLM = new LLModel(req.body);
    await newLLM.save();
    res.status(201).json(newLLM);
});

app.get('/api/llms', async (req, res) => {
    const llms = await LLModel.find();
    res.json(llms);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
