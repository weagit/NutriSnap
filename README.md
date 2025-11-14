# 🍽️ NutriSnap

**AI-Powered Calorie Tracking Made Simple**

NutriSnap is a mobile application that uses artificial intelligence to analyze food photos and estimate their caloric content. Built with React Native and Expo, it provides an intuitive way to track your daily calorie intake.

---

## ✨ Features

- 📸 **Photo Recognition**: Take a picture of your meal and get instant calorie estimates
- 🤖 **AI-Powered Analysis**: Uses Groq's Llama Vision model for accurate food identification
- 📝 **Custom Details**: Add text descriptions for more precise calorie calculations
- 📊 **Progress Tracking**: Visualize your daily calorie intake with an interactive chart
- 🎯 **Daily Goals**: Set and track your daily calorie limits
- 💾 **Local Storage**: All data is stored locally on your device
- 🌙 **Minimal Design**: Clean, modern interface with a professional color palette

---

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **AI Model**: Groq API (Llama 4 Scout Vision)
- **State Management**: React Context API
- **Storage**: AsyncStorage
- **Charts**: react-native-chart-kit
- **Navigation**: React Navigation

---

## 📱 Screenshots

*Coming soon*

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app on your mobile device

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/NutriSnap.git
cd NutriSnap
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

Get your free Groq API key at: https://console.groq.com

4. **Start the development server**
```bash
npx expo start
```

5. **Run on your device**
- Scan the QR code with Expo Go (Android) or Camera app (iOS)

---

## 📖 Usage

1. **Set Your Daily Goal**: Navigate to Settings and set your daily calorie limit
2. **Take a Photo**: Use the camera to capture your meal
3. **Add Details** (Optional): Provide additional context like "extra cheese" or "no sauce"
4. **Analyze**: Let the AI estimate the calories and macronutrients
5. **Track Progress**: View your daily intake in the Journal and track your progress in Settings

---

## 🏗️ Project Structure

```
NutriSnap/
├── src/
│   ├── components/          # Reusable UI components
│   ├── constants/           # App constants and configuration
│   │   └── constants.js     # Colors, sizes, messages, API config
│   ├── navigation/          # Navigation configuration
│   │   └── AppNavigator.js
│   ├── screens/             # App screens
│   │   ├── ScanScreen.js    # Main photo capture screen
│   │   ├── JournalScreen.js # Daily meals list
│   │   └── SettingsScreen.js # Settings and progress chart
│   ├── services/            # External services
│   │   └── apiClient.js     # Groq API integration
│   └── store/               # State management
│       └── caloriesContext.js # Global state with Context API
├── .env                     # Environment variables (not committed)
├── App.js                   # Root component
└── package.json
```

---

## 🎨 Design Principles

- **Minimalist UI**: Clean interface focused on functionality
- **Intuitive Navigation**: Simple flow from photo to tracking
- **Professional Aesthetics**: Custom color palette with turquoise accents
- **Mobile-First**: Optimized for smartphone usage

---

## 🔐 Privacy & Security

- All meal data is stored locally on your device
- No account creation required
- API key stored in environment variables
- No data is shared with third parties

---

## 🤝 Contributing

This is a school project, but suggestions and feedback are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is part of an academic assignment and is for educational purposes only.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@weagit](https://github.com/weagit)
---

## 🙏 Acknowledgments

- [Groq](https://groq.com) for providing the AI API
- [Expo](https://expo.dev) for the amazing development framework
- React Native community for excellent libraries

---

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

**Made with ❤️ and React Native**
