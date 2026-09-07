import React, { useState } from 'react';
import { Lock, Smartphone, X, UserCheck, KeyRound } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SwastikOmBadge } from '../components/common/SpiritualSymbols';
import { getApiErrorMessage } from '../api/authService';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setAuthModalOpen,
    login,
    sendSignupOtp,
    completeSignup,
    continueAsGuest,
    user,
    logout,
  } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const resetFormFlags = () => {
    setError('');
    setInfo('');
    setOtpStep(false);
    setOtp('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = identifier.trim();

    if (!email) {
      setError('कृपया अपना ईमेल प्रविष्ट करें');
      return;
    }
    if (!email.includes('@')) {
      setError('कृपया वैध ईमेल आईडी लिखें');
      return;
    }

    if (isSignUp && otpStep) {
      if (!otp.trim()) {
        setError('कृपया OTP प्रविष्ट करें');
        return;
      }
      setIsSubmitting(true);
      setError('');
      try {
        await completeSignup(email, otp.trim(), password, name.trim() || 'स्वाध्यायी पाठक');
      } catch (err) {
        setError(getApiErrorMessage(err, 'OTP गलत है या समाप्त हो चुका है'));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (password.length < 4) {
      setError('पासवर्ड कम से कम 4 अक्षरों का होना चाहिए');
      return;
    }

    if (isSignUp) {
      if (!name.trim()) {
        setError('कृपया अपना नाम लिखें');
        return;
      }
      setIsSubmitting(true);
      setError('');
      try {
        await sendSignupOtp(name.trim(), email, password);
        setOtpStep(true);
        setInfo('OTP आपके ईमेल पर भेज दिया गया है। कृपया नीचे भरें।');
      } catch (err) {
        setError(getApiErrorMessage(err, 'OTP भेजने में समस्या आई'));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await login(email, password, 'स्वाध्यायी पाठक');
    } catch (err) {
      setError(getApiErrorMessage(err, 'लॉग इन विफल रहा। ईमेल या पासवर्ड जाँचें।'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-jain-border">
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/25 hover:bg-black/40 text-white flex items-center justify-center transition-colors"
          title="बंद करें"
        >
          <X className="w-4 h-4" />
        </button>

        {!user.isGuest ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-jain-cream border-2 border-jain-gold mx-auto flex items-center justify-center text-jain-maroon mb-3 shadow-md">
              <UserCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-jain-maroon">{user.name}</h3>
            <p className="text-xs text-jain-muted mt-1">{user.identifier}</p>

            <div className="my-5 bg-jain-cream-light p-4 rounded-2xl border border-jain-border text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-jain-muted">स्वाध्याय स्तर:</span>
                <span className="font-bold text-jain-maroon">प्रौढ़ स्वाध्यायी</span>
              </div>
              <div className="flex justify-between">
                <span className="text-jain-muted">संचित धर्म बिंदु:</span>
                <span className="font-bold text-amber-600">{user.points} अंक 🌟</span>
              </div>
              <div className="flex justify-between">
                <span className="text-jain-muted">पठित ग्रंथ इतिहास:</span>
                <span className="font-bold">{user.history.length} कथाएं</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setAuthModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-jain-cream border border-jain-border text-xs font-bold text-jain-text hover:bg-amber-100"
              >
                जारी रखें
              </button>
              <button
                onClick={() => { logout(); setAuthModalOpen(false); }}
                className="flex-1 py-2.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-600 hover:bg-red-100"
              >
                लॉग आउट
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-gradient-to-b from-[#8F2018] to-[#6E1610] text-white pt-6 pb-5 px-5 text-center relative">
              <div className="flex justify-center mb-2.5">
                <SwastikOmBadge size="md" />
              </div>

              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                जैन कथाएं वाचनालय
              </h2>
              <p className="text-[11px] sm:text-xs text-amber-200/90 font-medium mt-0.5">
                शाश्वत जिनवाणी • धर्म कथाएं • स्वाध्याय गंगा
              </p>

              <div className="mt-4 max-w-xs mx-auto bg-[#65130D] p-1 rounded-2xl flex">
                <button
                  type="button"
                  onClick={() => { setIsSignUp(false); resetFormFlags(); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    !isSignUp
                      ? 'bg-white text-jain-maroon shadow-sm'
                      : 'text-amber-100 hover:text-white'
                  }`}
                >
                  लॉग इन (Login)
                </button>
                <button
                  type="button"
                  onClick={() => { setIsSignUp(true); resetFormFlags(); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    isSignUp
                      ? 'bg-white text-jain-maroon shadow-sm'
                      : 'text-amber-100 hover:text-white'
                  }`}
                >
                  नया खाता (Sign Up)
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6 bg-[#FFFDF8]">
              <div className="text-center mb-4">
                <h3 className="font-bold text-sm sm:text-base text-jain-text">
                  {isSignUp
                    ? otpStep
                      ? 'ईमेल OTP सत्यापित करें'
                      : 'नया स्वाध्यायी खाता बनाएँ'
                    : 'स्वाध्यायी खाते में प्रवेश करें'}
                </h3>
                <p className="text-[11px] sm:text-xs text-jain-muted mt-0.5">
                  {otpStep
                    ? 'आपके ईमेल पर भेजा गया 6 अंकों का OTP लिखें'
                    : 'अपने संचित बुकमार्क्स एवं पठन इतिहास तक पहुंचें'}
                </p>
              </div>

              {error && (
                <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
                  {error}
                </div>
              )}
              {info && !error && (
                <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium text-center">
                  {info}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {isSignUp && !otpStep && (
                  <div>
                    <label className="block text-xs font-bold text-jain-text mb-1">
                      आपका नाम *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="उदा. राहुल जैन"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-jain-border text-xs sm:text-sm text-jain-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-jain-gold"
                    />
                  </div>
                )}

                {!otpStep && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-jain-text mb-1">
                        ईमेल आईडी *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Smartphone className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="उदा. email@domain.com"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-jain-border text-xs sm:text-sm text-jain-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-jain-gold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-jain-text mb-1">
                        पासवर्ड (Password) *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Lock className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="कम से कम 4 अक्षर"
                          className="w-full pl-9 pr-12 py-2.5 rounded-xl bg-[#FAF6F0] border border-jain-border text-xs sm:text-sm text-jain-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-jain-gold"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-bold text-jain-muted hover:text-jain-maroon"
                        >
                          {showPassword ? 'छिपाएं' : 'देखें'}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {otpStep && (
                  <div>
                    <label className="block text-xs font-bold text-jain-text mb-1">
                      OTP *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <KeyRound className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="6 अंकों का OTP"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-jain-border text-xs sm:text-sm text-jain-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-jain-gold tracking-widest"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => { setOtpStep(false); setOtp(''); setInfo(''); setError(''); }}
                      className="mt-2 text-[11px] font-bold text-jain-maroon hover:underline"
                    >
                      ईमेल / पासवर्ड बदलें
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 sm:py-3 rounded-xl bg-jain-maroon hover:bg-jain-maroon-dark text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 mt-2 disabled:opacity-60"
                >
                  <span>🔐</span>
                  <span>
                    {isSubmitting
                      ? 'प्रतीक्षा करें...'
                      : isSignUp
                        ? otpStep
                          ? 'OTP सत्यापित करें'
                          : 'OTP भेजें (Sign Up)'
                        : 'लॉग इन करें (Login)'}
                  </span>
                </button>
              </form>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-jain-border"></div>
                </div>
                <span className="relative px-3 bg-[#FFFDF8] text-[11px] text-jain-muted font-medium">
                  अथवा त्वरित प्रवेश
                </span>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={continueAsGuest}
                  className="w-full py-2.5 rounded-xl bg-[#F4EFEA] hover:bg-[#ECE4DB] text-jain-text border border-jain-border text-xs sm:text-sm font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  <span>🕊️</span>
                  <span>अतिथि के रूप में जारी रखें (Continue as Guest)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
