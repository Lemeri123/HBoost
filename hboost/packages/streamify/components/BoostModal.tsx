'use client';

import { useState } from 'react';

interface Creator {
  id: string;
  username: string;
  avatar: string;
  followers: number;
}

interface BoostModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: Creator;
  onBoost: (amount: number, paymentData: PaymentData) => void;
}

interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  email: string;
}

export default function BoostModal({ isOpen, onClose, creator, onBoost }: BoostModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(5);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const presetAmounts = [5, 10, 25, 50, 100];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setShowCustomInput(false);
    setCustomAmount('');
  };

  const handleCustomAmount = () => {
    setShowCustomInput(true);
    setSelectedAmount(0);
  };

  const handleInputChange = (field: keyof PaymentData, value: string) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCardNumberChange = (value: string) => {
    // Format card number with spaces
    const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    if (formatted.replace(/\s/g, '').length <= 16) {
      handleInputChange('cardNumber', formatted);
    }
  };

  const handleExpiryChange = (value: string) => {
    // Format expiry as MM/YY
    const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
    if (formatted.length <= 5) {
      handleInputChange('expiryDate', formatted);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalAmount = showCustomInput && customAmount ? parseFloat(customAmount) : selectedAmount;
    
    if (finalAmount <= 0) {
      alert('Please select a valid amount');
      return;
    }

    // Basic validation
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || 
        !paymentData.cardholderName || !paymentData.email) {
      alert('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      onBoost(finalAmount, paymentData);
      setIsProcessing(false);
      onClose();
      // Reset form
      setSelectedAmount(5);
      setCustomAmount('');
      setShowCustomInput(false);
      setPaymentData({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        email: '',
      });
    }, 2000);
  };

  const finalAmount = showCustomInput && customAmount ? parseFloat(customAmount) : selectedAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#0f0f0f] rounded-2xl border border-[#222222] shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#222222] flex items-center justify-center hover:bg-[#333333] transition-colors"
        >
          <span className="material-symbols-outlined text-white text-xl">close</span>
        </button>

        {/* Header */}
        <div className="p-6 border-b border-[#222222]">
          <h2 className="text-2xl font-bold text-white mb-1">
            Boost @{creator.username}!
          </h2>
          <p className="text-sm text-[#aaaaaa]">Support this creator instantly</p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Amount Selector */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Select Boost Value
            </label>
            <div className="grid grid-cols-3 gap-3">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleAmountSelect(amount)}
                  className={`h-14 rounded-xl border-2 transition-all font-semibold ${
                    selectedAmount === amount && !showCustomInput
                      ? 'bg-[#2ba640] border-[#2ba640] text-white scale-105'
                      : 'bg-[#222222] border-[#222222] text-white hover:border-[#2ba640]/50'
                  }`}
                >
                  ${amount}
                </button>
              ))}
              <button
                type="button"
                onClick={handleCustomAmount}
                className={`h-14 rounded-xl border-2 transition-all font-semibold ${
                  showCustomInput
                    ? 'bg-[#2ba640] border-[#2ba640] text-white scale-105'
                    : 'bg-[#222222] border-[#222222] text-white hover:border-[#2ba640]/50'
                }`}
              >
                Custom
              </button>
            </div>
            
            {showCustomInput && (
              <div className="mt-3">
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full h-12 px-4 rounded-xl bg-[#222222] border border-[#222222] text-white placeholder:text-[#aaaaaa] focus:border-[#ff0000] focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Reward Preview */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#222222] to-[#1a1a1a] border border-[#333333]">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#ff0000] to-[#cc0000] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-white text-3xl">stars</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold">Get Exclusive Digital Badge</p>
                <p className="text-sm text-[#aaaaaa]">Unique collectible for your support</p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Pay with Visa/Mastercard</h3>
            
            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Card Number
              </label>
              <input
                type="text"
                value={paymentData.cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full h-12 px-4 rounded-xl bg-[#222222] border border-[#222222] text-white placeholder:text-[#aaaaaa] focus:border-[#ff0000] focus:outline-none"
                required
              />
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={paymentData.expiryDate}
                  onChange={(e) => handleExpiryChange(e.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full h-12 px-4 rounded-xl bg-[#222222] border border-[#222222] text-white placeholder:text-[#aaaaaa] focus:border-[#ff0000] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={paymentData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="123"
                  maxLength={4}
                  className="w-full h-12 px-4 rounded-xl bg-[#222222] border border-[#222222] text-white placeholder:text-[#aaaaaa] focus:border-[#ff0000] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Name on Card
              </label>
              <input
                type="text"
                value={paymentData.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                placeholder="John Doe"
                className="w-full h-12 px-4 rounded-xl bg-[#222222] border border-[#222222] text-white placeholder:text-[#aaaaaa] focus:border-[#ff0000] focus:outline-none"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email (for receipt)
              </label>
              <input
                type="email"
                value={paymentData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
                className="w-full h-12 px-4 rounded-xl bg-[#222222] border border-[#222222] text-white placeholder:text-[#aaaaaa] focus:border-[#ff0000] focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Footer Message */}
          <div className="text-center py-3 border-t border-[#222222]">
            <p className="text-sm text-[#aaaaaa]">
              Network Fee: <span className="text-white font-semibold">$0.00</span>
            </p>
            <p className="text-xs text-[#aaaaaa] mt-1">
              Your support is <span className="text-white">instantly logged and secured</span>
            </p>
          </div>

          {/* CTA Button */}
          <button
            type="submit"
            disabled={isProcessing || finalAmount <= 0}
            className="w-full h-14 rounded-xl bg-[#2ba640] text-white font-bold text-lg hover:bg-[#2ba640]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <span className="material-symbols-outlined animate-spin">sync</span>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">send</span>
                <span>Confirm & Send Boost</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

