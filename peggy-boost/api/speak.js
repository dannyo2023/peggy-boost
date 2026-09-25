// Vercel serverless function: /api/speak?text=...
// Calls ElevenLabs text-to-speech with a stock, non-cloned voice and
// streams the audio back as audio/mpeg. Requires an ELEVENLABS_API_KEY
// environment variable set in your Vercel project settings.
//
// Get a key at https://elevenlabs.io — the free tier is enough to test this.
// Swap ELEVENLABS_VOICE_ID for any voice from your ElevenLabs voice library
// if you'd rather use a different one.

module.exports = async (req, res) => {
  const text = (req.query.text || '').toString().slice(0, 300);
  if (!text) {
    res.status(400).json({ error: 'Missing "text" query param' });
    return;
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'ELEVENLABS_API_KEY is not set in this project' });
    return;
  }

  // Default: "Rachel", a stock ElevenLabs voice (not a clone of anyone).
  const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.45, similarity_boost: 0.75 },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      res.status(response.status).json({ error: errText });
      return;
    }

    const arrayBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(Buffer.from(arrayBuffer));
  } catch (err) {
    res.status(500).json({ error: 'TTS request failed' });
  }
};
