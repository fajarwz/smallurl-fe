import ACTION_TYPES from "../../actionTypes";

export const INITIAL_STATE = {
  loading: false,
  form: {
    email: "",
    password: "",
  },
  error: {
    email: [],
    password: [],
    general: [],
  },
};

export const loginReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.CHANGE_INPUT:
      return {
        ...state,
        form: {
          ...state.form,
          [action.payload.name]: action.payload.value,
        },
      };
    case ACTION_TYPES.POST_START:
      return {
        ...state,
        loading: true,
        error: {
          email: [],
          password: [],
          general: [],
        },
      };
    case ACTION_TYPES.POST_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case ACTION_TYPES.POST_ERROR:
      return {
        ...state,
        error: {
          email: action.payload.email ?? [],
          password: action.payload.password ?? [],
          general: action.payload.general ?? [],
        },
        loading: false,
      };
    default:
      return state;
  }
};
