// The Cookie string has the format as "name1=value1; name2=value2".
// If you would like to get the value2, the cookieString.match will split the cookie to an array as below:
// Array ["; name2=value2", ";", "value2"]
// Then we use pop() to get the last value of the Array.
export const getCookieValueByName = (cookieString: string, name: string) => {
  return (
    cookieString.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ``
  );
};

export const validateCookieExpiration = (cookieString: string) => {
  const expriteDateString = getCookieValueByName(cookieString, `Expires`);
  if (expriteDateString) {
    const expriteDate = new Date(expriteDateString);
    return expriteDate > new Date();
  }
  return false;
};
