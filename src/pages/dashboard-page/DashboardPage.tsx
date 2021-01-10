import React, { useState, useEffect } from "react";
import styles from "./DashboardPage.module.css";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import { swFirestore, swStorage } from "../../firebase";

export default function DashboardPage() {
  const { currentUser, logout } = useAuth();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [videos, setVideos] = useState<any>([]);

  useEffect(() => {
    getVideos();
  }, []);

  const history = useHistory();

  const getVideos = async () => {
    const snapshot = await swFirestore.collection("videos").get();
    const videoList = snapshot.docs.map((doc) => doc.data());
    if (currentUser.role === "client") {
      setVideos(videoList);
    } else {
      const filteredVideos = videoList.filter((video) => {
        return video.author === currentUser.id;
      });

      setVideos(filteredVideos);
    }
  };

  return (
    <div className="box-wide">
      <div className={styles.container}>
        <div className={styles.profile}>
          <h3>Profile Details</h3>
          <p>Email: {currentUser.email} </p>
          <p>Logged in as: {currentUser.role}</p>
          {currentUser.role === "candidate" && renderForm()}
        </div>

        <div>
          <h3>{currentUser.role === "client" ? "All videos" : "My videos"}</h3>
          <div className="column-grid">
            {videos.map((video: any) => {
              return (
                <div className={`box-third ${styles.video}`}>
                  <video width="100%" controls>
                    <source src={video.videoUrl} type="video/mp4" />
                  </video>
                </div>
              );
            })}
          </div>
        </div>
        <button onClick={handleLogout}>logout</button>
      </div>
    </div>
  );

  function renderForm() {
    return (
      <div>
        <form onSubmit={submitForm}>
          <input
            type="file"
            accept={"video/mp4"}
            onChange={(e: any) => {
              const file = e.target.files[0];
              setSelectedFile(file);
            }}
          />
          <button>Upload</button>
        </form>
      </div>
    );
  }

  async function submitForm(e: any) {
    e.preventDefault();

    if (selectedFile) {
      const uploadedVideoFile = await swStorage
        .ref()
        .child("videos")
        .child(selectedFile.name)
        .put(selectedFile);

      uploadedVideoFile.ref.getDownloadURL().then((downloadURL: string) => {
        swFirestore.collection("videos").doc().set({
          author: currentUser.id,
          videoUrl: downloadURL,
        });
      });
    }

    setSelectedFile(null);
  }

  async function handleLogout() {
    try {
      await logout();
      history.push("/");
    } catch (err) {
      console.log("Something went wrong", err);
    }
  }
}
