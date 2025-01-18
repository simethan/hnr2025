import { useEffect, useState } from "react"

export function Rating(props: { linkedinUrl: string, username: string }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    getData()
  }, [])

  async function getData() {
    const data = await fetch('/api/rating', {
      method: 'POST',
      body: JSON.stringify({ github: props.username, linkedin: props.linkedinUrl})
    })  

    const r = await data.json()

    setData(r)
  }

  // Fetch data from GitHub and LinkedIn
  // const githubLanguages = await fetchGithubLanguages(props.username)
  // const linkedInProfile = await fetchLinkedInProfile(props.linkedinUrl)

  return (
    <div>
      {/* <h2>GitHub Languages</h2>
      <pre>{JSON.stringify(githubLanguages, null, 2)}</pre>

      <h2>LinkedIn Profile</h2>
      <pre>{JSON.stringify(linkedInProfile, null, 2)}</pre> */}
      {/* {JSON.stringify(props)} */}

      {JSON.stringify(data)}
    </div>
  )
}
