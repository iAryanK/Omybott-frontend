export const iconColors = [
    "from-blue-500 to-blue-600",
    "from-violet-500 to-violet-600",
    "from-emerald-500 to-emerald-600",
    "from-orange-500 to-orange-600",
    "from-rose-500 to-rose-600",
    "from-cyan-500 to-cyan-600",
    "from-amber-500 to-amber-600",
    "from-indigo-500 to-indigo-600",
  ]
  
export function getIconColor(name: string) {
    const index =
      name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      iconColors.length
  
    return iconColors[index]
  }
  
export function getInitial(name: string) {
    return name.trim().charAt(0).toUpperCase() || "W"
  }

export function generateWorkspaceSlug(name: string) {
  return name.replace(/ /g, "_").trim()
}