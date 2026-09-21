const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
const fs = require("fs");
const path = require("path");

const nexusFile = path.join(__dirname, "Nexus", "ghana history.md");

const nexusKnowledge = fs.readFileSync(nexusFile, "utf8");

const sourceFile = path.join(__dirname, "Nexus", "sources", "ghana-history-sources.md");

const sourceKnowledge = fs.readFileSync(sourceFile, "utf8");

const traditionsFile = path.join(__dirname, "Nexus", "ghana-traditions.md");

const traditionsKnowledge = fs.readFileSync(traditionsFile, "utf8");

const ethnicGroupsFile = path.join(__dirname, "Nexus", "ghana-ethnic-groups.md");

const ethnicGroupsKnowledge = fs.readFileSync(ethnicGroupsFile, "utf8");

const kingdomsFile = path.join(__dirname, "Nexus", "ghana-kingdoms-and-states.md");

const kingdomsKnowledge = fs.readFileSync(kingdomsFile, "utf8");
app.use(express.json());
app.use(express.static(__dirname));

app.get("/api/status", (req, res) => {
    res.json({
        status: "online",
        message: "AMARA backend is running."
    });
});

app.post("/api/chat", async (req, res) => {

    const question = req.body.question;

    if (!question) {
        return res.status(400).json({
            error: "No question was provided."
        });
    }

    try {

        const response = await client.responses.create({
            model: "gpt-5.6-luna",

            instructions: `
You are Amara, an AI guide to African history, culture and knowledge.

Your purpose is to help people understand Africa through accurate,
respectful and evidence-based information.

Give African perspectives appropriate attention while maintaining
historical accuracy.

Distinguish documented historical evidence from oral traditions,
legends and disputed interpretations.

Never invent historical facts.

When historians disagree, explain the disagreement clearly.

Be helpful, educational and respectful.

When appropriate, identify reliable sources or explain where the
information comes from.
            `,

            input: `

NEXUS KNOWLEDGE:

${nexusKnowledge}
SOURCE AND EVIDENCE RULES:

${sourceKnowledge}

GHANAIAN TRADITIONS AND CULTURAL KNOWLEDGE:

${traditionsKnowledge}

GHANAIAN ETHNIC GROUPS AND TRADITIONAL SOCIETIES:

${ethnicGroupsKnowledge}

GHANAIAN KINGDOMS AND HISTORICAL STATES:

${kingdomsKnowledge}

USER QUESTION:

${question}
`
});

        res.json({
            answer: response.output_text
        });

    } catch (error) {

        console.error("OpenAI error:", error);

        res.status(500).json({
            error: "AMARA could not get an AI response."
        });
    }
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/amara.html");
});



app.listen(PORT, "0.0.0.0", () => {
    console.log("AMARA is running on port " + PORT);
});