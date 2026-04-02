import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpen, 
  Target, 
  Users, 
  Award, 
  Star, 
  ArrowRight,
  CheckCircle,
  Zap,
  Heart,
  TrendingUp
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const features = [
    {
      icon: BookOpen,
      title: 'Aptitude Assessment',
      description: 'Take comprehensive aptitude tests to discover your strengths and interests.',
      color: 'from-blue-500 to-indigo-600',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop&crop=center'
    },
    {
      icon: Target,
      title: 'College Database',
      description: 'Explore thousands of colleges with detailed information and rankings.',
      color: 'from-green-500 to-emerald-600',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop&crop=center'
    },
    {
      icon: Zap,
      title: 'Career Analytics',
      description: 'Get personalized career recommendations based on your test results.',
      color: 'from-purple-500 to-violet-600',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center'
    },
    {
      icon: Heart,
      title: 'Expert Guidance',
      description: 'Access professional career counseling and guidance resources.',
      color: 'from-orange-500 to-red-600',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&crop=center'
    }
  ];

  const stats = [
    { number: '999+', label: 'Colleges', icon: Target },
    { number: '50+', label: 'Career Paths', icon: Heart },
    { number: '10K+', label: 'Students Helped', icon: Users },
    { number: '95%', label: 'Success Rate', icon: Award }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Computer Science Student',
      content: 'CareerGuide helped me discover my passion for technology and find the perfect college.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Michael Chen',
      role: 'Engineering Graduate',
      content: 'The aptitude test was incredibly accurate and the college recommendations were spot-on.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Medical Student',
      content: 'Thanks to CareerGuide, I found my calling in medicine and got into my dream college.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 py-16 lg:py-24 transition-colors duration-300">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Background Images */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-6 lg:mb-8 slide-in-left shadow-lg">
                <Zap className="w-4 h-4" />
                <span>Professional Career Guidance</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 slide-in-left leading-tight">
                Discover Your Perfect
                <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent"> Career Path</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 lg:mb-8 max-w-2xl mx-auto lg:mx-0 slide-in-left leading-relaxed">
                Take our comprehensive aptitude assessment and get personalized recommendations for colleges, 
                courses, and career paths that match your unique strengths and interests.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6 lg:mb-8 slide-in-left">
                {isAuthenticated ? (
                  <Link
                    to="/quiz"
                    className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover-lift material-button flex items-center justify-center space-x-2"
                  >
                    <Zap className="w-5 h-5" />
                    <span>Take Aptitude Test</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover-lift material-button flex items-center justify-center space-x-2"
                    >
                      <span>Get Started Free</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                    <Link
                      to="/colleges"
                      className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover-lift border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-center space-x-2"
                    >
                      <Target className="w-5 h-5" />
                      <span>Explore Colleges</span>
                    </Link>
                  </>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-6 lg:space-x-8 text-sm text-gray-600 dark:text-gray-400 slide-in-left">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No Registration Required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Instant Results</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>100% Free</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative slide-in-right order-first lg:order-last">
              <div className="relative z-10">
                {/* Main Image with Enhanced Design */}
                <div className="w-full h-80 lg:h-96 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden">
                  {/* Background Image */}
                  <img 
                    src="https://images.unsplash.com/photo-1523240794102-9ebd6b7d4b1d?w=800&h=600&fit=crop&crop=center" 
                    alt="Students studying and planning their careers"
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/80 to-pink-600/80"></div>
                  
                  {/* Background decorative elements */}
                  <div className="absolute top-4 right-4 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-80"></div>
                  <div className="absolute bottom-4 left-4 w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-80"></div>
                  
                  {/* Main content */}
                  <div className="text-center text-white relative z-10">
                    <Heart className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 lg:mb-6" />
                    <h3 className="text-xl lg:text-2xl font-bold mb-2">Career Guidance</h3>
                    <p className="text-purple-100 text-sm lg:text-base">Discover Your Path</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-2 -right-2 w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Star className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 lg:w-10 lg:h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <Award className="w-3 h-3 lg:w-5 lg:h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={stat.label}
                  className="text-center p-4 lg:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 hover-scale transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4 shadow-lg">
                    <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1 lg:mb-2">{stat.number}</div>
                  <div className="text-sm lg:text-base text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Everything You Need for Your Career Journey
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive platform provides all the tools and resources you need to make informed decisions about your future.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.title}
                  className="p-6 lg:p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 hover-lift transition-all duration-300 overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Feature Image */}
                  <div className="relative mb-4 lg:mb-6 h-40 lg:h-48 rounded-xl overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    {/* Fallback if image doesn't load */}
                    <div className="hidden w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 items-center justify-center">
                      <Icon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                  
                  <div className={`w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 lg:mb-6 shadow-lg`}>
                    <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-4">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm lg:text-base">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              What Students Say About Us
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join thousands of students who have found their perfect career path with CareerGuide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.name}
                className="p-6 lg:p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 hover-lift transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start mb-4 lg:mb-6">
                  {/* Avatar */}
                  <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full overflow-hidden mr-4 shadow-lg flex-shrink-0">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    {/* Fallback avatar */}
                    <div className="hidden w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 items-center justify-center">
                      <span className="text-white font-bold text-sm lg:text-lg">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm lg:text-base">{testimonial.name}</div>
                    <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm lg:text-base">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-700 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1523240794102-9ebd6b7d4b1d?w=800&h=400&fit=crop&crop=center" 
            alt="Students celebrating success"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6">
            Ready to Discover Your Perfect Career?
          </h2>
          <p className="text-lg lg:text-xl text-purple-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Take the first step towards your dream career with our comprehensive aptitude assessment and personalized guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={isAuthenticated ? "/quiz" : "/signup"}
              className="group bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover-lift material-button flex items-center justify-center space-x-2"
            >
              <span>{isAuthenticated ? 'Take Aptitude Test' : 'Get Started Free'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              to="/colleges"
              className="group bg-transparent text-white border-2 border-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300 hover-lift flex items-center justify-center space-x-2"
            >
              <Target className="w-5 h-5" />
              <span>Explore Colleges</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
