import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    setUser({
      name: storedUser.name || "User",
      email: storedUser.email || "No email found",
    });
  }, []);

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold">
        My Profile
      </h1>

      <div className="rounded-2xl border bg-white p-6">
        <h2 className="text-xl font-semibold">
          {user.name}
        </h2>

        <p className="mt-2 text-gray-600">
          {user.email}
        </p>

        <p className="mt-4">
          Role: Patient
        </p>
      </div>
    </div>
  );
}