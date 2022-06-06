const setScrollPosition = (element, scrollPosition) => {
  element.scrollTop = scrollPosition;
};

const getScrollPosition = (elementScrollPosition) => elementScrollPosition.scrollTop;

export {setScrollPosition, getScrollPosition};
