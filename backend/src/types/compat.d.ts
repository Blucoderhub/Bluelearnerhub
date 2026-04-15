declare global {  
  function parseInt(string: string | string[], radix?: number): number;  
  function decodeURIComponent(encodedURI: string | string[]): string;  
}  
  
declare module 'drizzle-orm' {  
  export const eq: any;  
}  
  
export {}; 
