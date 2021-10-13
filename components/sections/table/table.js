import React, { useEffect, useState } from "react"
import List from "@mui/material/List";
import WorkingGroupListItem from "./list-item";
import { getAllUsers } from "utils/api"

export default function WorkingGroupTable({ data }) {
  const [users, setUsers] = useState([])
  // console.log(data);
    // Call the strapi API to GET all users
    useEffect(() => {
      getAllUsers()
        .then(function (result) {
          const users = result.filter((user) => user.organization === data.title.workinggrouptype)
          setUsers(users)
        })
    }, [])

  return (
    <div className="container">
      <section style={{boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)", margin: "0 0 15px 0"}}>
        <h1 className="text-3xl text-purple text-center p-3" style={{background: "#e5e0e7"}}>{data.title.title}</h1>
      </section>
      <nav aria-label="working group list">
        <List className="flex flex-wrap">
          {users.map((member, index) => {
            return (
              <WorkingGroupListItem
                key={member.firstname + index}
                name={member.firstname + " " + member.lastname}
                organization={member.organization}
              />
            );
          })}
        </List>
      </nav>
    </div>
  );
}

// import React, { useEffect, useState } from "react"
// import List from "@mui/material/List";
// import WorkingGroupListItem from "./list-item";
// import { getAllUsers } from "utils/api"

// export default function WorkingGroupTable({ data }) {
//   const [users, setUsers] = useState([])
//   // console.log(data);
//     // Call the strapi API to GET all users
//     useEffect(() => {
//       getAllUsers()
//         .then(function (result) {
//           const users = result.filter((user) => {
//             const regExSearch = "/"+ data.title.workinggrouptype.toLowerCase() + "/g"
            
//             if (user.organization !== null) {
//               const lowerCaseOrganization = user.organization.toLowerCase()
//               console.log(lowerCaseOrganization)
//               console.log(regExSearch)
//             }
            
//             // return user.organization.match(test)
//           })
//           setUsers(users)
//         })
//     }, [])

//   return (
//     <div className="container">
//       <section style={{boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)", margin: "0 0 15px 0"}}>
//         <h1 className="text-3xl text-purple text-center p-3" style={{background: "#e5e0e7"}}>{data.title.title}</h1>
//       </section>
//       <nav aria-label="working group list">
//         <List className="flex flex-wrap">
//           {users.map((member, index) => {
//             return (
//               <WorkingGroupListItem
//                 key={member.firstname + index}
//                 name={member.firstname + " " + member.lastname}
//                 organization={member.organization}
//               />
//             );
//           })}
//         </List>
//       </nav>
//     </div>
//   );
// }
