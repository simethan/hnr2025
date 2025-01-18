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
    let dotLottie;

    if (isLoading) {
      // Initialize the Lottie animation
      dotLottie = new DotLottie({
        autoplay: true,
        loop: true,
        speed:1,
        canvas: document.querySelector("#dotlottie-canvas"),
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
  };

  const handleSubmit = async (e) => {
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
      await pdfToText(resumeUrl);
      setCookedScore(calculateCookedScore(data));
    }
  };

  const calculateCookedScore = (profile) => {
    let score = 0;
    if (profile.linkedin_url) score += 0.3;
    if (profile.github_url) score += 0.4;
    if (profile.resume_url) score += 0.3;
    return Math.min(score * 10, 10);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
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
            onChange={(e) => setResumeUrl(e.target.files[0]?.name || "")}
            className="mb-4"
          />
          <Button type="submit" className="w-full mb-4">
            Update Profile
          </Button>
        </form>
        <CookedMeter score={cookedScore} />
        {githubUrl.length !== 0 && linkedinUrl.length !== 0 && (
          <Rating
            linkedinUrl={linkedinUrl}
            username={githubUrl.split("/").pop() || ""}
          />
        )}
      </main>
    </div>
  );
}





