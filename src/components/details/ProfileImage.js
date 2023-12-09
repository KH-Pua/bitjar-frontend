const ProfileImage = ({ src, label }) => {
  return (
    <div className="mx-3 flex flex-col items-center justify-center transition-all hover:translate-y-[-3px] hover:scale-110">
      <div className=" h-[4rem] w-[4rem] overflow-hidden rounded-full lg:h-[5rem] lg:w-[5rem]">
        <img
          src={src}
          alt={label}
          className="h-[100%] w-[100%] object-cover "
        />
      </div>
      <p className="] shrink-0 pt-[.7em] text-center font-medium tracking-tighter">
        {label}
      </p>
    </div>
  );
};

export default ProfileImage;
