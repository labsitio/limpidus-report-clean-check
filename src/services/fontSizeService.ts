export const saveFontSizeLocal = (data: string): void => {
  localStorage.setItem('limpiduscleancheck@fontSize', data);
};

export const getCurrentProjectLocal = (): any => {
  const data = localStorage.getItem('limpiduscleancheck@fontSize');
  if (!data) {
    return null;
  }
  return data;
};
