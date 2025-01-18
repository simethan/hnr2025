// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { CookedMeter } from "@/app/components/CookedMeter";
// import { Rating } from "@/components/rating";
// import { supabase } from "@/lib/supabase";
// import { pdfToText } from "./pdftotext";

// export default function Profile() {
//   const [linkedinUrl, setLinkedinUrl] = useState("");
//   const [githubUrl, setGithubUrl] = useState("");
//   const [resumeUrl, setResumeUrl] = useState("");
//   const [resumeText, setResumeText] = useState("");
//   const [cookedScore, setCookedScore] = useState(0);
//   const router = useRouter();

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) {
//       router.push("/login");
//       return;
//     }

//     const { data, error } = await supabase
//       .from("profiles")
//       .select("*")
//       .eq("id", user.id)
//       .single();

//     if (error) {
//       console.error(error);
//     }

//     if (data) {
//       setLinkedinUrl(data.linkedin_url || "");
//       setGithubUrl(data.github_url || "");
//       setResumeUrl(data.resume_url || "");
//       setCookedScore(data.cooked_score || 0);
//     }

//     if (!data?.resume_url) return

//     // Fetch resume URL if it exists

//     var resumeText = await pdfToText(data.resume_url);

//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) return;

//     const updatedProfile = {
//       id: user.id,
//       linkedin_url: linkedinUrl,
//       github_url: githubUrl,
//       resume_url: resumeUrl,
//     };

//     const { data, error } = await supabase
//       .from("profiles")
//       .upsert(updatedProfile)
//       .select()
//       .single();

//     if (error) {
//       console.error(error);
//     } else if (data) {
//       await pdfToText(resumeUrl);
//       setCookedScore(calculateCookedScore(data));
//     }
//   };

//   const calculateCookedScore = (profile: any): number => {
//     let score = 0;
//     if (profile.linkedin_url) score += 0.3;
//     if (profile.github_url) score += 0.4;
//     if (profile.resume_url) score += 0.3;
//     return Math.min(score * 10, 10);
//   };

//   const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) return;

//     const fileExt = file.name.split(".").pop();
//     const fileName = `${user.id}-${Math.random()}.${fileExt}`;

//     const { data, error } = await supabase.storage
//       .from("resumes")
//       .upload(fileName, file);

//     if (error) {
//       console.error(error);
//     } else if (data) {
//       console.log(data);
//       const {
//         data: { publicUrl },
//       } = supabase.storage.from("resumes").getPublicUrl(data.path);
//       setResumeUrl(publicUrl);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen py-2">
//       <canvas id="dotlottie-canvas"></canvas>
//       <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
//         <h1 className="text-4xl font-bold mb-8">Your Profile</h1>
//         <form onSubmit={handleSubmit} className="w-full max-w-xs mb-8">
//           <Input
//             type="url"
//             placeholder="LinkedIn URL"
//             value={linkedinUrl}
//             onChange={(e) => setLinkedinUrl(e.target.value)}
//             className="mb-4"
//           />
//           <Input
//             type="url"
//             placeholder="GitHub URL"
//             value={githubUrl}
//             onChange={(e) => setGithubUrl(e.target.value)}
//             className="mb-4"
//           />
//           <Input
//             type="file"
//             accept=".pdf,.docx"
//             onChange={handleResumeUpload}
//             className="mb-4"
//           />
//           <Button type="submit" className="w-full mb-4">
//             Update Profile
//           </Button>
//         </form>
//         <CookedMeter score={cookedScore} />
//         {/* Render Rating Component */}
//         {githubUrl.length != 0 && linkedinUrl.length != 0 && (
//           <Rating
//             linkedinUrl={linkedinUrl}
//             username={githubUrl.split("/").pop() || ""}
//           />
//         )}
//       </main>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { CookedMeter } from "@/app/components/CookedMeter";
// import { Rating } from "@/components/rating";
// import { supabase } from "@/lib/supabase";
// import { pdfToText } from "./pdftotext";
// import { DotLottie } from "@lottiefiles/dotlottie-web";

// export default function Profile() {
//   const [linkedinUrl, setLinkedinUrl] = useState("");
//   const [githubUrl, setGithubUrl] = useState("");
//   const [resumeUrl, setResumeUrl] = useState("");
//   const [cookedScore, setCookedScore] = useState(0);
//   const [isLoading, setIsLoading] = useState(false); // For loading popup
//   const router = useRouter();

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   useEffect(() => {
//     if (isLoading) {
//       // Display the Lottie animation for 30 seconds and then close
//       const dotLottie = new DotLottie({
//         autoplay: true,
//         loop: true,
//         canvas: document.querySelector("#dotlottie-canvas"),
//         src: "https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie",
//       });

//       const timer = setTimeout(() => {
//         setIsLoading(false); // Close popup after 30 seconds
//       }, 30000);

//       return () => clearTimeout(timer); // Cleanup timeout on unmount
//     }
//   }, [isLoading]);

//   const fetchProfile = async () => {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) {
//       router.push("/login");
//       return;
//     }

//     const { data, error } = await supabase
//       .from("profiles")
//       .select("*")
//       .eq("id", user.id)
//       .single();

//     if (error) {
//       console.error(error);
//     }

//     if (data) {
//       setLinkedinUrl(data.linkedin_url || "");
//       setGithubUrl(data.github_url || "");
//       setResumeUrl(data.resume_url || "");
//       setCookedScore(data.cooked_score || 0);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) return;

//     setIsLoading(true); // Show loading popup

//     const updatedProfile = {
//       id: user.id,
//       linkedin_url: linkedinUrl,
//       github_url: githubUrl,
//       resume_url: resumeUrl,
//     };

//     const { data, error } = await supabase
//       .from("profiles")
//       .upsert(updatedProfile)
//       .select()
//       .single();

//     if (error) {
//       console.error(error);
//     } else if (data) {
//       await pdfToText(resumeUrl);
//       setCookedScore(calculateCookedScore(data));
//     }
//   };

//   const calculateCookedScore = (profile: any): number => {
//     let score = 0;
//     if (profile.linkedin_url) score += 0.3;
//     if (profile.github_url) score += 0.4;
//     if (profile.resume_url) score += 0.3;
//     return Math.min(score * 10, 10);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen py-2">
//       {/* Popup Modal */}
//       {isLoading && (
//         <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h2 className="text-lg font-bold mb-4">Loading...</h2>
//             <canvas id="dotlottie-canvas" className="w-64 h-64"></canvas>
//           </div>
//         </div>
//       )}

//       <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
//         <h1 className="text-4xl font-bold mb-8">Your Profile</h1>
//         <form onSubmit={handleSubmit} className="w-full max-w-xs mb-8">
//           <Input
//             type="url"
//             placeholder="LinkedIn URL"
//             value={linkedinUrl}
//             onChange={(e) => setLinkedinUrl(e.target.value)}
//             className="mb-4"
//           />
//           <Input
//             type="url"
//             placeholder="GitHub URL"
//             value={githubUrl}
//             onChange={(e) => setGithubUrl(e.target.value)}
//             className="mb-4"
//           />
//           <Input
//             type="file"
//             accept=".pdf,.docx"
//             className="mb-4"
//           />
//           <Button type="submit" className="w-full mb-4">
//             Update Profile
//           </Button>
//         </form>
//         <CookedMeter score={cookedScore} />
//         {githubUrl.length !== 0 && linkedinUrl.length !== 0 && (
//           <Rating
//             linkedinUrl={linkedinUrl}
//             username={githubUrl.split("/").pop() || ""}
//           />
//         )}
//       </main>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CookedMeter } from "@/app/components/CookedMeter";
import { Rating } from "@/components/rating";
import { supabase } from "@/lib/supabase";
import { pdfToText } from "./pdftotext";
import { DotLottie } from "@lottiefiles/dotlottie-web";
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey:
    process.env.GROQ_API_KEY ||
    "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",
  dangerouslyAllowBrowser: true,
});

export default function Profile() {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [cookedScore, setCookedScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // For loading popup
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    let dotLottie: any;

    if (isLoading) {
      // Initialize the Lottie animation
      dotLottie = new DotLottie({
        autoplay: true,
        loop: true,
        speed: 1,
        canvas: document.querySelector("#dotlottie-canvas")!,
        src: "https://lottie.host/20dbbe1c-9acb-4dfb-989b-11618dd7ca51/KcCB6NN8rz.lottie",
      });

      // Timer to stop the loading modal after 30 seconds
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 28000);

      return () => {
        clearTimeout(timer);
        if (dotLottie) {
          dotLottie.destroy(); // Clean up the animation
        }
      };
    }
  }, [isLoading]);

  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error(error);
    }

    if (data) {
      setLinkedinUrl(data.linkedin_url || "");
      setGithubUrl(data.github_url || "");
      setResumeUrl(data.resume_url || "");
      setCookedScore(data.cooked_score || 0);
    }

    if (!data?.resume_url) return;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setIsLoading(true); // Show loading popup

    const updatedProfile = {
      id: user.id,
      linkedin_url: linkedinUrl,
      github_url: githubUrl,
      resume_url: resumeUrl,
    };

    const { data, error } = await supabase
      .from("profiles")
      .upsert(updatedProfile)
      .select()
      .single();

    if (error) {
      console.error(error);
    } else if (data) {
      var resumeText: any | string = await pdfToText(resumeUrl);
      console.log(data);
      const score = await calculateCookedScore(data, resumeText);
      setCookedScore(score);
    }
  };


  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Math.random()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("resumes")
      .upload(fileName, file);

    if (error) {
      console.error(error);
    } else if (data) {
      console.log(data);
      const {
        data: { publicUrl },
      } = supabase.storage.from("resumes").getPublicUrl(data.path);
      setResumeUrl(publicUrl);
    }
  };

  const calculateCookedScore = async (profile: any, resumeText: string): Promise<number> => {
    try {
      console.log("Calculating cooked score...");
      console.log(
        `Resume:\n${resumeText}\n\nProgramming Statistics:\n${JSON.stringify(
          profile.programming_stats
        )}\n\nLinkedIn Statistics:\nConnections: ${
          profile.linkedin_connections
        }\nWork Experiences: ${
          profile.linkedin_experiences
        }\nCertificates:\n${JSON.stringify(
          profile.linkedin_certificates
        )}\nEducation:\n${JSON.stringify(profile.linkedin_education)}\n\n`
      );
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "Task: Evaluate the quality of a Computer Science student's portfolio based on the following criteria, with the specified weightage:\nResume Analysis (40% Weightage):\nAssess the clarity, structure, and relevance of the resume content.\nLook for key elements such as education, work experience, projects, and skills.\n\nProgramming Languages (40% Weightage):\nReview the student's GitHub repositories to determine the variety and complexity of programming languages used.\nConsider the quality of the code, documentation, and project engagement.\nPenalize common programming languages and reward niche or less commonly used languages.\n\nLinkedIn Statistics (0% Weightage):\nAnalyze the student's LinkedIn profile for the number of connections, work experiences, educational background, and certifications.\nEvaluate how well these elements reflect the student's professional network and industry engagement.\n\nOutput: Provide a rating out of 10 to indicate how \"bad\" or lacking the portfolio is, with 10 being extremely poor and 0 being excellent. Include a brief justification for your rating based on the criteria above.\n\nJSON Format: Return the rating in this format:\njson\n{\"rating\": rating}",
          },
          {
            role: "user",
            content: `Resume:\n${resumeText}\n\nProgramming Statistics:\n${JSON.stringify(
              profile.programming_stats
            )}\n\nLinkedIn Statistics:\nConnections: ${
              profile.linkedin_connections
            }\nWork Experiences: ${
              profile.linkedin_experiences
            }\nCertificates:\n${JSON.stringify(
              profile.linkedin_certificates
            )}\nEducation:\n${JSON.stringify(profile.linkedin_education)}\n\n`,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 1,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: false,
        response_format: {
          type: "json_object",
        },
        stop: null,
      });

      console.log("Chat completion:", chatCompletion);

      const result = JSON.parse(chatCompletion.choices[0].message.content);
      return result.rating;
    } catch (error) {
      console.error("Error calculating cooked score:", error);
      return 0;
    }

  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 background-home steak-color">
      {/* Popup Modal */}
      {isLoading && (
        <div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50"
          aria-hidden={!isLoading}
        >
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4">Cooking...</h2>
            <canvas id="dotlottie-canvas" className="w-64 h-64"></canvas>
          </div>
        </div>
      )}
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <a href="/home" className="mb-2">
          - Back to home -
        </a>
        <h1 className="text-4xl font-bold mb-8">Your Profile</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-xs mb-8">
          <Input
            type="url"
            placeholder="LinkedIn URL"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            className="mb-4"
          />
          <Input
            type="url"
            placeholder="GitHub URL"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="mb-4"
          />
          <Input
            type="file"
            accept=".pdf,.docx"

            onChange={handleResumeUpload}

            className="mb-4"
          />
          <Button type="submit" className="w-full mb-4 steak-button">
            Update Profile
          </Button>
        </form>
        {githubUrl.length != 0 && linkedinUrl.length != 0 && (
          <Rating
            linkedinUrl={linkedinUrl}
            username={githubUrl.split("/").pop() || ""}
            pdfUrl={resumeUrl}
          />
        )}
      </main>
    </div>
  );
}
