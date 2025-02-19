import AvatarScene from "./AvatarScene";
import AvatarWithBodyPart from "./AvatarWithBodyPart";

const AvatarContainer: React.FC = () => {
  return (
    <div className="relative w-[300px] h-[300px]">
      {/* Avatar Scene (3D Model) */}
      <AvatarScene />

      {/* Clickable Body Parts Overlay */}
      <div style={{ pointerEvents: "none" }} className="absolute top-0 left-0 w-full h-full">
        <AvatarWithBodyPart />
      </div>
    </div>
  );
};

export default AvatarContainer;
