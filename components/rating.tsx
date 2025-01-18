'use server'

import { BrightDataResponse } from "@/lib/brightdata"

export function Rating(props: { linkedinUrl: string }) {
  async function getRating() {
    'use server'

    // GitHub stuff

    // Resume stuff

    // LinkedIn stuff
    const key = process.env.BRIGHTDATA_KEY
    const data: { snapshot_id: string } = await (await fetch("https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l1viktl72bvl7bjuj0&include_errors=true", {
      body: JSON.stringify([
        {
          url: props.linkedinUrl
        }
      ]),
      method: "POST",
      headers: {
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })).json()

    for (let i = 0; i < 100; i++) {
      const res: BrightDataResponse | { status: 'running' } = await (await fetch(`https://api.brightdata.com/datasets/v3/snapshot/${data.snapshot_id}?format=json`, {
        headers: {
          Authorization: 'Bearer ' + key,
        },
        credentials: 'include'
      })).json()

      if ('status' in res) {
        await Promise.resolve(r => setTimeout(r, 3000))
        continue
      }

      const profile = res[0]

      console.log(profile)

      // Send to gpt
    }
  }

  return <div>Nothing here yet!</div>
}
