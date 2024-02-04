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

const ITEMS_PER_PAGE = 10;

app.get('/api/llms', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const startIndex = (page - 1) * ITEMS_PER_PAGE;

        const llms = await LLModel.find()
            .skip(startIndex)
            .limit(ITEMS_PER_PAGE);

        res.json({
            llms,
            currentPage: page,
            totalPages: Math.ceil(llms.length / ITEMS_PER_PAGE),
        });
    } catch (error) {
        console.error('Error fetching LLMs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
