import * as React from 'react'
import { Copy, ExternalLink, FileText, Search, ListFilter } from 'lucide-react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getItemsFn } from '@/data/items'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import z from 'zod'
import { ItemStatus } from '@/generated/prisma/enums'
import { zodValidator } from '@tanstack/zod-adapter'

const itemsSearchSchema = z.object({
  q: z.string().default(''),
  status: z.union([z.literal('all'), z.nativeEnum(ItemStatus)]).default('all'),
})

export const Route = createFileRoute('/dashboard/items/')({
  component: RouteComponent,
  loader: () => ({ itemsPromise: getItemsFn() }),
  validateSearch: zodValidator(itemsSearchSchema),
  head: () => ({
    meta: [
      {
        title: 'Crawlytics | Saved Items',
      },
      {
        property: 'og:title',
        content: 'Saved Items',
      },
    ],
  }),
})

function RouteComponent() {
  const { itemsPromise } = Route.useLoaderData()
  const [data, setData] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let mounted = true
    setIsLoading(true)

    itemsPromise
      .then((res) => {
        if (!mounted) return
        setData(res ?? [])
      })
      .catch((err) => {
        console.error('Failed to load items', err)
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [itemsPromise])
  const { q, status } = Route.useSearch()
  const navigate = Route.useNavigate()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        !q ||
        (item.title?.toLowerCase() || '').includes(q.toLowerCase()) ||
        (item.url?.toLowerCase() || '').includes(q.toLowerCase()) ||
        (item.author?.toLowerCase() || '').includes(q.toLowerCase())

      const matchesStatus = status === 'all' || item.status === status

      return matchesSearch && matchesStatus
    })
  }, [data, q, status])

  const setStatusFilter = (newStatus: string) => {
    navigate({
      search: (old) => ({ ...old, status: newStatus as any }),
      replace: true,
    })
  }

  const setSearchQuery = (newQuery: string) => {
    navigate({
      search: (old) => ({ ...old, q: newQuery }),
      replace: true,
    })
  }

  return (
    <div className="flex-1 w-full flex flex-col min-h-screen bg-transparent p-4 lg:p-8 animate-in fade-in duration-1000">
      <div className="mx-auto w-full max-w-350">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
            Saved Items
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage and search your crawled knowledge assets.
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div
              onClick={() => setOpen(true)}
              className="relative group cursor-pointer flex-1 transition-all active:scale-[0.99]"
            >
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none z-10">
                <Search className="size-4 text-zinc-500 group-hover:text-white transition-colors" />
              </div>
              <div className="w-full bg-zinc-900/60 border border-white/10 group-hover:border-white/20 h-11 rounded-xl flex items-center px-11 text-[13px] text-zinc-400 group-hover:text-zinc-200 transition-all backdrop-blur-xl shadow-2xl">
                Quick search assets...
                <div className="ml-auto flex items-center gap-1.5">
                  <kbd className="h-5 px-1.5 flex items-center bg-white border border-white rounded text-[10px] font-black text-zinc-950 shadow-sm transition-all group-hover:scale-110">
                    ⌘
                  </kbd>
                  <kbd className="h-5 px-1.5 flex items-center bg-white border border-white rounded text-[10px] font-black text-zinc-950 shadow-sm transition-all group-hover:scale-110">
                    K
                  </kbd>
                </div>
              </div>
            </div>

            <Select value={status} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 h-11 cursor-pointer bg-zinc-900/60 border-white/10 rounded-xl text-[13px] font-medium text-zinc-400 focus:ring-0 focus:ring-offset-0 hover:border-white/20 transition-all backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <ListFilter className="size-3.5" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-white/10 text-zinc-400">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <CommandDialog
            open={open}
            onOpenChange={setOpen}
            className="max-w-3xl border-white/10 bg-zinc-950/95 backdrop-blur-3xl"
          >
            <CommandInput
              placeholder="Type to search..."
              value={q}
              onValueChange={setSearchQuery}
              className="h-14 text-base"
            />
            <CommandList className="max-h-[60vh] p-2">
              <CommandEmpty className="py-12 border-2 border-dashed border-white/5 rounded-2xl m-4">
                <div className="flex flex-col items-center gap-2">
                  <Search className="size-8 text-zinc-800" />
                  <p className="text-zinc-500 font-medium">No matches found.</p>
                </div>
              </CommandEmpty>
              <CommandGroup heading="Recent Assets">
                {data.slice(0, 8).map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => {
                      setSearchQuery(item.title || '')
                      setOpen(false)
                    }}
                    className="flex items-center gap-4 p-4 rounded-xl transition-all data-[selected=true]:bg-white/5 cursor-pointer"
                  >
                    <div className="size-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                      {item.ogImage ? (
                        <img
                          src={item.ogImage}
                          className="size-full object-cover"
                        />
                      ) : (
                        <FileText className="size-5 text-zinc-700" />
                      )}
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-base font-bold text-white truncate">
                        {item.title || item.url}
                      </span>
                      <span className="text-xs text-zinc-500 truncate font-mono">
                        {item.url}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </CommandDialog>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <ItemSkeleton key={i} />
                ))
              : filteredData.map((item) => (
                  <Card
                    key={item.id}
                    className="group flex flex-col overflow-hidden bg-zinc-900/30 border-white/5 hover:border-white/10 hover:bg-zinc-900/60 transition-all duration-500 shadow-2xl p-0 gap-0"
                  >
                    <Link
                      to={`/dashboard/items/$itemId`}
                      params={{
                        //using the params as typesafe its coming
                        itemId: item.id,
                      }}
                      className="block relative overflow-hidden aspect-video border-b border-white/5"
                    >
                      {item.ogImage ? (
                        <img
                          src={item.ogImage}
                          alt={item.title ?? 'Article Thumbnail'}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full bg-zinc-950 flex items-center justify-center">
                          <FileText className="size-12 text-zinc-900" />
                        </div>
                      )}

                      <div className="absolute top-4 left-4">
                        <div
                          className={cn(
                            'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl border',
                            item.status === 'COMPLETED'
                              ? 'bg-emerald-500 text-zinc-950 border-emerald-400'
                              : item.status === 'PROCESSING' ||
                                  item.status === 'PENDING'
                                ? 'bg-yellow-400 text-zinc-950 border-yellow-300 animate-pulse'
                                : 'bg-rose-500 text-zinc-950 border-rose-500',
                          )}
                        >
                          {item.status}
                        </div>
                      </div>
                    </Link>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-6">
                        <h3 className="text-xl font-bold leading-tight group-hover:text-orange-400 transition-colors line-clamp-2">
                          {item.title || item.url}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-9 shrink-0 rounded-xl bg-zinc-950/50 border border-white/5 text-zinc-500 hover:text-white hover:border-white/20 transition-all"
                          onClick={(e) => {
                            e.preventDefault()
                            navigator.clipboard.writeText(item.url)
                            toast.success('URL copied')
                          }}
                        >
                          <Copy className="size-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="px-6 pb-6 mt-auto">
                      <div className="flex items-center justify-between pt-5 border-t border-white/5">
                        <div className="flex items-center gap-2 text-xs text-zinc-400 font-bold truncate">
                          {item.author && (
                            <span className="truncate max-w-30">
                              {item.author}
                            </span>
                          )}
                          {item.author && item.publishedAt && (
                            <span className="text-zinc-800">•</span>
                          )}
                          {item.publishedAt && (
                            <span>
                              {new Date(item.publishedAt).toLocaleDateString(
                                undefined,
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                },
                              )}
                            </span>
                          )}
                        </div>

                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-black tracking-widest text-zinc-500 hover:text-white transition-all flex items-center gap-1.5 group/link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          SOURCE
                          <ExternalLink className="size-3.5 transition-transform group-hover/link:translate-x-0.5" />
                        </a>
                      </div>
                    </div>
                  </Card>
                ))}
          </div>

          {!isLoading && filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 animate-in slide-in-from-bottom-5 duration-700">
              <div className="size-20 rounded-4xl bg-zinc-900 border border-white/5 flex items-center justify-center mb-6 shadow-2xl">
                <Search className="size-8 text-zinc-800" />
              </div>
              <p className="text-lg font-black text-white">No items found</p>
              <p className="text-zinc-500 text-sm mt-1 font-medium italic">
                Try adjusting your filters or search query.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ItemSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden bg-zinc-900/30 border-white/5 shadow-2xl p-0 gap-0">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-6">
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="size-9 rounded-xl shrink-0" />
        </div>
      </div>
      <div className="px-6 pb-6 mt-auto">
        <div className="flex items-center justify-between pt-5 border-t border-white/5">
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="h-3 w-12 rounded-full" />
        </div>
      </div>
    </Card>
  )
}
