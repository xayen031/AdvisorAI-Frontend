import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Professional <span className="text-blue-600 dark:text-blue-400">Pricing</span>
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Scalable AI solutions tailored to your organizational needs with transparent, value-driven pricing.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {[
            {
              title: 'Starter',
              price: '$49',
              features: [
                { text: 'Basic AI insights', available: true },
                { text: 'Monthly report generation', available: true },
                { text: 'Email support', available: true },
                { text: 'Advanced analytics', available: false },
                { text: 'Custom integrations', available: false },
              ],
              button: 'Get Started',
              featured: false,
            },
            {
              title: 'Professional',
              price: '$149',
              features: [
                { text: 'Advanced AI insights', available: true },
                { text: 'Quarterly strategic reports', available: true },
                { text: 'Priority support', available: true },
                { text: 'Advanced analytics dashboard', available: true },
                { text: 'Custom integrations', available: false },
              ],
              button: 'Get Started',
              featured: true,
            },
            {
              title: 'Enterprise',
              price: '$299',
              features: [
                { text: 'All Professional features', available: true },
                { text: 'Dedicated account strategist', available: true },
                { text: '24/7 comprehensive support', available: true },
                { text: 'Custom AI model training', available: true },
                { text: 'Comprehensive integrations', available: true },
              ],
              button: 'Contact Sales',
              featured: false,
            },
          ].map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-xl overflow-hidden shadow-lg transform transition-all hover:scale-105 ${
                plan.featured
                  ? 'bg-white dark:bg-gray-800 border-2 border-blue-600 dark:border-blue-400 shadow-2xl'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.featured && (
                <div className="absolute top-0 right-0 bg-blue-600 dark:bg-blue-400 text-white px-4 py-1 rounded-bl-lg text-sm font-semibold">
                  RECOMMENDED
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{plan.title}</h3>
                <div className="flex items-baseline mb-8">
                  <span className={`text-5xl font-extrabold ${plan.featured ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                    {plan.price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li className="flex items-start" key={fIdx}>
                      {feature.available ? (
                        <Check className="text-blue-600 dark:text-blue-400 mr-3 mt-1" size={16} />
                      ) : (
                        <X className="text-gray-400 mr-3 mt-1" size={16} />
                      )}
                      <span className={`${feature.available ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500 text-white font-bold">
                  {plan.button}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
