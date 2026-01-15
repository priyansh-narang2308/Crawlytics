import { useState, useTransition } from 'react'
import {
  ArrowRight,
  Check,
  ExternalLink,
  GlobeIcon,
  Lightbulb,
  LinkIcon,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useForm } from '@tanstack/react-form'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Progress } from '@/components/ui/progress'

import { Badge } from '@/components/ui/badge'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { importBulkSchema, importSingleSchema } from '@/schemas/import'
import { bulkScrapeUrlsFn, mapUrlFn, scrapeUrlFn } from '@/data/items'
import { toast } from 'sonner'
import { type SearchResultWeb } from '@mendable/firecrawl-js'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export const Route = createFileRoute('/dashboard/import')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isPending, startTransition] = useTransition()
  const [bulkIsPending, startBulkTransition] = useTransition()
  const navigate = useNavigate()

  const [importProgress, setImportProgress] = useState<{
    current: number
    total: number
    url: string
  } | null>(null)

  //States for the bulk import
  const [discoveredLinks, setDiscoveredLinks] = useState<
    Array<SearchResultWeb>
  >([])
  const [selectedLinks, setSelectedLinks] = useState<Set<string>>(new Set())

  const toggleSelectLink = (url: string) => {
    const newSelected = new Set(selectedLinks)
    if (newSelected.has(url)) {
      newSelected.delete(url)
    } else {
      newSelected.add(url)
    }
    setSelectedLinks(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedLinks.size === discoveredLinks.length) {
      setSelectedLinks(new Set())
    } else {
      setSelectedLinks(new Set(discoveredLinks.map((l) => l.url)))
    }
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

  const form = useForm({
    defaultValues: {
      url: '',
    },
    validators: {
      onSubmit: importSingleSchema,
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        await scrapeUrlFn({ data: value })
        toast.success('URL scraped successfully!')
      })
    },
  })

  const bulkForm = useForm({
    defaultValues: {
      url: '',
      search: '',
    },
    validators: {
      onSubmit: importBulkSchema,
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        console.log(value)
        const data = await mapUrlFn({ data: value })

        setDiscoveredLinks(data)
        console.log('Discovered Links:', data)
      })
    },
  })

  return (
    <div className="flex-1 w-full flex flex-col min-h-screen bg-transparent p-4 lg:p-8 animate-in fade-in duration-500">
      <div className="mx-auto w-full max-w-350">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
            Import Content
          </h1>
          <p className="text-muted-foreground text-lg">
            Scrape and save any web page directly into your workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <Tabs defaultValue="single" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList className="bg-zinc-900/50 p-1 border border-white/5 h-11">
                  <TabsTrigger
                    value="single"
                    className="gap-2 cursor-pointer data-[state=active]:bg-zinc-800"
                  >
                    <LinkIcon className="size-4" />
                    Single URL
                  </TabsTrigger>
                  <TabsTrigger
                    value="bulk"
                    className="gap-2 cursor-pointer data-[state=active]:bg-zinc-800"
                  >
                    <GlobeIcon className="size-4" />
                    Bulk Import
                  </TabsTrigger>
                </TabsList>

                <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-zinc-900/30 px-3 py-1.5 rounded-full border border-white/5">
                  <ShieldCheck className="size-3 text-emerald-500" />
                  <span>Secure Sandbox Enabled</span>
                </div>
              </div>

              <TabsContent
                value="single"
                className="mt-0 focus-visible:outline-none"
              >
                <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-sm shadow-2xl overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <LinkIcon className="size-24 -rotate-12" />
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                        <LinkIcon className="size-5" />
                      </div>
                      <CardTitle className="text-xl">
                        Import Single Page
                      </CardTitle>
                    </div>
                    <CardDescription className="text-zinc-400">
                      Instantly convert any article, documentation, or blog post
                      into clean, structured data.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        form.handleSubmit()
                      }}
                      className="space-y-6"
                    >
                      <FieldGroup>
                        <form.Field
                          name="url"
                          children={(field) => {
                            const isInvalid =
                              field.state.meta.isTouched &&
                              !field.state.meta.isValid
                            return (
                              <Field
                                data-invalid={isInvalid}
                                className="w-full"
                              >
                                <FieldLabel
                                  htmlFor={field.name}
                                  className="flex items-center gap-2 mb-2 text-zinc-300"
                                >
                                  Source URL
                                </FieldLabel>
                                <div className="relative">
                                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                                  <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                      field.handleChange(e.target.value)
                                    }
                                    aria-invalid={isInvalid}
                                    placeholder="https://www.example.com/article-name"
                                    autoComplete="off"
                                    className="pl-10 h-12 bg-zinc-950/50 border-white/10 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all"
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
                              : 'cursor-pointer  active:scale-[0.98]',
                          )}
                        >
                          <div className="relative z-10 flex items-center justify-center gap-2">
                            {isPending ? (
                              <>
                                <Loader2 className="size-5 animate-spin" />
                                <span>Analyzing Content...</span>
                              </>
                            ) : (
                              <>
                                <span>Start Scraper</span>
                                <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                              </>
                            )}
                          </div>
                          {!isPending && (
                            <div className="absolute inset-x-0 bottom-0 h-full opacity-90 group-hover/btn:opacity-100 transition-opacity" />
                          )}
                        </Button>
                      </FieldGroup>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent
                value="bulk"
                className="mt-0 focus-visible:outline-none"
              >
                <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-sm shadow-2xl relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <GlobeIcon className="size-24 rotate-12" />
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                        <GlobeIcon className="size-5" />
                      </div>
                      <CardTitle className="text-xl">
                        Deep Website Analysis
                      </CardTitle>
                    </div>
                    <CardDescription className="text-zinc-400">
                      Discovery and spidering of multiple URLs from a root
                      domain with intelligent filtering.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        bulkForm.handleSubmit()
                      }}
                      className="space-y-6"
                    >
                      <FieldGroup className="grid gap-6">
                        <bulkForm.Field
                          name="url"
                          children={(field) => {
                            const isInvalid =
                              field.state.meta.isTouched &&
                              !field.state.meta.isValid
                            return (
                              <Field
                                data-invalid={isInvalid}
                                className="w-full"
                              >
                                <FieldLabel
                                  htmlFor={field.name}
                                  className="flex items-center gap-2 mb-2 text-zinc-300"
                                >
                                  Root Domain / Sitemaps
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
                                    placeholder="https://docs.example.com"
                                    autoComplete="off"
                                    className="pl-10 h-12 bg-zinc-950/50 border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all"
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

                        <div className="space-y-3">
                          <bulkForm.Field
                            name="search"
                            children={(field) => {
                              const isInvalid =
                                field.state.meta.isTouched &&
                                !field.state.meta.isValid
                              return (
                                <Field data-invalid={isInvalid}>
                                  <FieldLabel
                                    htmlFor={field.name}
                                    className="flex items-center justify-between mb-2 text-zinc-300"
                                  >
                                    <span className="flex items-center gap-2">
                                      Path Discovery Filter
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] uppercase tracking-wider border-white/10 text-zinc-500 px-1.5 h-4"
                                    >
                                      Optional
                                    </Badge>
                                  </FieldLabel>
                                  <div className="relative">
                                    <Input
                                      id={field.name}
                                      name={field.name}
                                      value={field.state.value}
                                      onBlur={field.handleBlur}
                                      onChange={(e) =>
                                        field.handleChange(e.target.value)
                                      }
                                      aria-invalid={isInvalid}
                                      placeholder="e.g. /blog, /docs/*, python-tutorial"
                                      autoComplete="off"
                                      className="h-10 bg-zinc-950/50 border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all pr-24"
                                    />
                                  </div>
                                  {isInvalid && (
                                    <FieldError
                                      errors={field.state.meta.errors}
                                    />
                                  )}
                                </Field>
                              )
                            }}
                          />

                          <div className="p-3 bg-zinc-950/40 rounded-lg border border-white/5 space-y-2">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block px-1">
                              Quick Match Patterns
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {[
                                '/blog/*',
                                '/docs',
                                '*pricing*',
                                'release-notes',
                              ].map((tag) => (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => {
                                    bulkForm.setFieldValue('search', tag)
                                  }}
                                  className="px-2.5 py-1 text-[11px] rounded-md bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:border-purple-500/30 transition-all cursor-pointer"
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          disabled={isPending}
                          className={cn(
                            'w-full h-12 text-base font-semibold transition-all duration-300 relative overflow-hidden group/btn',
                            isPending
                              ? 'opacity-70'
                              : 'cursor-pointer  active:scale-[0.98]',
                          )}
                        >
                          <div className="relative z-10 flex items-center justify-center gap-2">
                            {isPending ? (
                              <>
                                <Loader2 className="size-5 animate-spin text-white" />
                                <span>Crawling Site Map...</span>
                              </>
                            ) : (
                              <>
                                <span>Discover URLs</span>
                                <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                              </>
                            )}
                          </div>
                          {!isPending && (
                            <div className="absolute inset-x-0 bottom-0 h-full  opacity-90 group-hover/btn:opacity-100 transition-opacity" />
                          )}
                        </Button>
                      </FieldGroup>
                    </form>

                    {/* Discovered URLS */}
                    {discoveredLinks.length > 0 && (
                      <div className="space-y-6 mt-10 pt-8 border-t border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-orange-500/10 rounded-md">
                                <Sparkles className="size-3.5 text-orange-400" />
                              </div>
                              <h3 className="text-sm font-bold text-zinc-100 tracking-tight">
                                Analysis Complete
                              </h3>
                              <Badge
                                variant="outline"
                                className="text-[14px] h-4.5 bg-zinc-900 text-zinc-400 border-white/5 font-mono"
                              >
                                {discoveredLinks.length} results
                              </Badge>
                            </div>
                            <p className="text-[11px] text-zinc-500">
                              Select the pages you want to import to your
                              knowledge base.
                            </p>
                          </div>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={toggleSelectAll}
                            className="h-9 px-4 text-xs font-semibold bg-zinc-900 border-white/5 hover:bg-zinc-800 transition-all cursor-pointer group"
                          >
                            {selectedLinks.size === discoveredLinks.length ? (
                              'Deselect All'
                            ) : (
                              <>
                                <Check className="size-3 mr-2 text-zinc-500 group-hover:text-purple-400" />
                                Select All results
                              </>
                            )}
                          </Button>
                        </div>

                        <ScrollArea className="h-105 rounded-2xl border border-white/5 bg-zinc-950/20 backdrop-blur-md overflow-hidden relative shadow-inner">
                          <div className="p-3 grid gap-2.5">
                            {discoveredLinks.map((link) => {
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
                                      onCheckedChange={() =>
                                        toggleSelectLink(link.url)
                                      }
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

                        <div className="pt-2 space-y-4">
                          {bulkIsPending && importProgress && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                              <div className="flex justify-between text-[11px] font-medium transition-all">
                                <span className="text-zinc-400 truncate max-w-60">
                                  {importProgress.url}
                                </span>
                                <span className="text-blue-500 font-bold shrink-0">
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
                              'w-full h-12 text-sm font-bold tracking-tight rounded-xl transition-all duration-500 relative group overflow-hidden cursor-pointer',
                              selectedLinks.size > 0
                                ? 'bg-white text-zinc-950 hover:scale-[1.01] active:scale-[0.99] shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                                : 'bg-zinc-800 text-zinc-500',
                            )}
                          >
                            {bulkIsPending ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="size-4 animate-spin" />
                                Importing {selectedLinks.size} pages...
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-2 relative z-10">
                                <span>
                                  Import {selectedLinks.size || 'Discovered'}{' '}
                                  Knowledge Assets
                                </span>
                                {selectedLinks.size > 0 && (
                                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                                )}
                              </div>
                            )}
                            {selectedLinks.size > 0 && !isPending && (
                              <div className="absolute inset-0 bg-linear-to-r from-transparent via-zinc-200/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-900/30 p-6 rounded-2xl border border-white/5 space-y-6 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Lightbulb className="size-5 text-orange-500" />
                </div>
                <h3 className="font-semibold text-lg">Pro Tips</h3>
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
                      Sitemap Discovery
                    </p>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      For bulk imports, using{' '}
                      <code className="text-[10px] bg-zinc-950 px-1 py-0.5 rounded border border-white/5">
                        /sitemap.xml
                      </code>{' '}
                      is 5x faster than crawling the page.
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
                      Wildcard Patterns
                    </p>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Use asterisks{' '}
                      <code className="text-[10px] bg-zinc-950 px-1 py-0.5 rounded border border-white/5">
                        /docs/*
                      </code>{' '}
                      to capture nested sub-directories and all children.
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
                      Auth & Paywalls
                    </p>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Currently we only support public URLs. Secure pages may
                      require a dedicated API key integration.
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
