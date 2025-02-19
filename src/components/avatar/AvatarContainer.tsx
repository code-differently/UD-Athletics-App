import AvatarScene from "./AvatarScene";

const AvatarContainer: React.FC = () => {
  return (
    <div className="relative w-[300px] h-[300px]">
      {/* Avatar Scene (3D Model) */}
      <AvatarScene />
    </div>
  );
};

export default AvatarContainer;
