import { BrightDataResponse } from "@/lib/brightdata"
import crawler from "crawler-request";

export async function POST(request: Request) {
    const githubFetch: typeof globalThis.fetch = (url, ...opts) => fetch(url, {
        headers: {
          'User-Agent': "github.com/simethan/hnr2025",
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        },
        credentials: 'include',
        ...opts
      })
      
      async function fetchGithubLanguages(username: string) {
        try {
          const response = await githubFetch(`https://api.github.com/users/${username}/repos`)
          if (!response.ok) {
            console.error('Failed to fetch repos:', response)
            throw new Error('Failed to fetch repos')
          }
          const repos = await response.json()
    
          let languageCounts: Record<string, number> = {}
    
          for (const repo of repos) {
            const langResponse = await githubFetch(repo.languages_url)
            if (!langResponse.ok) {
              throw new Error('Failed to fetch languages')
            }
            const repoLanguages = await langResponse.json()
    
            for (const [lang, bytes] of Object.entries(repoLanguages)) {
              languageCounts[lang] = (languageCounts[lang] || 0) + (bytes as number)
            }
          }
    
          console.log(languageCounts)
          return languageCounts
        } catch (error) {
          console.error('Error fetching GitHub languages:', error)
          return {}
        }
      }
    
      async function fetchLinkedInProfile(linkedinUrl: string) {
        const key = process.env.BRIGHTDATA_KEY
        const triggerResponse = await fetch(
          "https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l1viktl72bvl7bjuj0&include_errors=true",
          {
            method: "POST",
            body: JSON.stringify([{ url: linkedinUrl }]),
            headers: {
              Authorization: `Bearer ${key}`,
              'Content-Type': 'application/json',
            },
          }
        )
    
        const { snapshot_id }: { snapshot_id: string } = await triggerResponse.json()
    
        for (let i = 0; i < 100; i++) {
          const snapshotResponse = await fetch(
            `https://api.brightdata.com/datasets/v3/snapshot/${snapshot_id}?format=json`,
            {
              headers: { Authorization: `Bearer ${key}` },
            }
          )
          const result: BrightDataResponse | { status: 'running' } = await snapshotResponse.json()
    
          if ('status' in result) {
            await new Promise((resolve) => setTimeout(resolve, 3000))
            continue
          }
    
          const profile = result[0]
          console.log(profile)
          return profile
        }
    
        throw new Error('Failed to fetch LinkedIn data within the time limit')
      }

      async function pdfToText(pdfUrl: string) {
        try {
            const response = await crawler(pdfUrl);
            console.log(response.text || "No response");
            return response.text;
        } catch (error) {
            console.error("Error fetching or parsing PDF:", error);
            return null;
        }
    }

      const content = await request.json()

      const [githubData, linkedinData, pdfText] = await Promise.all([
        fetchGithubLanguages(content.github),
        fetchLinkedInProfile(content.linkedin),
        content.pdfUrl ? pdfToText(content.pdfUrl) : null
    ]);
      
    //   return Response.json({
    //     github: data[0],
    //     linkedin: {
    //         followers: data[1].followers,
    //         work_experience: data[1].experience,
    //         education: data[1].education,
    //         certificates: data[1].certifications,    
    //         awards: data[1].honors_and_awards
    //     }
    //   })

    const linkedinDataProcessed = {
      followers: linkedinData.followers,
      work_experience: linkedinData.experience?.map((job: any) => ({
          company: job.company,
          title: job.title,
          duration: job.duration,
          description: job.description,
      })),
      education: linkedinData.education?.map((edu: any) => ({
          title: edu.title,
          degree: edu.degree,
          description: edu.description,
          duration: edu.duration,
      })),
      certificates: linkedinData.certifications?.map((cert: any) => ({
          name: cert.name,
          issuer: cert.issuer,
          issued_date: cert.issued_date,
      })),
      awards: linkedinData.honors_and_awards?.map((award: any) => ({
          title: award.title,
          description: award.description,
          date: award.date,
      })),
  };
      
      // Return the cleaned-up response
      return Response.json({
        github: githubData,
        linkedin: linkedinDataProcessed,
        pdfContent: pdfText
    });
}