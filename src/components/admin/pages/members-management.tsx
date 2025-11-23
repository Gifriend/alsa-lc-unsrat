"use client"

import { useState } from "react"

interface MemberStats {
  activeMembers: number
  alumni: number
}

export default function MembersManagement() {
  const [stats, setStats] = useState<MemberStats>({
    activeMembers: 0,
    alumni: 0,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdate = async (key: keyof MemberStats, value: number) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/member-stats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      })

      if (response.ok) {
        setStats((prev) => ({ ...prev, [key]: value }))
      }
    } catch (error) {
      console.error("Failed to update stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2 className="mb-6">Manage Members & Alumni</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <label className="block text-sm font-bold mb-2">Active Members</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={stats.activeMembers}
              onChange={(e) => setStats({ ...stats, activeMembers: Number.parseInt(e.target.value) || 0 })}
              className="flex-1 px-4 py-2 border border-neutral-light rounded"
            />
            <button
              onClick={() => handleUpdate("activeMembers", stats.activeMembers)}
              disabled={isLoading}
              className="btn-primary disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <label className="block text-sm font-bold mb-2">Alumni</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={stats.alumni}
              onChange={(e) => setStats({ ...stats, alumni: Number.parseInt(e.target.value) || 0 })}
              className="flex-1 px-4 py-2 border border-neutral-light rounded"
            />
            <button
              onClick={() => handleUpdate("alumni", stats.alumni)}
              disabled={isLoading}
              className="btn-primary disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded">
        <p className="text-sm text-neutral-medium">
          These numbers are displayed on the Members page and the homepage statistics section.
        </p>
      </div>
    </div>
  )
}
