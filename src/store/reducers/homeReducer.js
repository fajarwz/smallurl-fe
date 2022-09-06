import ACTION_TYPES from "../actionTypes";

export const INITIAL_STATE = {
  loading: false,
  form: {
    originalUrl: "",
  },
  shrinkedUrl: "",
  error: null,
};

export const homeReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.CHANGE_INPUT:
      return {
        ...state,
        form: {
          [action.payload.name]: action.payload.value,
        },
      };
    case ACTION_TYPES.FETCH_START:
      return {
        ...state,
        loading: true,
        error: null,
        shrinkedUrl: "",
      };
    case ACTION_TYPES.FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        shrinkedUrl: action.payload,
      };
    case ACTION_TYPES.FETCH_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};
