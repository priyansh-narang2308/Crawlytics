import { Button, buttonVariants } from '@/components/ui/button'
import { getItemById, saveSummaryFn } from '@/data/items'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  ArrowLeft,
  Calendar,
  User,
  Copy,
  Globe,
  Clock,
  AlertCircle,
  Tag,
  ChevronDown,
  Sparkles,
  FileText,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import * as React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { MessageResponse } from '@/components/ai-elements/message'

import { useCompletion } from '@ai-sdk/react'

export const Route = createFileRoute('/dashboard/items/$itemId')({
  component: RouteComponent,
  loader: ({ params }) => ({
    itemPromise: getItemById({ data: { id: params.itemId } }),
  }),
  head: async ({ loaderData }) => {
    const item = await loaderData?.itemPromise
    return {
      meta: [
        {
          title: item?.title || 'Default Title',
        },
        {
          property: 'og:image',
          content: item?.ogImage ?? 'Og image',
        },
      ],
    }
  },
})

function RouteComponent() {
  const { itemPromise } = Route.useLoaderData()
  const [item, setItem] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isContentOpen, setIsContentOpen] = React.useState(false)

  const router = useRouter()

  const {
    completion,
    complete,
    isLoading: isAIProgress,
  } = useCompletion({
    api: '/api/ai/summary',
    initialCompletion: item?.summary || undefined,
    streamProtocol: 'text',
    body: {
      itemId: item?.id,
      prompt: item?.content,
    },
    onFinish: async (_, completion) => {
      if (item?.id) {
        const updatedItem = await saveSummaryFn({
          data: { id: item.id, summary: completion },
        })
        setItem(updatedItem)
        toast.success('Summary & Tags generated!')
        router.invalidate()
      }
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  React.useEffect(() => {
    let mounted = true
    setIsLoading(true)

    itemPromise
      .then((res) => {
        if (!mounted) return
        setItem(res)
      })
      .catch((err) => {
        console.error('Failed to load item', err)
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [itemPromise])

  if (isLoading) {
    return <ItemDetailSkeleton />
  }

  if (!item) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center space-y-4">
        <AlertCircle className="h-12 w-12 text-zinc-500" />
        <h2 className="text-2xl font-bold text-white">Item not found</h2>
        <Link
          to="/dashboard/items"
          className={buttonVariants({ variant: 'outline' })}
        >
          Return to items
        </Link>
      </div>
    )
  }

  const publishedDate = item.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    : null

  return (
    <div className="flex-1 w-full h-[calc(100vh-4.1rem)] bg-transparent overflow-y-auto custom-scrollbar p-4 lg:p-8 animate-in fade-in duration-500">
      <div className="mx-auto w-full max-w-7xl flex flex-col space-y-8">
        <div className="flex items-center justify-between shrink-0 sticky top-0 z-30 py-2 bg-[#09090b]/80 backdrop-blur-2xl -mx-4 px-4 rounded-b-2xl">
          <Link
            to="/dashboard/items"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'group -ml-2 text-zinc-400 hover:text-white transition-colors',
            )}
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Library
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(item.url)
                toast.success('Link copied')
              }}
              className={cn(
                buttonVariants({ variant: 'outline', size: 'icon' }),
                'size-8 rounded-lg border-white/5 cursor-pointer bg-zinc-900/50 text-zinc-400 hover:text-white hover:border-white/20 transition-all',
              )}
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'h-8 rounded-lg border-white/5 cursor-pointer bg-zinc-900/50 text-zinc-400 hover:text-white hover:border-white/20 transition-all gap-2 text-xs',
              )}
            >
              <Globe className="h-3.5 w-3.5" />
              Visit Source
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 flex flex-col space-y-10 min-w-0">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-md text-[12px] font-bold  border',
                    item.status === 'COMPLETED'
                      ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
                      : item.status === 'PROCESSING' ||
                        item.status === 'PENDING'
                        ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'
                        : 'bg-rose-500/10 text-rose-500 border-rose-500/20',
                  )}
                >
                  {item.status}
                </div>
                {publishedDate && (
                  <div className="flex items-center gap-1.5 text-[12px] text-zinc-500 font-bold">
                    <Calendar className="h-3 w-3" />
                    {publishedDate}
                  </div>
                )}
              </div>

              <h1 className="text-4xl lg:text-4xl font-black tracking-tight text-white leading-[1.1] break-all">
                {item.title || item.url}
              </h1>

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {item.tags.map((tag: string) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full 
      bg-white/10 backdrop-blur-md border border-white/10 
      text-[12px] font-bold text-white shadow-md 
      transition-all duration-200 hover:scale-105 hover:bg-white/20"
                    >
                      <Tag className="h-3 w-3 text-orange-400" />
                      <span className="tracking-tighter uppercase">{tag}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <section className="space-y-6 p-8 rounded-4xl bg-emerald-500/5 border border-emerald-500/10 relative overflow-hidden group">
              <div className="flex items-center justify-between gap-4 text-emerald-500 relative">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-6" />
                  <h2 className="text-lg font-semibold">Executive Summary</h2>
                </div>
                {!item.summary && !completion && !isAIProgress && (
                  <Button
                    onClick={() => complete('')}
                    variant="outline"
                    className="rounded-2xl border-orange-500/20 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 hover:text-orange-300 transition-all font-semibold text-[15px] px-6 h-11 shadow-2xl shadow-emerald-500/20 cursor-pointer group"
                  >
                    <Sparkles className="size-4 mr-2 transition-transform group-hover:scale-125 group-hover:rotate-12" />
                    Generate Summary
                  </Button>
                )}
              </div>
              <div className="text-zinc-200 leading-relaxed text-lg lg:text-xl font-medium selection:bg-emerald-500/30 break-all relative">
                {completion || item.summary ? (
                  <MessageResponse>
                    {completion || item.summary}
                  </MessageResponse>
                ) : (
                  <div className="flex items-center gap-3">
                    {isAIProgress ? (
                      <div className="flex items-center gap-2.5">
                        <Loader2 className="h-5 w-5 text-orange-400 animate-spin" />
                        <p className="text-zinc-300 text-lg font-medium animate-pulse">
                          Analysis in progress...
                        </p>
                      </div>
                    ) : (
                      <p className="text-zinc-400 text-lg italic">
                        No summary generated for this asset yet.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </section>

            <div className="space-y-6">
              <Collapsible
                open={isContentOpen}
                onOpenChange={setIsContentOpen}
                className="space-y-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-zinc-500 min-w-0">
                    <FileText className="size-5 shrink-0" />
                    <h2 className="text-lg font-semibold  truncate">
                      Extracted Data
                    </h2>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 gap-2 text-sm font-bold text-zinc-400 hover:text-white transition-all cursor-pointer bg-white/5 hover:bg-white/10 rounded-xl px-4"
                    >
                      {isContentOpen ? 'Hide Content' : 'Show Content'}
                      <ChevronDown
                        className={cn(
                          'size-3.5 transition-transform duration-300',
                          isContentOpen ? 'rotate-180' : 'rotate-0',
                        )}
                      />
                    </Button>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent className="animate-in slide-in-from-top-4 duration-500 overflow-hidden">
                  <div className="p-8 rounded-4xl bg-zinc-900/40 border border-white/5">
                    <div className="text-zinc-400 leading-relaxed text-base whitespace-pre-wrap font-medium selection:bg-orange-500/30 break-all">
                      <MessageResponse>
                        {item.content || 'Data stream pending extraction...'}
                      </MessageResponse>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>

          <div className="lg:col-span-4 sticky top-24 space-y-6 h-fit shrink-0 self-start">
            {item.ogImage && (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/5 bg-zinc-950 shadow-2xl shrink-0 group">
                <img
                  className="h-full w-full object-cover"
                  src={item.ogImage}
                  alt={item.title ?? 'Display Image'}
                />
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950/40 to-transparent" />
              </div>
            )}

            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 space-y-6 backdrop-blur-xl">
              <h3 className="text-[14px] font-semibold text-zinc-500">
                Knowledge Asset Details
              </h3>
              <div className="space-y-5">
                <div className="space-y-2">
                  <span className="text-[12px] text-zinc-500 font-semibold  block">
                    Source Entity / Author
                  </span>
                  <div className="flex items-center gap-2.5">
                    <div className="size-6 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5 shadow-inner">
                      <User className="h-3 w-3 text-zinc-400" />
                    </div>
                    <span className="text-sm font-bold text-zinc-200">
                      {item.author || 'Anonymous Source'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 text-zinc-400">
                  <span className="text-[12px] text-zinc-500 font-semibold block">
                    Created On
                  </span>
                  <div className="flex items-center gap-2.5 text-sm font-bold">
                    <Clock className="h-4 w-4 text-zinc-600" />
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ItemDetailSkeleton() {
  return (
    <div className="flex-1 w-full flex flex-col h-screen p-4 lg:p-8">
      <div className="mx-auto w-full max-w-7xl h-full space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-20" />
          <div className="flex gap-2">
            <Skeleton className="size-8 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-8 h-full">
          <div className="col-span-8 space-y-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-6 w-64" />
            <div className="h-100 w-full bg-zinc-900/40 rounded-3xl border border-white/5 p-8">
              <div className="space-y-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
              <div className="mt-12 space-y-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-full" />
              </div>
            </div>
          </div>
          <div className="col-span-4 space-y-6">
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
