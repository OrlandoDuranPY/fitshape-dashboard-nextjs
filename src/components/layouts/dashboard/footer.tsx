export default function Footer() {
  return (
    <footer className='w-full h-14 bg-card-surface/20 border-t border-border/20'>
      <div className='flex items-center justify-center h-full'>
        <p className='text-muted-foreground text-xs'>
          {process.env.NEXT_PUBLIC_APP_TITLE} © {new Date().getFullYear()} Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
