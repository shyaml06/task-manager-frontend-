import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:8000/admin";

export default function AdminUsers() {
const navigate=useNavigate()
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);


  const loadUsers = async () => {

    try{const res = await axios.get(
      `${API}/users/`,
      { withCredentials: true }
    );

    setUsers(res.data);}
    catch(err){
      if(err.status===401){
        navigate("/login")
      }
      console.log(err.status)
    }
  };


  const changeRole = async (userId, roleId) => {

   try{ await axios.post(
      `${API}/assign-role/`,
      {
        user_id: userId,
        role_id: roleId
      },
      { withCredentials: true }
    );}
    catch(err){
      console.log(err)

    }

    loadUsers();
  };


  return (
    <div>

      <h2>User Management</h2>

      <table style={styles.table}>

        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Change</th>
          </tr>
        </thead>

        <tbody>

          {users.map(u => (

            <tr key={u.id}>

              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>

              <td>
                <select
                  value={u.role}
                  onChange={(e) =>
                    changeRole(u.id, roleToId(e.target.value))
                  }
                >

                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>

                </select>
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}


/* Convert role name → id */
function roleToId(role) {

  if (role === "admin") return 1;
  if (role === "manager") return 2;
  return 3;
}


const styles = {

  table: {
    width: "100%",
    background: "white",
    borderCollapse: "collapse",
    marginTop: "20px"
  }
};
