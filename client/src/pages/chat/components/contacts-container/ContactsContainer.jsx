import React from "react";

function ContactsContainer() {
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Fitness-Groups" />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Fitness-Buddies" />
        </div>
      </div>
    </div>
  );
}

export default ContactsContainer;

const Logo = () => {
  return (
    <div className="flex   justify-start items-center gap-2 pl-3">
      <svg
        fill="#7950F2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width="90px"
        height="90px"
      >
        <path d="M32,10.927c-17.944,0-32,9.444-32,21.5s14.056,21.5,32,21.5s32-9.444,32-21.5C64,20.572,49.645,10.927,32,10.927z M52.517,40.264c-1.569,1.433-3.62,3.516-6.034,4.558c3.983-6.251-3.742-9.376-7.242-2.604c-1.327-5.47-5.913-1.693-7.241,5.209	c-1.328-6.902-5.914-10.679-7.241-5.209c-3.5-6.772-11.224-3.647-7.241,2.604c-2.414-1.042-4.466-3.125-6.034-4.688	c-2.173-2.214-3.5-4.819-3.621-7.293c0.121-5.47,5.914-10.679,14.483-12.763c-6.035,8.596,3.741,14.716,5.431,7.033l0.724-7.684	l1.69,1.953h3.62l1.69-1.953l0.724,7.684c1.69,7.553,11.466,1.563,5.431-7.033c8.569,2.214,14.362,7.423,14.483,12.893	C56.017,35.446,54.69,38.05,52.517,40.264z" />
      </svg>
      <span className="text-3xl font-semibold pl-2">Fit-Knight</span>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
