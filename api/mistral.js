export default async function handler(req, res) {
    // Hanya menerima method POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { promptText } = req.body;

    if (!promptText) {
        return res.status(400).json({ error: 'Prompt text is required' });
    }

    try {
        const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
            },
            body: JSON.stringify({
                model: "mistral-large-latest",
                messages: [{ role: "user", content: promptText }],
                temperature: 0.2
            })
        });

        if (!response.ok) {
            throw new Error(`Mistral API Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Mengirimkan kembali balasan Mistral ke Frontend
        res.status(200).json(data);
        
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: 'Gagal menghubungi server AI Mistral' });
    }
}