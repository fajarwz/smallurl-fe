import ACTION_TYPES from "../../actionTypes";

export const INITIAL_STATE = {
  loading: false,
  shrinkUrlForm: {
    originalUrl: "",
    shortUrl: "",
    name: "",
  },
  error: {
    originalUrl: [],
    shortUrl: [],
    name: [],
  },
  shrinkedUrl: "",
  visits: [],
  urls: [],
};

export const dashboardReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.CHANGE_INPUT:
      return {
        ...state,
        shrinkUrlForm: {
          ...state.shrinkUrlForm,
          [action.payload.name]: action.payload.value,
        },
      };
    case ACTION_TYPES.FETCH_URLS_SUCCESS:
      return {
        ...state,
        urls: action.payload,
      };
    case ACTION_TYPES.FETCH_VISITS_SUCCESS:
      return {
        ...state,
        visits: action.payload,
      };
    case ACTION_TYPES.SHRINK_URL_START:
      return {
        ...state,
        loading: true,
        error: {
          originalUrl: [],
          shortUrl: [],
          name: [],
        },
        shrinkedUrl: "",
      };
    case ACTION_TYPES.SHRINK_URL_SUCCESS:
      return {
        ...state,
        loading: false,
        shrinkedUrl: action.payload,
        shrinkUrlForm: {
          originalUrl: "",
          shortUrl: "",
          name: "",
        },
      };
    case ACTION_TYPES.SHRINK_URL_ERROR:
      return {
        ...state,
        error: {
          originalUrl : action.payload.original_url ?? [],
          shortUrl : action.payload.short_url ?? [],
          name: action.payload.name ?? [],
        },
        loading: false,
      };
    default:
      return state;
  }
};
