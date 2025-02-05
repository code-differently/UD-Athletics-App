import Header from "../components/header/Header"
import AvatarCustomizer from "../components/avatar/AvatarCustomizer";

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header/>
      <h1>Welcome to My App</h1>
      <AvatarCustomizer />  
    </main>
  );
  }
