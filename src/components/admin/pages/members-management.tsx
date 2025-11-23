"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface MemberStats {
  activeMembers: number
  alumni: number
  totalMembers: number
  membersByYear?: Record<number, number>
}

export default function MembersManagement() {
  const [stats, setStats] = useState<MemberStats>({
    activeMembers: 0,
    alumni: 0,
    totalMembers: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/member-stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
      setMessage("Gagal memuat data statistik")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const token = localStorage.getItem("authToken")

      const response = await fetch("/api/member-stats", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          activeMembers: stats.activeMembers,
          alumni: stats.alumni,
        }),
      })

      if (response.ok) {
        setMessage("Data berhasil disimpan")
        await fetchStats()
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage("Gagal menyimpan data")
      }
    } catch (error) {
      console.error("Failed to save stats:", error)
      setMessage("Terjadi kesalahan saat menyimpan")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Memuat data...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-glaucous-600">Kelola Anggota & Alumni</h2>
        <p className="text-sm text-glaucous-400 mt-1">Update statistik anggota dan alumni ALSA LC Unsrat</p>
      </div>

      {message && (
        <div className="p-4 bg-powder-blue-100 border border-powder-blue-300 rounded text-sm text-glaucous-600">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-glaucous-600">Anggota Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-glaucous-700">{stats.activeMembers}</div>
            <p className="text-xs text-glaucous-400 mt-2">Anggota aktif saat ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-glaucous-600">Alumni</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-glaucous-700">{stats.alumni}</div>
            <p className="text-xs text-glaucous-400 mt-2">Total alumni</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-glaucous-600">Total Anggota</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-glaucous-700">{stats.totalMembers}</div>
            <p className="text-xs text-glaucous-400 mt-2">Total keseluruhan</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Statistik</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="active-members" className="text-glaucous-600">
              Anggota Aktif
            </Label>
            <Input
              id="active-members"
              type="number"
              value={stats.activeMembers}
              onChange={(e) =>
                setStats((prev) => ({
                  ...prev,
                  activeMembers: Number.parseInt(e.target.value) || 0,
                }))
              }
              className="mt-2 border-powder-blue-300"
            />
          </div>

          <div>
            <Label htmlFor="alumni" className="text-glaucous-600">
              Alumni
            </Label>
            <Input
              id="alumni"
              type="number"
              value={stats.alumni}
              onChange={(e) =>
                setStats((prev) => ({
                  ...prev,
                  alumni: Number.parseInt(e.target.value) || 0,
                }))
              }
              className="mt-2 border-powder-blue-300"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-glaucous-600 hover:bg-glaucous-700 text-white"
          >
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-alice-blue-50 border-alice-blue-200">
        <CardHeader>
          <CardTitle className="text-sm text-glaucous-600">Informasi</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-glaucous-500">
          Statistik ini ditampilkan di halaman homepage dan halaman Anggota. Perubahan akan langsung terlihat di
          website.
        </CardContent>
      </Card>
    </div>
  )
}
