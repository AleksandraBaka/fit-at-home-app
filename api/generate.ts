export default async function handler(req, res) {
  try {
    const { profile } = req.body;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
        process.env.VITE_GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Ułóż trening domowy dla osoby:
wiek ${profile.age},
waga ${profile.weight},
wzrost ${profile.height},
energia ${profile.energyLevel},
czas ${profile.availableTime} minut.
Zwróć konkretny plan.`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    res.status(200).json({
      text: data?.candidates?.[0]?.content?.parts?.[0]?.text || "Brak odpowiedzi",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server error" });
  }
}
