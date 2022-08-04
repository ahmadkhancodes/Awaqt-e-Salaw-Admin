import React, { useRef, useState } from "react";
import "../index.css";
import styled from "styled-components";
import { color } from "../Style/color";
import Joi from "joi";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp, GeoPoint } from "firebase/firestore";

import { db, firebaseApp, storage } from "../Firebase/config";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Lottie from "react-lottie";
import animation from "../loading.json";

function Signup(props) {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [account, setAccount] = useState({
    mosqueName: "",
    ownerName: "",
    latitude: "",
    longitude: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    country: "",
    city: "",
  });
  const [errors, setErrors] = useState({
    mosqueName: "",
    ownerName: "",
    latitude: "",
    longitude: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    image: "",
    country: "",
    city: "",
  });
  const [image, setImage] = useState("");
  const schema = Joi.object({
    ownerName: Joi.string().required().alphanum(),
    mosqueName: Joi.string().required(),
    latitude: Joi.number().required().label("Latitude"),
    longitude: Joi.number().required().label("Longitude"),
    email: Joi.string().email({ tlds: [] }).required(),
    password: Joi.string()
      .min(8)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    confirmPassword: Joi.ref("password"),
    phoneNumber: Joi.string().required(),
    country: Joi.string().required().label("Country Name"),
    city: Joi.string().required().label("City Name"),
    image: Joi.object().required().label("Image"),
  });
  const hiddenFileInput = useRef("");
  const UploadImage = async (ref) => {
    return await uploadBytes(ref, image).then(() => {
      return getDownloadURL(ref);
    });
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({
      mosqueName: "",
      ownerName: "",
      latitude: "",
      longitude: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      image: "",
      country: "",
      city: "",
    });
    let tempTimings = [];
    const error = schema.validate({ ...account, image }, { abortEarly: false });
    const erros = { ...errors };
    if (error.error) {
      for (let item of error.error.details) {
        erros[item.path[0]] = item.message;
      }
      setErrors(erros);
      setLoading(false);
    } else {
      const auth = getAuth(firebaseApp);
      createUserWithEmailAndPassword(auth, account.email, account.password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          const storageRef = ref(storage, `TVBackgroundImages/${user.uid}`);
          UploadImage(storageRef)
            .then(async (url) => {
              setDoc(doc(db, "users", user.uid), {
                mName: account.mosqueName,
                ownerName: account.ownerName,
                location: new GeoPoint(account.latitude, account.longitude),
                email: account.email,
                phoneNumber: account.phoneNumber,
                activated: false,
                city: account.city.toLowerCase(),
                country: account.country,
                creationDate: serverTimestamp(),
                uri: url,
                timings: tempTimings,
              }).catch((error) => {
                console.warn(error.code);
              });
              // setting up the userID doc in timings
              setDoc(doc(db, "timings", user.uid), {}).catch((error) => {
                console.warn(error.code);
              });
            })
            .then(() => {
              navigate("/");
              // auth.signOut();
            });
        })
        .catch((error) => {
          alert(error);
          setLoading(false);
        });
    }
  };
  const handleChange = ({ currentTarget: input }) => {
    const accoun = { ...account };
    accoun[input.name] = input.value;
    setAccount(accoun);
  };
  const handleClick = (e) => {
    e.preventDefault();
    hiddenFileInput.current.click();
  };
  return (
    <Container className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ArrowBackIcon
          onClick={() => navigate("/")}
          style={{ fontSize: "3rem", cursor: "pointer" }}
        />
        <h1 className="text-center mt-3 ">Register</h1>
        <div></div>
      </div>
      <form onSubmit={handleSubmit}>
        <Wrapper>
          <TextInputContainer>
            <div className="mb-3">
              <label htmlFor="mosquename">Mosque Name</label>
              <input
                value={account.mosqueName}
                onChange={handleChange}
                name="mosqueName"
                id="mosqueName"
                type="text"
                className="form-control"
              />
            </div>

            <p style={{ color: "tomato" }}>{errors.mosqueName}</p>
            <div className="mb-3">
              <label htmlFor="ownername">Owner's Name</label>
              <input
                value={account.ownerName}
                id="ownerName"
                onChange={handleChange}
                name="ownerName"
                type="text"
                className="form-control"
              />
            </div>
            <p style={{ color: "tomato" }}>{errors.ownerName}</p>
            <div className="mb-3">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                value={account.phoneNumber}
                id="phoneNumber"
                onChange={handleChange}
                name="phoneNumber"
                type="text"
                className="form-control"
              />
            </div>
            <p style={{ color: "tomato" }}>{errors.phoneNumber}</p>
            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <input
                value={account.email}
                id="email"
                onChange={handleChange}
                name="email"
                type="email"
                className="form-control"
              />
            </div>
            <p style={{ color: "tomato" }}>{errors.email}</p>
            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <input
                value={account.password}
                id="password"
                onChange={handleChange}
                name="password"
                type="password"
                className="form-control"
              />
            </div>
            <p style={{ color: "tomato" }}>{errors.password}</p>
            <div className="mb-3">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                value={account.confirmPassword}
                id="confirmPassword"
                onChange={handleChange}
                name="confirmPassword"
                type="password"
                className="form-control"
              />
            </div>
            <p style={{ color: "tomato" }}>{errors.confirmPassword}</p>
            <div className="mb-3">
              <label htmlFor="location">Latitude</label>
              <input
                value={account.latitude}
                id="latitude"
                onChange={handleChange}
                name="latitude"
                type="text"
                className="form-control"
              />
            </div>
            <p style={{ color: "tomato" }}>{errors.latitude}</p>
            <div className="mb-3">
              <label htmlFor="location">Longitude</label>
              <input
                value={account.longitude}
                id="longitude"
                onChange={handleChange}
                name="longitude"
                type="text"
                className="form-control"
              />
            </div>
            <p style={{ color: "tomato" }}>{errors.longitude}</p>

            <div className="mb-3">
              <label htmlFor="country">Country</label>
              <input
                value={account.country}
                id="country"
                onChange={handleChange}
                name="country"
                type="text"
                className="form-control"
              />
            </div>
            <p style={{ color: "tomato" }}>{errors.country}</p>
            <div className="mb-3">
              <label htmlFor="city">City</label>
              <input
                value={account.city}
                id="city"
                onChange={handleChange}
                name="city"
                type="text"
                className="form-control"
              />
            </div>
            <p style={{ color: "tomato" }}>{errors.city}</p>
          </TextInputContainer>
          <ImageInputContainer>
            <div>
              <h3>TV background image</h3>
              <div className="Image">
                {image && <img src={URL.createObjectURL(image)} alt="" />}
              </div>
              <p style={{ color: "tomato" }}>{errors.image}</p>
              <Button onClick={handleClick}>Upload Image</Button>
              <input
                type="file"
                ref={hiddenFileInput}
                onChange={(e) => {
                  setErrors({
                    ...errors,
                    image: "",
                  });
                  setImage(e.target.files[0]);
                }}
                style={{ display: "none" }}
                accept={".jpg, .png"}
              />
            </div>
          </ImageInputContainer>
        </Wrapper>
        <SubmitContainer>
          <Button type="submit">Submit</Button>
        </SubmitContainer>
      </form>
      {isLoading && (
        <Overlay>
          <Lottie options={defaultOptions} height={300} width={300} />
        </Overlay>
      )}
    </Container>
  );
}

export default Signup;

const Container = styled.div`
  height: 150vh;
  h1 {
    margin: 2rem;
    font-size: 4rem;
    font-weight: bold;
  }
  label {
    font-size: 1.5rem;
  }
  input,
  textarea {
    font-size: 1.5rem;
    padding: 1rem;
    text-transform: none;
  }
  input:focus,
  textarea:focus {
    border-color: ${color.primary};
    box-shadow: 0px 0px 0rem 0px ${color.primary};
  }
`;
const Wrapper = styled.div``;
const TextInputContainer = styled.div``;
const ImageInputContainer = styled.div`
  .Image {
    height: 40rem;
    border: 0.1rem solid rgba(0, 0, 0, 0.2);
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
`;
const SubmitContainer = styled.div`
  width: 100%;
  margin: 2rem 0rem;
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  font-weight: bold;
  width: 35%;
  padding: 1rem;
  font-size: 1.5rem;

  background-color: ${color.primary};
  color: white;

  :hover {
    color: ${color.primary};
    background: rgba(34, 253, 5, 0.157);
    border: 0.5px solid ${color.primary};
  }
`;

const Overlay = styled.div`
  height: 200vh;
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  display: flex;
  top: 0;
  left: 0;
  right: 0;
`;
