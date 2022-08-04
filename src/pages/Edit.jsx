import { useRef, useState, useEffect } from "react";
import "../index.css";
import styled from "styled-components";
import { color } from "../Style/color";
import Joi from "joi";
import { getAuth } from "firebase/auth";
import { doc, updateDoc, GeoPoint } from "firebase/firestore";

import { db, firebaseApp, storage } from "../Firebase/config";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { useNavigate } from "react-router-dom";
import Lottie from "react-lottie";
import animation from "../loading.json";

function Edit({ isAdmin, profile }) {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [account, setAccount] = useState({
    mosqueName: "",
    ownerName: "",
    latitude: "",
    longitude: "",
    phoneNumber: "",
    country: "",
    city: "",
  });
  const [errors, setErrors] = useState({
    mosqueName: "",
    ownerName: "",
    latitude: "",
    longitude: "",
    phoneNumber: "",
    image: "",
    country: "",
    city: "",
  });
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const schema = Joi.object({
    ownerName: Joi.string().required().alphanum(),
    mosqueName: Joi.string().required(),
    latitude: Joi.number().required().label("Location"),
    longitude: Joi.number().required().label("Location"),
    phoneNumber: Joi.string().required(),
    country: Joi.string().required().label("Country Name"),
    city: Joi.string().required().label("City Name"),
    image: Joi.object().required().label("Image"),
  });
  const [ayatUrl, setAyatUrl] = useState("");
  const [ayatImg, setAyatImg] = useState("");
  const hiddenFileInputBg = useRef("");
  const hiddenFileInputAyat = useRef("");

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const UploadImage = async (ref, image, url) => {
    if (image) {
      await uploadBytes(ref, image);
      return getDownloadURL(ref);
    } else {
      return url;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({
      mosqueName: "",
      ownerName: "",
      latitude: "",
      longitude: "",
      phoneNumber: "",
      image: "",
      country: "",
      city: "",
    });
    const accountHold = { ...account, image };
    const error = schema.validate(accountHold, { abortEarly: false });
    const erros = { ...errors };
    const auth = getAuth(firebaseApp);
    const user = isAdmin ? profile.id : auth.currentUser.uid;
    const storageRef = ref(storage, `TVBackgroundImages/${user}`);
    const storageRefAyet = ref(storage, `AyatImages/${user}`);
    let occured = 0;
    let count = 0;
    if (error.error) {
      for (let item of error.error.details) {
        if (accountHold[item.path[0]] === url) {
          occured = 1;
        } else {
          erros[item.path[0]] = item.message;
          count = 1;
        }
      }
      setLoading(false);
      setErrors(erros);
    } else {
      UploadImage(storageRef, image, url)
        .then((url) => {
          UploadImage(storageRefAyet, ayatImg, ayatUrl).then(
            async (ayatUrl) => {
              await updateDoc(doc(db, "users", user), {
                mName: account.mosqueName,
                ownerName: account.ownerName,
                location: new GeoPoint(account.latitude, account.longitude),
                phoneNumber: account.phoneNumber,
                city: account.city.toLowerCase(),
                country: account.country,
                uri: url,
                ayatImg: ayatUrl,
              }).catch((error) => {
                console.warn(error.code);
              });
            }
          );
        })
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          console.warn(error.code);
        });
    }
    if (occured == 1 && count == 0) {
      UploadImage(storageRefAyet, ayatImg, ayatUrl)
        .then(async (ayatUrl) => {
          await updateDoc(doc(db, "users", user), {
            mName: account.mosqueName,
            ownerName: account.ownerName,
            location: new GeoPoint(account.latitude, account.longitude),
            phoneNumber: account.phoneNumber,
            city: account.city.toLowerCase(),
            country: account.country,
            ayatImg: ayatUrl,
          });
        })
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          console.warn(error.code);
        });
    }
    setLoading(false);
  };

  const handleChange = ({ currentTarget: input }) => {
    const accoun = { ...account };
    accoun[input.name] = input.value;
    setAccount(accoun);
  };

  const handleClick = (e, ref) => {
    e.preventDefault();
    ref.current.click();
  };

  useEffect(() => {
    setAccount({
      mosqueName: profile?.mName,
      ownerName: profile?.ownerName,
      latitude: profile?.location.latitude,
      longitude: profile?.location.longitude,
      phoneNumber: profile?.phoneNumber,
      country: profile?.country,
      city: profile?.city,
    });
    setImage(profile?.uri);
    setUrl(profile?.uri);
    setAyatUrl(profile?.ayatImg);
  }, [profile]);

  return (
    <Container className="container">
      <br />
      <form onSubmit={handleSubmit}>
        <Wrapper>
          <TextInputContainer>
            <div className="mb-3">
              <label htmlFor="resturantname">Mosque Name</label>
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
              <label htmlFor="location">Latitude</label>
              <input
                value={account.latitude}
                id="latitude"
                onChange={handleChange}
                name="latitude"
                type="number"
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
                type="number"
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
              <div className="Image">{url && <img src={url} alt="" />}</div>
              <p style={{ color: "tomato" }}>{errors.image}</p>
              <Button onClick={(e) => handleClick(e, hiddenFileInputBg)}>
                Upload Image
              </Button>
              <input
                type="file"
                ref={hiddenFileInputBg}
                onChange={(e) => {
                  setErrors({
                    ...errors,
                    image: "",
                  });
                  setImage(e.target.files[0]);
                  setUrl(URL.createObjectURL(e.target.files[0]));
                }}
                style={{ display: "none" }}
                accept={".jpg, .png"}
              />
            </div>
          </ImageInputContainer>
          <br />
          <ImageInputContainer>
            <div>
              <h3>Ayat Image</h3>
              <div className="Image">
                {ayatUrl && <img src={ayatUrl} alt="" />}
              </div>
              <p style={{ color: "tomato" }}>{errors.ayatImg}</p>
              <Button onClick={(e) => handleClick(e, hiddenFileInputAyat)}>
                Upload Image
              </Button>
              <input
                type="file"
                ref={hiddenFileInputAyat}
                onChange={(e) => {
                  setErrors({
                    ...errors,
                    image: "",
                  });
                  setAyatImg(e.target.files[0]);
                  setAyatUrl(URL.createObjectURL(e.target.files[0]));
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

export default Edit;

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
  height: 180vh;
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  display: flex;
  top: 0;
  left: 0;
  right: 0;
`;
