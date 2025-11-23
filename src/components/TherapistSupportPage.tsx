import { useState } from 'react';
import { ArrowLeft, Search, MapPin, Phone, Mail, Globe, Calendar, Heart, Shield, Users, Baby, Home, BookHeart, Award, AlertCircle, CheckCircle } from 'lucide-react';

interface TherapistSupportPageProps {
  onBack: () => void;
}

interface TherapistProfile {
  id: string;
  name: string;
  credentials: string;
  specialties: string[];
  address: string;
  distance: string;
  phone: string;
  email: string;
  website: string;
  acceptsInsurance: boolean;
  languages: string[];
  availability: string;
  rating: number;
  reviewCount: number;
  bio: string;
}

const therapyCategories = [
  { id: 'anxiety', label: 'Anxiety & Stress', icon: '😰', description: 'Worry, panic attacks, social anxiety' },
  { id: 'trauma', label: 'Trauma & PTSD', icon: '🌪️', description: 'Past experiences, flashbacks, healing' },
  { id: 'depression', label: 'Depression', icon: '🌧️', description: 'Low mood, loss of interest, hopelessness' },
  { id: 'relationships', label: 'Relationships', icon: '💑', description: 'Couples therapy, communication, boundaries' },
  { id: 'family', label: 'Family Issues', icon: '👨‍👩‍👧', description: 'Family dynamics, parenting, conflict' },
  { id: 'addiction', label: 'Addiction & Recovery', icon: '🚭', description: 'Substance use, behavioral addictions' },
  { id: 'child-teen', label: 'Child & Teen', icon: '👶', description: 'Youth counseling, developmental issues' },
  { id: 'faith-based', label: 'Faith-Based Counseling', icon: '🙏', description: 'Spiritually integrated therapy' },
];

const placeholderTherapists: TherapistProfile[] = [
  {
    id: '1',
    name: 'Dr. Sarah Mitchell, PhD',
    credentials: 'Licensed Clinical Psychologist',
    specialties: ['Anxiety', 'Trauma', 'CBT', 'EMDR'],
    address: '123 Main St, Suite 200',
    distance: '2.3 miles',
    phone: '(555) 123-4567',
    email: 'dr.mitchell@example.com',
    website: 'www.drmitchelltherapy.com',
    acceptsInsurance: true,
    languages: ['English', 'Spanish'],
    availability: 'Accepting new patients',
    rating: 4.9,
    reviewCount: 127,
    bio: 'Specializing in trauma-informed care with over 15 years of experience helping clients overcome anxiety and PTSD.',
  },
  {
    id: '2',
    name: 'Marcus Thompson, LMFT',
    credentials: 'Licensed Marriage & Family Therapist',
    specialties: ['Relationships', 'Family Therapy', 'Communication'],
    address: '456 Oak Avenue, Building B',
    distance: '3.7 miles',
    phone: '(555) 234-5678',
    email: 'marcus@familyhealingcenter.com',
    website: 'www.familyhealingcenter.com',
    acceptsInsurance: true,
    languages: ['English'],
    availability: 'Limited openings',
    rating: 4.8,
    reviewCount: 89,
    bio: 'Passionate about helping couples and families build stronger connections through compassionate, evidence-based therapy.',
  },
  {
    id: '3',
    name: 'Rev. Dr. Grace Chen, LPC',
    credentials: 'Licensed Professional Counselor',
    specialties: ['Faith-Based', 'Depression', 'Life Transitions'],
    address: '789 Church Street',
    distance: '4.1 miles',
    phone: '(555) 345-6789',
    email: 'grace@hopecounseling.org',
    website: 'www.hopecounseling.org',
    acceptsInsurance: false,
    languages: ['English', 'Mandarin'],
    availability: 'Accepting new patients',
    rating: 5.0,
    reviewCount: 156,
    bio: 'Integrating Christian principles with professional therapy to support your spiritual and emotional healing journey.',
  },
];

