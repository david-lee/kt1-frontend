import { SET_VALUES, TOGGLE_LEFT_SIDEBAR, TOGGLE_PAGE_VIEW } from "data/actions";

export const appReducer = (state, action) => {
  switch (action.type) {
    case SET_VALUES:
      const newState = { ...state, ...action.data };
      console.log("*** SET_VALUES: ", newState);
      return newState;
    case TOGGLE_LEFT_SIDEBAR:
      return { ...state, isLeftSideBarOpen: !state.isLeftSideBarOpen };
    case TOGGLE_PAGE_VIEW:
      console.log('toggle page view > ', action.data);
      return { ...state, isADPageViewOpen: action.data || !state.isADPageViewOpen };
    default:
      return state;
  }
}
