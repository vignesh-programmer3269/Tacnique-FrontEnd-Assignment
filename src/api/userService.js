import axios from "axios";
import { API_BASE_URL } from "../constants/constants";

const userApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

function createServiceError(error, fallbackMessage) {
  const serviceError = new Error(
    error.response?.data?.message || fallbackMessage,
  );

  serviceError.status = error.response?.status ?? null;
  serviceError.cause = error;

  return serviceError;
}

export async function getUsers() {
  try {
    const response = await userApi.get("/users");
    return response.data;
  } catch (error) {
    throw createServiceError(
      error,
      "Failed to retrieve users. Please check your connection.",
    );
  }
}

export async function createUser(user) {
  try {
    const response = await userApi.post("/users", user);
    return response.data;
  } catch (error) {
    throw createServiceError(error, "Failed to create user.");
  }
}

export async function updateUser(id, user) {
  try {
    const response = await userApi.put(`/users/${id}`, user);
    return response.data;
  } catch (error) {
    throw createServiceError(error, "Failed to update user.");
  }
}

export async function deleteUser(id) {
  try {
    const response = await userApi.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw createServiceError(error, "Failed to delete user.");
  }
}
