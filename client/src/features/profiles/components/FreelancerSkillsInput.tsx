import { useState, useEffect, useRef } from "react"
import { X, Search, PlusCircle, Check, Sparkle } from "lucide-react"
import { useSkillsSearch, useCreateSkill } from "../api/useSkills.api"
import type { Skill } from "../types/profiles.types"
import { cn } from "../../../utils/cn"

interface Props {
  selected: Skill[]
  onChange: (skills: Skill[]) => void
}

export default function FreelancerSkillsInput({ selected, onChange }: Props) {
  const [inputValue, setInputValue] = useState("")
  const [debouncedValue, setDebouncedValue] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Debounce para evitar spam de peticiones
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue)
    }, 300)
    return () => clearTimeout(handler)
  }, [inputValue])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // data va a cambiar cada vez que el usuario escriba algo + debounce
  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSkillsSearch(debouncedValue)
  const createMut = useCreateSkill()

  // si la habilidad ya esta seleccionada, no se puede seleccionar de nuevo
  const handleSelect = (skill: Skill) => {
    if (!selected.some((s) => s.id === skill.id)) {
      onChange([...selected, skill])
    }
    setInputValue("")
    setDebouncedValue("")
    setIsOpen(false)
  }

  const handleRemove = (skillId: string) => {
    onChange(selected.filter((s) => s.id !== skillId))
  }

  const handleCreate = () => {
    if (!inputValue.trim()) return
    createMut.mutate(inputValue.trim(), {
      onSuccess: (newSkill) => {
        handleSelect(newSkill)
      },
    })
  }

  // Comprobar si el exact match existe en los resultados
  const exactMatchExists = searchResults?.some(
    (s) => s.name.toLowerCase() === inputValue.trim().toLowerCase(),
  )

  const showCreateOption =
    inputValue.trim().length >= 2 && !exactMatchExists && !isLoading

  return (
    <div className="flex flex-col w-full gap-2 relative" ref={dropdownRef}>
      <label className="text-zinc-400 font-semibold px-1 text-sm mt-2">
        Habilidades
      </label>

      {/* skills seleccionados */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-1">
          {selected.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-primary/20 text-primary border border-primary/30">
              {s.name}
              <button
                type="button"
                onClick={() => handleRemove(s.id)}
                className="hover:text-red-400 hover:bg-primary/20 rounded-full p-0.5 transition-colors focus:outline-none">
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
        />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Busca o añade habilidades (ej. React, Node.js)"
          className="w-full rounded-xl border border-zinc-500 bg-zinc-900 pl-10 pr-4 h-12 text-zinc-100 outline-none hover:border-primary focus:ring focus:ring-primary/50 transition-colors"
          disabled={createMut.isPending}
        />
      </div>

      {/* Dropdown de resultados */}
      {isOpen && (
        <div className="absolute top-[105%] left-0 w-full bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto flex flex-col p-1">
          {isLoading && (
            <div className="p-3 text-sm text-zinc-400 text-center">
              Cargando...
            </div>
          )}

          {isError && (
            <div className="p-3 text-sm text-red-400 text-center">
              Error al cargar habilidades
            </div>
          )}

          {!isLoading && searchResults && searchResults.length > 0 && (
            <>
              {searchResults.map((skill) => {
                const isSelected = selected.some((s) => s.id === skill.id)
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => handleSelect(skill)}
                    disabled={isSelected}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-left transition-colors",
                      isSelected
                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                        : "hover:bg-zinc-800 text-zinc-200 cursor-pointer",
                    )}>
                    <span className="flex items-center gap-2">
                      <Sparkle size={18} className="text-zinc-500" />
                      {skill.name}
                    </span>
                    {isSelected && <Check size={18} className="text-primary" />}
                  </button>
                )
              })}
            </>
          )}

          {!isLoading &&
            searchResults &&
            searchResults.length === 0 &&
            !showCreateOption && (
              <div className="p-3 text-sm text-zinc-500 text-center">
                No hay habilidades sugeridas. Escribe para buscar o crear.
              </div>
            )}

          {/* Opcion de crear si no existe exact match */}
          {showCreateOption && (
            <button
              type="button"
              onClick={handleCreate}
              disabled={createMut.isPending}
              className="flex items-center gap-2 px-3 py-3 border-t border-zinc-800 mt-1 hover:bg-primary/10 rounded-b-lg text-sm text-primary font-medium transition-colors text-left">
              <PlusCircle size={16} />
              {createMut.isPending
                ? "Creando..."
                : `Crear nueva habilidad "${inputValue.trim()}"`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
