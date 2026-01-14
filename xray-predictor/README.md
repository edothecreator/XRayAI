# XRayAI - AI-Powered X-Ray Analysis Platform

A modern, fully-featured React + Vite application for X-ray image analysis using AI-powered predictions. Built with TypeScript, TailwindCSS, and integrated with a FastAPI backend.

## 🚀 Features

- **🎨 Modern UI/UX**: Beautiful, responsive design with dark mode support
- **🌍 Multi-language Support**: English, French, and Spanish
- **📤 File Upload**: Drag & drop or click to upload X-ray images
- **🤖 AI Predictions**: Real-time analysis and prediction results
- **📊 Export Options**: Download results as PDF, CSV, Excel, or JSON
- **🌙 Dark Mode**: Smooth theme switching with animations
- **📱 Fully Responsive**: Works seamlessly on mobile, tablet, and desktop
- **⚡ Fast Performance**: Optimized with lazy loading and code splitting
- **🎭 Smooth Animations**: Powered by Framer Motion

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd xray-predictor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=https://uninfusive-pleasureful-jule.ngrok-free.dev/predict
   ```

   Or use the provided `.env.example` as a template.

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:3000` (or the next available port).

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
xray-predictor/
├── public/                 # Static assets
│   ├── manifest.json      # PWA manifest
│   └── vite.svg          # Favicon
├── src/
│   ├── components/        # Reusable React components
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── pages/            # Page components
│   │   ├── Home.tsx
│   │   ├── Upload.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   └── NotFound.tsx
│   ├── hooks/            # Custom React hooks
│   │   └── useTheme.tsx
│   ├── services/         # API services
│   │   └── api.ts
│   ├── utils/            # Utility functions
│   │   └── export.ts
│   ├── i18n/            # Internationalization
│   │   ├── config.ts
│   │   └── locales/
│   │       ├── en.json
│   │       ├── fr.json
│   │       └── es.json
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── .eslintrc.cjs        # ESLint configuration
├── .prettierrc          # Prettier configuration
├── tailwind.config.js   # TailwindCSS configuration
├── postcss.config.js    # PostCSS configuration
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## 🎯 Usage

### Uploading X-Ray Images

1. Navigate to the **Upload** page
2. Enter an optional patient name
3. Drag and drop an X-ray image or click to browse
4. Click **Upload** to process the image
5. View predictions in the results table
6. Export results in your preferred format (PDF, CSV, Excel, or JSON)

### Changing Language

Click the globe icon in the navigation bar to switch between:
- English
- French (Français)
- Spanish (Español)

### Dark Mode

Toggle dark mode using the sun/moon icon in the navigation bar.

## 🔧 Configuration

### API Endpoint

Update the API URL in `.env`:
```env
VITE_API_URL=your-api-endpoint-here
```

### Styling

The project uses TailwindCSS. Customize colors and themes in `tailwind.config.js`.

### Internationalization

Add new languages by:
1. Creating a new JSON file in `src/i18n/locales/`
2. Adding the translation to `src/i18n/config.ts`

## 📦 Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animation library
- **i18next** - Internationalization
- **jsPDF** - PDF generation
- **xlsx** - Excel file generation
- **Lucide React** - Icon library

## 🚢 Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Other Platforms

The `dist` folder contains static files that can be deployed to any static hosting service.

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 is occupied, Vite will automatically use the next available port.

### API Connection Issues

- Verify the API URL in `.env`
- Check CORS settings on the backend
- Ensure the API server is running

### Build Errors

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## 📝 License

This project is private and proprietary.

## 👥 Contributing

This is a private project. For issues or suggestions, please contact the development team.

## 📞 Support

For support, use the Contact page in the application or email: contact@xrayai.com

---

**Built with ❤️ for healthcare professionals**

