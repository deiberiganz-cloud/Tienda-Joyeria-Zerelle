export const parsePrice = (price: string): number => {
  return parseFloat(price.replace(/[$.]/g, '').replace(',', '.'));
};
