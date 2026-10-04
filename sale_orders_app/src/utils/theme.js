export const applyTheme = (settings) => {
  const root = document.documentElement;

  // 1. Color Mode (Light/Dark)
  if (settings.colorMode === 'dark') {
    root.classList.add('dark');
    // Dark background variables
    root.style.setProperty('--color-background', '#0f172a');
    root.style.setProperty('--color-surface', '#1e293b');
    root.style.setProperty('--color-surface-container', '#334155');
    root.style.setProperty('--color-surface-container-low', '#1e293b');
    root.style.setProperty('--color-on-surface', '#f8fafc');
    root.style.setProperty('--color-on-surface-variant', '#cbd5e1');
    root.style.setProperty('--color-outline-variant', '#475569');
  } else {
    root.classList.remove('dark');
    // Light background variables
    root.style.setProperty('--color-background', '#f8f9ff');
    root.style.setProperty('--color-surface', '#ffffff');
    root.style.setProperty('--color-surface-container', '#ecedf4');
    root.style.setProperty('--color-surface-container-low', '#f2f3fa');
    root.style.setProperty('--color-on-surface', '#191c20');
    root.style.setProperty('--color-on-surface-variant', '#414750');
    root.style.setProperty('--color-outline-variant', '#c1c7d2');
  }

  // 2. Primary Color
  const colors = {
    indigo: { primary: '#6366f1', container: '#e0e7ff', onPrimary: '#ffffff', onPrimaryContainer: '#3730a3' },
    emerald: { primary: '#10b981', container: '#d1fae5', onPrimary: '#ffffff', onPrimaryContainer: '#065f46' },
    rose: { primary: '#f43f5e', container: '#ffe4e6', onPrimary: '#ffffff', onPrimaryContainer: '#881337' },
    amber: { primary: '#f59e0b', container: '#fef3c7', onPrimary: '#ffffff', onPrimaryContainer: '#78350f' },
    sky: { primary: '#0ea5e9', container: '#e0f2fe', onPrimary: '#ffffff', onPrimaryContainer: '#0c4a6e' },
  };
  const selectedColor = colors[settings.primaryColor] || colors.indigo;
  root.style.setProperty('--color-primary', selectedColor.primary);
  root.style.setProperty('--color-on-primary', selectedColor.onPrimary);
  
  if (settings.colorMode === 'dark') {
    root.style.setProperty('--color-primary-container', `${selectedColor.primary}33`); // 20% opacity
    root.style.setProperty('--color-on-primary-container', selectedColor.container);
  } else {
    root.style.setProperty('--color-primary-container', selectedColor.container);
    root.style.setProperty('--color-on-primary-container', selectedColor.onPrimaryContainer);
  }

  // 3. Typography
  const fonts = {
    inter: '"Inter", sans-serif',
    roboto: '"Roboto", sans-serif',
    outfit: '"Outfit", sans-serif',
  };
  const selectedFont = fonts[settings.fontStyle] || fonts.inter;
  root.style.setProperty('--font-body', selectedFont);
  root.style.setProperty('--font-headline', selectedFont);

  // 4. Border Radius
  const radius = {
    sharp: { default: '0px', lg: '0px', xl: '0px', '2xl': '0px', '3xl': '0px', full: '0px' },
    rounded: { default: '0.125rem', lg: '0.25rem', xl: '0.5rem', '2xl': '1rem', '3xl': '1.5rem', full: '9999px' },
    pill: { default: '1rem', lg: '1rem', xl: '1.5rem', '2xl': '2rem', '3xl': '3rem', full: '9999px' }
  };
  const selectedRadius = radius[settings.borderRadius] || radius.rounded;
  root.style.setProperty('--radius-default', selectedRadius.default);
  root.style.setProperty('--radius-lg', selectedRadius.lg);
  root.style.setProperty('--radius-xl', selectedRadius.xl);
  root.style.setProperty('--radius-2xl', selectedRadius['2xl']);
  root.style.setProperty('--radius-3xl', selectedRadius['3xl']);
  root.style.setProperty('--radius-full', selectedRadius.full);
};
