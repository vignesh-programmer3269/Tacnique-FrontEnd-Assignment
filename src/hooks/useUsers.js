import { useEffect, useState } from "react";
import { getUsers } from "../api/userService";
import { mapApiUsers } from "../utils/helpers";

function multiplyUsers(apiUsers, factor = 12) {
  const multiplied = [];
  for (let i = 0; i < factor; i++) {
    apiUsers.forEach((user) => {
      multiplied.push({
        ...user,
        id: user.id + i * apiUsers.length,
      });
    });
  }
  return multiplied;
}

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refetchUsers() {
    setLoading(true);
    setError("");

    try {
      const apiUsers = await getUsers();
      const multipliedApiUsers = multiplyUsers(apiUsers);
      const mappedUsers = mapApiUsers(multipliedApiUsers);

      setUsers(mappedUsers);
    } catch (fetchError) {
      setError(fetchError.message || "Unable to load users right now.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchUsers() {
      setLoading(true);
      setError("");

      try {
        const apiUsers = await getUsers();

        if (!isMounted) {
          return;
        }

        const multipliedApiUsers = multiplyUsers(apiUsers);
        setUsers(mapApiUsers(multipliedApiUsers));
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        setError(fetchError.message || "Unable to load users right now.");
        setUsers([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const addUser = (newUser) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  const updateUserLocal = (updatedUser) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  return {
    users,
    loading,
    error,
    refetchUsers,
    addUser,
    updateUserLocal,
  };
}
