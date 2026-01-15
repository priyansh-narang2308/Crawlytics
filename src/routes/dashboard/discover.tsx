import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { searchSchema } from '@/schemas/import'
import { useForm } from '@tanstack/react-form'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Progress } from '@/components/ui/progress'
import {
  Loader2,
  Search,
  Lightbulb,
  Compass,
  ExternalLink,
  ArrowRight,
} from 'lucide-react'
import { useState, useTransition } from 'react'
import { cn } from '@/lib/utils'
import { searchWebFn, bulkScrapeUrlsFn } from '@/data/items'
import { SearchResultWeb } from '@mendable/firecrawl-js'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/discover')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isPending, startTransition] = useTransition()
  const [bulkIsPending, startBulkTransition] = useTransition()
  const navigate = useNavigate()

  const [searchResults, setSearchResults] = useState<Array<SearchResultWeb>>([])
  const [selectedLinks, setSelectedLinks] = useState<Set<string>>(new Set())
  const [importProgress, setImportProgress] = useState<{
    current: number
    total: number
    url: string
  } | null>(null)

  const toggleSelectLink = (url: string) => {
    const newSelected = new Set(selectedLinks)
    if (newSelected.has(url)) {
      newSelected.delete(url)
    } else {
      newSelected.add(url)
    }
    setSelectedLinks(newSelected)
  }

  const handleBulkImport = () => {
    startBulkTransition(async () => {
      const urlsToScrape = Array.from(selectedLinks)
      if (urlsToScrape.length === 0) {
        toast.error('Please select at least one URL')
        return
      }

      const response = (await bulkScrapeUrlsFn({
        data: { urls: urlsToScrape },
      })) as unknown as Response

      if (!response.body) return

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter((l) => l.trim())

        for (const line of lines) {
          try {
            const data = JSON.parse(line)
            if (data.status === 'done') {
              toast.success(`Successfully imported ${urlsToScrape.length} assets`)
              setSelectedLinks(new Set())
              setImportProgress(null)
              navigate({ to: '/dashboard/items' })
              return
            }
            if (
              data.status === 'processing' ||
              data.status === 'completed' ||
              data.status === 'failed'
            ) {
              setImportProgress({
                current: data.current,
                total: data.total,
                url: data.url,
              })
            }
          } catch (e) {
            console.error('Error parsing stream:', e)
          }
        }
      }
    })
  }

  const toggleSelectAll = () => {
    if (selectedLinks.size === searchResults.length) {
      setSelectedLinks(new Set())
    } else {
      setSelectedLinks(new Set(searchResults.map((l) => l.url)))
    }
  }

  const form = useForm({
    defaultValues: {
      query: '',
    },
    validators: {
      onSubmit: searchSchema,
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        const result = await searchWebFn({
          data: {
            query: value.query,
          },
        })

        setSearchResults(result)
      })
    },
  })

  return (
    <div className="flex-1 w-full flex flex-col min-h-screen bg-transparent p-4 lg:p-8 animate-in fade-in duration-500">
      <div className="mx-auto w-full max-w-350">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
            Discover Content
          </h1>
          <p className="text-muted-foreground text-lg">
            Search the web and discover new knowledge assets to import.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-sm shadow-2xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Compass className="size-24 -rotate-12" />
              </div>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <Compass className="size-5" />
                  </div>
                  <CardTitle className="text-xl">Topic Search</CardTitle>
                </div>
                <CardDescription className="text-zinc-400">
                  Enter a topic or niche to find the most relevant and
                  high-quality content across the web.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                  }}
                  className="space-y-6"
                >
                  <FieldGroup>
                    <form.Field
                      name="query"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid} className="w-full">
                            <FieldLabel
                              htmlFor={field.name}
                              className="flex items-center gap-2 mb-2 text-zinc-300"
                            >
                              Search Query
                            </FieldLabel>
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                              <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                aria-invalid={isInvalid}
                                placeholder="e.g. Trends in Generative AI 2024"
                                autoComplete="off"
                                className="pl-10 h-12 bg-zinc-950/50 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all"
                              />
                            </div>
                            {isInvalid && (
                              <FieldError
                                errors={field.state.meta.errors}
                                className="mt-2 text-red-400 text-xs font-medium"
                              />
                            )}
                          </Field>
                        )
                      }}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isPending}
                      className={cn(
                        'w-full h-12 text-base font-semibold transition-all duration-300 relative overflow-hidden group/btn',
                        isPending
                          ? 'opacity-70'
                          : 'cursor-pointer active:scale-[0.98]',
                      )}
                    >
                      <div className="relative z-10 flex items-center justify-center gap-2">
                        {isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Searching Web...</span>
                          </>
                        ) : (
                          <>
                            <Search className="size-4 text-zinc-400  transition-colors" />
                            <span>Discover Assets</span>
                          </>
                        )}
                      </div>
                    </Button>
                  </FieldGroup>
                </form>

                <ScrollArea className="h-105 rounded-2xl border border-white/5 bg-zinc-950/20 backdrop-blur-md overflow-hidden relative shadow-inner">
                  {searchResults.length > 0 && (
                    <div className="sticky top-0 z-20 px-4 py-3 bg-zinc-900/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] font-medium text-zinc-400">
                          Found {searchResults.length} knowledge assets
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleSelectAll}
                        className="h-7 px-3 text-[11px] font-medium text-zinc-500 hover:text-white hover:bg-white/5 cursor-pointer"
                      >
                        {selectedLinks.size === searchResults.length
                          ? 'Unselect all'
                          : 'Select all'}
                      </Button>
                    </div>
                  )}
                  <div className="p-3 grid gap-2.5">
                    {searchResults.map((link) => {
                      const isSelected = selectedLinks.has(link.url)
                      return (
                        <Label
                          key={link.url}
                          className={cn(
                            'group relative flex cursor-pointer items-start gap-4 rounded-xl p-4 border transition-all duration-300',
                            isSelected
                              ? 'bg-purple-500/5 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.05)]'
                              : 'bg-zinc-900/40 border-white/3 hover:border-white/10 hover:bg-zinc-900/60',
                          )}
                        >
                          <div className="mt-0.5 relative flex items-center justify-center">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleSelectLink(link.url)}
                              className={cn(
                                'size-5 rounded-md transition-all duration-300 border-zinc-700',
                                isSelected &&
                                'bg-purple-500 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]',
                              )}
                            />
                          </div>

                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center justify-between gap-4">
                              <p
                                className={cn(
                                  'text-sm font-semibold truncate transition-colors',
                                  isSelected
                                    ? 'text-white'
                                    : 'text-zinc-200 group-hover:text-white',
                                )}
                              >
                                {link.title ?? 'Untitled Page'}
                              </p>
                              <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1 px-1.5 rounded-md bg-zinc-950/50 text-zinc-500 hover:text-white border border-white/5 text-[10px] font-mono flex items-center gap-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Visit
                                  <ExternalLink className="size-2.5" />
                                </a>
                              </div>
                            </div>

                            {link.description && (
                              <p className="text-[11px] text-zinc-500 line-clamp-1 leading-relaxed">
                                {link.description}
                              </p>
                            )}

                            <div className="flex items-center gap-2">
                              <div className="px-1.5 py-0.5 rounded bg-zinc-950/50 border border-white/5">
                                <p className="text-[9px] font-mono text-zinc-400 group-hover:text-zinc-300 transition-colors truncate max-w-75 sm:max-w-none">
                                  {link.url}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Label>
                      )
                    })}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-zinc-950 to-transparent pointer-events-none" />
                </ScrollArea>

                {searchResults.length > 0 && (
                  <div className="pt-4 mt-4 border-t border-white/5 space-y-4">
                    {bulkIsPending && importProgress && (
                      <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between text-[11px] font-medium transition-all">
                          <span className="text-zinc-400 truncate max-w-60">
                            {importProgress.url}
                          </span>
                          <span className="text-emerald-500 font-bold shrink-0">
                            {importProgress.current} / {importProgress.total}
                          </span>
                        </div>
                        <Progress
                          value={
                            (importProgress.current / importProgress.total) *
                            100
                          }
                          className="h-1.5 bg-zinc-800"
                        />
                      </div>
                    )}
                    <Button
                      onClick={handleBulkImport}
                      disabled={bulkIsPending || selectedLinks.size === 0}
                      className={cn(
                        'w-full h-12 text-sm font-semibold rounded-xl transition-all duration-300 relative group overflow-hidden cursor-pointer',
                        selectedLinks.size > 0
                          ? 'bg-emerald-600 text-white hover:bg-emerald-500 active:scale-[0.98] shadow-lg shadow-emerald-500/10'
                          : 'bg-zinc-800 text-zinc-500 border border-white/5',
                      )}
                    >
                      <div className="relative z-10 flex items-center justify-center gap-2">
                        {bulkIsPending ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            <span>Importing {selectedLinks.size} assets...</span>
                          </>
                        ) : (
                          <>
                            <span>Import {selectedLinks.size || 'selected'} assets</span>
                            {selectedLinks.size > 0 && (
                              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                            )}
                          </>
                        )}
                      </div>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-900/30 p-6 rounded-2xl border border-white/5 space-y-6 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Lightbulb className="size-5 text-orange-500" />
                </div>
                <h3 className="font-semibold text-lg text-white">
                  Discovery Tips
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4 group/tip">
                  <div className="mt-1 shrink-0 size-6 bg-zinc-950 rounded-full flex items-center justify-center border border-white/10 group-hover/tip:border-orange-500/50 transition-colors">
                    <span className="text-[10px] font-bold text-zinc-500">
                      01
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-zinc-200">
                      Specific Queries
                    </p>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Use detailed topics like "PostgreSQL locking strategies"
                      instead of just "database docs" for better results.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 group/tip">
                  <div className="mt-1 shrink-0 size-6 bg-zinc-950 rounded-full flex items-center justify-center border border-white/10 group-hover/tip:border-blue-500/50 transition-colors">
                    <span className="text-[10px] font-bold text-zinc-500">
                      02
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-zinc-200">
                      Deep Search
                    </p>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Our engines prioritize semantic relevance, so focus on the
                      actual intent of your research.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 group/tip">
                  <div className="mt-1 shrink-0 size-6 bg-zinc-950 rounded-full flex items-center justify-center border border-white/10 group-hover/tip:border-purple-500/50 transition-colors">
                    <span className="text-[10px] font-bold text-zinc-500">
                      03
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-zinc-200">
                      Content Verification
                    </p>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Every asset discovered undergoes a quality check before
                      appearing in your final results list.
                    </p>
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
