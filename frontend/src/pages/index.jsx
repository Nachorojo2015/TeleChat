const Dashboard = () => {
  
  const getMyUser = async () => {
    try {
      const response = await fetch("/api/users/myUser", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await response.json();
      console.log("User data:", data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={getMyUser}>Get My User</button>
    </div>
  )
}

export default Dashboard