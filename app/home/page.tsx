"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CookedMeter } from "@/app/components/CookedMeter";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [cookedScore, setCookedScore] = useState(0);
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

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
    } else if (data) {
      setCookedScore(data.cooked_score || 0);
      setName(data.name || "");
    }
  };

  const getCookedDescription = (score: number) => {
    if (score < 2)
      return "You're practically raw! Time to fire up that coding grill!";
    if (score < 4) return "You're a rare find in the CS world. Keep coding!";
    if (score < 6)
      return "You're cooking with gas now! Medium rare and ready for more challenges.";
    if (score < 8) return "Well done! You're sizzling with CS skills.";
    return "You're so well done, you're practically burnt! Impressive CS skills!";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 background-home steak-color">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-5xl font-bold mb-8">Welcome, {name}!</h1>
        <CookedMeter score={cookedScore} />
        <p className="mt-4 text-xl">{getCookedDescription(cookedScore)}</p>
        <div className="mt-8">
          <Button
            className="steak-button"
            onClick={() => router.push("/profile")}
          >
            Update Profile
          </Button>
        </div>
      </main>
    </div>
  );
}
