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

// app.get('/api/llms', async (req, res) => {
//     const llms = await LLModel.find();
//     res.json(llms);
// });

const ITEMS_PER_PAGE = 4;

const MAX_ITEMS_PER_PAGE = 4;

app.get('/api/llms', async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        const requestedLimit = parseInt(req.query.limit) || ITEMS_PER_PAGE;

        const limit = Math.min(requestedLimit, MAX_ITEMS_PER_PAGE);

        const startIndex = (page - 1) * limit;

        const llms = await LLModel.find()
            .skip(startIndex)
            .limit(limit);

        res.json(llms);
    } catch (error) {
        console.error('Error fetching LLMs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/llms/:id', async (req, res) => {
    try {
        const llmId = req.params.id;
        const llm = await LLModel.findById(llmId);

        if (!llm) {
            return res.status(404).json({ error: 'LLM not found' });
        }

        res.json(llm);
    } catch (error) {
        console.error('Error fetching LLM by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
