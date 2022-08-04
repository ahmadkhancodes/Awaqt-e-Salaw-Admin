import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase/config";

function Dashbord({ data }) {
  const [ApprovedData, setApprovedData] = useState([]);
  const [approved, setApproved] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setApprovedData(data.filter((p) => p?.activated == approved));
  }, [data, approved]);

  const handleDeActivation = async (id) => {
    const ref = doc(db, "users", id);

    await updateDoc(ref, {
      activated: !approved,
    });
  };
  const handleAccountSearch = (e) => {
    e.preventDefault();
    let temp = ApprovedData;
    let data = temp.filter((e, i) => (e.email == email ? e : null));
    if (data) {
      const index = temp.indexOf(data[0]);
      if (index > -1) {
        data = temp.splice(index, -1);
        temp.splice(0, 0, data);

        setApprovedData(temp);
      }
    }
  };

  const handleChange = (text) => {
    setEmail(text);
    if (text !== "") {
      const data = ApprovedData.filter((e) => e.email.includes(text));
      setApprovedData(data);
    } else {
      setApprovedData(data.filter((p) => p?.activated == approved));
    }
  };

  return (
    <Container>
      <br />
      <div className="d-flex flex-row">
        <Select
          defaultValue={"Pending"}
          name="size"
          onChange={(e) =>
            setApproved(e.target.value === "Pending" ? false : true)
          }
        >
          <Option>Pending</Option>
          <Option>Approved</Option>
        </Select>

        <form
          className="d-flex"
          onSubmit={handleAccountSearch}
          style={{ alignItems: "center" }}
        >
          <input
            className="form-control"
            type="email"
            placeholder="Enter email to bring it on top"
            aria-label="Search"
            value={email}
            onChange={(e) => {
              handleChange(e.currentTarget.value);
            }}
            style={{ width: 320 }}
          />
        </form>
      </div>
      <br />
      <br />
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Mosquet&nbsp;Name</th>
            <th scope="col">Owner&nbsp;Name</th>
            <th scope="col">Phone&nbsp;Number</th>
            <th scope="col">Email</th>
            <th scope="col">Country</th>
            <th scope="col">City</th>
            <th scope="col">Background</th>
            <th scope="col">{approved ? "Deactivate" : "Activate"}</th>
          </tr>
        </thead>
        <tbody>
          {ApprovedData.map((profile) => {
            return (
              <tr key={profile.id}>
                <td>{profile.mName}</td>
                <td>{profile.ownerName}</td>
                <td>{profile.phoneNumber}</td>
                <td>
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </td>
                <td>{profile.country}</td>
                <td>{profile.city}</td>

                <td>
                  <p
                    style={{
                      textDecoration: "underline",
                      color: "teal",
                      cursor: "pointer",
                    }}
                    data-bs-toggle="modal"
                    data-bs-target={`#${profile.id}logo`}
                  >
                    View&nbsp;Img
                  </p>
                  <div
                    className="modal fade"
                    id={`${profile.id}logo`}
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabIndex="-1"
                    aria-labelledby="staticBackdropLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="staticBackdropLabel">
                            Mosque Background Image
                          </h5>
                        </div>
                        <div
                          className="modal-body"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <img style={{}} src={profile.uri} />
                        </div>
                        <div className="modal-footer">
                          <Button data-bs-dismiss="modal">Close</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ paddingTop: 0 }}>
                  <Button onClick={() => handleDeActivation(profile.id)}>
                    {approved ? "Deactivate" : "Activate"}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Container>
  );
}

export default Dashbord;
const Container = styled.div`
  overflow-x: auto;
  a {
    color: teal;
    text-transform: lowercase;
  }
  a:visited {
    color: teal;
  }
  img {
    height: 20rem;
  }
  td {
    padding-top: 1.3rem;
  }
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  background: teal;
  border-radius: 0.5rem;
  margin-top: 0.5rem;
  color: white;
  font-weight: bold;
  :hover {
    opacity: 0.9;
  }
`;

const Select = styled.select`
  padding: 1rem;
  margin-right: 2rem;
  font-size: 1.5rem;
  font-weight: bold;
`;
const Option = styled.option`
  text-transform: capitalize;
`;
