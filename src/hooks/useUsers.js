import { useEffect, useState } from "react";
import { getUsers } from "../api/userService";
import { mapApiUsers } from "../utils/helpers";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refetchUsers() {
    setLoading(true);
    setError("");

    try {
      const apiUsers = await getUsers();
      const mappedUsers = mapApiUsers(apiUsers);

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

        setUsers(mapApiUsers(apiUsers));
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

  return {
    users,
    loading,
    error,
    refetchUsers,
  };
}
