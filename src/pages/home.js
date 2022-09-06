import { useState, useReducer } from "react";
import ShrinkUrl from "../components/ShrinkUrl";
import ShortenedUrlNotification from "../components/ShortenedUrlNotification";
import { Link } from "react-router-dom";
import api from "../services/api";
import { INITIAL_STATE, homeReducer } from "../store/reducers/homeReducer";
import ACTION_TYPES from "../store/actionTypes";

export default function Home() {
  const [state, dispatch] = useReducer(homeReducer, INITIAL_STATE);

  function fieldHandler(e) {
    dispatch({
      type: ACTION_TYPES.CHANGE_INPUT,
      payload: { name: e.target.name, value: e.target.value },
    });
  }

  const shrinkHandler = async (e) => {
    e.preventDefault();

    dispatch({ type: ACTION_TYPES.FETCH_START });

    try {
      const req = await api.post(`${process.env.REACT_APP_API_HOST}/short-url`, {
        original_url: state.form.originalUrl,
      });
  
      const res = await req.data;
      
      if (res.meta.code === 200) {
        dispatch({ type: ACTION_TYPES.FETCH_SUCCESS, payload: res.data.short_url });
      } else {
        dispatch({ type: ACTION_TYPES.FETCH_ERROR, payload: res.meta.message });
      }
    } catch (error) {
      dispatch({ type: ACTION_TYPES.FETCH_ERROR, payload: error });
    } 

  };

  function copyUrl() {
    navigator.clipboard.writeText(state.shrinkedUrl);

    alert("URL Copied");
  }

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen">
      <h1>SmallUrl</h1>
      <div className="mb-4 w-full md:w-[500px]">
        <ShrinkUrl
          shrinkHandler={shrinkHandler}
          fieldHandler={fieldHandler}
          loading={state.loading}
          error={state.error}
        />
      </div>
      <div className="w-[500px]">
        {state.shrinkedUrl && (
          <ShortenedUrlNotification
            shortenedUrl={state.shrinkedUrl}
            copyUrl={copyUrl}
          />
        )}
      </div>
      <div>
        <span className=" text-gray-400">Wanna custom URL? </span>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
