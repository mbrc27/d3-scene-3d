export const checkHashParam = () => {
  const { hash } = window.location;

  return hash ? hash.replace('#', '').split('/') : '';
};

export default { checkHashParam };
