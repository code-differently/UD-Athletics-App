import React from "react";
import  AvatarScene  from "../components/avatar/AvatarScene";
import Header from "../components/header/Header"

export default function Page() {
  return (
    <main>
      <Header/>
      <h1>Welcome to My App</h1>
      <AvatarScene />  
    </main>
  );
  }