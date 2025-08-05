# 🎮 Pixel Authenticator

A pixel-perfect retro-themed 2FA authenticator app with gamification features. Generate TOTP codes, collect special sequences, and unlock achievements in true 80s/90s arcade style!

## ✨ Features

### 🔐 **Core 2FA Functionality**
- **TOTP Code Generation**: Standards-compliant Time-based One-Time Password generation
- **Multiple Entry Methods**:
  - Manual otpauth:// URI entry
  - QR code image upload and parsing
  - Live camera QR code scanning
- **Auto-refresh**: Codes update every 30 seconds with countdown timers
- **Local Storage**: All entries persist between sessions
- **Copy to Clipboard**: One-click code copying

### 🎯 **Gamification System**
- **Special Sequence Collection**: Automatically detect and collect unique code patterns
- **Rarity System**: 
  - 👑 **Legendary**: Ultimate sequences like `123456`, `654321`
  - ⚡ **Epic**: Repeating digits, counting patterns
  - 💎 **Rare**: Echo patterns, alternating sequences  
  - ⭐ **Common**: Patterns with special starts/endings
- **Achievement System**: 8+ achievements to unlock including "Legend Seeker" and "The Ultimate"
- **Collection Stats**: Track total found, rarity breakdowns, and discovery dates

### 🕹️ **Retro Pixel Theme**
- **Authentic 80s/90s Aesthetic**: Dark backgrounds, bright neon colors
- **Pixel-Perfect UI**: Sharp corners, block shadows, monospace fonts
- **Retro Animations**: Pixel bouncing, pulsing effects
- **Custom Elements**: Retro scrollbars, CRT-style effects
- **Arcade Typography**: Uppercase pixel fonts throughout

### 🖼️ **QR Code Support**
- **Image Upload**: Drag & drop or file selection for QR code images
- **Live Camera Scanning**: Real-time QR code detection with visual feedback
- **Auto-parsing**: Automatic otpauth:// URI extraction from QR codes

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pixel-authenticator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 How to Use

### Adding Your First 2FA Entry

1. **Click "ADD NEW"** from the main screen
2. **Choose your method**:
   - **MANUAL**: Paste your otpauth:// URI directly
   - **UPLOAD**: Upload a QR code image file
   - **SCAN**: Use your camera to scan a QR code live
3. **Save and start collecting!**

### Collecting Special Sequences

- **Use your 2FA codes normally** - special sequences are detected automatically
- **Watch for special animations** when rare codes appear
- **Check your collection** by clicking "🏆 COLLECTION" 
- **Hunt for legendary sequences** like the ultimate `123456`!

### Achievement Hunting

- **First Contact**: Collect your first special sequence
- **Pattern Hunter**: Find 5 different sequences  
- **Lucky Number**: Discover the `777777` sequence
- **The Ultimate**: Find the legendary `123456` code
- **And more!**

## 🛠️ Technical Details

### Built With
- **React 19** with TypeScript
- **Tailwind CSS** with custom retro theme
- **CryptoJS** for HMAC-SHA1 TOTP generation
- **jsQR** for QR code image parsing
- **qr-scanner** for live camera scanning

### Architecture
- **Component-based**: Modular React components
- **Local Storage**: Client-side persistence
- **Standards Compliant**: RFC 6238 TOTP implementation
- **Security Focused**: No server required, all local processing

### File Structure
```
src/
├── components/           # React components
│   ├── TokenListPage.tsx    # Main 2FA codes display
│   ├── RegistrationPage.tsx # Add new entries
│   ├── CollectionPage.tsx   # Gamification hub
│   ├── Toast.tsx           # Notifications
│   └── ConfirmModal.tsx    # Confirmations
├── utils/               # Core utilities
│   ├── totp.ts             # TOTP generation & validation
│   ├── storage.ts          # Local storage management
│   └── collection.ts       # Gamification system
└── index.css           # Global retro styles
```

## 🎨 Customization

### Color Scheme
The retro theme uses a carefully crafted pixel palette:
- **Background**: `#1a1a2e` (Dark navy)
- **Surface**: `#16213e` (Card backgrounds)  
- **Accent**: `#e94560` (Bright red)
- **Success**: `#00f5ff` (Cyan)
- **Text**: `#eee` (Light gray)

### Adding New Special Sequences
Edit `src/utils/collection.ts` to add new patterns:
```typescript
{ pattern: /^YOUR_PATTERN$/, rarity: 'Epic' as const, description: 'Your Description' }
```

## 📱 Browser Support

- **Chrome/Edge**: Full support including camera scanning
- **Firefox**: Full support including camera scanning  
- **Safari**: Full support including camera scanning
- **Mobile**: Responsive design works on all devices

## 🔒 Security & Privacy

- **100% Client-Side**: No servers, no data transmission
- **Local Storage Only**: All data stays on your device
- **Standards Compliant**: Uses official TOTP algorithms
- **Open Source**: Full code transparency

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Anywhere
The built app is a static site that can be deployed to:
- GitHub Pages
- Netlify  
- Vercel
- Any static hosting service

## 🎮 Pro Tips

- **Leave the app open** to automatically collect sequences as they appear
- **Check back regularly** - some legendary sequences are extremely rare
- **Use multiple 2FA services** to increase your collection chances
- **Share your achievements** - screenshot your legendary finds!

## 🤝 Contributing

Contributions welcome! Feel free to:
- Add new special sequence patterns
- Create additional achievements  
- Improve the retro theme
- Add new gamification features

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Happy collecting!** 🏆✨ 

*May the sequences be ever in your favor!*