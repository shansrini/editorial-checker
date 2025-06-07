const express = require("express");
const bodyParser = require("body-parser");
const OpenAI = require("openai");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors()); 
app.use(bodyParser.json({ limit: "10mb" }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/analyze", async (req, res) => {
  const html = req.body.html;

  const prompt = `
You are an editorial assistant. Review the following HTML article using these rules:
- Avoid passive voice
- Keep sentences short
- Remove filler or vague language
- Ensure logical headings
- Flag missing image alt text

Return the analysis in bullet points.

HTML:
${html}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }]
    });
    console.log("GPT RESPONSE:", response);
    res.json({ result: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
