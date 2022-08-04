import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LOADEDCONTEXT,
  LOGINCONTEXT,
  PROFILEAPPROVALCONTEXT,
} from "./context/index";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import {
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
} from "firebase/auth";
import { db, firebaseApp } from "./Firebase/config";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "@firebase/firestore";
import Dashbord from "./pages/Dashbord";
import NotFound from "./pages/NotFound.jsx";
import Loading from "./pages/Loading.jsx";
import Login from "./pages/Login";
import Auqate from "./pages/Auqate";

import NotApproved from "./pages/NotApproved";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";
import Edit from "./pages/Edit";
import ForgotPassword from "./pages/ForgotPassword";
import Signup from "./pages/Signup";

function App(props) {
  const [isLoaded, setLoaded] = useState(false);
  const [login, setLogin] = useState(false);
  const [profile, setProfile] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [profileData, setProfileData] = useState(false); // This state will store the data of a specific
  // mosque when admin search one.
  const [data, setData] = useState([]);

  const getProfileData = async () => {
    const auth = getAuth(firebaseApp);
    const docRef = doc(db, "users", auth.currentUser.uid);
    const timingsDocRef = doc(db, "timings", auth.currentUser.uid);
    onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        if (doc.data()?.admin) {
          setIsAdmin(true);
        } else {
          setIsApproved(doc.data().activated);
        }
        const profile = { id: doc.id, ...doc.data() };
        onSnapshot(timingsDocRef, (doc) => {
          if (doc.exists()) {
            let temp = { ...profile, timings: { ...doc.data() } };

            setProfile(temp);
            setLoaded(true);
          } else {
            setLoaded(true);
          }
        });
      } else {
        setLoaded(true);
      }
    });
  };

  const getSpecificProfileData = async (email, navigate) => {
    const queryRef = collection(db, "users");
    const q = query(queryRef, where("email", "==", email));
    getDocs(q).then((snap) => {
      snap.forEach((docData) => {
        if (docData.exists()) {
          onSnapshot(doc(db, "users", docData.id), (docProfile) => {
            const profile1 = { id: docProfile.id, ...docProfile.data() };
            const timingsDocRef = doc(db, "timings", docProfile.id);
            onSnapshot(timingsDocRef, (doc) => {
              if (doc.exists()) {
                let temp = { ...profile1, timings: { ...doc.data() } };

                setProfileData(temp);
                setLoaded(true);
              } else {
                console.warn("No such document!");
                setLoaded(true);
              }
            });
          });
        } else {
          console.warn("No such document!");
        }
        navigate("/profile");
      });
    });
  };

  const getMosqueAccounts = async () => {
    const q = query(collection(db, "users"), orderBy("creationDate", "desc"));
    onSnapshot(q, (querySnapshot) => {
      const array = [];
      querySnapshot.forEach((doc) => {
        array.push({ id: doc.id, ...doc.data() });
      });
      setData(array);
    });
  };

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    try {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          if (user.emailVerified) {
            setLogin(user);
          } else if (!user.emailVerified) {
            sendEmailVerification(auth.currentUser).then(() => {
              alert(
                "A verification link was sent to you Please verify your Email"
              );
            });
            auth.signOut();
            setLogin(false);
            setLoaded(true);
          }
        } else {
          setLogin(false);
          setIsAdmin(false);
          setLoaded(true);
        }
      });
    } catch (error) {
      console.error(error);
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (login) {
      getProfileData();
    }
    if (isAdmin && login) {
      getMosqueAccounts();
    }
  }, [login, isAdmin]);

  return (
    <LOGINCONTEXT.Provider value={[login, setLogin]}>
      <PROFILEAPPROVALCONTEXT.Provider value={[profile, setProfile]}>
        <LOADEDCONTEXT.Provider value={[isLoaded, setLoaded]}>
          <Router>
            {isLoaded ? (
              login ? (
                !isAdmin ? (
                  isApproved ? (
                    <>
                      <Navbar />
                      <Routes>
                        <Route
                          path="/"
                          element={
                            <Auqate profile={profile} setProfile={setProfile} />
                          }
                        ></Route>
                        <Route path="/admin" element={<Admin />} />
                        <Route
                          path="/edit"
                          element={<Edit profile={profile} />}
                        />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </>
                  ) : (
                    <>
                      <Navbar />
                      <Routes>
                        <Route path="/" element={<NotApproved />}></Route>
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </>
                  )
                ) : (
                  <>
                    <Navbar
                      isAdmin={isAdmin}
                      profileData={profileData}
                      getProfileData={getSpecificProfileData}
                    />
                    <Routes>
                      <Route path="/" element={<Dashbord data={data} />} />
                      <Route
                        path="/profile"
                        element={
                          <Auqate
                            profile={profileData}
                            setProfile={setProfileData}
                          />
                        }
                      ></Route>
                      <Route path="/admin" element={<Admin />} />
                      <Route
                        path="/edit"
                        element={
                          <Edit isAdmin={isAdmin} profile={profileData} />
                        }
                      />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </>
                )
              ) : (
                <Routes>
                  <Route path="/" element={<Login />}></Route>
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgotPassword" element={<ForgotPassword />} />
                </Routes>
              )
            ) : (
              <Loading />
            )}
          </Router>
        </LOADEDCONTEXT.Provider>
      </PROFILEAPPROVALCONTEXT.Provider>
    </LOGINCONTEXT.Provider>
  );
}

export default App;
