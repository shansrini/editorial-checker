const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
app.use(bodyParser.json({ limit: "10mb" }));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

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
    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }]
    });

    res.json({ result: response.data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
