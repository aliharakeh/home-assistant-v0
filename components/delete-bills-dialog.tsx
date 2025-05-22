"use client"

import { useState } from "react"
import { format } from "date-fns"
import { AlertCircle, Calendar, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/contexts/language-context"
import { useHomes } from "@/contexts/home-context"
import { cn } from "@/lib/utils"

interface DeleteBillsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  homeId: string
  onSuccess?: (deletedCount: number) => void
}

export function DeleteBillsDialog({ open, onOpenChange, homeId, onSuccess }: DeleteBillsDialogProps) {
  const { t } = useLanguage()
  const { deleteBillsInDateRange } = useHomes()

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleDelete = async () => {
    if (!dateRange.from || !dateRange.to) {
      setError(t("selectDateRangeError"))
      return
    }

    try {
      setIsDeleting(true)
      setError(null)

      // Ensure end date is set to the end of the day for inclusive range
      const endDate = new Date(dateRange.to)
      endDate.setHours(23, 59, 59, 999)

      const deletedCount = await deleteBillsInDateRange(homeId, dateRange.from, endDate)

      if (deletedCount === 0) {
        setError(t("noBillsInRangeToDelete"))
      } else {
        onSuccess?.(deletedCount)
        resetAndClose()
      }
    } catch (err) {
      console.error("Failed to delete bills:", err)
      setError(t("deleteBillsError"))
    } finally {
      setIsDeleting(false)
      setShowConfirmation(false)
    }
  }

  const resetAndClose = () => {
    setDateRange({ from: undefined, to: undefined })
    setError(null)
    setShowConfirmation(false)
    onOpenChange(false)
  }

  const handleProceedToConfirmation = () => {
    if (!dateRange.from || !dateRange.to) {
      setError(t("selectDateRangeError"))
      return
    }
    setError(null)
    setShowConfirmation(true)
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !isDeleting && onOpenChange(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("deleteBillsInRange")}</DialogTitle>
          <DialogDescription>{t("deleteBillsInRangeDescription")}</DialogDescription>
        </DialogHeader>

        {!showConfirmation ? (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <div className="flex flex-col space-y-1.5">
                  <h3 className="text-sm font-medium leading-none">{t("selectDateRange")}</h3>
                  <p className="text-sm text-muted-foreground">{t("selectDateRangeForDeletion")}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-from"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange.from && "text-muted-foreground",
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateRange.from ? format(dateRange.from, "PPP") : <span>{t("startDate")}</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => setDateRange((prev) => ({ ...prev, from: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-to"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange.to && "text-muted-foreground",
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateRange.to ? format(dateRange.to, "PPP") : <span>{t("endDate")}</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) => setDateRange((prev) => ({ ...prev, to: date }))}
                        disabled={(date) => (dateRange.from ? date < dateRange.from : false)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={resetAndClose}>
                {t("cancel")}
              </Button>
              <Button
                variant="destructive"
                onClick={handleProceedToConfirmation}
                disabled={!dateRange.from || !dateRange.to}
              >
                {t("proceed")}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="py-4">
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{t("deleteBillsWarning")}</AlertDescription>
              </Alert>

              <div className="bg-muted p-4 rounded-md mb-4">
                <p className="font-medium mb-2">{t("selectedDateRange")}:</p>
                <p>
                  {dateRange.from && format(dateRange.from, "PPP")} - {dateRange.to && format(dateRange.to, "PPP")}
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmation(false)} disabled={isDeleting}>
                {t("back")}
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="gap-2">
                <Trash2 className="h-4 w-4" />
                {isDeleting ? t("deleting") : t("confirmDelete")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
