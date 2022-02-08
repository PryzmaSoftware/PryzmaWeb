import { People, Envelope } from "react-bootstrap-icons";

const Contact = () => {
  return (
    <div className="p-4 h-[calc(100vh-84px)] min-h-[600px]">
      <div className="max-w-xs rounded-md border border-neutral-700 mt-24 overflow-hidden mx-auto opacity-0 animate-fadeIn">
        <div className="bg-gradient-to-br from-indigo-600 to-fuchsia-600 py-4 text-center">
          <People className="text-5xl text-white mx-auto mb-1" />
          <p className="text-white font-bold text-3xl">Support</p>
        </div>
        <p className="text-neutral-400 p-4 py-8 text-center">
          You can contact our support team with any questions or comments you
          may have at{" "}
          <a
            href="mailto:support@pryzma.io"
            className="text-sky-500 hover:underline transition-all"
          >
            support@pryzma.io
          </a>
          .
        </p>
        <div className="mb-8 flex justify-center">
          <a
            href="mailto:support@pryzma.io"
            className="text-white font-medium flex items-center justify-center py-2 px-10 border border-white hover:bg-white hover:text-black transition-all duration-300 bg-transparent w-fit rounded-md"
          >
            <Envelope className="mr-2" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
