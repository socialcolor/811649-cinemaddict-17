const remove = (component) => {
  const element = component.getElement();
  if (element) {
    const parent = element.parentElement;
    if (parent) {
      parent.removeChild(element);
    }
  }
};

export { remove };