export function TherapistSupportPage({ onBack }: TherapistSupportPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [zipCode, setZipCode] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [selectedTherapist, setSelectedTherapist] = useState<TherapistProfile | null>(null);

  const handleSearch = () => {
    if (selectedCategory && zipCode) {
      setSearchPerformed(true);
    }
  };

  const handleLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setZipCode('Using current location');
          setSearchPerformed(true);
        },
        (error) => {
          alert('Unable to access location. Please enter ZIP code manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>

        {showDisclaimer && (
          <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6 shadow-md">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">Important Notice</h3>
                <p className="text-gray-700 text-sm mb-3">
                  LifeZinc is a wellness tool and does not replace professional mental health care.
                  The therapist directory is provided for informational purposes only. We do not endorse
                  specific providers and recommend verifying credentials before scheduling.
                </p>
                <p className="text-gray-700 text-sm mb-4">
                  <strong>In case of emergency:</strong> Call 911 or the 988 Suicide & Crisis Lifeline immediately.
                </p>
                <button
                  onClick={() => setShowDisclaimer(false)}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Get Professional Support</h1>
            <p className="text-xl text-gray-600">
              Find qualified therapists and counselors in your area
            </p>
          </div>

          <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-l-4 border-green-500">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Why Seek Professional Help?
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Professional therapists have specialized training to help you heal</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Therapy provides a safe, confidential space to process emotions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Evidence-based techniques can create lasting positive change</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>You deserve support from someone trained to help</span>
              </li>
            </ul>
          </div>

          {!searchPerformed ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 1: What are you seeking help with?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {therapyCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`p-5 rounded-xl border-2 transition-all text-left hover:shadow-lg ${
                        selectedCategory === category.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{category.icon}</div>
                      <h3 className="font-bold text-gray-900 mb-1 text-sm">{category.label}</h3>
                      <p className="text-xs text-gray-600">{category.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 2: Where are you located?</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="Enter ZIP code"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
                      maxLength={5}
                    />
                  </div>
                  <button
                    onClick={handleLocationPermission}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2 border-2 border-gray-300"
                  >
                    <MapPin className="w-5 h-5" />
                    Use My Location
                  </button>
                </div>
              </div>

              <button
                onClick={handleSearch}
                disabled={!selectedCategory || !zipCode}
                className="w-full py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                <Search className="w-5 h-5" />
                Find Therapists Near Me
              </button>
            </>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {therapyCategories.find(c => c.id === selectedCategory)?.label} Specialists
                  </h2>
                  <p className="text-gray-600">Found {placeholderTherapists.length} providers near {zipCode}</p>
                </div>
                <button
                  onClick={() => {
                    setSearchPerformed(false);
                    setSelectedTherapist(null);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  New Search
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> This is placeholder data for demonstration. In production,
                  this will connect to verified therapist directories and insurance networks.
                </p>
              </div>

              <div className="space-y-4">
                {placeholderTherapists.map((therapist) => (
                  <div key={therapist.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition-all bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{therapist.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{therapist.credentials}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-lg ${i < Math.floor(therapist.rating) ? 'text-yellow-500' : 'text-gray-300'}`}>
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {therapist.rating} ({therapist.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-blue-600 mb-1">{therapist.distance}</div>
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          therapist.availability === 'Accepting new patients'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {therapist.availability}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-4">{therapist.bio}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900 mb-1">Specialties:</p>
                        <div className="flex flex-wrap gap-1">
                          {therapist.specialties.map((specialty, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900 mb-1">Languages:</p>
                        <p className="text-gray-700">{therapist.languages.join(', ')}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-700 mb-4">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{therapist.address}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      {therapist.acceptsInsurance && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          Accepts Insurance
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={`tel:${therapist.phone}`}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </a>
                      <a
                        href={`mailto:${therapist.email}`}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </a>
                      <a
                        href={`https://${therapist.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                      >
                        <Globe className="w-4 h-4" />
                        Website
                      </a>
                      <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm">
                        <Calendar className="w-4 h-4" />
                        Book Appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-l-4 border-purple-500">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <BookHeart className="w-5 h-5 text-purple-600" />
                  Tips for Your First Appointment
                </h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">1.</span>
                    <span>Write down what you'd like to work on before your session</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">2.</span>
                    <span>Be honest about your symptoms and history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">3.</span>
                    <span>Ask about their approach and what to expect</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">4.</span>
                    <span>It's okay if the first therapist isn't the right fit - keep trying</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">5.</span>
                    <span>Bring your LifeZinc therapy export to share your emotional patterns</span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
