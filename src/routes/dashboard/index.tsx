import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
  loader: () => {
    return {
      name: 'priyansh',
      age: 50,
    }
  },
})

function RouteComponent() {
  const data = Route.useLoaderData()

  return <div>{data.name}</div>
}
