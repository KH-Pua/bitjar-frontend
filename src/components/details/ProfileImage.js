const ProfileImage = ({ src, label }) => {
  return (
    <div className="mx-1 flex w-[100px] flex-col items-center justify-center  transition-all hover:translate-y-[-3px] hover:scale-110">
      <div className=" h-[4rem] w-[4rem] overflow-hidden rounded-full lg:h-[5rem] lg:w-[5rem]">
        <img
          src={src}
          alt={label}
          className="h-[100%] w-[100%] object-contain "
        />
      </div>
      <p className="] pt-[.7em] text-center text-[14px] font-medium tracking-tighter">
        {label}
      </p>
    </div>
  );
};

export default ProfileImage;
