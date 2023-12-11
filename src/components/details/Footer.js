const Footer = () => {
  return (
    <footer className="bottom-2 mt-[5em] flex w-full justify-center p-[1em]">
      <p className="text-sm">
        © 2023 Bitjar -{" "}
        <a
          href="https://github.com/KH-Pua/bitjar-frontend"
          target="_blank"
          className=" text-sm hover:underline"
          rel="noreferrer"
        >
          Github -{" "}
        </a>
        <a
          href="https://twitter.com/bitjarxyz"
          target="_blank"
          className=" text-sm hover:underline"
          rel="noreferrer"
        >
          Twitter
        </a>
      </p>
    </footer>
  );
};
export default Footer;
