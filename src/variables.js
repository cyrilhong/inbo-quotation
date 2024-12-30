export const colors = {
    primary: '#004632',
    cta: '#2E7D32',
    white: '#ffffff',
    black: '#000000',
    gray: '#F7F7F7',
    lightGray: '#DCDCDC',
    orange:'#EB7100'
  };

 const breakpoints = {
    mobile: '768px',
    tablet: '1280px',
    desktop: '1440px',
  };

  export const mediaQueries = {
    mobile: `@media (max-width: ${breakpoints.mobile})`,
    tablet: `@media (max-width: ${breakpoints.tablet})`,
    desktop: `@media (min-width: ${breakpoints.desktop})`,
  };