import { useIsMutating, useIsFetching } from "@tanstack/react-query"
import loaderSvg from "../assets/loader.svg"

export default function AppLoader() {
  // esto lo implemente especificamente para el chat
  // si no se pone el predicate, se muestra el loader en toda la aplicacion
  // es decir si meta silent es true, no se muestra el loader
  // porque no quiero que el loader se muestre en el chat
  // cada vez que envio un mensaje se mostraria el loader y eso es molesto para el usuario.
  // el chat tendra su propio loader que no interfiera con la experiencia del usuario.
  // - jose luis
  const isMutating = useIsMutating({
    predicate: (mutation) => mutation.meta?.silent !== true,
  })
  const isFetching = useIsFetching({
    predicate: (query) => query.meta?.silent !== true,
  })

  if (isMutating === 0 && isFetching === 0) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <img
        src={loaderSvg}
        alt="Cargando..."
        className="w-16 h-16 animate-spin"
      />
    </div>
  )
}
