"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface FormResult {
  type: 'success' | 'error' | null;
  message: string;
}

const EmailSubscriptionForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: false,
    errors: []
  });
  const [result, setResult] = useState<FormResult | null>(null);

  // Real-time email validation
  const validateEmail = (email: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!email.includes('@')) {
      errors.push('Email must contain @ symbol');
    }
    
    if (email.length > 100) {
      errors.push('Email must be maximum 100 characters');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Handle email change with validation
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value.trim() === '') {
      setValidation({ isValid: false, errors: [] });
    } else {
      setValidation(validateEmail(value));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    
    if (!validation.isValid) {
      setResult({
        type: 'error',
        message: validation.errors.join(', ')
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      // Success
      setResult({
        type: 'success',
        message: data.message || 'Thank you for subscribing to our newsletter!'
      });
      
      // Clear form on success
      setEmail('');
      setValidation({ isValid: false, errors: [] });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setResult(null);
      }, 3000);

    } catch (error: any) {
      setResult({
        type: 'error',
        message: error.message || 'Failed to subscribe. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full md:w-3/4"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <div className="border-b border-gray-400 pb-1 focus-within:border-white transition-colors duration-200">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-transparent w-full text-white placeholder-gray-400 focus:outline-none text-base pr-10"
              disabled={loading}
              maxLength={100}
            />
            {loading && (
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Validation errors */}
          {validation.errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 space-y-1"
            >
              {validation.errors.map((error, index) => (
                <div key={index} className="flex items-center space-x-2 text-xs text-red-400">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
        
        {/* Result message */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded text-sm ${
              result.type === 'success' 
                ? 'bg-green-900/30 text-green-400 border border-green-800' 
                : 'bg-red-900/30 text-red-400 border border-red-800'
            }`}
          >
            {result.message}
          </motion.div>
        )}
        
        {/* Helper text */}
        <p className="text-xs text-gray-500">
          Press Enter to subscribe. We respect your privacy.
        </p>
      </form>
    </motion.div>
  );
};

export default EmailSubscriptionForm;