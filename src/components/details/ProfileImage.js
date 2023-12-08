const ProfileImage = ({ src, label }) => {
  return (
    <div className="mx-3 flex flex-col items-center justify-center">
      <img src={src} alt={label} className="h-20 rounded-full" />
      <p className="tracking-tighter">{label}</p>
    </div>
  );
};

export default ProfileImage;
