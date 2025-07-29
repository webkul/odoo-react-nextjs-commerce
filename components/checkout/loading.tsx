const Loading = () => {
  return (
    <section className="flex-col hidden w-full h-full max-w-xl px-4 pt-4 mr-auto lg:flex lg:max-w-xl">
      <div
        role="status"
        className="flex flex-col w-full gap-4 my-12 animate-pulse"
      >
        <div className="w-full h-24 bg-gray-200 rounded-md dark:bg-gray-700"></div>
        <div className="w-3/4 h-8 bg-gray-200 rounded-md dark:bg-gray-700"></div>
        <div className="w-full h-8 bg-gray-200 rounded-md dark:bg-gray-700"></div>
        <span className="sr-only">Loading...</span>
      </div>
      <div className="flex flex-col w-full gap-3 animate-pulse">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="w-auto h-8 bg-gray-200 rounded-md dark:bg-gray-700"
            ></div>
          ))}
      </div>
    </section>
  );
};

export default Loading;
