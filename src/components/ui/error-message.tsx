/* ========================================
   = Props =
========================================= */
interface ErrorMessageProps {
  errorMessage: string;
}

export default function ErrorMessage({errorMessage}: ErrorMessageProps) {
  return <p className='text-red-500 text-sm'>{errorMessage}</p>;
}
