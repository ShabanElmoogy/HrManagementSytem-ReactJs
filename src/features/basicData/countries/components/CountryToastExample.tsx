import React, { useState } from 'react';
import { showToast } from '@/shared/components';
import { useCreateCountry, useUpdateCountry, useDeleteCountry } from '../hooks/useCountryQueries';
import CountryService from '../services/countryService';

/**
 * Example component showing different ways to use toast with country operations
 * This demonstrates various toast patterns for better UX
 */
const CountryToastExample: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Method 1: Using mutations with toast in onSuccess/onError (Recommended)
  const createMutation = useCreateCountry({
    onSuccess: (newCountry) => {
      showToast.success(`Country "${newCountry.nameEn}" created successfully!`);
    },
    onError: (error: any) => {
      showToast.error(error?.message || 'Failed to create country');
    },
  });

  const updateMutation = useUpdateCountry({
    onSuccess: (updatedCountry) => {
      showToast.success(`Country "${updatedCountry.nameEn}" updated successfully!`);
    },
    onError: (error: any) => {
      showToast.error(error?.message || 'Failed to update country');
    },
  });

  const deleteMutation = useDeleteCountry({
    onSuccess: () => {
      showToast.success('Country deleted successfully!');
    },
    onError: (error: any) => {
      showToast.error(error?.message || 'Failed to delete country');
    },
  });

  // Method 2: Using promise toast (Great for direct service calls)
  const handlePromiseCreate = () => {
    const countryData = {
      nameEn: 'Promise Country',
      nameAr: 'دولة الوعد',
      alpha2Code: 'PC',
      alpha3Code: 'PRC',
      phoneCode: '+999',
      currencyCode: 'PRC',
    };

    showToast.promise(
      CountryService.create(countryData),
      {
        loading: 'Creating country...',
        success: (newCountry) => `Country "${newCountry.nameEn}" created successfully!`,
        error: (error) => `Failed to create: ${error.message}`,
      }
    );
  };

  // Method 3: Manual loading toast with dismiss
  const handleManualLoading = async () => {
    const loadingToast = showToast.loading('Processing country data...');
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      showToast.dismiss(loadingToast);
      showToast.success('Country data processed successfully!');
    } catch (error) {
      showToast.dismiss(loadingToast);
      showToast.error('Failed to process country data');
    } finally {
      setIsLoading(false);
    }
  };

  // Method 4: Conditional toasts based on operation result
  const handleConditionalToast = async () => {
    try {
      const result = await CountryService.getAll();
      
      if (result.length === 0) {
        showToast.info('No countries found. Consider adding some countries.');
      } else if (result.length < 5) {
        showToast.warning(`Only ${result.length} countries found. You might want to add more.`);
      } else {
        showToast.success(`Found ${result.length} countries in the system.`);
      }
    } catch (error) {
      showToast.error('Failed to fetch countries');
    }
  };

  // Method 5: Custom styled toast
  const handleCustomToast = () => {
    showToast.custom('🌍 Welcome to the Countries Management System!', {
      duration: 6000,
      style: {
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        fontWeight: 'bold',
        padding: '16px 20px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      },
    });
  };

  // Method 6: Sequential operations with toasts
  const handleSequentialOperations = async () => {
    try {
      // Step 1: Create
      const createToast = showToast.loading('Step 1: Creating country...');
      const newCountry = await CountryService.create({
        nameEn: 'Sequential Country',
        nameAr: 'دولة متسلسلة',
        alpha2Code: 'SC',
        alpha3Code: 'SEQ',
        phoneCode: '+888',
        currencyCode: 'SEQ',
      });
      showToast.dismiss(createToast);
      showToast.success('✅ Step 1: Country created!');

      // Step 2: Update
      await new Promise(resolve => setTimeout(resolve, 1000)); // Brief pause
      const updateToast = showToast.loading('Step 2: Updating country...');
      const updatedCountry = await CountryService.update({
        ...newCountry,
        nameEn: 'Updated Sequential Country',
      });
      showToast.dismiss(updateToast);
      showToast.success('✅ Step 2: Country updated!');

      // Step 3: Final success
      await new Promise(resolve => setTimeout(resolve, 1000)); // Brief pause
      showToast.success('🎉 All operations completed successfully!', {
        duration: 5000,
      });

    } catch (error: any) {
      showToast.error(`Operation failed: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Country Toast Integration Examples</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TanStack Query Mutations */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-3">TanStack Query Mutations</h3>
          <p className="text-blue-700 text-sm mb-4">
            Using mutations with toast in onSuccess/onError callbacks (Recommended approach)
          </p>
          
          <div className="space-y-2">
            <button
              onClick={() => createMutation.mutate({
                nameEn: 'New Country',
                nameAr: 'دولة جديدة',
                alpha2Code: 'NC',
                alpha3Code: 'NEW',
                phoneCode: '+123',
                currencyCode: 'NEW',
              })}
              disabled={createMutation.isPending}
              className="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Country'}
            </button>
            
            <button
              onClick={() => updateMutation.mutate({
                id: 1,
                nameEn: 'Updated Country',
                nameAr: 'دولة محدثة',
                alpha2Code: 'UC',
                alpha3Code: 'UPD',
                phoneCode: '+456',
                currencyCode: 'UPD',
              })}
              disabled={updateMutation.isPending}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {updateMutation.isPending ? 'Updating...' : 'Update Country'}
            </button>
            
            <button
              onClick={() => deleteMutation.mutate(1)}
              disabled={deleteMutation.isPending}
              className="w-full px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Country'}
            </button>
          </div>
        </div>

        {/* Promise Toast */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-800 mb-3">Promise Toast</h3>
          <p className="text-purple-700 text-sm mb-4">
            Using promise toast for direct service calls with automatic loading states
          </p>
          
          <button
            onClick={handlePromiseCreate}
            className="w-full px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
          >
            Create with Promise Toast
          </button>
        </div>

        {/* Manual Loading */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-3">Manual Loading Toast</h3>
          <p className="text-yellow-700 text-sm mb-4">
            Manual control over loading toast with dismiss functionality
          </p>
          
          <button
            onClick={handleManualLoading}
            disabled={isLoading}
            className="w-full px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 text-sm"
          >
            {isLoading ? 'Processing...' : 'Manual Loading Toast'}
          </button>
        </div>

        {/* Conditional Toast */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-3">Conditional Toast</h3>
          <p className="text-green-700 text-sm mb-4">
            Different toast types based on operation results
          </p>
          
          <button
            onClick={handleConditionalToast}
            className="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            Check Countries Count
          </button>
        </div>

        {/* Custom Toast */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h3 className="font-semibold text-indigo-800 mb-3">Custom Styled Toast</h3>
          <p className="text-indigo-700 text-sm mb-4">
            Custom styling and branding for special notifications
          </p>
          
          <button
            onClick={handleCustomToast}
            className="w-full px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
          >
            Show Custom Toast
          </button>
        </div>

        {/* Sequential Operations */}
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
          <h3 className="font-semibold text-pink-800 mb-3">Sequential Operations</h3>
          <p className="text-pink-700 text-sm mb-4">
            Multiple operations with step-by-step toast feedback
          </p>
          
          <button
            onClick={handleSequentialOperations}
            className="w-full px-3 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 text-sm"
          >
            Run Sequential Operations
          </button>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Toast Best Practices</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">✅ Do:</h4>
            <ul className="text-gray-600 space-y-1 list-disc list-inside">
              <li>Use success toasts for completed actions</li>
              <li>Include entity names in messages</li>
              <li>Use promise toasts for async operations</li>
              <li>Provide clear error messages</li>
              <li>Use appropriate toast types (success, error, warning, info)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">❌ Don't:</h4>
            <ul className="text-gray-600 space-y-1 list-disc list-inside">
              <li>Show toasts for every minor action</li>
              <li>Use generic error messages</li>
              <li>Forget to dismiss loading toasts</li>
              <li>Stack too many toasts at once</li>
              <li>Use toasts for critical errors (use dialogs instead)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryToastExample;