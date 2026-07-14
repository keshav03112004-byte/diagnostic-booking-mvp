import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const InquiryModalContext = createContext(null);

export function InquiryModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaults, setDefaults] = useState({});

  const openInquiryModal = useCallback((options = {}) => {
    setDefaults({
      subject: options.subject || 'Booking Inquiry',
      message: options.message || '',
    });
    setIsOpen(true);
  }, []);

  const closeInquiryModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      defaults,
      openInquiryModal,
      closeInquiryModal,
    }),
    [isOpen, defaults, openInquiryModal, closeInquiryModal]
  );

  return (
    <InquiryModalContext.Provider value={value}>
      {children}
    </InquiryModalContext.Provider>
  );
}

export function useInquiryModal() {
  const ctx = useContext(InquiryModalContext);
  if (!ctx) {
    throw new Error('useInquiryModal must be used within InquiryModalProvider');
  }
  return ctx;
}
