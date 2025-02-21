import Header from "../components/header/Header"
import AvatarContainer from "../components/avatar/AvatarContainer";

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header/>
      <h1>Welcome to My App</h1>
      <AvatarContainer />  
    </main>
  );
  }
