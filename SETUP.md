# Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- OpenAI API key
- ElevenLabs API key (optional, for voice features)

## Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Create Environment File**
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=sk-your-openai-key-here
   ELEVENLABS_API_KEY=your-elevenlabs-key-here
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to `http://localhost:3000`

## Getting API Keys

### OpenAI API Key
1. Visit https://platform.openai.com/
2. Sign up or log in
3. Go to API Keys section
4. Create a new secret key
5. Copy and paste into `.env.local`

**Note**: You need a paid OpenAI account with credits for API access.

### ElevenLabs API Key (Optional)
1. Visit https://elevenlabs.io/
2. Sign up for a free account
3. Go to Profile → API Keys
4. Copy your API key
5. Add to `.env.local`

**Note**: Free tier includes limited characters per month.

## Troubleshooting

### "Failed to generate plan"
- Check your OpenAI API key is correct
- Ensure you have API credits in your OpenAI account
- Check browser console for detailed error messages

### Voice features not working
- Verify ElevenLabs API key is set
- Check your ElevenLabs account has available credits
- Text length is limited to 5000 characters

### Image generation fails
- Ensure your OpenAI account has DALL-E access
- Some queries may be filtered by content policy
- Check API credits

### Build errors
- Delete `node_modules` and `.next` folder
- Run `npm install` again
- Run `npm run build` to check for errors

## Production Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
Make sure to add these in your hosting platform:
- `OPENAI_API_KEY`
- `ELEVENLABS_API_KEY`

## Cost Estimates

- **OpenAI GPT-4o-mini**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- **DALL-E 3**: ~$0.04 per image
- **ElevenLabs**: Free tier includes 10,000 characters/month

Average cost per plan generation: ~$0.05-0.10




