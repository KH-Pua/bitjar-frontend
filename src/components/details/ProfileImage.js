const ProfileImage = ({ src, label }) => {
  return (
    <div className="mx-3 flex flex-col items-center justify-center transition-all hover:translate-y-[-3px] hover:scale-110 ">
      <img src={src} alt={label} className="h-20 shrink-0 rounded-full " />
      <p className="] shrink-0 pt-[.7em] text-center font-medium tracking-tighter">
        {label}
      </p>
    </div>
  );
};

export default ProfileImage;
