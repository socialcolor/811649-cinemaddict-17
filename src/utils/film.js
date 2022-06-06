const setScrollPosition = (element, scrollPosition) => {
  element.scrollTop = scrollPosition;
};

const getScrollPosition = (element) => element.scrollTop;

export {setScrollPosition, getScrollPosition};
