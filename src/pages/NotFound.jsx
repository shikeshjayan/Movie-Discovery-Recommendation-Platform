const NotFound = () => {
  return (
    <div className="min-h-screen max-w-screen flex flex-col justify-center items-center">
      <h1 className="text-9xl font-extrabold flex">
        4
        <span>
          <img
            src="/settings.svg"
            alt=""
            className="w-32 h-32 animate-spin [animation-duration:2s]"
          />
        </span>{" "}
        4
      </h1>
      <p className="text-5xl text-center">NotFound</p>
    </div>
  );
};

export default NotFound;
