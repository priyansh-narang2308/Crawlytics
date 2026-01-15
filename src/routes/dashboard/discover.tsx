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
import { createFileRoute } from '@tanstack/react-router'
import {
  Loader2,
  Search,
  Lightbulb,
  Compass,
} from 'lucide-react'
import { useTransition } from 'react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/discover')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isPending, startTransition] = useTransition()

  const form = useForm({
    defaultValues: {
      query: '',
    },
    validators: {
      onSubmit: searchSchema,
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        console.log(value)
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
                            <span>Searching Neural Web...</span>
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
              </CardContent>
            </Card>

        
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-900/30 p-6 rounded-2xl border border-white/5 space-y-6 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Lightbulb className="size-5 text-orange-500" />
                </div>
                <h3 className="font-semibold text-lg text-white">Discovery Tips</h3>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4 group/tip">
                  <div className="mt-1 shrink-0 size-6 bg-zinc-950 rounded-full flex items-center justify-center border border-white/10 group-hover/tip:border-orange-500/50 transition-colors">
                    <span className="text-[10px] font-bold text-zinc-500">01</span>
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
                    <span className="text-[10px] font-bold text-zinc-500">02</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-zinc-200">
                      Deep Search
                    </p>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Our engines prioritize semantic relevance, so focus on
                      the actual intent of your research.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 group/tip">
                  <div className="mt-1 shrink-0 size-6 bg-zinc-950 rounded-full flex items-center justify-center border border-white/10 group-hover/tip:border-purple-500/50 transition-colors">
                    <span className="text-[10px] font-bold text-zinc-500">03</span>
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
