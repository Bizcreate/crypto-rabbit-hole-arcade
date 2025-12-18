"use client"

import { useArcade } from "@/components/providers"
import { X, CheckCircle2, AlertCircle, Loader2 } from "@/components/icons"
import { Button } from "./button"

export function Toaster() {
  const { txns, removeTxn } = useArcade()
  const recentTxns = txns.slice(0, 3)

  if (recentTxns.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80">
      {recentTxns.map((txn) => (
        <div
          key={txn.id}
          className="bg-card/40 backdrop-blur-xl border border-border/50 p-4 rounded-xl animate-in slide-in-from-right"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              {txn.status === "confirmed" && <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />}
              {txn.status === "error" && <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />}
              {["prepare", "sign", "pending"].includes(txn.status) && (
                <Loader2 className="w-5 h-5 text-muted-foreground mt-0.5 animate-spin" />
              )}

              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{txn.title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {txn.status === "prepare" && "Preparing transaction..."}
                  {txn.status === "sign" && "Waiting for signature..."}
                  {txn.status === "pending" && "Transaction pending..."}
                  {txn.status === "confirmed" && "Transaction confirmed!"}
                  {txn.status === "error" && (txn.error || "Transaction failed")}
                </div>
                {txn.hash && (
                  <div className="text-xs text-primary mt-1 truncate">
                    {txn.hash.substring(0, 10)}...{txn.hash.substring(txn.hash.length - 8)}
                  </div>
                )}
              </div>
            </div>

            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => removeTxn(txn.id)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
