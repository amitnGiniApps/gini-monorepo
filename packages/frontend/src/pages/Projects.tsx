import React, { useState } from "react";
import bg from "../assets/gini-avatar-0.png";

export default function LandingPage() {
  const [htmlContent, setHtmlContent] = useState<string |null>(null);
  const [loading] = useState(false);

  // const onSubmit = async (appType) => {
  //   setHtmlContent(null);
  //   setLoading(true);
  //
  //   await new Promise((resolve) => setTimeout(resolve, 2000));
  //
  //   try {
  //     let url = `http://localhost:3020/api/v1/generate/${appType}`;
  //     if (appType === "calendar-ai") {
  //       url = "http://localhost:3020/api/v2/generate";
  //     }
  //     const response = await fetch(url, {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //     });
  //
  //     if (response.ok) {
  //       const html = await response.text();
  //       setHtmlContent(html);
  //       setLoading(false);
  //     } else {
  //       console.error("Error fetching HTML", response);
  //     }
  //   } catch (error) {
  //     console.error("Failed to generate HTML", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="bg-no-repeat bg-contain bg-bottom"
         style={{flex: '0.5', alignSelf:'stretch', backgroundImage: `url(${bg})` }}
    >
      <section className="flex flex-col items-center justify-center text-center px-4 bg-white/80">
        {loading && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              zIndex: 1000,
            }}
          >
            <div className="spinner"></div>
          </div>
        )}
        {htmlContent && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              zIndex: 1000,
            }}
          >
            <div
              onClick={() => setHtmlContent(null)}
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                width: "1000%",
                height: "90%",
                backgroundColor: "transparent",
                borderRadius: "12px",
                overflow: "hidden",
                padding: "0 100px",
              }}
            >
              <iframe
                title="Generated HTML"
                srcDoc={htmlContent}
                style={{
                  width: "1400px",
                  height: "800px",
                  border: "1px solid white",
                  marginTop: "2rem",
                  borderRadius: "8px",
                  background: "white",
                  padding: "10px",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
                }}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}


// {/* <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-5xl font-bold mb-6">
//           Get Project with Gini AI
//         </motion.h1> */}
//
// {/* <p className="text-lg max-w-2xl mb-6">Create high-converting landing pages that capture leads and grow your business — in just a few clicks.</p> */}
//
// <div className="flex gap-7 justify-center">
//   {/* <button onClick={() => onSubmit("map")} className="basis-1/2 mr-10 rounded-3xl bg-yellow-500 text-white px-6 py-3 text-lg">
//             Generate Map App
//           </button>
//           <button onClick={() => onSubmit("map2")} className="basis-1/2 mr-10 rounded-3xl bg-yellow-400 text-white px-6 py-3 text-lg">
//             Generate Map App
//           </button> */}
//
//   {/*<button onClick={() => onSubmit("map3")} className="basis-1/2 mr-10 rounded-3xl rounded-3xl bg-yellow-400 text-white px-6 py-3 text-lg">*/}
//   {/*  Generate Map App*/}
//   {/*</button>*/}
//
//   {/* <button onClick={() => onSubmit("calendar")} className="basis-1/2 mr-10 rounded-3xl bg-blue-300 text-white px-6 py-3 text-lg">
//             Generate Calendar App
//           </button>
//
//           <button onClick={() => onSubmit("calendar-ai")} className="basis-1/2 mr-10 rounded-3xl bg-blue-500 text-white px-6 py-3 text-lg">
//             Generate AI Calendar
//           </button>
//
//           <button onClick={() => onSubmit("chat1")} className="basis-1/2 mr-10 rounded-3xl bg-green-500 text-white px-6 py-3 text-lg">
//             Generate Chat App
//           </button> */}
// </div>
// {/* <div className="mb-4 mt-5 flex gap-6">
//           <button onClick={() => onSubmit("chat2")} className="basis-1/2 mr-10 rounded-3xl bg-green-600 text-white px-6 py-3 text-lg">
//             Generate Chat App
//           </button>
//
//           <button onClick={() => onSubmit("dashboard1")} className=" basis-1/2 mr-10 rounded-3xl bg-purple-300 text-white px-6 py-3 text-lg">
//             Generate Dashboard App
//           </button>
//
//           <button onClick={() => onSubmit("dashboard2")} className="basis-1/2 mr-10 rounded-3xl bg-purple-500 text-white px-6 py-3 text-lg">
//             Generate Dashboard App
//           </button>
//
//           <button onClick={() => onSubmit("track")} className="basis-1/2 mr-10 rounded-3xl bg-black text-white px-6 py-3 text-lg">
//             Generate Tracking App
//           </button>
//         </div> */}
