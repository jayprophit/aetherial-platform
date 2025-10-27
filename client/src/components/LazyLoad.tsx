import { useInView } from 'react-intersection-observer';
import { ReactNode } from 'react';

interface LazyLoadProps {
  children: ReactNode;
  placeholder?: ReactNode;
  threshold?: number;
  rootMargin?: string;
}

export default function LazyLoad({
  children,
  placeholder,
  threshold = 0.1,
  rootMargin = '50px',
}: LazyLoadProps) {
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  return (
    <div ref={ref}>
      {inView ? children : placeholder || <LoadingPlaceholder />}
    </div>
  );
}

function LoadingPlaceholder() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
  );
}

