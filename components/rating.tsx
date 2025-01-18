import { use, useEffect, useState } from "react"
import { CookedMeter } from "@/app/components/CookedMeter"
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams } from "next/navigation";
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "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", dangerouslyAllowBrowser: true });

export function Rating(props: { linkedinUrl: string, username: string, pdfUrl: string }) {
  const [data, setData] = useState(null);
  const [cookedScore, setCookedScore] = useState(0);
  const [shareData, setShareData] = useState(null);
  const params = useSearchParams()

  useEffect(() => {
    getData()

    if (params.has('share_id')) {
      getShareData()
    }
  }, [0])

  async function getShareData() {
    const data = await supabase.from('shares')
      .select('*')
      .eq('id', params.get('share_id'))
      .single()

    setShareData(data.data.shared_to)
  }

  async function getData() {
    const data = await fetch('/api/rating', {
      method: 'POST',
      body: JSON.stringify({ github: props.username, linkedin: props.linkedinUrl, pdfUrl: props.pdfUrl }),
    })

    const r = await data.json()
    console.log(r)
    setData(r)

    // if r has the required data, calculate the cooked score
    if (r) {
      const cookedScore = await calculateCookedScore(r, r.pdfContent)
      console.log("Cooked score:", cookedScore)
      setCookedScore(cookedScore)

      if (cookedScore) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const updatedProfile = {
          id: user.id,
          cooked_score: cookedScore
        }

        const { error } = await supabase.from('profiles').upsert(updatedProfile).select().single();
        if (error) console.error("Error updating profile:", error)
      }
    }
  };

  const calculateCookedScore = async (profile: any, resumeText: string): Promise<number> => {
    try {
      console.log("Calculating cooked score...");
      console.log(`Resume:\n${resumeText}\n\nProgramming Statistics:\n${JSON.stringify(profile.github)}\n\nLinkedIn Statistics:\Followers: ${profile.linkedin.followers}\nWork Experiences: ${profile.linkedin.work_experience}\nCertificates:\n${JSON.stringify(profile.linkedin.certificates)}\nEducation:\n${JSON.stringify(profile.linkedin.education)}\n\n`);
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Task: Evaluate the quality of a Computer Science student's portfolio based on the following criteria, with the specified weightage:\nResume Analysis (40% Weightage):\nAssess the clarity, structure, and relevance of the resume content.\nLook for key elements such as education, work experience, projects, and skills.\n\nProgramming Languages (40% Weightage):\nReview the student's GitHub repositories to determine the variety and complexity of programming languages used.\nConsider the quality of the code, documentation, and project engagement.\nPenalize common programming languages and reward niche or less commonly used languages.\n\nLinkedIn Statistics (0% Weightage):\nAnalyze the student's LinkedIn profile for the number of connections, work experiences, educational background, and certifications.\nEvaluate how well these elements reflect the student's professional network and industry engagement.\n\nOutput: Provide a rating out of 10 to indicate how \"bad\" or lacking the portfolio is, with 10 being extremely poor and 0 being excellent. Include a brief justification for your rating based on the criteria above.\n\nJSON Format: Return the rating in this format:\njson\n{\"rating\": rating}"
          },
          {
            role: "user",
            content: `Resume:\n${resumeText}\n\nProgramming Statistics:\n${JSON.stringify(profile.github)}\n\nLinkedIn Statistics:\Followers: ${profile.linkedin.followers}\nWork Experiences: ${profile.linkedin.work_experience}\nCertificates:\n${JSON.stringify(profile.linkedin.certificates)}\nEducation:\n${JSON.stringify(profile.linkedin.education)}\n\n`
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 1,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: false,
        response_format: {
          type: "json_object"
        },
        stop: null
      });

      console.log("Chat completion:", chatCompletion);

      const result = JSON.parse(chatCompletion.choices[0].message.content);
      return result.rating;
    } catch (error) {
      console.error("Error calculating cooked score:", error);
      return 0;
    }
  };

  // Fetch data from GitHub and LinkedIn
  // const githubLanguages = await fetchGithubLanguages(props.username)
  // const linkedInProfile = await fetchLinkedInProfile(props.linkedinUrl)

  async function createShare(e) {
    e.preventDefault()

    const user = await supabase.auth.getUser()

    const share = await supabase.from('shares')
      .upsert({
        id: uuidv4(),
        owner_id: user.data.user?.id,
        name: 'Users share',
        shared_to: [
          {
            user: user.data.user?.id,
            name: (await supabase.from("profiles").select("*").eq("id", user.data.user?.id).single()).data.name,
            score: cookedScore
          }
        ]
      })
      .select()
      .single()

    window.navigator.clipboard.writeText(`${window.location.origin}/profile?share_id=${share.data.id}`)

    alert(`Copied to clipboard!`)

    return true
  }

  return (
    <div>
      {/* <h2>GitHub Languages</h2>
      <pre>{JSON.stringify(githubLanguages, null, 2)}</pre>

      <h2>LinkedIn Profile</h2>
      <pre>{JSON.stringify(linkedInProfile, null, 2)}</pre> */}
      {/* {JSON.stringify(props)} */}

      <CookedMeter score={cookedScore || 0} />

      {shareData === null ? (
        <>

          {cookedScore === 0 ? (
            <form onSubmit={createShare}>
              <Button type="submit" className="w-full my-10">
                Share results!
              </Button>
            </form>
          ) : null}

        </>
      ) : (

        <>

        {shareData?.map(u => (
          <pre key={u.user}>{u.name}: {u.score}</pre>
        ))}

        </>

      )}

    </div>
  )
}
