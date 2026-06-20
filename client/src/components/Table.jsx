import React from 'react';

function Table({tableHead,slice,userdata,devicedata}) {
    
  let matches = new Set();
  return (
    <>
      {userdata && 
        <table className="table">
        <thead>
          <tr>
            {
            tableHead.map((i)=>{
                return(<th scope="col">{i}</th>)
            })
            }
            
          </tr>
        </thead>
        <tbody>
          {slice==="true"?
          userdata?.slice(0,5).map((user,index)=>{
              
              return(
                  <tr key={index}>
                  <td scope="row">{index+1}</td>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  {
                  user.devices.map(i => {
                      devicedata.map(device => {
                          if (i === device._id) {
                              matches.add(device.type);
                          }
                      });
                  })}
                  {console.log(matches)}
                  <td>{Array.from(matches).join(", ")}</td>
  
                  <td>{user.status}</td>
              </tr>
              )
             
          }):
          userdata?.map((user,index)=>{
              
            return(
                <tr key={index}>
                <td scope="row">{index+1}</td>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                {
                user.devices.map(i => {
                    devicedata.map(device => {
                        if (i === device._id) {
                            matches.add(device.type);
                        }
                    });
                })}
                {console.log(matches)}
                <td>{Array.from(matches).join(", ")}</td>

                <td>{user.status}</td>
            </tr>
            )
           
        })
        }
        
        </tbody>
      </table>
  
       } 
    </>
  )
}

export default Table
