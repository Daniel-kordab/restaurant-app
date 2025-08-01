'use client';

import { useState, useEffect } from 'react';

interface HeroSection {
  id: number;
  documentId: string;
  title: string;
  main_heading: string;
  subtitle: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface Feature {
  id: number;
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface CallToAction {
  id: number;
  documentId: string;
  button_text: string;
  button_link: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface CompanyLogo {
  id: number;
  documentId: string;
  name: string;
  logo?: {
    id: number;
    name: string;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  } | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface ServiceSection {
  id: number;
  documentId: string;
  title: string;
  subtitle: string;
  description: any;
  image?: {
    id: number;
    name: string;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  } | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface ServicePoint {
  id: number;
  documentId: string;
  title: string;
  description: any;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface ProcessStep {
  id: number;
  documentId: string;
  step_number: number;
  title: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface OfferingsSection {
  id: number;
  documentId: string;
  title: string;
  subtitle: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface Package {
  id: number;
  documentId: string;
  name: string;
  type: string;
  price: string;
  description: any;
  button_text: string;
  button_link: string;
  features?: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface PackageFeature {
  id: number;
  documentId: string;
  feature_text: string;
  package_type: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface Testimonial {
  id: number;
  documentId: string;
  name: string;
  company: string;
  content: any;
  profile_image?: {
    id: number;
    name: string;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  } | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface FAQ {
  id: number;
  documentId: string;
  question: string;
  answer: any;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface Language {
  id: number;
  documentId: string;
  name: string;
  code: string;
  flag_emoji: string;
  local: string; // Fixed: Changed from 'locale' to 'local' to match Strapi field
  is_default: boolean;
  is_active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export default function Home() {
  // Content state
  const [heroSection, setHeroSection] = useState<HeroSection | null>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [callToAction, setCallToAction] = useState<CallToAction | null>(null);
  const [companyLogos, setCompanyLogos] = useState<CompanyLogo[]>([]);
  const [serviceSection, setServiceSection] = useState<ServiceSection | null>(null);
  const [servicePoints, setServicePoints] = useState<ServicePoint[]>([]);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [offeringsSection, setOfferingsSection] = useState<OfferingsSection | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [packageFeatures, setPackageFeatures] = useState<PackageFeature[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  
  // Language state
  const [languages, setLanguages] = useState<Language[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState('EN');
  const [currentLocale, setCurrentLocale] = useState('en');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  
  // UI state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activePackageType, setActivePackageType] = useState<'Flex' | 'Fixed-Price'>('Flex');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize app and load content
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        
        // First, fetch available languages from Strapi
        const languagesResponse = await fetch('http://localhost:1337/api/languages?sort=order:asc');
        
        if (languagesResponse.ok) {
          const languagesData = await languagesResponse.json();
          const activeLanguages = languagesData.data?.filter((lang: Language) => lang.is_active) || [];
          setLanguages(activeLanguages);
          
          // Determine which language to use
          let targetLanguage = activeLanguages.find((lang: Language) => lang.is_default) || activeLanguages[0];
          
          // Check for saved language preference
          const savedLanguage = localStorage.getItem('preferredLanguage');
          if (savedLanguage) {
            try {
              const parsedLanguage = JSON.parse(savedLanguage);
              const foundLanguage = activeLanguages.find((lang: { code: any; }) => lang.code === parsedLanguage.code);
              if (foundLanguage) {
                targetLanguage = foundLanguage;
              }
            } catch (e) {
              console.warn('Invalid saved language preference');
            }
          }
          
          if (targetLanguage) {
            setCurrentLanguage(targetLanguage.code);
            setCurrentLocale(targetLanguage.local); // Fixed: Changed from 'locale' to 'local'
            
            // Load content for the target language
            await fetchContentForLocale(targetLanguage.local); // Fixed: Changed from 'locale' to 'local'
          } else {
            // Fallback if no languages are configured
            await fetchContentForLocale('en');
          }
        } else {
          console.warn('Failed to fetch languages, using default');
          await fetchContentForLocale('en');
        }
      } catch (err) {
        console.error('Error initializing app:', err);
        setError(err instanceof Error ? err.message : 'Failed to load application');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.language-switcher')) {
        setShowLanguageMenu(false);
      }
    };

    if (showLanguageMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showLanguageMenu]);

  // Handle language change
  const handleLanguageChange = async (language: Language) => {
    if (currentLanguage === language.code) {
      setShowLanguageMenu(false);
      return;
    }

    try {
      setLoading(true);
      setCurrentLanguage(language.code);
      setCurrentLocale(language.local); // Fixed: Changed from 'locale' to 'local'
      setShowLanguageMenu(false);
      
      console.log('🔄 Switching to:', language.name, 'Local:', language.local); // Fixed: Changed from 'Locale' to 'Local'
      
      // Fetch content for the selected language
      await fetchContentForLocale(language.local); // Fixed: Changed from 'locale' to 'local'
      
      // Save language preference
      localStorage.setItem('preferredLanguage', JSON.stringify(language));
      
    } catch (error) {
      console.error('Error changing language:', error);
      setError('Failed to load content in selected language');
    } finally {
      setLoading(false);
    }
  };

  // Build API URL with locale parameter
  const buildApiUrl = (endpoint: string, locale: string): string => {
    const baseUrl = 'http://localhost:1337/api';
    const separator = endpoint.includes('?') ? '&' : '?';
    return `${baseUrl}/${endpoint}${separator}locale=${locale}`;
  };

  // Fetch all content for a specific locale
  const fetchContentForLocale = async (locale: string = 'en') => {
    try {
      console.log('🌍 Fetching content for locale:', locale);

      // Fetch all content in parallel with error handling
      const fetchPromises = [
        fetch(buildApiUrl('hero-sections', locale)).then(res => res.json()).catch(() => ({ data: [] })),
        fetch(buildApiUrl('features', locale)).then(res => res.json()).catch(() => ({ data: [] })),
        fetch(buildApiUrl('call-to-actions', locale)).then(res => res.json()).catch(() => ({ data: [] })),
        fetch(buildApiUrl('company-logos?populate=logo&sort=order:asc', locale)).then(res => res.json()).catch(() => ({ data: [] })),
        fetch(buildApiUrl('service-sections?populate=image&sort=order:asc', locale)).then(res => res.json()).catch(() => ({ data: [] })),
        fetch(buildApiUrl('service-points?sort=order:asc', locale)).then(res => res.json()).catch(() => ({ data: [] })),
        fetch(buildApiUrl('process-steps?sort=order:asc', locale)).then(res => res.json()).catch(() => ({ data: [] })),
        fetch(buildApiUrl('offerings-sections', locale)).then(res => res.json()).catch(() => ({ data: [] })),
        fetch(buildApiUrl('packages?sort=order:asc', locale)).then(res => res.json()).catch(() => ({ data: [] })),
        fetch(buildApiUrl('package-features?sort=order:asc', locale)).then(res => res.json()).catch(() => ({ data: [] })),
        fetch(buildApiUrl('testimonials?populate=profile_image&sort=order:asc', locale)).then(res => res.json()).catch(() => ({ data: [] })),
        fetch(buildApiUrl('faqs?sort=order:asc', locale)).then(res => res.json()).catch(() => ({ data: [] }))
      ];

      const [
        heroData,
        featuresData,
        ctaData,
        logosData,
        serviceSectionData,
        servicePointsData,
        processStepsData,
        offeringsData,
        packagesData,
        packageFeaturesData,
        testimonialsData,
        faqsData
      ] = await Promise.all(fetchPromises);

      // Update all content state
      setHeroSection(heroData.data?.[0] || null);
      setFeatures(featuresData.data || []);
      setCallToAction(ctaData.data?.[0] || null);
      setCompanyLogos(logosData.data || []);
      setServiceSection(serviceSectionData.data?.[0] || null);
      setServicePoints(servicePointsData.data || []);
      setProcessSteps(processStepsData.data || []);
      setOfferingsSection(offeringsData.data?.[0] || null);
      setPackages(packagesData.data || []);
      setPackageFeatures(packageFeaturesData.data || []);
      setTestimonials(testimonialsData.data || []);
      setFaqs(faqsData.data || []);

      console.log('✅ Content loaded successfully for locale:', locale);
      
    } catch (err) {
      console.error('❌ Error fetching content:', err);
      throw err;
    }
  };

  // Helper function to extract text from rich text content
  const getTextFromRichText = (richText: any): string => {
    if (!richText) return '';
    if (typeof richText === 'string') return richText;
    if (Array.isArray(richText)) {
      return richText
        .map(block => {
          if (block.children && Array.isArray(block.children)) {
            return block.children.map((child: any) => child.text || '').join('');
          }
          return '';
        })
        .join(' ');
    }
    return '';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
          <div className="text-2xl font-semibold text-gray-900 mb-2">Loading...</div>
          <div className="text-gray-600">
            {currentLanguage !== 'EN' ? `Switching to ${currentLanguage}...` : 'Fetching content from Strapi...'}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-2xl text-red-600 mb-4">Error!</div>
          <div className="text-gray-600 mb-6">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className="min-h-screen bg-gray-50" dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Navigation with Dynamic Language Switcher */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-blue-600">ITGrate</div>
            
            <div className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#services" className="text-gray-600 hover:text-gray-900 transition-colors">Services</a>
              <a href="#process" className="text-gray-600 hover:text-gray-900 transition-colors">Process</a>
              <a href="#packages" className="text-gray-600 hover:text-gray-900 transition-colors">Packages</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Testimonials</a>
              <a href="#faqs" className="text-gray-600 hover:text-gray-900 transition-colors">FAQs</a>
              <a href="#trusted-by" className="text-gray-600 hover:text-gray-900 transition-colors">Trusted By</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
              
              {/* Dynamic Language Switcher */}
              {languages.length > 0 && (
                <div className="relative language-switcher">
                  <button
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                    disabled={loading}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50"
                  >
                    <span className="text-lg">
                      {currentLang?.flag_emoji || '🌐'}
                    </span>
                    <span className="font-medium">{currentLanguage}</span>
                    <span className={`transform transition-transform duration-200 ${showLanguageMenu ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  
                  {showLanguageMenu && (
                    <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[160px] z-50">
                      {languages
                        .sort((a, b) => a.order - b.order)
                        .map((language) => (
                        <button
                          key={language.id}
                          onClick={() => handleLanguageChange(language)}
                          disabled={loading}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center space-x-3 disabled:opacity-50 ${
                            currentLanguage === language.code 
                              ? 'bg-blue-50 text-blue-600 font-medium' 
                              : 'text-gray-700'
                          }`}
                        >
                          <span className="text-lg">{language.flag_emoji}</span>
                          <span>{language.name}</span>
                          {currentLanguage === language.code && (
                            <span className="ml-auto text-blue-600 font-bold">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Mobile Language Switcher */}
            <div className="md:hidden flex items-center space-x-4">
              {languages.length > 0 && (
                <div className="relative language-switcher">
                  <button
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                    disabled={loading}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
                  >
                    <span className="text-lg">
                      {currentLang?.flag_emoji || '🌐'}
                    </span>
                    <span className="text-sm">{currentLanguage}</span>
                  </button>
                  
                  {showLanguageMenu && (
                    <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[140px] z-50">
                      {languages
                        .sort((a, b) => a.order - b.order)
                        .map((language) => (
                        <button
                          key={language.id}
                          onClick={() => handleLanguageChange(language)}
                          disabled={loading}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center space-x-2 disabled:opacity-50 ${
                            currentLanguage === language.code 
                              ? 'bg-blue-50 text-blue-600 font-medium' 
                              : 'text-gray-700'
                          }`}
                        >
                          <span>{language.flag_emoji}</span>
                          <span>{language.name}</span>
                          {currentLanguage === language.code && (
                            <span className="ml-auto text-blue-600">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Dynamic Content from Strapi */}
      {heroSection && (
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white pt-20">
          <div className="max-w-7xl mx-auto px-8 py-16 text-center">
            <p className="text-lg mb-4 text-blue-200">{heroSection.title}</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {heroSection.main_heading}
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-4xl mx-auto">
              {heroSection.subtitle}
            </p>
            <div className="flex items-center justify-center space-x-2 text-yellow-300 font-semibold">
              <span>💡</span>
              <span>{heroSection.description}</span>
            </div>
          </div>
        </div>
      )}

      {/* Features Section - Dynamic Content from Strapi */}
      <div id="features" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          {features.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Call to Action - Dynamic Content from Strapi */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-8 text-center">
          {callToAction && (
            <a
              href={callToAction.button_link || '#contact'}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <span>📞</span>
              <span>{callToAction.button_text}</span>
            </a>
          )}
        </div>
      </div>

      {/* Services Section - Dynamic Content from Strapi */}
      {serviceSection && (
        <div id="services" className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                {serviceSection.image?.url ? (
                  <img 
                    src={`http://localhost:1337${serviceSection.image.url}`}
                    alt={serviceSection.image.alternativeText || 'Services'}
                    className="w-full h-96 object-cover rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="bg-gray-300 rounded-lg h-96 flex items-center justify-center">
                    <span className="text-gray-600">Service Image</span>
                  </div>
                )}
              </div>
              <div className="order-1 lg:order-2">
                <p className="text-blue-600 font-semibold mb-4">{serviceSection.subtitle}</p>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">{serviceSection.title}</h2>
                <p className="text-gray-600 mb-8 text-lg">{getTextFromRichText(serviceSection.description)}</p>
                {servicePoints.length > 0 && (
                  <div className="space-y-6">
                    {servicePoints.map((point) => (
                      <div key={point.id}>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          <span className="text-blue-600">{point.title}</span>
                        </h3>
                        <p className="text-gray-600">{getTextFromRichText(point.description)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Process Section - Dynamic Content from Strapi */}
      <div id="process" className="bg-gradient-to-br from-slate-700 to-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <p className="text-slate-300 mb-4">Talk to us</p>
            <h2 className="text-4xl font-bold mb-8">Get started in 4 steps:</h2>
          </div>
          {processSteps.length > 0 && (
            <div className="space-y-8 max-w-4xl mx-auto">
              {processSteps.map((step) => (
                <div key={step.id} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {step.step_number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-slate-300 text-lg">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <a
              href="#contact"
              className="inline-flex items-center space-x-2 bg-white text-slate-800 px-8 py-4 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              <span>📞</span>
              <span>CONTACT</span>
            </a>
          </div>
        </div>
      </div>

      {/* Packages Section - Dynamic Content from Strapi */}
      <div id="packages" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold mb-4">
              {offeringsSection?.title || "Our Offerings"}
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              {offeringsSection?.subtitle || "All Packages at a Glance"}
            </h2>
            
            {/* Package Type Tabs */}
            <div className="flex justify-center space-x-8 mb-8">
              <button
                onClick={() => setActivePackageType('Flex')}
                className={`font-semibold text-lg pb-2 transition-colors ${
                  activePackageType === 'Flex'
                    ? 'text-gray-900 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Flex
              </button>
              <button
                onClick={() => setActivePackageType('Fixed-Price')}
                className={`font-semibold text-lg pb-2 transition-colors ${
                  activePackageType === 'Fixed-Price'
                    ? 'text-gray-900 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Fixed-Price
              </button>
            </div>
          </div>
          
          {packages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {packages
                .filter(pkg => pkg.type === activePackageType)
                .map((pkg) => (
                  <div key={pkg.id} className="bg-gray-50 rounded-lg p-8 shadow-sm">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">{pkg.name}</h3>
                      <div className="text-3xl font-bold text-gray-900 mb-4">{pkg.price}</div>
                      <div className="text-gray-600 text-sm leading-relaxed">
                        {getTextFromRichText(pkg.description)}
                      </div>
                    </div>
                    <a
                      href={pkg.button_link || '#contact'}
                      className="inline-flex items-center space-x-2 border border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      <span>{pkg.button_text}</span>
                      <span>→</span>
                    </a>
                  </div>
                ))
              }
            </div>
          )}
          
          {/* Package Features - Dynamic Content from Strapi */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {packageFeatures
              .filter(feature => feature.package_type === activePackageType)
              .map((feature) => (
                <div key={feature.id} className="flex items-start space-x-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span className="text-gray-600">{feature.feature_text}</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* Testimonials Section - Dynamic Content from Strapi */}
      <div id="testimonials" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Testimonial</h2>
            <div className="flex space-x-4">
              <button className="w-12 h-12 rounded-full border-2 border-gray-400 flex items-center justify-center hover:bg-gray-100 transition-colors">
                <span className="text-gray-600 text-xl">←</span>
              </button>
              <button className="w-12 h-12 rounded-full border-2 border-gray-400 flex items-center justify-center hover:bg-gray-100 transition-colors">
                <span className="text-gray-600 text-xl">→</span>
              </button>
            </div>
          </div>
          
          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-blue-100 rounded-lg p-6 relative">
                  <div className="absolute -top-6 left-6">
                    {testimonial.profile_image?.url ? (
                      <img
                        src={`http://localhost:1337${testimonial.profile_image.url}`}
                        alt={testimonial.profile_image.alternativeText || testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-4 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-500 border-4 border-white shadow-md flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-8">
                    <div className="text-gray-700 text-sm leading-relaxed mb-4">
                      {getTextFromRichText(testimonial.content)}
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">{testimonial.name}</p>
                      {testimonial.company && (
                        <p className="text-sm text-gray-600">{testimonial.company}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No testimonials found. Add testimonials in Strapi admin.</p>
              <a
                href="http://localhost:1337/admin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Go to Strapi Admin →
              </a>
            </div>
          )}
        </div>
      </div>

      {/* FAQs Section - Dynamic Content from Strapi */}
      <div id="faqs" className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">FAQs</h2>
          
          {faqs.length > 0 ? (
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="bg-blue-100 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-blue-200 transition-colors"
                  >
                    <span className="text-lg font-semibold text-gray-900">
                      {faq.question}
                    </span>
                    <span className="text-2xl text-gray-600 transform transition-transform duration-200">
                      {expandedFaq === faq.id ? '−' : '+'}
                    </span>
                  </button>
                  
                  {expandedFaq === faq.id && (
                    <div className="px-6 pb-4">
                      <div className="text-gray-700 leading-relaxed">
                        {getTextFromRichText(faq.answer)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No FAQs found. Add FAQs in Strapi admin.</p>
              <a
                href="http://localhost:1337/admin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Go to Strapi Admin →
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Trusted By Section - Dynamic Content from Strapi */}
      <div id="trusted-by" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Trusted By</h2>
          {companyLogos.length > 0 && (
            <div className="flex items-center justify-center space-x-8 md:space-x-12 flex-wrap gap-8">
              {companyLogos.map((company) => (
                <div key={company.id} className="flex items-center justify-center">
                  {company.logo?.url ? (
                    <img 
                      src={`http://localhost:1337${company.logo.url}`}
                      alt={company.logo.alternativeText || company.name}
                      className="h-16 md:h-20 lg:h-24 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    <div className="text-gray-600 font-semibold text-xl md:text-2xl px-6 py-4">
                      {company.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="bg-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
          <p className="text-gray-300 mb-8">Ready to build your remote dream team?</p>
          <div className="flex justify-center space-x-4">
            <a
              href="mailto:contact@itgrate.com"
              className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Email Us
            </a>
            <a
              href="#"
              className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-800 transition-colors"
            >
              Schedule Call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}