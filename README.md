# 💪 AI Fitness Coach

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=for-the-badge&logo=openai)

**An AI-powered fitness assistant that generates personalized workout and diet plans using advanced LLMs**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [API Keys](#-api-keys-setup) • [Demo](#-demo-mode)

</div>

---

## 📖 Overview

AI Fitness Coach is a modern, full-stack web application built with Next.js that leverages artificial intelligence to create personalized fitness and nutrition plans. The app uses OpenAI's GPT models to generate custom workout routines and meal plans based on user preferences, fitness goals, and physical attributes.

### ✨ Key Highlights

- 🤖 **AI-Powered**: Uses GPT-4o-mini for intelligent plan generation
- 🎨 **Beautiful UI**: Modern pink-blue gradient design with smooth animations
- 🔊 **Voice Features**: Text-to-speech for workout and diet plans
- 🖼️ **Image Generation**: Visual representations of exercises and meals
- 📄 **PDF Export**: Download your complete fitness plan
- 🌓 **Dark Mode**: Beautiful dark/light theme support
- 💾 **Local Storage**: Automatically saves your plans
- 📱 **Responsive**: Works perfectly on all devices

---

## 🚀 Features

### 🧑 User Input & Personalization

- **Personal Details**: Name, Age, Gender
- **Physical Metrics**: Height & Weight (with BMI calculation)
- **Fitness Goals**: Weight Loss, Muscle Gain, Endurance, General Fitness, Flexibility
- **Fitness Level**: Beginner, Intermediate, Advanced
- **Workout Location**: Home, Gym, or Outdoor
- **Dietary Preferences**: Vegetarian, Non-Vegetarian, Vegan, Keto
- **Optional Fields**: Medical history, stress level

### 🧠 AI-Powered Plan Generation

- **Workout Plan**:

  - 7-day weekly schedule
  - Exercise routines with sets, reps, and rest times
  - Location-appropriate exercises
  - Level-adjusted intensity
  - Workout tips and guidance

- **Diet Plan**:

  - Daily meal breakdown (Breakfast, Lunch, Dinner, Snacks)
  - Calorie counts for each meal
  - Dietary preference-compliant recipes
  - Nutrition tips and advice

- **Motivation & Tips**:
  - Personalized motivational messages
  - Lifestyle and posture tips
  - Daily AI-generated motivation quotes

### 🔊 Voice Features

- **Text-to-Speech**: Listen to your workout and diet plans
- **Multiple Voices**: Choose from different voice options
- **Browser Fallback**: Uses Web Speech API when ElevenLabs is unavailable
- **Section-Specific**: Listen to Workout or Diet sections separately

### 🖼️ Image Generation

- **Exercise Images**: Click any exercise to see AI-generated visuals
- **Meal Images**: Visual representations of your meal plan
- **DALL-E 3 Integration**: High-quality, realistic images

### 🧾 Additional Features

- **PDF Export**: Download your complete plan as a PDF
- **Dark/Light Mode**: Toggle between themes
- **Local Storage**: Plans automatically saved in browser
- **Regenerate Plan**: Get new recommendations anytime
- **Smooth Animations**: Framer Motion animations throughout
- **Daily Motivation**: AI-powered daily quotes

---

## 🛠️ Tech Stack

| Category          | Technology                     |
| ----------------- | ------------------------------ |
| **Framework**     | Next.js 14 (App Router)        |
| **Language**      | TypeScript 5.5                 |
| **Styling**       | Tailwind CSS 3.4               |
| **UI Components** | Shadcn UI, Radix UI            |
| **Animations**    | Framer Motion                  |
| **AI/ML**         | OpenAI GPT-4o-mini, DALL-E 3   |
| **Voice**         | ElevenLabs API, Web Speech API |
| **PDF**           | jsPDF                          |
| **State**         | React Hooks, Local Storage     |
| **Theme**         | next-themes                    |

---

## 📦 Installation

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **OpenAI API Key** (for AI features)
- **ElevenLabs API Key** (optional, for voice features)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd "Fitness App"
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# OpenAI API Key (Required for AI features)
OPENAI_API_KEY=sk-your-openai-api-key-here

# ElevenLabs API Key (Optional for voice features)
ELEVENLABS_API_KEY=your-elevenlabs-api-key-here
```

### Step 4: Run the Development Server

```bash
npm run dev
```

### Step 5: Open Your Browser

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔑 API Keys Setup

### OpenAI API Key (Required)

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to **API Keys** section
4. Click **Create new secret key**
5. Copy the key and add it to `.env.local`
6. **Note**: You need a paid OpenAI account with credits

**Cost Estimate**: ~$0.05-0.10 per plan generation

### ElevenLabs API Key (Optional)

1. Visit [ElevenLabs](https://elevenlabs.io/)
2. Sign up for a free account
3. Go to **Profile** → **API Keys**
4. Copy your API key
5. Add it to `.env.local`

**Free Tier**: 10,000 characters/month

---

## 🎮 Usage

### Basic Workflow

1. **Fill in Your Details**

   - Enter your personal information
   - Select your fitness goals and level
   - Choose workout location and dietary preferences

2. **Generate Your Plan**

   - Click "Generate My Fitness Plan"
   - Wait for AI to create your personalized plan
   - (Works in demo mode even without API keys!)

3. **Explore Your Plan**

   - View workout routines for each day
   - Check your daily meal plan
   - Read tips and motivation

4. **Use Additional Features**
   - Click "Listen to Workout Plan" for voice playback
   - Click exercises/meals to see AI-generated images
   - Export your plan as PDF
   - Toggle dark/light mode

### Demo Mode

The app includes a **demo mode** that works without API keys! It generates personalized plans based on your input using intelligent algorithms. Perfect for testing and demonstration.

---

## 📁 Project Structure

```
Fitness App/
├── app/
│   ├── api/
│   │   ├── generate-plan/      # AI plan generation endpoint
│   │   ├── motivation-quote/  # Daily motivation quotes
│   │   ├── text-to-speech/    # ElevenLabs TTS integration
│   │   ├── generate-image/    # DALL-E image generation
│   │   └── export-pdf/        # PDF export functionality
│   ├── globals.css            # Global styles with theme
│   ├── layout.tsx             # Root layout with theme provider
│   └── page.tsx               # Main page component
├── components/
│   ├── ui/                    # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── tabs.tsx
│   │   └── ...
│   ├── user-form.tsx          # User input form
│   ├── plan-display.tsx       # Plan display with tabs
│   ├── voice-player.tsx       # TTS player component
│   ├── image-modal.tsx        # Image generation modal
│   ├── motivation-quote.tsx   # Daily quote component
│   └── theme-toggle.tsx       # Dark/light mode toggle
├── lib/
│   └── utils.ts               # Utility functions
├── types/
│   └── index.ts               # TypeScript type definitions
├── .env.local                 # Environment variables (create this)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 🎨 Customization

### Changing Colors

Edit `app/globals.css` to customize the color scheme:

```css
:root {
	--primary: 330 81% 60%; /* Pink */
	--secondary: 210 100% 96%; /* Light Blue */
	/* ... */
}
```

### Changing AI Models

Edit `app/api/generate-plan/route.ts`:

```typescript
model: "gpt-4o-mini"; // Change to "gpt-4", "gpt-3.5-turbo", etc.
```

### Adding More Voices

Edit `components/voice-player.tsx` to add more ElevenLabs voices.

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`
   - `ELEVENLABS_API_KEY`
4. Deploy!

### Other Platforms

The app can be deployed to any platform supporting Next.js:

- **Netlify**
- **AWS Amplify**
- **Railway**
- **Render**

---

## 🐛 Troubleshooting

### Plan Generation Fails

**Issue**: "Failed to generate plan" error

**Solutions**:

- ✅ Check your OpenAI API key is correct in `.env.local`
- ✅ Ensure you have sufficient API credits
- ✅ Verify the key starts with `sk-`
- ✅ Check browser console for detailed error messages
- ✅ Try the demo mode (works without API keys)

### Voice Features Not Working

**Issue**: "Failed to generate speech" error

**Solutions**:

- ✅ Verify ElevenLabs API key is set (optional)
- ✅ Check your ElevenLabs account has available credits
- ✅ The app will automatically use browser TTS as fallback
- ✅ Text length is limited to 5000 characters

### Image Generation Fails

**Issue**: "Failed to generate image" error

**Solutions**:

- ✅ Verify your OpenAI API key has DALL-E access
- ✅ Check your OpenAI account has available credits
- ✅ Some queries may be filtered by OpenAI's content policy
- ✅ Ensure you're using a paid OpenAI account

### Build Errors

**Issue**: TypeScript or build errors

**Solutions**:

```bash
# Delete node_modules and reinstall
rm -rf node_modules .next
npm install

# Check for TypeScript errors
npm run build
```

---

## 📝 Environment Variables

| Variable             | Required | Description                                            |
| -------------------- | -------- | ------------------------------------------------------ |
| `OPENAI_API_KEY`     | Yes\*    | OpenAI API key for plan generation, quotes, and images |
| `ELEVENLABS_API_KEY` | No       | ElevenLabs API key for voice features                  |

\*Required for AI features, but demo mode works without it

---

## 💡 Tips & Best Practices

1. **API Costs**: Monitor your OpenAI usage to control costs
2. **Rate Limits**: Be aware of API rate limits for production use
3. **Error Handling**: The app includes fallbacks for missing API keys
4. **Local Storage**: Plans are saved automatically in browser
5. **Responsive Design**: Test on mobile devices for best experience

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- 🌐 Translations
- 🧪 Tests

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **OpenAI** for GPT and DALL-E APIs
- **ElevenLabs** for text-to-speech API
- **Next.js** team for the amazing framework
- **Shadcn** for beautiful UI components
- **Framer Motion** for smooth animations

---

## 📞 Support

- 📧 **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- 📖 **Documentation**: Check the [Wiki](https://github.com/your-repo/wiki)

---

## ⭐ Show Your Support

If you find this project helpful, please give it a ⭐ on GitHub!

---

<div align="center">

**Built with ❤️ using Next.js and AI**

[⬆ Back to Top](#-ai-fitness-coach)

</div>
