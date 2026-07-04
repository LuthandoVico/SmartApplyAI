const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

async function callOpenAI(prompt) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant. Always respond with valid JSON only, no markdown." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    }),
  });
  const data = await res.json();
  return data.choices[0].message.content.replace(/```json|```/g, "").trim();
}

export async function generateQuestions(role, type, difficulty) {
  const prompt = `Generate exactly 5 ${difficulty} ${type} interview questions for a ${role} position.
Return ONLY a JSON array of 5 strings. Example: ["Question 1?", "Question 2?"]`;
  try {
    return JSON.parse(await callOpenAI(prompt));
  } catch {
    return getMockQuestions(type);
  }
}

export async function generateFeedback(question, answer) {
  const prompt = `Score this interview answer.
Question: ${question}
Answer: ${answer}
Return ONLY valid JSON:
{"score": <1-10>, "good": "<what was good>", "improve": "<what to improve>", "suggested": "<better answer in 2-3 sentences>"}`;
  try {
    return JSON.parse(await callOpenAI(prompt));
  } catch {
    return { score: 6, good: "You attempted the question.", improve: "Be more specific.", suggested: "A stronger answer would include concrete examples." };
  }
}

export async function generateOverallFeedback(questions, answers, scores) {
  const pairs = questions.map((q, i) => `Q: ${q}\nA: ${answers[i]}\nScore: ${scores[i]}/10`).join("\n\n");
  const prompt = `Give overall interview feedback based on these responses:\n${pairs}
Return ONLY valid JSON:
{"summary": "<one sentence>", "strengths": ["s1","s2","s3"], "improvements": ["i1","i2","i3"], "nextSteps": ["n1","n2"]}`;
  try {
    return JSON.parse(await callOpenAI(prompt));
  } catch {
    return {
      summary: "You showed good effort throughout the interview.",
      strengths: ["Attempted all questions", "Stayed composed", "Some structured answers"],
      improvements: ["Add specific examples", "Use STAR method", "Be more concise"],
      nextSteps: ["Practice 3 more mock interviews", "Research the STAR method"]
    };
  }
}

function getMockQuestions(type) {
  const banks = {
    technical: ["Explain the difference between var, let, and const.", "What is a REST API?", "What is the difference between SQL and NoSQL?", "Explain version control.", "What does scalability mean?"],
    behavioural: ["Tell me about a time you met a tight deadline.", "Describe a disagreement with a teammate.", "Tell me about a project you're proud of.", "Describe learning something new quickly.", "Tell me about a mistake and what you learned."],
    general: ["Tell me about yourself.", "Where do you see yourself in 3 years?", "What are your greatest strengths?", "What is your biggest weakness?", "Why do you want this role?"]
  };
  return banks[type] || banks.general;
}