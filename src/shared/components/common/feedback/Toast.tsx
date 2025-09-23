import React from 'react';
import toast, { Toaster, ToastOptions } from 'react-hot-toast';

// Toast configuration
const defaultToastOptions: ToastOptions = {
  duration: 5000,
  position: 'top-right',
  style: {
    borderRadius: '8px',
    background: '#333',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500',
    padding: '12px 16px',
    maxWidth: '400px',
  },
};

// Success toast options
const successOptions: ToastOptions = {
  ...defaultToastOptions,
  style: {
    ...defaultToastOptions.style,
    background: '#10b981',
    color: '#fff',
  },
  iconTheme: {
    primary: '#fff',
    secondary: '#10b981',
  },
};

// Error toast options
const errorOptions: ToastOptions = {
  ...defaultToastOptions,
  style: {
    ...defaultToastOptions.style,
    background: '#ef4444',
    color: '#fff',
  },
  iconTheme: {
    primary: '#fff',
    secondary: '#ef4444',
  },
};

// Warning toast options
const warningOptions: ToastOptions = {
  ...defaultToastOptions,
  style: {
    ...defaultToastOptions.style,
    background: '#f59e0b',
    color: '#fff',
  },
  iconTheme: {
    primary: '#fff',
    secondary: '#f59e0b',
  },
};

// Info toast options
const infoOptions: ToastOptions = {
  ...defaultToastOptions,
  style: {
    ...defaultToastOptions.style,
    background: '#3b82f6',
    color: '#fff',
  },
  iconTheme: {
    primary: '#fff',
    secondary: '#3b82f6',
  },
};

// Loading toast options
const loadingOptions: ToastOptions = {
  ...defaultToastOptions,
  duration: Infinity, // Loading toasts don't auto-dismiss
  style: {
    ...defaultToastOptions.style,
    background: '#6b7280',
    color: '#fff',
  },
};

// Toast utility functions
export const showToast = {
  success: (message: string, options?: ToastOptions) => 
    toast.success(message, { ...successOptions, ...options }),
  
  error: (message: string, options?: ToastOptions) => 
    toast.error(message, { ...errorOptions, ...options }),
  
  warning: (message: string, options?: ToastOptions) => 
    toast(message, { 
      ...warningOptions, 
      ...options,
      icon: '⚠️',
    }),
  
  info: (message: string, options?: ToastOptions) => 
    toast(message, { 
      ...infoOptions, 
      ...options,
      icon: 'ℹ️',
    }),
  
  loading: (message: string, options?: ToastOptions) => 
    toast.loading(message, { ...loadingOptions, ...options }),
  
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: ToastOptions
  ) => 
    toast.promise(promise, messages, { ...defaultToastOptions, ...options }),
  
  custom: (message: string, options?: ToastOptions) => 
    toast(message, { ...defaultToastOptions, ...options }),
  
  dismiss: (toastId?: string) => toast.dismiss(toastId),
  
  remove: (toastId?: string) => toast.remove(toastId),
};

// Toast Provider Component
interface ToastProviderProps {
  children: React.ReactNode;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  reverseOrder?: boolean;
  gutter?: number;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
  toastOptions?: ToastOptions;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top-right',
  reverseOrder = false,
  gutter = 8,
  containerClassName,
  containerStyle,
  toastOptions,
}) => {
  return (
    <>
      {children}
      <Toaster
        position={position}
        reverseOrder={reverseOrder}
        gutter={gutter}
        containerClassName={containerClassName}
        containerStyle={containerStyle}
        toastOptions={{
          ...defaultToastOptions,
          ...toastOptions,
        }}
      />
    </>
  );
};

// Hook for using toast in components
export const useToast = () => {
  return {
    success: showToast.success,
    error: showToast.error,
    warning: showToast.warning,
    info: showToast.info,
    loading: showToast.loading,
    promise: showToast.promise,
    custom: showToast.custom,
    dismiss: showToast.dismiss,
    remove: showToast.remove,
  };
};

// Export the toast instance for direct use
export { toast };

export default showToast;