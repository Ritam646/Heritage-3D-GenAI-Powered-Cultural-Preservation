import { createContext, useContext, useState, useEffect } from 'react';

// Define available languages with their translations
const defaultLanguages = {
  en: {
    code: 'en',
    name: 'English',
    translations: {
      // Navbar
      home: 'Home',
      models: '3D Models',
      assistant: 'Assistant',
      converter: 'Text to 3D',
      signIn: 'Sign in',
      signUp: 'Sign up',
      signOut: 'Sign out',
      language: 'Language',
      
      // Homepage
      heroTitle: 'Explore Indian Heritage in 3D',
      heroSubtitle: 'Discover the rich history and architectural beauty of Indian monuments through immersive 3D experiences and AI-powered knowledge.',
      exploreButton: 'Explore 3D Models',
      learnMore: 'Learn more',
      featuredModels: 'Featured Monuments',
      viewAllModels: 'View All Models',
      viewDetails: 'View details',
      selectMonument: 'Select a monument to explore:',
      dragRotate: 'Drag to rotate | Scroll to zoom',
      interactiveModel: 'Interactive 3D Model',
      
      // Feature sections
      richHistory: 'Rich History',
      richHistoryDesc: 'Discover the fascinating history behind iconic Indian monuments and cultural sites.',
      aiAssistant: 'AI Assistant',
      aiAssistantDesc: 'Ask questions and get detailed information about any Indian heritage monument.',
      modelsFeature: '3D Models',
      modelsFeatureDesc: 'Explore detailed 3D models of monuments with interactive controls and immersive views.',
      
      // Models page
      modelsTitle: 'Explore 3D Models',
      modelsSubtitle: 'Browse our collection of detailed 3D models of iconic Indian heritage monuments.',
      searchPlaceholder: 'Search monuments by name, location or category...',
      noModelsFound: 'No models found matching your search.',
      clearSearch: 'Clear Search',
      viewModel: 'View 3D Model',
      fullDetails: 'Full Details',
      
      // Assistant page
      assistantTitle: 'Heritage Knowledge Assistant',
      assistantSubtitle: 'Ask anything about Indian heritage monuments and get detailed information powered by AI.',
      messagePlaceholder: 'Type your question about Indian monuments...',
      sendMessage: 'Send',
      
      // Common
      loading: 'Loading...',
      error: 'Something went wrong. Please try again.',
      close: 'Close',
    }
  },
  hi: {
    code: 'hi',
    name: 'हिंदी',
    translations: {
      // Navbar
      home: 'मुख्य पृष्ठ',
      models: '3D मॉडल्स',
      assistant: 'सहायक',
      converter: 'टेक्स्ट से 3D',
      signIn: 'लॉग इन करें',
      signUp: 'पंजीकरण करें',
      signOut: 'लॉग आउट करें',
      language: 'भाषा',
      
      // Homepage
      heroTitle: 'भारतीय विरासत को 3D में देखें',
      heroSubtitle: 'इमर्सिव 3D अनुभवों और AI-संचालित जानकारी के माध्यम से भारतीय स्मारकों के समृद्ध इतिहास और वास्तुकला सौंदर्य की खोज करें।',
      exploreButton: '3D मॉडल्स देखें',
      learnMore: 'अधिक जानकारी',
      featuredModels: 'प्रमुख स्मारक',
      viewAllModels: 'सभी मॉडल्स देखें',
      viewDetails: 'विवरण देखें',
      selectMonument: 'एक स्मारक चुनें:',
      dragRotate: 'घुमाने के लिए खींचें | ज़ूम करने के लिए स्क्रॉल करें',
      interactiveModel: 'इंटरैक्टिव 3D मॉडल',
      
      // Feature sections
      richHistory: 'समृद्ध इतिहास',
      richHistoryDesc: 'प्रसिद्ध भारतीय स्मारकों और सांस्कृतिक स्थलों के पीछे के रोचक इतिहास की खोज करें।',
      aiAssistant: 'AI सहायक',
      aiAssistantDesc: 'किसी भी भारतीय विरासत स्मारक के बारे में प्रश्न पूछें और विस्तृत जानकारी प्राप्त करें।',
      modelsFeature: '3D मॉडल्स',
      modelsFeatureDesc: 'इंटरैक्टिव नियंत्रणों और इमर्सिव दृश्यों के साथ स्मारकों के विस्तृत 3D मॉडल का अन्वेषण करें।',
      
      // Models page
      modelsTitle: '3D मॉडल्स का अन्वेषण करें',
      modelsSubtitle: 'प्रतिष्ठित भारतीय विरासत स्मारकों के विस्तृत 3D मॉडल्स का हमारा संग्रह देखें।',
      searchPlaceholder: 'नाम, स्थान या श्रेणी से स्मारकों को खोजें...',
      noModelsFound: 'आपकी खोज से मेल खाने वाला कोई मॉडल नहीं मिला।',
      clearSearch: 'खोज साफ़ करें',
      viewModel: '3D मॉडल देखें',
      fullDetails: 'पूरा विवरण',
      
      // Assistant page
      assistantTitle: 'विरासत ज्ञान सहायक',
      assistantSubtitle: 'भारतीय विरासत स्मारकों के बारे में कुछ भी पूछें और AI द्वारा संचालित विस्तृत जानकारी प्राप्त करें।',
      messagePlaceholder: 'भारतीय स्मारकों के बारे में अपना प्रश्न लिखें...',
      sendMessage: 'भेजें',
      
      // Common
      loading: 'लोड हो रहा है...',
      error: 'कुछ गलत हुआ। कृपया पुनः प्रयास करें।',
      close: 'बंद करें',
    }
  }
};

// Create language context
const LanguageContext = createContext();

// Language provider component
export function LanguageProvider({ children }) {
  // Get saved language from localStorage or use default
  const getSavedLanguage = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      return saved || 'en';
    }
    return 'en';
  };

  const [currentLanguage, setCurrentLanguage] = useState(getSavedLanguage);
  const [languages, setLanguages] = useState(defaultLanguages);

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  // Function to change language
  const changeLanguage = (languageCode) => {
    if (languages[languageCode]) {
      setCurrentLanguage(languageCode);
    }
  };

  // Translation function
  const t = (key) => {
    const lang = languages[currentLanguage];
    if (!lang) return '';
    
    return lang.translations[key] || key;
  };

  // Context value
  const value = {
    currentLanguage,
    languages,
    changeLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}