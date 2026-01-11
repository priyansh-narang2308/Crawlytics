import {type  User } from "better-auth"
import { LucideIcon } from "lucide-react"

export interface NavPrimaryProps {
  items: {
    title: string
    to: string
    icon: LucideIcon
  }[]
}

export interface NavUserProps{
  user:User
}
