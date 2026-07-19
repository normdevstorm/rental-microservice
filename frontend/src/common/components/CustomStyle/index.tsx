import withAuth from "../WithAuth";

function CustomStyle() {
  return (
    <div className="flex flex-col mt-5">
      <div className="flex flex-row mt-5">
        <button className="myButton">
          Test custom button with taillwindcss
        </button>
      </div>
      <div className="flex flex-row mt-5">
        <button className="my-button">
          Test custom button with taillwindcss
        </button>
      </div>
      <div className="flex flex-row mt-5">
        <button className="bg-primaryBtn rounded h-10 px-5">
          Test custom button with taillwindcss
        </button>
      </div>
    </div>
  );
}

export default withAuth(CustomStyle);
