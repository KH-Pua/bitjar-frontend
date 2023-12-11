import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.log(error);

  return (
    <>
      {error.message ===
      `Cannot read properties of undefined (reading 'userName')` ? (
        <div className="animate-pulse">Filling In Information</div>
      ) : (
        <div>
          <br />
          <h2>Oops!</h2>
          <p>Sorry, an unexpected error has occurred.</p>
          <p>
            <i>{error.statustext || error.message}</i>
          </p>
        </div>
      )}
    </>
  );
};

export default ErrorPage;
