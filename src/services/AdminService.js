import axios from "axios";
import Cookies from "js-cookie";
import base64 from "react-native-base64";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// constant declaration
const AuthType = "user";
const BaseUrl = import.meta.env.VITE_API_URL;

const AuthLogin = "/user/login";

/********************* User Auth ************/
export default function AuthUser() {
  const navigate = useNavigate();

  const getToken = () => {
    const tokenString = Cookies.get(AuthType + "-accessToken");
    let userToken = tokenString;
    return userToken;
  };

  const getRefreshToken = () => {
    const tokenString = Cookies.get(AuthType + "-refreshToken");
    let userToken = tokenString;
    return userToken;
  };

  const getUser = () => {
    const userString = Cookies.get(AuthType + "-info");
    let user_detail = "";
    if (userString) {
      user_detail = JSON.parse(base64.decode(userString));
    }
    return user_detail;
  };

  const [token, setToken] = useState(getToken());
  const [refreshToken, setRefreshToken] = useState(getRefreshToken());
  const [user, setuser] = useState(getUser());

  const saveToken = (userData, token, refreshToken) => {
    Cookies.set(AuthType + "-accessToken", token, { expires: 1 });
    Cookies.set(AuthType + "-refreshToken", refreshToken, { expires: 1 });
    Cookies.set(AuthType + "-info", base64.encode(JSON.stringify(userData)), {
      expires: 1,
    });
    setToken(token);
    setRefreshToken(refreshToken);
    setuser(userData);
  };
  const logout = () => {
    Cookies.remove(AuthType + "-accessToken");
    Cookies.remove(AuthType + "-refreshToken");
    Cookies.remove(AuthType + "-info");
    navigate(AuthLogin);
  };
  const http = axios.create({
    baseURL: BaseUrl + "",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return {
    setToken: saveToken,
    refreshToken,
    token,
    user: user,
    getToken,
    http,
    logout,
  };
}

export const userLoginService = async (data) => {
  try {
    const response = await axios.post(BaseUrl + "auth/login", data);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const userCreateService = async (data) => {
  const token = Cookies.get(AuthType + "-refreshToken");
  try {
    const response = await axios.post(BaseUrl + "user", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("User Creation error:", error);
    throw error;
  }
};

export const userUpdateService = async (data, id) => {
  const token = Cookies.get(AuthType + "-refreshToken");
  try {
    const response = await axios.put(BaseUrl + `user/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("User Creation error:", error);
    throw error;
  }
};

export const userDetailsService = async (id) => {
  const token = Cookies.get(AuthType + "-refreshToken");
  try {
    const response = await axios.get(BaseUrl + `user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("User Creation error:", error);
    throw error;
  }
};

export const userListService = async (params) => {
  const token = Cookies.get(AuthType + "-refreshToken");
  try {
    const response = await axios.get(BaseUrl + `user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return response.data;
  } catch (error) {
    console.error("User Creation error:", error);
    throw error;
  }
};

export const updateProfileService = async (data) => {
  const token = Cookies.get(AuthType + "-refreshToken");
  try {
    const response = await axios.put(BaseUrl + `user/update-profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("User Creation error:", error);
    throw error;
  }
};

export const getDashboard = async () => {
  const token = Cookies.get(AuthType + "-refreshToken");
  try {
    const response = await axios.get(BaseUrl + `dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("User Creation error:", error);
    throw error;
  }
};
