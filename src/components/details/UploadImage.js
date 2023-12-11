const UploadImage = ({ src, alt, add }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`m-1 h-[7em] w-[7em] rounded-full border-2 border-yellow-400 bg-white object-contain p-1 shadow-md ${add}`}
    />
  );
};

export default UploadImage;
