import axios from "axios";
import Cookies from "js-cookie";
import base64 from "react-native-base64";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// constant declaration
const AuthType = "user";
const BaseUrl = import.meta.env.VITE_API_URL;

export const projectCreationService = async (data) => {
  const token = Cookies.get(`${AuthType}-accessToken`);
  try {
    const response = await axios.post(BaseUrl + "project", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const projectDetailsService = async (id) => {
  const token = Cookies.get(`${AuthType}-accessToken`);
  try {
    const response = await axios.get(BaseUrl + `project/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const updateProjectDetailsService = async (data, id) => {
  const token = Cookies.get(`${AuthType}-accessToken`);
  try {
    const response = await axios.put(BaseUrl + `project/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const uploadAttachments = async (data) => {
  const token = Cookies.get(`${AuthType}-accessToken`);

  try {
    const response = await axios.post(`${BaseUrl}project/upload`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Upload attachments error:", error);
    throw error;
  }
};

export const projectListService = async (params) => {
  const token = Cookies.get(`${AuthType}-accessToken`);

  try {
    const response = await axios.get(`${BaseUrl}project`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Upload attachments error:", error);
    throw error;
  }
};

export const updateProjectStatus = async (id, data) => {
  const token = Cookies.get(`${AuthType}-accessToken`);

  try {
    const response = await axios.patch(`${BaseUrl}project/status/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Upload attachments error:", error);
    throw error;
  }
};
