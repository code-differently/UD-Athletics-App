import Header from "../components/header/Header"
import AvatarScene from "../components/avatar/AvatarScene";

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header/>
      <h1>Welcome to My App</h1>
      <AvatarScene />  
    </main>
  );
  }
