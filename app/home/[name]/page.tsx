"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Edit,
  Home,
  MapPin,
  User,
  Zap,
  DollarSign,
  Users,
  Trash2,
  Calendar,
  AlertCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

import { formatShareholderAmount, formatRent, type ElectricityBill } from "@/lib/data"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { OfflineBanner } from "@/components/offline-banner"
import { ElectricityBillsDashboard } from "@/components/electricity-bills-dashboard"
import { useHomes } from "@/contexts/home-context"

export default function HomeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const homeName = decodeURIComponent(params.name as string)
  const { t, dir } = useLanguage()
  const { getHomeByName, updateHome, deleteHome, addBillToHome, deleteBillFromHome, loading, error } = useHomes()

  const [homeData, setHomeData] = useState<ReturnType<typeof getHomeByName>>(undefined)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!loading) {
      setHomeData(getHomeByName(homeName))
    }
  }, [loading, homeName, getHomeByName])

  const handleAddBill = async (bill: Omit<ElectricityBill, "id">) => {
    if (!homeData) return

    try {
      await addBillToHome(homeData.name, bill)
      // The home context will update the state, so we don't need to do it here
    } catch (err) {
      console.error("Failed to add bill:", err)
    }
  }

  const handleDeleteHome = async () => {
    if (!homeData) return

    try {
      setIsDeleting(true)
      await deleteHome(homeData.name)
      router.push("/")
    } catch (err) {
      console.error("Failed to delete home:", err)
      setIsDeleting(false)
    }
  }

  const handleDeleteBill = async (billId: string) => {
    if (!homeData) return

    try {
      await deleteBillFromHome(homeData.name, billId)
      // The home context will update the state, so we don't need to do it here
    } catch (err) {
      console.error("Failed to delete bill:", err)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-md mx-auto px-4 py-6" dir={dir}>
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-1 text-sm">
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Link>
          <LanguageSwitcher />
        </div>
        <Skeleton className="h-[500px] w-full rounded-lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-md mx-auto px-4 py-6" dir={dir}>
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button className="mt-4" asChild>
          <Link href="/">{t("goBack")}</Link>
        </Button>
      </div>
    )
  }

  if (!homeData) {
    return (
      <div className="container max-w-md mx-auto px-4 py-6" dir={dir}>
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>
        <Alert>
          <AlertDescription>{t("propertyNotFound")}</AlertDescription>
        </Alert>
        <Button className="mt-4" asChild>
          <Link href="/">{t("goBack")}</Link>
        </Button>
        <OfflineBanner />
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-6" dir={dir}>
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="flex items-center gap-1 text-sm">
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </Link>
        <LanguageSwitcher />
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="details">{t("details")}</TabsTrigger>
          <TabsTrigger value="bills">{t("bills")}</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  {homeData.name}
                </CardTitle>
                <Link href={`/add-home?edit=true&name=${encodeURIComponent(homeData.name)}`}>
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{t("address")}</p>
                  <p className="text-sm text-muted-foreground">{homeData.address}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{t("tenant")}</p>
                  <p className="text-sm text-muted-foreground">{homeData.tenant}</p>
                  <div className="mt-1 flex items-center gap-1">
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                      {t("callTenant")}
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                      {t("message")}
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{t("electricityCode")}</p>
                  <p className="text-sm text-muted-foreground">{homeData.electricityCode}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="flex items-center justify-between w-full">
                  <div>
                    <p className="font-medium">{t("rent")}</p>
                    <p className="text-sm text-muted-foreground">{formatRent(homeData.rent, homeData.rentDuration)}</p>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {t(homeData.rentDuration === "monthly" ? "monthly" : "yearly")}
                  </Badge>
                </div>
              </div>

              {homeData.shareholders.length > 0 && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="w-full">
                      <p className="font-medium">{t("shareholders")}</p>
                      <div className="mt-2 space-y-2">
                        {homeData.shareholders.map((shareholder, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                            <div>
                              <p className="text-sm font-medium">{shareholder.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {t("coOwner")} • {formatShareholderAmount(shareholder)}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                              {t("contact")}
                            </Button>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {t("peopleShareOwnership", { count: homeData.shareholders.length })}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full gap-2">
                    <Trash2 className="h-4 w-4" />
                    {t("deleteProperty")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("areYouSure")}</DialogTitle>
                    <DialogDescription>{t("deleteConfirmation", { name: homeData.name })}</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {}}>
                      {t("cancel")}
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteHome} disabled={isDeleting}>
                      {isDeleting ? t("deleting") : t("delete")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="bills">
          <ElectricityBillsDashboard
            homeId={homeData.name}
            bills={homeData.electricityBills}
            onAddBill={handleAddBill}
            onDeleteBill={(billId) => handleDeleteBill(billId)}
          />
        </TabsContent>
      </Tabs>

      <OfflineBanner />
    </div>
  )
}
