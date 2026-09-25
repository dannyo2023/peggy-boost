# Deploying peggy-boost

## 1. Deploy as-is (browser voice only)
    npx vercel --prod
This works immediately — the page falls back to the visitor's
browser voice if /api/speak isn't configured.

## 2. Turn on the higher-quality voice
1. Sign up at https://elevenlabs.io and grab an API key.
2. In your Vercel project → Settings → Environment Variables, add:
   ELEVENLABS_API_KEY = your key
3. Redeploy (`npx vercel --prod` again, or push to git if you connected
   a repo). The page will automatically start using /api/speak once it
   responds successfully — no code changes needed.
4. Optional: set ELEVENLABS_VOICE_ID to any voice ID from your ElevenLabs
   voice library if you want a different stock voice than the default.
